/**
 * Illustrated mattress artwork.
 *
 * A mattress is drawn as an axonometric slab: a top face, a front face and a
 * right-hand side face. Each face has its own local coordinate system, mapped
 * onto the screen with an SVG matrix, so textures and patterns foreshorten
 * naturally with the view. Local units are centimetres along the mattress
 * length (190) and width (135); vertical units are screen pixels.
 */
import type { ReactNode } from "react";
import type { LayerId, RenderVariant } from "@/data/products";

export const LEN = 190;
export const WID = 135;

export type Vec = { x: number; y: number };
export type Proj = { ox: number; oy: number; L: Vec; D: Vec };

const r2 = (n: number) => Math.round(n * 100) / 100;

export function faces(p: Proj) {
  const a = p.L.x / LEN;
  const b = p.L.y / LEN;
  const c = p.D.x / WID;
  const d = p.D.y / WID;
  return {
    top: (y: number) => `matrix(${r2(a)} ${r2(b)} ${r2(c)} ${r2(d)} ${p.ox} ${r2(p.oy + y)})`,
    front: (y: number) => `matrix(${r2(a)} ${r2(b)} 0 1 ${p.ox} ${r2(p.oy + y)})`,
    side: (y: number) => `matrix(${r2(c)} ${r2(d)} 0 1 ${r2(p.ox + p.L.x)} ${r2(p.oy + p.L.y + y)})`,
    /** local top-face coordinate -> screen */
    pt: (u: number, v: number, y = 0): Vec => ({ x: p.ox + a * u + c * v, y: p.oy + y + b * u + d * v }),
    a,
    b,
    c,
    d,
  };
}

export function silhouette(p: Proj, y: number, h: number) {
  const f = faces(p);
  const pts = [f.pt(0, WID, y), f.pt(LEN, WID, y), f.pt(LEN, WID, y + h), f.pt(LEN, 0, y + h), f.pt(0, 0, y + h), f.pt(0, 0, y)];
  return pts.map((q) => `${r2(q.x)},${r2(q.y)}`).join(" ");
}

function insetSilhouette(p: Proj, y: number, h: number, iu: number, iv: number) {
  const f = faces(p);
  const pts = [
    f.pt(iu, WID - iv, y),
    f.pt(LEN - iu, WID - iv, y),
    f.pt(LEN - iu, WID - iv, y + h),
    f.pt(LEN - iu, iv, y + h),
    f.pt(iu, iv, y + h),
    f.pt(iu, iv, y),
  ];
  return pts.map((q) => `${r2(q.x)},${r2(q.y)}`).join(" ");
}

/* ------------------------------------------------------------------ */
/* Texture definitions                                                 */
/* ------------------------------------------------------------------ */

const TEXTURES = {
  knit: { file: "/textures/knit.jpg", px: 150 },
  fibre: { file: "/textures/fibre.jpg", px: 300 },
  foamC: { file: "/textures/foam-comfort.jpg", px: 300 },
  foamS: { file: "/textures/foam-support.jpg", px: 300 },
  foamB: { file: "/textures/foam-base.jpg", px: 300 },
  nonwoven: { file: "/textures/nonwoven.jpg", px: 220 },
} as const;
type TexName = keyof typeof TEXTURES;

function texPatterns(id: string, p: Proj, name: TexName, scale = 1) {
  const { file, px } = TEXTURES[name];
  const T = px * scale;
  const lx = Math.hypot(p.L.x, p.L.y) / LEN; // screen px per cm along length
  const dx = Math.hypot(p.D.x, p.D.y) / WID; // screen px per cm along width
  const tile = (w: number, h: number, key: string) => (
    <pattern key={`${name}-${key}`} id={`${id}-${name}-${key}`} patternUnits="userSpaceOnUse" width={r2(w)} height={r2(h)}>
      <image href={file} width={r2(w)} height={r2(h)} preserveAspectRatio="none" />
    </pattern>
  );
  return [tile(T / lx, T / lx, "top"), tile(T / lx, T, "front"), tile(T / dx, T, "side")];
}

export const tex = (id: string, name: TexName, face: "top" | "front" | "side") => `url(#${id}-${name}-${face})`;

