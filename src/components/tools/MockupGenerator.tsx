"use client";

import { useCallback, useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Center, Float, RoundedBox, Torus } from "@react-three/drei";
import { Shirt, Upload, Download, Loader2, RotateCw, Sun, Palette, Coffee, ShoppingBag, HardHat, RefreshCw } from "lucide-react";
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
  { id: "hoodie", name: "Hoodie", icon: Shirt },
  { id: "mug", name: "Mug", icon: Coffee },
  { id: "tote", name: "Tote Bag", icon: ShoppingBag },
  { id: "cap", name: "Cap", icon: HardHat },
] as const;

type ProductType = typeof PRODUCTS[number]["id"];

export function MockupGenerator({ onBack }: MockupGeneratorProps) {
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [productType, setProductType] = useState<ProductType>("tshirt");
  const [productColor, setProductColor] = useState("#f5f5f5");
  const [designScale, setDesignScale] = useState(0.5);
  const [designX, setDesignX] = useState(0);
  const [designY, setDesignY] = useState(0.2);
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
      tagline="3D rotatable product mockups with realistic depth"
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
              Upload a PNG (ideally transparent). Run through <span className="text-foreground">Image Clipper</span> first for best results.
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

          {designUrl && (
            <ToolSection title="Design Placement">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Scale</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(designScale * 100)}%</span>
                  </div>
                  <Slider value={[designScale]} min={0.1} max={1} step={0.05} onValueChange={(v) => setDesignScale(v[0])} />
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
                  <Slider value={[designY]} min={-1.5} max={1.5} step={0.05} onValueChange={(v) => setDesignY(v[0])} />
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
              <li>• <span className="text-foreground">Drag</span> to rotate 360°</li>
              <li>• <span className="text-foreground">Scroll</span> to zoom in/out</li>
              <li>• Use transparent PNGs for best placement</li>
              <li>• Design wraps onto curved 3D surface</li>
              <li>• Export high-res PNG for client proofs</li>
              <li>• Real 3D depth with fabric shading</li>
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
            dpr={[1, 2]}
          >
            <color attach="background" args={[bgColor]} />
            {/* 3-point studio lighting */}
            <ambientLight intensity={0.3 * lighting} />
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
                designScale={designScale}
                designX={designX}
                designY={designY}
                autoRotate={autoRotate}
                captureRef={captureRef}
              />
            </Suspense>

            {/* Contact shadow for grounding */}
            <ContactShadows
              position={[0, -2.2, 0]}
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
          Drag to rotate 360° • Scroll to zoom
        </div>
      </div>
    </ToolLayout>
  );
}

// ============== 3D PRODUCT MODELS ==============

interface ProductModelProps {
  type: ProductType;
  color: string;
  designUrl: string | null;
  designScale: number;
  designX: number;
  designY: number;
  autoRotate: boolean;
  captureRef: React.MutableRefObject<(() => void) | null>;
}

