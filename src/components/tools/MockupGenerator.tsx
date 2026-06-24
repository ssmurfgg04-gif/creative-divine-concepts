"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import { Shirt, Upload, Download, Loader2, RotateCw, Sun, Palette } from "lucide-react";
import * as Icons from "lucide-react";
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

const SHIRT_COLORS = [
  { name: "White", hex: "#ffffff" },
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
];

type ProductType = "tshirt" | "hoodie" | "mug" | "tote";

const PRODUCTS: { id: ProductType; name: string; icon: string }[] = [
  { id: "tshirt", name: "T-Shirt", icon: "Shirt" },
  { id: "hoodie", name: "Hoodie", icon: "Shirt" },
  { id: "mug", name: "Mug", icon: "Coffee" },
  { id: "tote", name: "Tote Bag", icon: "ShoppingBag" },
];

export function MockupGenerator({ onBack }: MockupGeneratorProps) {
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [productType, setProductType] = useState<ProductType>("tshirt");
  const [shirtColor, setShirtColor] = useState("#ffffff");
  const [designScale, setDesignScale] = useState(0.4);
  const [designX, setDesignX] = useState(0);
  const [designY, setDesignY] = useState(0.2);
  const [autoRotate, setAutoRotate] = useState(false);
  const [lighting, setLighting] = useState(1);
  const [bgColor, setBgColor] = useState("#1e293b");
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureRef = useRef<() => void>(null);

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
      }, 100);
    }
  };

  return (
    <ToolLayout
      title="Mockup Generator"
      tagline="3D rotatable T-shirt mockups for client proofs"
      icon={<Shirt className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <Button
          onClick={handleExport}
          className="gap-2 bg-primary text-white hover:bg-primary/90"
        >
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
              Upload a PNG (ideally with transparent background). Run through <span className="text-foreground">Image Clipper</span> first for best results.
            </p>
          </ToolSection>

          <ToolSection title="Product Type">
            <div className="grid grid-cols-2 gap-2">
              {PRODUCTS.map((p) => {
                const Icon = (Icons as any)[p.icon];
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
            <div className="grid grid-cols-6 gap-2">
              {SHIRT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setShirtColor(c.hex)}
                  title={c.name}
                  className={`aspect-square rounded-md border-2 transition ${
                    shirtColor === c.hex ? "border-primary box-glow" : "border-border"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="color"
                value={shirtColor}
                onChange={(e) => setShirtColor(e.target.value)}
                className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
              />
              <Input value={shirtColor} onChange={(e) => setShirtColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
            </div>
          </ToolSection>

          {designUrl && (
            <ToolSection title="Design Placement">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Scale</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(designScale * 100)}%</span>
                  </div>
                  <Slider value={[designScale]} min={0.1} max={0.8} step={0.05} onValueChange={(v) => setDesignScale(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Horizontal</Label>
                    <span className="text-xs text-muted-foreground">{designX.toFixed(2)}</span>
                  </div>
                  <Slider value={[designX]} min={-1} max={1} step={0.05} onValueChange={(v) => setDesignX(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Vertical</Label>
                    <span className="text-xs text-muted-foreground">{designY.toFixed(2)}</span>
                  </div>
                  <Slider value={[designY]} min={-1} max={1.5} step={0.05} onValueChange={(v) => setDesignY(v[0])} />
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
              <li>• Drag to rotate • Scroll to zoom</li>
              <li>• Use transparent PNGs for best placement</li>
              <li>• Export high-res PNG for client proofs</li>
              <li>• No expensive physical samples needed!</li>
            </ul>
          </ToolSection>
        </>
      }
    >
      <div className="relative h-full w-full" style={{ backgroundColor: bgColor }}>
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 35 }}
            gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
            shadows
          >
            <color attach="background" args={[bgColor]} />
            <ambientLight intensity={0.4 * lighting} />
            <directionalLight
              position={[3, 5, 5]}
              intensity={1.2 * lighting}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <directionalLight position={[-3, 2, -2]} intensity={0.4 * lighting} color="#fef3c7" />
            <Suspense fallback={null}>
              <TShirtModel
                productType={productType}
                color={shirtColor}
                designUrl={designUrl}
                designScale={designScale}
                designX={designX}
                designY={designY}
                autoRotate={autoRotate}
                captureRef={captureRef}
              />
            </Suspense>
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Canvas>
        </Suspense>

        {/* Hint overlay */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </ToolLayout>
  );
}

// --- T-shirt 3D model ---

interface TShirtModelProps {
  productType: ProductType;
  color: string;
  designUrl: string | null;
  designScale: number;
  designX: number;
  designY: number;
  autoRotate: boolean;
  captureRef: React.MutableRefObject<(() => void) | null>;
}

function TShirtModel({ productType, color, designUrl, designScale, designX, designY, autoRotate, captureRef }: TShirtModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl, scene, camera } = useThree();

  // Build product shape based on productType
  const { geometry, bodyFrontPos, collar: collarInfo, hasHood } = useMemo(() => {
    if (productType === "mug") {
      // Mug: cylinder
      const geo = new THREE.CylinderGeometry(0.9, 0.9, 1.8, 32, 1, false);
      geo.computeVertexNormals();
      // Handle (torus)
      const handle = new THREE.TorusGeometry(0.4, 0.1, 8, 16, Math.PI);
      return { geometry: geo, bodyFrontPos: 0.9, collar: null, hasHood: false, handle };
    }
    if (productType === "tote") {
      // Tote bag: a box with handles
      const geo = new THREE.BoxGeometry(2.2, 2.2, 0.3);
      geo.computeVertexNormals();
      return { geometry: geo, bodyFrontPos: 0.16, collar: null, hasHood: false };
    }
    // T-shirt or Hoodie — same silhouette, hoodie has a hood
    const shape = new THREE.Shape();
    // T-shirt silhouette (front view, normalized to ~3x3 units)
    shape.moveTo(0, 1.5);
    shape.lineTo(-0.4, 1.4);
    shape.quadraticCurveTo(0, 1.0, 0.4, 1.4);
    shape.lineTo(0.9, 1.45);
    shape.lineTo(1.7, 0.8);
    shape.lineTo(1.5, 0.4);
    shape.lineTo(1.0, 0.6);
    shape.lineTo(1.0, -1.6);
    shape.lineTo(-1.0, -1.6);
    shape.lineTo(-1.0, 0.6);
    shape.lineTo(-1.5, 0.4);
    shape.lineTo(-1.7, 0.8);
    shape.lineTo(-0.9, 1.45);
    shape.lineTo(-0.4, 1.4);
    shape.quadraticCurveTo(0, 1.0, 0.4, 1.4);

    const depth = productType === "hoodie" ? 0.6 : 0.4;
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 4,
      curveSegments: 12,
    });
    geo.center();
    geo.computeVertexNormals();

    // Collar geometry (small torus around neck)
    const collar = new THREE.TorusGeometry(0.45, 0.06, 8, 24, Math.PI);

    return { geometry: geo, bodyFrontPos: depth / 2 + 0.1, collar, hasHood: productType === "hoodie" };
  }, [productType]);

  // Load design texture
  const designTexture = useRef<THREE.CanvasTexture | null>(null);
  const designCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!designUrl) {
      designTexture.current = null;
      return;
    }
    let cancelled = false;
    (async () => {
      const img = await loadImage(designUrl);
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Place design centered at designX, designY with scale designScale
      const maxW = canvas.width * designScale;
      const maxH = canvas.height * designScale;
      const ar = img.naturalWidth / img.naturalHeight;
      let dw, dh;
      if (ar > 1) {
        dw = maxW;
        dh = maxW / ar;
      } else {
        dh = maxH;
        dw = maxH * ar;
      }
      const dx = (canvas.width - dw) / 2 + designX * canvas.width * 0.3;
      const dy = (canvas.height - dh) / 2 - designY * canvas.height * 0.3;
      ctx.drawImage(img, dx, dy, dw, dh);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      designTexture.current = tex;
      designCanvasRef.current = canvas;
      // Force re-render
      forceUpdate();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designUrl, designScale, designX, designY]);

  const [, forceUpdateState] = useState(0);
  const forceUpdate = () => forceUpdateState((s) => s + 1);

  // Auto rotate
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  // Setup capture function
  useEffect(() => {
    captureRef.current = () => {
      try {
        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL("image/png");
        downloadDataURL(dataUrl, `cdc-mockup-${productType}-${Date.now()}.png`);
        toast.success("Mockup exported!");
      } catch (err: any) {
        toast.error(err?.message || "Export failed");
      }
    };
  }, [gl, scene, camera, captureRef, productType]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* Main product body */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={productType === "mug" ? 0.2 : 0.85}
          metalness={productType === "mug" ? 0.3 : 0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mug handle */}
      {productType === "mug" && (
        <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.4, 0.1, 8, 16, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
        </mesh>
      )}

      {/* Tote bag handles */}
      {productType === "tote" && (
        <>
          <mesh position={[-0.6, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.4, 0.04, 8, 16, Math.PI]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          <mesh position={[0.6, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.4, 0.04, 8, 16, Math.PI]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Collar (T-shirt / Hoodie only) */}
      {collarInfo && (
        <mesh geometry={collarInfo} position={[0, 1.05, 0.15]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      )}

      {/* Hood (Hoodie only) */}
      {hasHood && (
        <mesh position={[0, 1.6, -0.1]} castShadow>
          <sphereGeometry args={[0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Design overlay - rendered as a separate plane in front of the product */}
      {designTexture.current && (
        <mesh position={[designX * 0.6, designY * 0.8, bodyFrontPos + 0.05]}>
          <planeGeometry args={[2.4 * designScale, 2.4 * designScale]} />
          <meshBasicMaterial
            map={designTexture.current}
            transparent
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}
