"use client";

/**
 * High-quality SVG product templates for mockup generator.
 * Each template has:
 * - Realistic body shape with proper curves
 * - Fabric texture (via filters/gradients)
 * - Shading (gradient overlays for folds, shadows)
 * - Dynamic color tinting via props
 * - A defined design placement area (x, y, width, height in SVG coordinates)
 */

export interface ProductTemplate {
  id: string;
  name: string;
  viewBox: string;
  designArea: { x: number; y: number; width: number; height: number };
  render: (color: string) => JSX.Element;
}

// Fabric texture filter (subtle noise for realism)
const FabricFilter = ({ id }: { id: string }) => (
  <>
    <filter id={id} x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
      <feComposite in2="SourceGraphic" operator="in" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode />
      </feMerge>
    </filter>
  </>
);

// Helper: darken/lighten a hex color
function shadeColor(hex: string, percent: number): string {
  if (!hex || typeof hex !== "string") return "#888888";
  const cleaned = hex.replace("#", "");
  if (!cleaned || cleaned.length < 6) return "#888888";
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return "#888888";
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(255 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(255 * percent)));
  return `rgb(${r},${g},${b})`;
}

// === T-SHIRT ===
const TShirt = ({ color }: { color: string }) => {
  const dark = shadeColor(color, -0.15);
  const darker = shadeColor(color, -0.3);
  const light = shadeColor(color, 0.08);
  const lighter = shadeColor(color, 0.15);
  return (
    <g>
      <defs>
        <linearGradient id="tshirt-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light} />
          <stop offset="30%" stopColor={color} />
          <stop offset="70%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="tshirt-shade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="80%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="tshirt-fold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
          <stop offset="15%" stopColor="#000" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="85%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id="tshirt-highlight" cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="tshirt-shadow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="tshirt-fabric" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>
      </defs>

      {/* Drop shadow under shirt */}
      <ellipse cx="300" cy="580" rx="200" ry="15" fill="#000" opacity="0.2" filter="url(#tshirt-shadow)" />

      {/* Main T-shirt body */}
      <path
        d="M 180 120
           Q 200 100 230 105
           L 270 115
           Q 300 140 330 115
           L 370 105
           Q 400 100 420 120
           L 480 160
           Q 500 175 490 200
           L 460 230
           Q 445 240 430 235
           L 420 225
           L 420 520
           Q 420 540 400 545
           L 200 545
           Q 180 540 180 520
           L 180 225
           L 170 235
           Q 155 240 140 230
           L 110 200
           Q 100 175 120 160
           Z"
        fill="url(#tshirt-body)"
        stroke={darker}
        strokeWidth="1"
        filter="url(#tshirt-fabric)"
      />

      {/* Fabric fold shading */}
      <path
        d="M 180 120
           Q 200 100 230 105
           L 270 115
           Q 300 140 330 115
           L 370 105
           Q 400 100 420 120
           L 480 160
           Q 500 175 490 200
           L 460 230
           Q 445 240 430 235
           L 420 225
           L 420 520
           Q 420 540 400 545
           L 200 545
           Q 180 540 180 520
           L 180 225
           L 170 235
           Q 155 240 140 230
           L 110 200
           Q 100 175 120 160
           Z"
        fill="url(#tshirt-fold)"
      />

      {/* Soft highlight on shoulder/chest */}
      <path
        d="M 180 120
           Q 200 100 230 105
           L 270 115
           Q 300 140 330 115
           L 370 105
           Q 400 100 420 120
           L 480 160
           Q 500 175 490 200
           L 460 230
           Q 445 240 430 235
           L 420 225
           L 420 520
           Q 420 540 400 545
           L 200 545
           Q 180 540 180 520
           L 180 225
           L 170 235
           Q 155 240 140 230
           L 110 200
           Q 100 175 120 160
           Z"
        fill="url(#tshirt-highlight)"
      />

      {/* Vertical fold lines (subtle wrinkles) */}
      <path d="M 240 180 Q 245 350 240 520" stroke="#000" strokeWidth="1" fill="none" opacity="0.06" />
      <path d="M 360 180 Q 355 350 360 520" stroke="#000" strokeWidth="1" fill="none" opacity="0.06" />
      <path d="M 300 200 Q 300 360 300 530" stroke="#fff" strokeWidth="1" fill="none" opacity="0.05" />
      {/* Side fold shadows */}
      <path d="M 200 200 Q 205 360 200 520" stroke="#000" strokeWidth="2" fill="none" opacity="0.08" />
      <path d="M 400 200 Q 395 360 400 520" stroke="#000" strokeWidth="2" fill="none" opacity="0.08" />

      {/* Bottom hem shadow */}
      <rect x="180" y="535" width="240" height="10" fill="url(#tshirt-shade)" />

      {/* Neckline (ribbed collar) */}
      <path
        d="M 270 115
           Q 300 140 330 115
           Q 300 150 270 115 Z"
        fill={dark}
        stroke={darker}
        strokeWidth="1"
      />
      <path
        d="M 275 118 Q 300 138 325 118"
        fill="none"
        stroke={darker}
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M 280 122 Q 300 136 320 122"
        fill="none"
        stroke={lighter}
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Sleeve seams */}
      <path d="M 140 200 Q 155 235 175 230" fill="none" stroke={darker} strokeWidth="1" opacity="0.4" />
      <path d="M 460 200 Q 445 235 425 230" fill="none" stroke={darker} strokeWidth="1" opacity="0.4" />

      {/* Sleeve hem shadows */}
      <path d="M 110 200 L 140 230 L 175 230" stroke={dark} strokeWidth="3" fill="none" opacity="0.3" />
      <path d="M 490 200 L 460 230 L 425 230" stroke={dark} strokeWidth="3" fill="none" opacity="0.3" />

      {/* Shoulder highlights */}
      <path d="M 200 110 Q 215 115 230 108" fill="none" stroke={lighter} strokeWidth="2" opacity="0.5" />
      <path d="M 400 110 Q 385 115 370 108" fill="none" stroke={lighter} strokeWidth="2" opacity="0.5" />
    </g>
  );
};