function ProductModel({ type, color, designUrl, designScale, designX, designY, autoRotate, captureRef }: ProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl, scene, camera } = useThree();
  const [designTexture, setDesignTexture] = useState<THREE.Texture | null>(null);

  // Load design texture
  useEffect(() => {
    if (!designUrl) {
      setDesignTexture(null);
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.load(designUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setDesignTexture(tex);
    });
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

  // Convert hex to THREE.Color
  const fabricColor = useMemo(() => new THREE.Color(color), [color]);

  // Fabric material with proper PBR settings + procedural fabric texture
  const fabricMaterial = useMemo(() => {
    // Create a procedural fabric normal map (weave pattern)
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    // Base
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    // Weave pattern — cross-hatch of lighter/darker lines
    for (let i = 0; i < 256; i += 4) {
      ctx.fillStyle = i % 8 === 0 ? "#c0c0c0" : "#909090";
      ctx.fillRect(i, 0, 2, 256);
      ctx.fillRect(0, i, 256, 2);
    }
    // Add noise
    const imgData = ctx.getImageData(0, 0, 256, 256);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
      imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + noise));
      imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
    const normalTex = new THREE.CanvasTexture(canvas);
    normalTex.wrapS = THREE.RepeatWrapping;
    normalTex.wrapT = THREE.RepeatWrapping;
    normalTex.repeat.set(4, 4);

    const mat = new THREE.MeshStandardMaterial({
      color: fabricColor,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
      normalMap: normalTex,
      normalScale: new THREE.Vector2(0.8, 0.8),
    });
    return mat;
  }, [fabricColor]);

  // Mug material (glossy ceramic)
  const mugMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: fabricColor,
      roughness: 0.15,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
  }, [fabricColor]);

  // Design material (uses the loaded texture)
  const designMaterial = useMemo(() => {
    if (!designTexture) return null;
    return new THREE.MeshBasicMaterial({
      map: designTexture,
      transparent: true,
      toneMapped: false,
    });
  }, [designTexture]);

  if (type === "tshirt") {
    return (
      <group ref={groupRef} position={[0, -0.3, 0]}>
        <TShirtMesh material={fabricMaterial} />
        {designMaterial && (
          <mesh position={[designX * 0.5, designY * 0.6, 0.32]}>
            <planeGeometry args={[1.5 * designScale, 1.8 * designScale]} />
            <primitive object={designMaterial} />
          </mesh>
        )}
      </group>
    );
  }

  if (type === "hoodie") {
    return (
      <group ref={groupRef} position={[0, -0.3, 0]}>
        <HoodieMesh material={fabricMaterial} />
        {designMaterial && (
          <mesh position={[designX * 0.5, designY * 0.5, 0.45]}>
            <planeGeometry args={[1.3 * designScale, 1.5 * designScale]} />
            <primitive object={designMaterial} />
          </mesh>
        )}
      </group>
    );
  }

  if (type === "mug") {
    return (
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <MugMesh material={mugMaterial} />
        {designMaterial && (
          <mesh position={[designX * 0.3, designY * 0.3, 0.75]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.76, 0.76, 1.2 * designScale, 32, 1, true, -Math.PI / 3, Math.PI * 2 / 3]} />
            <primitive object={designMaterial} />
          </mesh>
        )}
      </group>
    );
  }

  if (type === "tote") {
    return (
      <group ref={groupRef} position={[0, -0.3, 0]}>
        <ToteBagMesh material={fabricMaterial} />
        {designMaterial && (
          <mesh position={[designX * 0.4, designY * 0.4, 0.16]}>
            <planeGeometry args={[1.4 * designScale, 1.6 * designScale]} />
            <primitive object={designMaterial} />
          </mesh>
        )}
      </group>
    );
  }

  if (type === "cap") {
    return (
      <group ref={groupRef} position={[0, 0, 0]}>
        <CapMesh material={fabricMaterial} />
        {designMaterial && (
          <mesh position={[designX * 0.2, designY * 0.15, 0.6]} rotation={[-0.3, 0, 0]}>
            <planeGeometry args={[0.7 * designScale, 0.5 * designScale]} />
            <primitive object={designMaterial} />
          </mesh>
        )}
      </group>
    );
  }

  return null;
}

// ============== T-SHIRT 3D MODEL ==============
// Built from multiple curved meshes for realistic depth

function TShirtMesh({ material }: { material: THREE.Material }) {
  // Body — curved plane with proper T-shirt shape
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // T-shirt silhouette (front view)
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

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.15,
      bevelSegments: 8,
      curveSegments: 24,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Collar (torus)
  const collarGeometry = useMemo(() => new THREE.TorusGeometry(0.4, 0.08, 12, 32, Math.PI), []);

  return (
    <group>
      {/* Main body */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow material={material} />
      {/* Collar */}
      <mesh geometry={collarGeometry} position={[0, 1.0, 0.15]} rotation={[0, 0, 0]} material={material} castShadow />
      {/* Sleeve cuffs (small cylinders) */}
      <mesh position={[-1.6, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={material}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
      </mesh>
      <mesh position={[1.6, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={material}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
      </mesh>
      {/* Bottom hem (torus for rounded edge) */}
      <mesh position={[0, -1.55, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.9, 0.06, 8, 32, Math.PI]} />
      </mesh>
    </group>
  );
}

// ============== HOODIE 3D MODEL ==============

function HoodieMesh({ material }: { material: THREE.Material }) {
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Hoodie silhouette (wider, with hood area)
    shape.moveTo(0, 1.6);
    shape.lineTo(-0.5, 1.5);
    shape.quadraticCurveTo(0, 1.1, 0.5, 1.5);
    shape.lineTo(1.0, 1.55);
    shape.lineTo(1.8, 0.85);
    shape.lineTo(1.6, 0.4);
    shape.lineTo(1.1, 0.6);
    shape.lineTo(1.1, -1.6);
    shape.lineTo(-1.1, -1.6);
    shape.lineTo(-1.1, 0.6);
    shape.lineTo(-1.6, 0.4);
    shape.lineTo(-1.8, 0.85);
    shape.lineTo(-1.0, 1.55);
    shape.lineTo(-0.5, 1.5);
    shape.quadraticCurveTo(0, 1.1, 0.5, 1.5);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.7,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelSegments: 8,
      curveSegments: 24,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Hood (half sphere)
  const hoodGeometry = useMemo(() => {
    return new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  }, []);

  // Pocket (box)
  const pocketGeometry = useMemo(() => new THREE.BoxGeometry(1.2, 0.5, 0.1), []);

  return (
    <group>
      <mesh geometry={bodyGeometry} castShadow receiveShadow material={material} />
      {/* Hood */}
      <mesh geometry={hoodGeometry} position={[0, 1.5, -0.1]} material={material} castShadow />
      {/* Collar */}
      <mesh position={[0, 1.1, 0.2]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.35, 0.07, 8, 24, Math.PI]} />
      </mesh>
      {/* Pocket */}
      <mesh geometry={pocketGeometry} position={[0, -0.5, 0.4]} material={material} castShadow />
      {/* Drawstrings */}
      <mesh position={[-0.2, 0.8, 0.35]} material={material}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
      </mesh>
      <mesh position={[0.2, 0.8, 0.35]} material={material}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
      </mesh>
      {/* Drawstring balls */}
      <mesh position={[-0.2, 0.5, 0.35]} material={material}>
        <sphereGeometry args={[0.04, 8, 8]} />
      </mesh>
      <mesh position={[0.2, 0.5, 0.35]} material={material}>
        <sphereGeometry args={[0.04, 8, 8]} />
      </mesh>
      {/* Sleeve cuffs (ribbed) */}
      <mesh position={[-1.65, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.18, 0.35, 16]} />
      </mesh>
      <mesh position={[1.65, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.18, 0.35, 16]} />
      </mesh>
      {/* Bottom hem */}
      <mesh position={[0, -1.55, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[1.0, 0.08, 8, 32, Math.PI]} />
      </mesh>
    </group>
  );
}

// ============== MUG 3D MODEL ==============

function MugMesh({ material }: { material: THREE.Material }) {
  // Inner cavity (slightly smaller, darker)
  const innerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#d0d0d0",
      roughness: 0.1,
      metalness: 0.1,
      side: THREE.BackSide,
    });
  }, []);

  return (
    <group rotation={[0, -0.3, 0]}>
      {/* Main body — cylinder */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.8, 0.75, 1.8, 64, 1, false]} />
      </mesh>
      {/* Top rim (torus) */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.78, 0.04, 12, 64]} />
      </mesh>
      {/* Inner cavity */}
      <mesh position={[0, 0, 0]} material={innerMaterial}>
        <cylinderGeometry args={[0.72, 0.68, 1.7, 64, 1, true]} />
      </mesh>
      {/* Inside bottom (darker for coffee/liquid) */}
      <mesh position={[0, 0.85, 0]} material={innerMaterial}>
        <circleGeometry args={[0.7, 64]} />
      </mesh>
      {/* Handle — torus */}
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={material}>
        <torusGeometry args={[0.45, 0.1, 16, 32]} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <circleGeometry args={[0.75, 64]} />
      </mesh>
    </group>
  );
}

