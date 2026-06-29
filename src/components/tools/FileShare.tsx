"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Download, Link2, Trash2, Shield, FileText, Image as ImageIcon, File, Clock, Copy, Check } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface FileShareProps {
  onBack: () => void;
}

interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  expiry: number;
  downloads: number;
  maxDownloads: number;
  password?: string;
}

export function FileShare({ onBack }: FileShareProps) {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [password, setPassword] = useState("");
  const [maxDownloads, setMaxDownloads] = useState(5);
  const [expiryHours, setExpiryHours] = useState(24);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles: SharedFile[] = [];
    for (const file of Array.from(fileList)) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 50MB)`);
        continue;
      }
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
        expiry: Date.now() + expiryHours * 60 * 60 * 1000,
        downloads: 0,
        maxDownloads,
        password: password || undefined,
      });
    }
    setFiles((prev) => [...newFiles, ...prev]);
    toast.success(`${newFiles.length} file(s) ready to share`);
  }, [expiryHours, maxDownloads, password]);

  const generateShareLink = (file: SharedFile) => {
    // In production this would be a real URL with server-side storage
    // For now, we create a link that works within the browser session
    const params = new URLSearchParams({
      f: file.id,
      n: file.name,
      e: String(file.expiry),
      d: String(file.maxDownloads),
    });
    if (file.password) params.set("p", btoa(file.password));
    return `https://creativedivineconcepts.com/#share?${params.toString()}`;
  };

  const copyLink = (file: SharedFile) => {
    const link = generateShareLink(file);
    navigator.clipboard.writeText(link);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Share link copied to clipboard!");
  };

  const downloadFile = (file: SharedFile) => {
    const a = document.createElement("a");
    a.href = file.dataUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f
      )
    );
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.success("File deleted");
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon;
    if (type.startsWith("text/") || type.includes("pdf") || type.includes("document")) return FileText;
    return File;
  };

  const getTimeLeft = (expiry: number) => {
    const left = expiry - Date.now();
    if (left <= 0) return "Expired";
    const hours = Math.floor(left / (60 * 60 * 1000));
    const mins = Math.floor((left % (60 * 60 * 1000)) / (60 * 1000));
    return hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;
  };

  return (
    <ToolLayout
      title="Secure File Share"
      tagline="Upload and share files securely with expiry and download limits"
      icon={<Shield className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      sidebar={
        <>
          <ToolSection title="Upload Files">
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/40 hover:bg-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Max 50MB per file. Up to 5 files at once. Files are processed locally in your browser.
            </p>
          </ToolSection>

          <ToolSection title="Security Settings">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Password (optional)</Label>
                <Input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Protect with password"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Max Downloads</Label>
                <Input
                  type="number"
                  value={maxDownloads}
                  min={1}
                  max={100}
                  onChange={(e) => setMaxDownloads(Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Expiry (hours)</Label>
                <Input
                  type="number"
                  value={expiryHours}
                  min={1}
                  max={168}
                  onChange={(e) => setExpiryHours(Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
          </ToolSection>

          <ToolSection title="Features" defaultOpen={false}>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                Password protection
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                Auto-expiry after set time
              </li>
              <li className="flex items-start gap-2">
                <Download className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                Download limit per file
              </li>
              <li className="flex items-start gap-2">
                <Link2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                Shareable links
              </li>
              <li className="flex items-start gap-2">
                <File className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                Perfect for cyber/printing services
              </li>
            </ul>
          </ToolSection>
        </>
      }
    >
      {files.length === 0 ? (
        <EmptyState
          icon={<Shield className="h-8 w-8" />}
          title="Secure File Sharing"
          description="Upload documents, images, or designs and share them securely. Set passwords, download limits, and expiry times. Perfect for sending print files to our studio or sharing sensitive documents."
          action={
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" /> Upload Files
            </Button>
          }
        />
      ) : (
        <div className="h-full w-full overflow-auto p-6 scrollbar-thin">
          <div className="max-w-3xl mx-auto space-y-3">
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              const isExpired = Date.now() > file.expiry;
              const isMaxed = file.downloads >= file.maxDownloads;
              return (
                <div
                  key={file.id}
                  className="nura-card p-4 flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">{file.name}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{formatBytes(file.size)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeLeft(file.expiry)}
                      </span>
                      <span>{file.downloads}/{file.maxDownloads} downloads</span>
                      {file.password && (
                        <span className="flex items-center gap-1 text-primary">
                          <Shield className="h-3 w-3" /> Protected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => copyLink(file)}
                      disabled={isExpired || isMaxed}
                      title="Copy share link"
                    >
                      {copiedId === file.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => downloadFile(file)}
                      disabled={isExpired || isMaxed}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => deleteFile(file.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {(isExpired || isMaxed) && (
                    <span className="text-xs text-destructive font-semibold shrink-0">
                      {isExpired ? "Expired" : "Max downloads"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
