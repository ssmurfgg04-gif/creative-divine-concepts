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
      toast.success("Shirt design uploaded! Drag to position.");
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
              Upload a PNG (transparent background recommended). Use Image Clipper first for best results.
            </p>
            {activeSlot === "shirt" && shirtDesign && (
              <button
                onClick={() => setShirtDesign(null)}
                className="mt-2 text-xs text-destructive hover:underline"
              >
                Remove shirt design
              </button>
            )}
            {activeSlot === "pants" && pantsDesign && (
              <button
                onClick={() => setPantsDesign(null)}
                className="mt-2 text-xs text-destructive hover:underline"
              >
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
            <ToolSection title="Shirt Design Position">
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
              <li>3. Adjust position and scale</li>
              <li>4. Change clothing/skin colors</li>
              <li>5. Drag to rotate 360 degrees</li>
              <li>6. Export as PNG for client proof</li>
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
            camera={{ position: [0, 0, 4], fov: 35 }}
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
                autoRotate={autoRotate}
                captureRef={captureRef}
              />
            </Suspense>

            <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={10} blur={2.5} far={5} resolution={1024} />
            <Environment preset="studio" />

            <OrbitControls
              enablePan={false}
              minDistance={2}
              maxDistance={7}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.7}
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
  autoRotate: boolean;
  captureRef: React.MutableRefObject<(() => void) | null>;
}

function MannequinModel({ shirtDesign, pantsDesign, shirtColor, pantsColor, skinColor, shirtScale, shirtX, shirtY, autoRotate, captureRef }: MannequinModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl, scene, camera } = useThree();

  // Load shirt design texture
  const shirtTexture = useMemo(() => {
    if (!shirtDesign) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(shirtDesign);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [shirtDesign]);

  // Load pants design texture
  const pantsTexture = useMemo(() => {
    if (!pantsDesign) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(pantsDesign);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [pantsDesign]);

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

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 1.5;
    }
  });

  // Materials
  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(skinColor),
      roughness: 0.6,
      metalness: 0.0,
    });
  }, [skinColor]);

  const shirtMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(shirtColor),
      roughness: 0.85,
      metalness: 0.0,
      map: shirtTexture || null,
      transparent: true,
    });
  }, [shirtColor, shirtTexture]);

  const pantsMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(pantsColor),
      roughness: 0.85,
      metalness: 0.0,
      map: pantsTexture || null,
    });
  }, [pantsColor, pantsTexture]);

  // Build a simple mannequin from primitives (head, torso, arms, legs)
  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow material={skinMaterial}>
        <sphereGeometry args={[0.25, 32, 32]} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.2, 0]} castShadow material={skinMaterial}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
      </mesh>

      {/* Torso (shirt area) */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow material={shirtMaterial}>
        <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
      </mesh>

      {/* Shirt design overlay (on chest) */}
      {shirtTexture && (
        <mesh position={[shirtX * 0.3, 0.5 + shirtY * 0.3, 0.36]}>
          <planeGeometry args={[0.5 * shirtScale, 0.6 * shirtScale]} />
          <meshBasicMaterial map={shirtTexture} transparent toneMapped={false} />
        </mesh>
      )}

      {/* Arms */}
      <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, 0.3]} castShadow material={shirtMaterial}>
        <capsuleGeometry args={[0.1, 0.7, 8, 16]} />
      </mesh>
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -0.3]} castShadow material={shirtMaterial}>
        <capsuleGeometry args={[0.1, 0.7, 8, 16]} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.65, 0.0, 0]} castShadow material={skinMaterial}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      <mesh position={[0.65, 0.0, 0]} castShadow material={skinMaterial}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>

      {/* Legs (pants area) */}
      <mesh position={[-0.15, -0.5, 0]} castShadow material={pantsMaterial}>
        <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
      </mesh>
      <mesh position={[0.15, -0.5, 0]} castShadow material={pantsMaterial}>
        <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
      </mesh>

      {/* Pants design overlay (on left thigh) */}
      {pantsTexture && (
        <mesh position={[-0.15, -0.4, 0.13]}>
          <planeGeometry args={[0.2, 0.3]} />
          <meshBasicMaterial map={pantsTexture} transparent toneMapped={false} />
        </mesh>
      )}

      {/* Shoes */}
      <mesh position={[-0.15, -1.0, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, -1.0, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}