// === HOODIE ===
const Hoodie = ({ color }: { color: string }) => {
  const dark = shadeColor(color, -0.15);
  const darker = shadeColor(color, -0.3);
  const light = shadeColor(color, 0.08);
  return (
    <g>
      <defs>
        <linearGradient id="hoodie-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light} />
          <stop offset="30%" stopColor={color} />
          <stop offset="70%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="hoodie-fold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
          <stop offset="15%" stopColor="#000" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="85%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="hoodie-hood" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={dark} />
          <stop offset="100%" stopColor={darker} />
        </radialGradient>
        <filter id="hoodie-shadow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="300" cy="580" rx="210" ry="15" fill="#000" opacity="0.2" filter="url(#hoodie-shadow)" />

      {/* Hood (behind body) */}
      <path
        d="M 220 90
           Q 240 50 300 50
           Q 360 50 380 90
           Q 390 110 380 130
           L 340 115
           Q 300 145 260 115
           L 220 130
           Q 210 110 220 90 Z"
        fill="url(#hoodie-hood)"
        stroke={darker}
        strokeWidth="1"
      />

      {/* Main hoodie body (thicker than t-shirt) */}
      <path
        d="M 170 130
           Q 190 110 220 120
           L 260 125
           Q 300 155 340 125
           L 380 120
           Q 410 110 430 130
           L 495 175
           Q 515 190 505 215
           L 475 250
           Q 460 260 445 255
           L 430 245
           L 430 525
           Q 430 545 410 550
           L 190 550
           Q 170 545 170 525
           L 170 245
           L 155 255
           Q 140 260 125 250
           L 95 215
           Q 85 190 105 175
           Z"
        fill="url(#hoodie-body)"
        stroke={darker}
        strokeWidth="1"
      />

      {/* Fold shading */}
      <path
        d="M 170 130
           Q 190 110 220 120
           L 260 125
           Q 300 155 340 125
           L 380 120
           Q 410 110 430 130
           L 495 175
           Q 515 190 505 215
           L 475 250
           Q 460 260 445 255
           L 430 245
           L 430 525
           Q 430 545 410 550
           L 190 550
           Q 170 545 170 525
           L 170 245
           L 155 255
           Q 140 260 125 250
           L 95 215
           Q 85 190 105 175
           Z"
        fill="url(#hoodie-fold)"
      />

      {/* Center zipper line */}
      <line x1="300" y1="155" x2="300" y2="550" stroke={darker} strokeWidth="2" opacity="0.5" />
      <line x1="300" y1="155" x2="300" y2="550" stroke={light} strokeWidth="0.5" opacity="0.3" />

      {/* Drawstrings */}
      <path d="M 270 145 Q 275 200 280 250" stroke={darker} strokeWidth="3" fill="none" />
      <path d="M 330 145 Q 325 200 320 250" stroke={darker} strokeWidth="3" fill="none" />
      <circle cx="280" cy="255" r="5" fill={darker} />
      <circle cx="320" cy="255" r="5" fill={darker} />

      {/* Pocket */}
      <path
        d="M 220 380
           L 380 380
           L 390 450
           L 210 450 Z"
        fill="none"
        stroke={darker}
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* Fold lines */}
      <path d="M 240 200 Q 245 380 240 530" stroke="#000" strokeWidth="1" fill="none" opacity="0.05" />
      <path d="M 360 200 Q 355 380 360 530" stroke="#000" strokeWidth="1" fill="none" opacity="0.05" />

      {/* Ribbed cuffs */}
      <rect x="95" y="240" width="35" height="15" fill={dark} opacity="0.6" />
      <rect x="470" y="240" width="35" height="15" fill={dark} opacity="0.6" />
      <rect x="170" y="535" width="260" height="15" fill={dark} opacity="0.6" />

      {/* Hood inner shadow */}
      <path
        d="M 260 115 Q 300 145 340 115"
        fill={darker}
        opacity="0.5"
      />
    </g>
  );
};

