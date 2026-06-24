"use client";

import { useCallback, useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Shirt, Upload, Download, Loader2, RotateCw, Sun, Palette, Coffee, ShoppingBag, HardHat } from "lucide-react";
import * as THREE from "three";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fileToDataURL, loadImage, downloadDataURL } from "@/lib/canvas-utils";

interface MockupGeneratorProps {
  onBack: () => void;
}

const PRODUCT_COLORS = [
  { name: "White", hex: "#f5f5f5" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Heather Gray", hex: "#9ca3af" },
  { name: "Navy", hex: "#1e293b" },
  { name: "Royal Blue", hex: "#1d4ed8" },
  { name: "Red", hex: "#dc2626" },
  { name: "Forest Green", hex: "#166534" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Orange", hex: "#f36a21" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Maroon", hex: "#7f1d1d" },
  { name: "Sand", hex: "#e2c9a0" },
  { name: "Teal", hex: "#0d9488" },
];

const PRODUCTS = [
  { id: "tshirt", name: "T-Shirt", icon: Shirt },
  { id: "mug", name: "Mug", icon: Coffee },
] as const;

type ProductType = typeof PRODUCTS[number]["id"];

export function MockupGenerator({ onBack }: MockupGeneratorProps) {
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [productType, setProductType] = useState<ProductType>("tshirt");
  const [productColor, setProductColor] = useState("#f5f5f5");
  const [autoRotate, setAutoRotate] = useState(false);
  const [lighting, setLighting] = useState(1);
  const [bgColor, setBgColor] = useState("#f0ede8");
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureRef = useRef<(() => void) | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = await fileToDataURL(file);
    setDesignUrl(url);
  }, []);

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
      title="Mockup Generator"
      tagline="3D product mockups with real GLB models — upload design to see it wrapped"
      icon={<Shirt className="h-5 w-5" />}
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
          <ToolSection title="Upload Design">
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/40 hover:bg-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Choose Design
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
              Upload a PNG (ideally transparent). Run through <span className="text-foreground">Image Clipper</span> first for best results. Design wraps onto the 3D model via UV mapping.
            </p>
          </ToolSection>

          <ToolSection title="Product Type">
            <div className="grid grid-cols-3 gap-2">
              {PRODUCTS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProductType(p.id)}
                    className={`flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-xs transition ${
                      productType === p.id
                        ? "border-primary bg-primary/10 text-primary box-glow"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </ToolSection>

          <ToolSection title="Product Color">
            <div className="grid grid-cols-7 gap-1.5">
              {PRODUCT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setProductColor(c.hex)}
                  title={c.name}
                  className={`aspect-square rounded-md border-2 transition ${
                    productColor === c.hex ? "border-primary box-glow scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="color"
                value={productColor}
                onChange={(e) => setProductColor(e.target.value)}
                className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
              />
              <Input value={productColor} onChange={(e) => setProductColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
            </div>
          </ToolSection>

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
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
                </div>
              </div>
            </div>
          </ToolSection>

          <ToolSection title="Tips" defaultOpen={false}>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <span className="text-foreground">Drag</span> to rotate 360°</li>
              <li>• <span className="text-foreground">Scroll</span> to zoom in/out</li>
              <li>• Uses real 3D GLB models with UV mapping</li>
              <li>• Design texture wraps onto product surface</li>
              <li>• Change color — model updates instantly</li>
              <li>• Export high-res PNG for client proofs</li>
            </ul>
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
                <p className="mt-3 text-sm text-muted-foreground">Loading 3D model…</p>
              </div>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 35 }}
            gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
            shadows
            dpr={[1, 2]}
          >
            <color attach="background" args={[bgColor]} />
            {/* 3-point studio lighting */}
            <ambientLight intensity={0.4 * lighting} />
            <directionalLight
              position={[4, 6, 4]}
              intensity={1.5 * lighting}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={20}
              shadow-camera-left={-5}
              shadow-camera-right={5}
              shadow-camera-top={5}
              shadow-camera-bottom={-5}
            />
            <directionalLight position={[-4, 3, -2]} intensity={0.6 * lighting} color="#fef3c7" />
            <directionalLight position={[0, -2, 3]} intensity={0.3 * lighting} color="#dbeafe" />

            <Suspense fallback={null}>
              <ProductModel
                type={productType}
                color={productColor}
                designUrl={designUrl}
                autoRotate={autoRotate}
                captureRef={captureRef}
              />
            </Suspense>

            {/* Contact shadow for grounding */}
            <ContactShadows
              position={[0, -1.8, 0]}
              opacity={0.5}
              scale={12}
              blur={2.5}
              far={5}
              resolution={1024}
            />

            {/* Environment for realistic reflections */}
            <Environment preset="studio" />

            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.7}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
            />
          </Canvas>
        </Suspense>

        {/* Hint overlay */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          Drag to rotate 360° • Scroll to zoom • Real 3D GLB model
        </div>
      </div>
    </ToolLayout>
  );
}