export function MattressDefs({ id, p }: { id: string; p: Proj }) {
  const qw = LEN / 9;
  const qh = WID / 6;
  const diamond = (cx: number, cy: number) =>
    `M${r2(cx)},${r2(cy - qh / 2)} L${r2(cx + qw / 2)},${r2(cy)} L${r2(cx)},${r2(cy + qh / 2)} L${r2(cx - qw / 2)},${r2(cy)} Z`;

  return (
    <defs>
      {(Object.keys(TEXTURES) as TexName[]).flatMap((n) => texPatterns(id, p, n))}

      {/* Quilted cover: puffed diamonds with dashed stitching */}
      <radialGradient id={`${id}-puff`} cx="50%" cy="45%" r="62%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="55%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#b9ae9c" stopOpacity="0.38" />
      </radialGradient>
      <pattern id={`${id}-quilt`} patternUnits="userSpaceOnUse" width={r2(qw)} height={r2(qh)}>
        {[
          [qw / 2, qh / 2],
          [0, 0],
          [qw, 0],
          [0, qh],
          [qw, qh],
        ].map(([cx, cy], i) => (
          <path key={i} d={diamond(cx, cy)} fill={`url(#${id}-puff)`} />
        ))}
        <path
          d={`M0,${r2(qh / 2)} L${r2(qw / 2)},0 L${r2(qw)},${r2(qh / 2)} L${r2(qw / 2)},${r2(qh)} Z`}
          fill="none"
          stroke="#7a6e5e"
          strokeOpacity="0.5"
          strokeWidth="0.22"
          strokeDasharray="0.7 0.45"
        />
        <ellipse
          cx={r2(qw / 2)}
          cy={r2(qh / 2)}
          rx="2.6"
          ry="2"
          fill="none"
          stroke="#7a6e5e"
          strokeOpacity="0.28"
          strokeWidth="0.18"
          strokeDasharray="0.5 0.4"
        />
      </pattern>

      {/* Quilted padding: soft, irregular cushions without stitching */}
      <radialGradient id={`${id}-cushion`} cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="100%" stopColor="#8f846f" stopOpacity="0.28" />
      </radialGradient>
      <pattern id={`${id}-cushions`} patternUnits="userSpaceOnUse" width={r2(LEN / 7)} height={r2(WID / 5)}>
        <ellipse cx={r2(LEN / 14)} cy={r2(WID / 10)} rx={r2(LEN / 14)} ry={r2(WID / 10)} fill={`url(#${id}-cushion)`} />
      </pattern>

      {/* Border fabric ribs */}
      <pattern id={`${id}-ribs`} patternUnits="userSpaceOnUse" width="1.4" height="40">
        <rect width="0.55" height="40" fill="#8b7f6d" fillOpacity="0.14" />
      </pattern>

      {/* Lighting */}
      <linearGradient id={`${id}-frontShade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
        <stop offset="0.25" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#3a3127" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id={`${id}-sideShade`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#3a3127" stopOpacity="0.16" />
        <stop offset="1" stopColor="#3a3127" stopOpacity="0.28" />
      </linearGradient>
      <linearGradient id={`${id}-topShade`} x1="0" y1="1" x2="0.4" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#3a3127" stopOpacity="0.07" />
      </linearGradient>

      {/* Steel */}
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5c6268" />
        <stop offset="0.38" stopColor="#e9edf0" />
        <stop offset="0.55" stopColor="#9aa1a7" />
        <stop offset="1" stopColor="#4d5257" />
      </linearGradient>
      <linearGradient id={`${id}-pocketShade`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5e554a" stopOpacity="0.42" />
        <stop offset="0.32" stopColor="#ffffff" stopOpacity="0.28" />
        <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.08" />
        <stop offset="1" stopColor="#4c443a" stopOpacity="0.5" />
      </linearGradient>
      <radialGradient id={`${id}-capShade`} cx="42%" cy="40%" r="65%">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="0.7" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#6d6457" stopOpacity="0.35" />
      </radialGradient>
      <radialGradient id={`${id}-button`} cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#fffdf8" />
        <stop offset="0.6" stopColor="#d9cfbf" />
        <stop offset="1" stopColor="#9c917f" />
      </radialGradient>

      <filter id={`${id}-shadow`} x="-20%" y="-60%" width="140%" height="220%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/* Faces                                                               */
/* ------------------------------------------------------------------ */

type FaceProps = { id: string; p: Proj; y: number; h: number };

function Slab({
  id,
  p,
  y,
  h,
  top,
  front,
  side,
  topOverlay,
  frontOverlay,
  sideOverlay,
  edge = true,
}: FaceProps & {
  top: string;
  front: string;
  side: string;
  topOverlay?: ReactNode;
  frontOverlay?: ReactNode;
  sideOverlay?: ReactNode;
  edge?: boolean;
}) {
  const f = faces(p);
  return (
    <g>
      <g transform={f.side(y)}>
        <rect width={WID} height={h} fill={side} />
        {sideOverlay}
        <rect width={WID} height={h} fill={`url(#${id}-sideShade)`} />
      </g>
      <g transform={f.front(y)}>
        <rect width={LEN} height={h} fill={front} />
        {frontOverlay}
        <rect width={LEN} height={h} fill={`url(#${id}-frontShade)`} />
      </g>
      <g transform={f.top(y)}>
        <rect width={LEN} height={WID} fill={top} />
        {topOverlay}
        <rect width={LEN} height={WID} fill={`url(#${id}-topShade)`} />
      </g>
      {edge && (
        <>
          <polyline
            points={`${f.pt(0, 0, y).x},${f.pt(0, 0, y).y} ${f.pt(LEN, 0, y).x},${f.pt(LEN, 0, y).y} ${f.pt(LEN, WID, y).x},${f.pt(LEN, WID, y).y}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.75"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <line
            x1={f.pt(LEN, 0, y).x}
            y1={f.pt(LEN, 0, y).y}
            x2={f.pt(LEN, 0, y + h).x}
            y2={f.pt(LEN, 0, y + h).y}
            stroke="#2f2a24"
            strokeOpacity="0.12"
            strokeWidth="0.8"
          />
        </>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Construction layers                                                 */
/* ------------------------------------------------------------------ */

function CoverLayer({ id, p, y, h }: FaceProps) {
  const tape = (
    <>
      <rect width={LEN} height={1.6} fill="#cbbfac" />
      <rect y={h - 1.6} width={LEN} height={1.6} fill="#cbbfac" />
    </>
  );
  const sideTape = (
    <>
      <rect width={WID} height={1.6} fill="#cbbfac" />
      <rect y={h - 1.6} width={WID} height={1.6} fill="#cbbfac" />
    </>
  );
  return (
    <Slab
      id={id}
      p={p}
      y={y}
      h={h}
      top={tex(id, "knit", "top")}
      front={tex(id, "knit", "front")}
      side={tex(id, "knit", "side")}
      topOverlay={<rect width={LEN} height={WID} fill={`url(#${id}-quilt)`} />}
      frontOverlay={
        <>
          <rect width={LEN} height={h} fill={`url(#${id}-ribs)`} />
          {tape}
        </>
      }
      sideOverlay={
        <>
          <rect width={WID} height={h} fill={`url(#${id}-ribs)`} />
          {sideTape}
        </>
      }
    />
  );
}

function scallop(len: number, h: number, bumps: number, amp: number) {
  const w = len / bumps;
  let d = `M0,${h} L0,${amp}`;
  for (let i = 0; i < bumps; i++) {
    d += ` Q${r2(i * w + w / 2)},${r2(-amp)} ${r2((i + 1) * w)},${amp}`;
  }
  return d + ` L${len},${h} Z`;
}

function QuiltLayer({ id, p, y, h }: FaceProps) {
  const f = faces(p);
  return (
    <g>
      <g transform={f.side(y)}>
        <path d={scallop(WID, h, 5, 3)} fill={tex(id, "fibre", "side")} />
        <path d={scallop(WID, h, 5, 3)} fill="#f7f3ec" fillOpacity="0.35" />
        <path d={scallop(WID, h, 5, 3)} fill={`url(#${id}-sideShade)`} />
      </g>
      <g transform={f.front(y)}>
        <path d={scallop(LEN, h, 7, 3)} fill={tex(id, "fibre", "front")} />
        <path d={scallop(LEN, h, 7, 3)} fill="#f7f3ec" fillOpacity="0.35" />
        <path d={scallop(LEN, h, 7, 3)} fill={`url(#${id}-frontShade)`} />
        {/* compressed stitch points where the quilting pulls the wadding in */}
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx={r2((i * LEN) / 7)} cy={4} rx={1.4} ry={3} fill="#8f846f" fillOpacity="0.2" />
        ))}
      </g>
      <g transform={f.top(y)}>
        <rect width={LEN} height={WID} fill={tex(id, "fibre", "top")} />
        <rect width={LEN} height={WID} fill="#f8f4ee" fillOpacity="0.4" />
        <rect width={LEN} height={WID} fill={`url(#${id}-cushions)`} />
        <rect width={LEN} height={WID} fill={`url(#${id}-topShade)`} />
      </g>
    </g>
  );
}

function FoamLayer({ id, p, y, h, kind }: FaceProps & { kind: "foamC" | "foamS" | "foamB" }) {
  const base = kind === "foamB";
  const wash = kind === "foamC" ? "#f1e9d8" : kind === "foamS" ? "#ddd5c8" : null;
  const washTop = wash ? <rect width={LEN} height={WID} fill={wash} fillOpacity="0.3" /> : undefined;
  return (
    <Slab
      id={id}
      p={p}
      y={y}
      h={h}
      top={tex(id, kind, "top")}
      front={tex(id, kind, "front")}
      side={tex(id, kind, "side")}
      edge={!base}
      topOverlay={washTop}
      frontOverlay={
        base ? (
          <rect y={h - 3} width={LEN} height={3} fill="#3c3833" />
        ) : (
          <rect width={LEN} height={h} fill={wash!} fillOpacity="0.22" />
        )
      }
      sideOverlay={
        base ? (
          <rect y={h - 3} width={WID} height={3} fill="#3c3833" />
        ) : (
          <rect width={WID} height={h} fill={wash!} fillOpacity="0.22" />
        )
      }
    />
  );
}

/** Geometry for one pocket spring, centred on its top cap. */
function pocketGeometry(p: Proj, rho: number, h: number) {
  const f = faces(p);
  const { a, b, c, d } = f;
  const ell = (t: number, r: number) => ({
    x: r * (a * Math.cos(t) + c * Math.sin(t)),
    y: r * (b * Math.cos(t) + d * Math.sin(t)),
  });
  const tx = Math.atan2(c, a);
  const right = ell(tx, rho);
  const slope = right.y / right.x;
  const isFront = (q: Vec) => q.y > q.x * slope + 0.001;
  const N = 36;
  const poly = (r: number, dy: number, from: number, to: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const t = from + ((to - from) * i) / N;
      const q = ell(t, r);
      pts.push(`${r2(q.x)},${r2(q.y + dy)}`);
    }
    return pts;
  };
  // Decide which half (tx -> tx+PI or tx -> tx-PI) is the front.
  const mid = ell(tx + Math.PI / 2, rho);
  const dir = isFront(mid) ? 1 : -1;
  const frontArcBottom = poly(rho, h, tx, tx + dir * Math.PI);
  const body = `M${r2(right.x)},${r2(right.y)} L${frontArcBottom.join(" L")} L${r2(-right.x)},${r2(-right.y)} Z`;
  const cap = `M${poly(rho, 0, 0, Math.PI * 2).join(" L")} Z`;

  // Helix, split into front and back runs.
  const rc = rho * 0.78;
  const turns = 5;
  const steps = turns * 48;
  const front: string[] = [];
  const back: string[] = [];
  let run: string[] = [];
  let runFront: boolean | null = null;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const q = ell(t, rc);
    const yy = q.y + 4 + (i / steps) * (h - 8);
    const fr = isFront(q);
    if (runFront !== null && fr !== runFront) {
      (runFront ? front : back).push(`M${run.join(" L")}`);
      run = [run[run.length - 1]];
    }
    runFront = fr;
    run.push(`${r2(q.x)},${r2(yy)}`);
  }
  if (run.length > 1) (runFront ? front : back).push(`M${run.join(" L")}`);
  const ring = `M${poly(rc, 1.2, 0, Math.PI * 2).join(" L")} Z`;
  return { body, cap, coilFront: front.join(" "), coilBack: back.join(" "), ring };
}

function SpringLayer({ id, p, y, h }: FaceProps) {
  const f = faces(p);
  const cols = 22;
  const rows = 15;
  const pl = LEN / cols;
  const pw = WID / rows;
  const rho = Math.min(pl, pw) * 0.47;
  const g = pocketGeometry(p, rho, h);

  const pockets: Vec[] = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) pockets.push(f.pt((i + 0.5) * pl, (j + 0.5) * pw, y));
  pockets.sort((m, n) => m.y - n.y);

  return (
    <g>
      <defs>
        <g id={`${id}-pocket`}>
          <path d={g.body} fill="#b9b2a7" />
          <path d={g.coilBack} fill="none" stroke="#6c7277" strokeOpacity="0.7" strokeWidth="1.1" />
          <path d={g.body} fill={tex(id, "nonwoven", "front")} fillOpacity="0.3" />
          <path d={g.coilFront} fill="none" stroke={`url(#${id}-steel)`} strokeWidth="2" strokeLinecap="round" />
          <path
            d={g.coilFront}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.6"
            strokeWidth="0.5"
            transform="translate(-0.3,-0.5)"
          />
          <path d={g.body} fill={tex(id, "nonwoven", "front")} fillOpacity="0.32" />
          <path d={g.body} fill={`url(#${id}-pocketShade)`} />
          <path d={g.cap} fill={tex(id, "nonwoven", "top")} />
          <path d={g.ring} fill="none" stroke="#7d8389" strokeOpacity="0.35" strokeWidth="0.8" />
          <path d={g.cap} fill={`url(#${id}-capShade)`} stroke="#8a8073" strokeOpacity="0.35" strokeWidth="0.4" />
        </g>
      </defs>
      {/* interior shadow seen between the pockets */}
      <polygon points={insetSilhouette(p, y + 3, h - 4, pl / 2, pw / 2)} fill="#5a534a" />
      {pockets.map((q, i) => (
        <use key={i} href={`#${id}-pocket`} x={r2(q.x)} y={r2(q.y)} />
      ))}
    </g>
  );
}