// ============== TOTE BAG 3D MODEL ==============

function ToteBagMesh({ material }: { material: THREE.Material }) {
  // Front face
  const frontGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Tote bag shape: rounded rectangle bottom
    shape.moveTo(-1.0, -1.2);
    shape.lineTo(-1.0, 0.9);
    shape.quadraticCurveTo(-1.0, 1.0, -0.9, 1.0);
    shape.lineTo(0.9, 1.0);
    shape.quadraticCurveTo(1.0, 1.0, 1.0, 0.9);
    shape.lineTo(1.0, -1.2);
    shape.quadraticCurveTo(1.0, -1.3, 0.9, -1.3);
    shape.lineTo(-0.9, -1.3);
    shape.quadraticCurveTo(-1.0, -1.3, -1.0, -1.2);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 4,
      curveSegments: 16,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* Main body */}
      <mesh geometry={frontGeometry} castShadow receiveShadow material={material} />
      {/* Handles — two torus shapes */}
      <mesh position={[-0.5, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow material={material}>
        <torusGeometry args={[0.4, 0.04, 12, 32, Math.PI]} />
      </mesh>
      <mesh position={[0.5, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow material={material}>
        <torusGeometry args={[0.4, 0.04, 12, 32, Math.PI]} />
      </mesh>
      {/* Top opening (darker) */}
      <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.3]} />
        <meshStandardMaterial color="#000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

// ============== CAP 3D MODEL ==============

function CapMesh({ material }: { material: THREE.Material }) {
  // Crown (half sphere)
  const crownGeometry = useMemo(() => {
    return new THREE.SphereGeometry(1.0, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  }, []);

  // Brim/visor — flattened half torus
  const brimGeometry = useMemo(() => {
    return new THREE.SphereGeometry(1.0, 32, 8, 0, Math.PI, Math.PI / 2, Math.PI / 2);
  }, []);

  return (
    <group rotation={[0.2, 0, 0]} position={[0, 0.3, 0]}>
      {/* Crown */}
      <mesh geometry={crownGeometry} castShadow receiveShadow material={material} />
      {/* Brim */}
      <mesh geometry={brimGeometry} position={[0, 0, 0]} scale={[1, 0.3, 1.5]} castShadow material={material} />
      {/* Button on top */}
      <mesh position={[0, 1.0, 0]} material={material}>
        <sphereGeometry args={[0.06, 12, 12]} />
      </mesh>
      {/* Front panel stitching (decorative line) */}
      <mesh position={[0, 0.5, 0.85]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.02, 0.8]} />
        <meshStandardMaterial color="#000" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}
