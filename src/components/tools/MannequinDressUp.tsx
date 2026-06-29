"use client";

import { useCallback, useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Shirt, Upload, Download, Loader2, RotateCw, Sun, Palette, User } from "lucide-react";
import * as THREE from "three";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fileToDataURL, loadImage, downloadDataURL } from "@/lib/canvas-utils";

interface MannequinDressUpProps {
  onBack: () => void;
}

type ClothingSlot = "shirt" | "pants" | null;

export function MannequinDressUp({ onBack }: MannequinDressUpProps) {
  const [shirtDesign, setShirtDesign] = useState<string | null>(null);
  const [pantsDesign, setPantsDesign] = useState<string | null>(null);
  const [shirtColor, setShirtColor] = useState("#ffffff");
  const [pantsColor, setPantsColor] = useState("#1a1a1a");
  const [skinColor, setSkinColor] = useState("#c4a07d");
  const [autoRotate, setAutoRotate] = useState(false);
  const [lighting, setLighting] = useState(1);
  const [bgColor, setBgColor] = useState("#f0ede8");
  const [activeSlot, setActiveSlot] = useState<ClothingSlot>("shirt");
  const [shirtScale, setShirtScale] = useState(0.8);
  const [shirtX, setShirtX] = useState(0);
  const [shirtY, setShirtY] = useState(0.3);
  const [shirtRotation, setShirtRotation] = useState(0);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureRef = useRef<(() => void) | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = await fileToDataURL(file);
    if (activeSlot === "shirt") {
      setShirtDesign(url);
      toast.success("Shirt design uploaded! It wraps onto the body.");
    } else {
      setPantsDesign(url);
      toast.success("Pants design uploaded!");
    }
  }, [activeSlot]);

  const handleExport = () => {
    if (captureRef.current) {
      setExporting(true);
      setTimeout(() => {
        captureRef.current?.();
        setExporting(false);
      }, 200);
    }
  };

  return (
    <ToolLayout
      title="3D Mannequin Dress-Up"
      tagline="Upload designs and dress a 3D mannequin in real-time"
      icon={<User className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <Button onClick={handleExport} disabled={exporting} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export PNG
        </Button>
      }
      sidebar={
        <>
          <ToolSection title="Select Clothing Slot">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveSlot("shirt")}
                className={`flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-xs transition ${
                  activeSlot === "shirt" ? "border-primary bg-primary/10 text-primary box-glow" : "border-border hover:border-primary/40"
                }`}
              >
                <Shirt className="h-5 w-5" />
                <span>Shirt</span>
              </button>
              <button
                onClick={() => setActiveSlot("pants")}
                className={`flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-xs transition ${
                  activeSlot === "pants" ? "border-primary bg-primary/10 text-primary box-glow" : "border-border hover:border-primary/40"
                }`}
              >
                <Palette className="h-5 w-5" />
                <span>Pants</span>
              </button>
            </div>
          </ToolSection>

          <ToolSection title={`Upload ${activeSlot === "shirt" ? "Shirt" : "Pants"} Design`}>
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/40 hover:bg-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Upload Design
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Upload a transparent PNG. The design wraps directly onto the 3D body mesh like real clothing.
            </p>
            {activeSlot === "shirt" && shirtDesign && (
              <button onClick={() => setShirtDesign(null)} className="mt-2 text-xs text-destructive hover:underline">
                Remove shirt design
              </button>
            )}
            {activeSlot === "pants" && pantsDesign && (
              <button onClick={() => setPantsDesign(null)} className="mt-2 text-xs text-destructive hover:underline">
                Remove pants design
              </button>
            )}
          </ToolSection>

          <ToolSection title={`${activeSlot === "shirt" ? "Shirt" : "Pants"} Color`}>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeSlot === "shirt" ? shirtColor : pantsColor}
                onChange={(e) => activeSlot === "shirt" ? setShirtColor(e.target.value) : setPantsColor(e.target.value)}
                className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
              />
              <Input
                value={activeSlot === "shirt" ? shirtColor : pantsColor}
                onChange={(e) => activeSlot === "shirt" ? setShirtColor(e.target.value) : setPantsColor(e.target.value)}
                className="h-8 flex-1 font-mono text-xs"
              />
            </div>
          </ToolSection>

          <ToolSection title="Skin Tone">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={skinColor}
                onChange={(e) => setSkinColor(e.target.value)}
                className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
              />
              <Input value={skinColor} onChange={(e) => setSkinColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
            </div>
          </ToolSection>

          {activeSlot === "shirt" && shirtDesign && (
            <ToolSection title="Design Position">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Scale</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(shirtScale * 100)}%</span>
                  </div>
                  <Slider value={[shirtScale]} min={0.2} max={1.5} step={0.05} onValueChange={(v) => setShirtScale(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Horizontal</Label>
                    <span className="text-xs text-muted-foreground">{shirtX.toFixed(2)}</span>
                  </div>
                  <Slider value={[shirtX]} min={-1} max={1} step={0.05} onValueChange={(v) => setShirtX(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Vertical</Label>
                    <span className="text-xs text-muted-foreground">{shirtY.toFixed(2)}</span>
                  </div>
                  <Slider value={[shirtY]} min={-1} max={1.5} step={0.05} onValueChange={(v) => setShirtY(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Rotation</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(shirtRotation)}deg</span>
                  </div>
                  <Slider value={[shirtRotation]} min={-180} max={180} step={5} onValueChange={(v) => setShirtRotation(v[0])} />
                </div>
              </div>
            </ToolSection>
          )}

          <ToolSection title="Scene">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1">
                  <RotateCw className="h-3 w-3" /> Auto-rotate
                </Label>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`relative h-5 w-10 rounded-full transition ${autoRotate ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${autoRotate ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs flex items-center gap-1">
                    <Sun className="h-3 w-3" /> Lighting
                  </Label>
                  <span className="text-xs text-muted-foreground">{Math.round(lighting * 100)}%</span>
                </div>
                <Slider value={[lighting]} min={0.3} max={2} step={0.1} onValueChange={(v) => setLighting(v[0])} />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Palette className="h-3 w-3" /> Background
                </Label>
                <div className="mt-1 flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent" />
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
                </div>
              </div>
            </div>
          </ToolSection>

          <ToolSection title="How to Use" defaultOpen={false}>
            <ol className="space-y-1.5 text-xs text-muted-foreground">
              <li>1. Select Shirt or Pants slot</li>
              <li>2. Upload a transparent PNG design</li>
              <li>3. Design wraps onto body like real clothing</li>
              <li>4. Adjust position, scale, rotation</li>
              <li>5. Change clothing and skin colors</li>
              <li>6. Drag to rotate 360 degrees</li>
              <li>7. Scroll to zoom in/out</li>
              <li>8. Export as PNG for client proof</li>
            </ol>
          </ToolSection>
        </>
      }
    >
      <div className="relative h-full w-full" style={{ backgroundColor: bgColor }}>
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Loading 3D mannequin…</p>
              </div>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0.5, 5], fov: 30 }}
            gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
            shadows
            dpr={[1, 2]}
          >
            <color attach="background" args={[bgColor]} />
            <ambientLight intensity={0.4 * lighting} />
            <directionalLight position={[4, 6, 4]} intensity={1.5 * lighting} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
            <directionalLight position={[-4, 3, -2]} intensity={0.6 * lighting} color="#fef3c7" />

            <Suspense fallback={null}>
              <MannequinModel
                shirtDesign={shirtDesign}
                pantsDesign={pantsDesign}
                shirtColor={shirtColor}
                pantsColor={pantsColor}
                skinColor={skinColor}
                shirtScale={shirtScale}
                shirtX={shirtX}
                shirtY={shirtY}
                shirtRotation={shirtRotation}
                autoRotate={autoRotate}
                captureRef={captureRef}
              />
            </Suspense>

            <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={5} resolution={1024} />
            <Environment preset="studio" />

            <OrbitControls
              enablePan={false}
              minDistance={1.5}
              maxDistance={8}
              minPolarAngle={Math.PI / 8}
              maxPolarAngle={Math.PI / 1.5}
              target={[0, 0, 0]}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
            />
          </Canvas>
        </Suspense>

        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          Drag to rotate 360 degrees • Scroll to zoom • Real 3D mannequin
        </div>
      </div>
    </ToolLayout>
  );
}

// ============== MANNEQUIN MODEL ==============

interface MannequinModelProps {
  shirtDesign: string | null;
  pantsDesign: string | null;
  shirtColor: string;
  pantsColor: string;
  skinColor: string;
  shirtScale: number;
  shirtX: number;
  shirtY: number;
  shirtRotation: number;
  autoRotate: boolean;
  captureRef: React.MutableRefObject<(() => void) | null>;
}

function MannequinModel({ shirtDesign, pantsDesign, shirtColor, pantsColor, skinColor, shirtScale, shirtX, shirtY, shirtRotation, autoRotate, captureRef }: MannequinModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl, scene, camera } = useThree();

  // Load the GLB human model
  const gltf = useGLTF("/models/mannequin.glb");

  // Clone and scale the model to fit properly
  const model = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    // Scale to fit the viewport nicely - full body visible
    cloned.scale.set(0.8, 0.8, 0.8);
    cloned.position.set(0, -1.5, 0);
    return cloned;
  }, [gltf]);

  // Create a canvas texture that combines skin color + shirt design + pants design
  // This simulates CLO 3D's approach of applying a texture map to the garment mesh
  const combinedTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Fill with skin color as base
    ctx.fillStyle = skinColor;
    ctx.fillRect(0, 0, 1024, 1024);

    return new THREE.CanvasTexture(canvas);
  }, [skinColor]);

  // Update texture when designs or colors change
  useEffect(() => {
    const canvas = combinedTexture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    // Fill with skin color
    ctx.fillStyle = skinColor;
    ctx.fillRect(0, 0, 1024, 1024);

    // Draw shirt color on upper portion (torso area)
    ctx.fillStyle = shirtColor;
    ctx.fillRect(256, 200, 512, 400);

    // Draw pants color on lower portion (leg area)
    ctx.fillStyle = pantsColor;
    ctx.fillRect(256, 600, 512, 300);

    combinedTexture.needsUpdate = true;
  }, [combinedTexture, skinColor, shirtColor, pantsColor]);

  // Load shirt design image and draw onto texture
  useEffect(() => {
    if (!shirtDesign) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = combinedTexture.image as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      // Draw shirt design on chest area of texture
      const dw = 300 * shirtScale;
      const dh = 350 * shirtScale;
      const dx = 512 - dw / 2 + shirtX * 100;
      const dy = 350 - dh / 2 + shirtY * 100;
      ctx.drawImage(img, dx, dy, dw, dh);
      combinedTexture.needsUpdate = true;
    };
    img.src = shirtDesign;
  }, [shirtDesign, shirtScale, shirtX, shirtY, combinedTexture]);

  // Load pants design image and draw onto texture
  useEffect(() => {
    if (!pantsDesign) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = combinedTexture.image as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      // Draw pants design on leg area of texture
      ctx.drawImage(img, 400, 650, 224, 224);
      combinedTexture.needsUpdate = true;
    };
    img.src = pantsDesign;
  }, [pantsDesign, combinedTexture]);

  // Setup capture
  useEffect(() => {
    captureRef.current = () => {
      try {
        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL("image/png");
        downloadDataURL(dataUrl, `cdc-mannequin-${Date.now()}.png`);
        toast.success("Mannequin mockup exported!");
      } catch (err: any) {
        toast.error(err?.message || "Export failed");
      }
    };
  }, [gl, scene, camera, captureRef]);

  // Apply the combined texture to all meshes in the model
  useEffect(() => {
    model.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: combinedTexture,
          roughness: 0.7,
          metalness: 0.0,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model, combinedTexture]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

// Preload
useGLTF.preload("/models/mannequin.glb");