export function LayerArt({ id, p, y, h, layer }: FaceProps & { layer: LayerId }) {
  switch (layer) {
    case "cover":
      return <CoverLayer id={id} p={p} y={y} h={h} />;
    case "quilt":
      return <QuiltLayer id={id} p={p} y={y} h={h} />;
    case "comfort-foam":
      return <FoamLayer id={id} p={p} y={y} h={h} kind="foamC" />;
    case "support-foam":
      return <FoamLayer id={id} p={p} y={y} h={h} kind="foamS" />;
    case "pocket-springs":
      return <SpringLayer id={id} p={p} y={y} h={h} />;
    case "base":
      return <FoamLayer id={id} p={p} y={y} h={h} kind="foamB" />;
  }
}

export function GroundShadow({ id, p, y, opacity = 0.32 }: { id: string; p: Proj; y: number; opacity?: number }) {
  const f = faces(p);
  const q = [f.pt(-4, WID - 6, y), f.pt(LEN + 4, WID - 6, y), f.pt(LEN + 8, -6, y + 6), f.pt(-2, -6, y + 6)];
  return (
    <polygon
      points={q.map((v) => `${r2(v.x)},${r2(v.y)}`).join(" ")}
      fill="#3b3127"
      opacity={opacity}
      filter={`url(#${id}-shadow)`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Finished product render                                             */
/* ------------------------------------------------------------------ */

export function sanitizeId(raw: string) {
  return "m" + raw.replace(/[^a-zA-Z0-9]/g, "");
}

export function MattressRender({
  id,
  variant,
  depthCm,
  className,
  label = true,
}: {
  id: string;
  variant: RenderVariant;
  depthCm: number;
  className?: string;
  label?: boolean;
}) {
  const h = depthCm * 5;
  const L = { x: 420, y: 74 };
  const D = { x: 140, y: -84 };
  const p: Proj = { ox: 38, oy: 330 - h - L.y, L, D };
  const f = faces(p);

  const ptH = variant.pillowtop ? Math.round(h * 0.3) : 0;
  const gusset = variant.pillowtop ? 5 : 0;
  const bodyY = ptH + gusset;
  const bodyH = h - bodyY;

  const border = (w: number, hh: number, tapeColor: string) => (
    <>
      <rect width={w} height={hh} fill={variant.border} />
      <rect
        width={w}
        height={hh}
        fill={tex(id, "knit", w === LEN ? "front" : "side")}
        opacity="0.55"
        style={{ mixBlendMode: "multiply" }}
      />
      <rect width={w} height={hh} fill={`url(#${id}-ribs)`} />
      <rect y={-1} width={w} height={3} fill={tapeColor} rx={1.5} />
      <rect y={hh - 2} width={w} height={3} fill={tapeColor} rx={1.5} />
    </>
  );

  const topFace = (yy: number) => (
    <g transform={f.top(yy)}>
      <rect width={LEN} height={WID} fill={variant.fabric} />
      <rect width={LEN} height={WID} fill={tex(id, "knit", "top")} opacity="0.7" style={{ mixBlendMode: "multiply" }} />
      <rect width={LEN} height={WID} fill={`url(#${id}-quilt)`} />
      {variant.tufted &&
        Array.from({ length: 8 * 5 }, (_, i) => {
          const u = ((i % 8) + 1) * (LEN / 9);
          const v = (Math.floor(i / 8) + 1) * (WID / 6);
          return <ellipse key={i} cx={r2(u)} cy={r2(v)} rx={1.8} ry={1.8} fill={`url(#${id}-button)`} />;
        })}
      <rect width={LEN} height={WID} fill={`url(#${id}-topShade)`} />
      <rect x={0.6} y={0.6} width={LEN - 1.2} height={WID - 1.2} fill="none" stroke={variant.tape} strokeWidth="1.1" rx="1.5" />
    </g>
  );

  const slab = (yy: number, hh: number, isTop: boolean, tapeColor: string) => (
    <g>
      <g transform={f.side(yy)}>
        {border(WID, hh, tapeColor)}
        {!isTop && hh > 90 && (
          <g fill="none" stroke={tapeColor} strokeWidth="2.4" strokeLinecap="round" opacity="0.9">
            <path d={`M${WID * 0.3},${hh * 0.42} h22`} />
            <path d={`M${WID * 0.6},${hh * 0.42} h22`} />
          </g>
        )}
        <rect width={WID} height={hh} fill={`url(#${id}-sideShade)`} />
      </g>
      <g transform={f.front(yy)}>
        {border(LEN, hh, tapeColor)}
        <rect width={LEN} height={hh} fill={`url(#${id}-frontShade)`} />
      </g>
    </g>
  );

  return (
    <svg viewBox="0 0 640 400" className={className} role="img" aria-label={`Illustration of a ${depthCm} cm mattress`}>
      <MattressDefs id={id} p={p} />
      <GroundShadow id={id} p={p} y={h + 4} opacity={0.38} />
      {slab(bodyY, bodyH, false, variant.tape)}
      {variant.pillowtop && (
        <>
          <g transform={f.front(ptH)}>
            <rect x={1.5} width={LEN - 3} height={gusset + 1} fill="#d8cfc3" />
          </g>
          <g transform={f.side(ptH)}>
            <rect width={WID - 2} height={gusset + 1} fill="#c7beb1" />
          </g>
          {slab(0, ptH, true, variant.tape)}
        </>
      )}
      {topFace(0)}
      {label && (
        // A plain woven care label; the wordmark itself is never distorted onto the render.
        <g transform={f.front(bodyY + bodyH * 0.36)}>
          <rect x={LEN * 0.07} width={22} height={Math.max(12, bodyH * 0.15)} fill="#fbf9f4" stroke="#d9d0c3" strokeWidth="0.4" />
          <rect x={LEN * 0.07 + 4} y={Math.max(12, bodyH * 0.15) / 2 - 1} width={14} height={2} fill="#3f1e3f" opacity="0.85" />
        </g>
      )}
    </svg>
  );
}