// === MUG ===
const Mug = ({ color }: { color: string }) => {
  const dark = shadeColor(color, -0.2);
  const darker = shadeColor(color, -0.35);
  const light = shadeColor(color, 0.15);
  return (
    <g>
      <defs>
        <linearGradient id="mug-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={dark} />
          <stop offset="15%" stopColor={color} />
          <stop offset="50%" stopColor={light} />
          <stop offset="85%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="mug-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={darker} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="mug-handle" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={dark} />
          <stop offset="50%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <filter id="mug-shadow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="300" cy="520" rx="150" ry="12" fill="#000" opacity="0.25" filter="url(#mug-shadow)" />

      {/* Handle */}
      <path
        d="M 430 250
           Q 500 250 500 330
           Q 500 410 430 410"
        fill="none"
        stroke="url(#mug-handle)"
        strokeWidth="25"
        strokeLinecap="round"
      />
      <path
        d="M 430 260
           Q 485 260 485 330
           Q 485 400 430 400"
        fill="none"
        stroke={darker}
        strokeWidth="2"
        opacity="0.3"
      />

      {/* Mug body (cylinder) */}
      <rect x="170" y="180" width="260" height="320" fill="url(#mug-body)" rx="8" />

      {/* Top rim (elliptical) */}
      <ellipse cx="300" cy="180" rx="130" ry="22" fill="url(#mug-top)" />
      <ellipse cx="300" cy="178" rx="120" ry="18" fill={darker} opacity="0.7" />

      {/* Inner shadow (coffee/tea hint) */}
      <ellipse cx="300" cy="180" rx="115" ry="16" fill="#2a1a0a" opacity="0.4" />

      {/* Bottom */}
      <ellipse cx="300" cy="500" rx="130" ry="18" fill={darker} />

      {/* Glossy highlight */}
      <rect x="195" y="200" width="20" height="280" fill="#fff" opacity="0.15" rx="10" />
      <rect x="210" y="195" width="8" height="290" fill="#fff" opacity="0.25" rx="4" />

      {/* Right side shadow */}
      <rect x="400" y="195" width="25" height="290" fill="#000" opacity="0.12" rx="10" />
    </g>
  );
};

// === TOTE BAG ===
const ToteBag = ({ color }: { color: string }) => {
  const dark = shadeColor(color, -0.18);
  const darker = shadeColor(color, -0.32);
  const light = shadeColor(color, 0.1);
  return (
    <g>
      <defs>
        <linearGradient id="tote-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="tote-fold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
          <stop offset="20%" stopColor="#000" stopOpacity="0" />
          <stop offset="80%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.15" />
        </linearGradient>
        <filter id="tote-shadow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="300" cy="580" rx="180" ry="12" fill="#000" opacity="0.2" filter="url(#tote-shadow)" />

      {/* Handles (behind bag) */}
      <path d="M 210 180 Q 210 100 260 100 Q 300 100 300 160" fill="none" stroke={dark} strokeWidth="8" strokeLinecap="round" />
      <path d="M 390 180 Q 390 100 340 100 Q 300 100 300 160" fill="none" stroke={dark} strokeWidth="8" strokeLinecap="round" />

      {/* Handle highlights */}
      <path d="M 210 180 Q 210 105 258 105" fill="none" stroke={light} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M 390 180 Q 390 105 342 105" fill="none" stroke={light} strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Main bag body */}
      <path
        d="M 160 200
           L 440 200
           L 450 540
           Q 450 555 435 555
           L 165 555
           Q 150 555 150 540
           Z"
        fill="url(#tote-body)"
        stroke={darker}
        strokeWidth="1"
      />

      {/* Fold shading */}
      <path
        d="M 160 200
           L 440 200
           L 450 540
           Q 450 555 435 555
           L 165 555
           Q 150 555 150 540
           Z"
        fill="url(#tote-fold)"
      />

      {/* Top opening (darker) */}
      <path
        d="M 160 200 L 440 200 L 435 215 L 165 215 Z"
        fill={darker}
        opacity="0.6"
      />

      {/* Corner gussets (shadows) */}
      <path d="M 150 540 Q 165 530 165 510 L 165 555 Q 155 555 150 540 Z" fill={darker} opacity="0.3" />
      <path d="M 450 540 Q 435 530 435 510 L 435 555 Q 445 555 450 540 Z" fill={darker} opacity="0.3" />

      {/* Stitching line at top */}
      <line x1="170" y1="225" x2="430" y2="225" stroke={darker} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

      {/* Center fold line */}
      <path d="M 300 215 Q 305 380 300 545" stroke="#000" strokeWidth="1" fill="none" opacity="0.05" />
      <path d="M 240 215 Q 245 380 240 545" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.04" />
      <path d="M 360 215 Q 355 380 360 545" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.04" />
    </g>
  );
};