// ============== PRODUCT MODEL LOADER ==============

interface ProductModelProps {
  type: ProductType;
  color: string;
  designUrl: string | null;
  autoRotate: boolean;
  captureRef: React.MutableRefObject<(() => void) | null>;
}

function ProductModel({ type, color, designUrl, autoRotate, captureRef }: ProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl, scene, camera } = useThree();

  // Load design texture
  const designTexture = useMemo(() => {
    if (!designUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(designUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [designUrl]);

  // Setup capture function for export
  useEffect(() => {
    captureRef.current = () => {
      try {
        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL("image/png");
        downloadDataURL(dataUrl, `cdc-mockup-${type}-${Date.now()}.png`);
        toast.success("Mockup exported!");
      } catch (err: any) {
        toast.error(err?.message || "Export failed");
      }
    };
  }, [gl, scene, camera, captureRef, type]);

  if (type === "tshirt") {
    return (
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <TShirtGLB color={color} designTexture={designTexture} autoRotate={autoRotate} groupRef={groupRef} />
      </group>
    );
  }

  if (type === "mug") {
    return (
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <MugGLB color={color} designTexture={designTexture} autoRotate={autoRotate} groupRef={groupRef} />
      </group>
    );
  }

  return null;
}

// ============== T-SHIRT (loads shirt_baked.glb) ==============

function TShirtGLB({ color, designTexture, autoRotate, groupRef }: {
  color: string;
  designTexture: THREE.Texture | null;
  autoRotate: boolean;
  groupRef: React.RefObject<THREE.Group>;
}) {
  // Preload the GLB model
  const gltf = useGLTF("/models/shirt_baked.glb");

  // Clone the mesh so we don't modify the cached original
  const mesh = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.scale.set(1.2, 1.2, 1.2);
    return cloned;
  }, [gltf]);

  // Apply color and design texture to the mesh material
  useEffect(() => {
    mesh.traverse((child: any) => {
      if (child.isMesh) {
        // Clone the material so each instance is independent
        child.material = child.material.clone();
        child.material.color = new THREE.Color(color);
        child.material.roughness = 0.8;
        child.material.metalness = 0.0;

        // If we have a design texture, use it as the map (UV-mapped onto shirt)
        if (designTexture) {
          child.material.map = designTexture;
        } else {
          child.material.map = null;
        }
        child.material.needsUpdate = true;
      }
    });
  }, [mesh, color, designTexture]);

  // Auto-rotate
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 1.5;
    }
  });

  return <primitive object={mesh} />;
}

// ============== MUG (loads teacup.glb) ==============

function MugGLB({ color, designTexture, autoRotate, groupRef }: {
  color: string;
  designTexture: THREE.Texture | null;
  autoRotate: boolean;
  groupRef: React.RefObject<THREE.Group>;
}) {
  const gltf = useGLTF("/models/teacup.glb");

  // Scale and position the mug (inside useMemo so it's done at creation time)
  const mugMesh = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.scale.set(2.5, 2.5, 2.5);
    cloned.rotation.y = -0.5;
    return cloned;
  }, [gltf]);

  // Apply color and design texture
  useEffect(() => {
    mugMesh.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color = new THREE.Color(color);
        child.material.roughness = 0.15;
        child.material.metalness = 0.05;

        if (designTexture) {
          child.material.map = designTexture;
        } else {
          child.material.map = null;
        }
        child.material.needsUpdate = true;
      }
    });
  }, [mugMesh, color, designTexture]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 1.5;
    }
  });

  return <primitive object={mugMesh} />;
}

// Preload GLB models
useGLTF.preload("/models/shirt_baked.glb");
useGLTF.preload("/models/teacup.glb");