// === CAP / HAT ===
const Cap = ({ color }: { color: string }) => {
  const dark = shadeColor(color, -0.2);
  const darker = shadeColor(color, -0.35);
  const light = shadeColor(color, 0.12);
  return (
    <g>
      <defs>
        <linearGradient id="cap-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="cap-brim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={dark} />
          <stop offset="100%" stopColor={darker} />
        </linearGradient>
        <filter id="cap-shadow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="300" cy="400" rx="180" ry="10" fill="#000" opacity="0.2" filter="url(#cap-shadow)" />

      {/* Crown (dome) */}
      <path
        d="M 150 350
           Q 150 180 300 180
           Q 450 180 450 350
           Z"
        fill="url(#cap-body)"
        stroke={darker}
        strokeWidth="1"
      />

      {/* Crown panels (stitching) */}
      <path d="M 300 180 L 300 350" stroke={darker} strokeWidth="0.8" opacity="0.4" strokeDasharray="3,2" />
      <path d="M 225 190 Q 230 270 240 350" stroke={darker} strokeWidth="0.8" fill="none" opacity="0.3" strokeDasharray="3,2" />
      <path d="M 375 190 Q 370 270 360 350" stroke={darker} strokeWidth="0.8" fill="none" opacity="0.3" strokeDasharray="3,2" />

      {/* Front panel highlight */}
      <path
        d="M 250 200 Q 300 190 350 200 Q 345 280 300 290 Q 255 280 250 200 Z"
        fill={light}
        opacity="0.2"
      />

      {/* Button on top */}
      <circle cx="300" cy="185" r="6" fill={darker} />

      {/* Brim/visor */}
      <path
        d="M 150 345
           Q 200 380 300 385
           Q 400 380 450 345
           Q 460 360 440 375
           Q 380 405 300 410
           Q 220 405 160 375
           Q 140 360 150 345 Z"
        fill="url(#cap-brim)"
        stroke={darker}
        strokeWidth="1"
      />

      {/* Brim highlight */}
      <path
        d="M 170 350 Q 250 375 300 378"
        fill="none"
        stroke={light}
        strokeWidth="2"
        opacity="0.3"
      />

      {/* Sweatband */}
      <path
        d="M 160 345 Q 300 360 440 345"
        fill="none"
        stroke={darker}
        strokeWidth="3"
        opacity="0.5"
      />
    </g>
  );
};

export const PRODUCT_TEMPLATES: Record<string, ProductTemplate> = {
  tshirt: {
    id: "tshirt",
    name: "T-Shirt",
    viewBox: "0 0 600 600",
    designArea: { x: 220, y: 190, width: 160, height: 200 },
    render: (color: string) => <TShirt color={color} />,
  },
  hoodie: {
    id: "hoodie",
    name: "Hoodie",
    viewBox: "0 0 600 600",
    designArea: { x: 225, y: 260, width: 150, height: 180 },
    render: (color: string) => <Hoodie color={color} />,
  },
  mug: {
    id: "mug",
    name: "Mug",
    viewBox: "0 0 600 600",
    designArea: { x: 195, y: 210, width: 210, height: 260 },
    render: (color: string) => <Mug color={color} />,
  },
  tote: {
    id: "tote",
    name: "Tote Bag",
    viewBox: "0 0 600 600",
    designArea: { x: 200, y: 240, width: 200, height: 240 },
    render: (color: string) => <ToteBag color={color} />,
  },
  cap: {
    id: "cap",
    name: "Cap",
    viewBox: "0 0 600 600",
    designArea: { x: 250, y: 200, width: 100, height: 80 },
    render: (color: string) => <Cap color={color} />,
  },
};

export const PRODUCT_LIST = Object.values(PRODUCT_TEMPLATES);
