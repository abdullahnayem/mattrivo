"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { mattressLayers } from "@/data/mattressLayers";
import { ease } from "@/lib/utils";
import { GroundShadow, LayerArt, MattressDefs, faces, sanitizeId, silhouette, type Proj } from "./art";

const VB_W = 900;
const VB_H = 700;
const BASE_TOP = 525;
const GAP = 40;
const ACTIVE_LIFT = 22;
const ASSEMBLED_SHIFT = -95;

export const PROJ: Proj = { ox: 58, oy: 0, L: { x: 560, y: 118 }, D: { x: 212, y: -120 } };

/** Assembled y of each layer's top face (front-left corner), top layer first. */
const assembledTops = (() => {
  const tops: number[] = [];
  let y = BASE_TOP + mattressLayers[mattressLayers.length - 1].thickness;
  for (let i = mattressLayers.length - 1; i >= 0; i--) {
    y -= mattressLayers[i].thickness;
    tops[i] = y;
  }
  return tops;
})();

export type ExplodeMode = "assembled" | "exploded";

export function layerOffset(index: number, mode: ExplodeMode, active: number | null) {
  const last = mattressLayers.length - 1;
  if (mode === "assembled") return ASSEMBLED_SHIFT;
  let off = -GAP * (last - index);
  if (active !== null) {
    if (index < active) off -= ACTIVE_LIFT * 2;
    else if (index === active) off -= ACTIVE_LIFT;
  }
  return off;
}

export function ExplodedMattress({
  mode,
  active,
  onSelect,
  onHover,
  entered,
}: {
  mode: ExplodeMode;
  active: number | null;
  onSelect: (index: number) => void;
  onHover?: (index: number | null) => void;
  entered: boolean;
}) {
  const id = sanitizeId(useId());
  const reduce = useReducedMotion();
  const f = faces(PROJ);
  const last = mattressLayers.length - 1;

  return (
    <div className="relative w-full select-none" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
      {/* Shared texture definitions for every layer SVG below */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <MattressDefs id={id} p={PROJ} />
      </svg>

      {mattressLayers
        .map((layer, i) => ({ layer, i }))
        .reverse()
        .map(({ layer, i }) => {
          const y = assembledTops[i];
          const h = layer.thickness;
          const off = entered ? layerOffset(i, mode, active) : ASSEMBLED_SHIFT;
          const isActive = active === i;
          const dimmed = active !== null && !isActive && mode === "exploded";
          // Marker anchored to the middle of the layer's side face.
          const anchor = f.pt(0, 0, 0);
          const ax = anchor.x + PROJ.L.x + PROJ.D.x * 0.52;
          const ay = y + PROJ.L.y + PROJ.D.y * 0.52 + h / 2;
          const mx = 866;

          return (
            <motion.div
              key={layer.id}
              className="pointer-events-none absolute inset-0"
              initial={false}
              animate={{
                y: `${(off / VB_H) * 100}%`,
                filter: dimmed ? "saturate(0.6) brightness(1.05) contrast(0.88)" : "saturate(1) brightness(1) contrast(1)",
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      y: {
                        duration: 1.1,
                        ease,
                        delay: entered && mode === "exploded" && active === null ? (last - i) * 0.09 : 0,
                      },
                      filter: { duration: 0.5 },
                    }
              }
              style={{ zIndex: 10 + (last - i), willChange: "transform" }}
            >
              <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                {i === last && <GroundShadow id={id} p={PROJ} y={y + h + 2} />}
                <LayerArt id={id} p={PROJ} y={y} h={h} layer={layer.id} />
                {/* hit area */}
                <polygon
                  points={silhouette(PROJ, y, h + (i === 0 ? 6 : 0))}
                  fill="transparent"
                  className="pointer-events-auto cursor-pointer"
                  onPointerEnter={(e) => e.pointerType === "mouse" && onHover?.(i)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && onHover?.(null)}
                  onClick={() => onSelect(i)}
                />
                {mode === "exploded" && (
                  <g className="pointer-events-auto cursor-pointer" onClick={() => onSelect(i)}>
                    <motion.line
                      x1={ax + 4}
                      y1={ay}
                      x2={mx - 15}
                      y2={ay}
                      stroke={isActive ? "#3f1e3f" : "#8c857a"}
                      strokeWidth={isActive ? 1.1 : 0.8}
                      strokeDasharray={isActive ? undefined : "2 4"}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: entered ? 1 : 0, opacity: entered ? 1 : 0 }}
                      transition={{ duration: 0.8, ease, delay: entered ? 0.6 + (last - i) * 0.08 : 0 }}
                    />
                    <circle cx={ax + 2} cy={ay} r={2.6} fill={isActive ? "#3f1e3f" : "#8c857a"} />
                    <circle
                      cx={mx}
                      cy={ay}
                      r={15}
                      fill={isActive ? "#3f1e3f" : "#fbf9f4"}
                      stroke={isActive ? "#3f1e3f" : "#c9c0b3"}
                      strokeWidth="1"
                    />
                    <text
                      x={mx}
                      y={ay + 4}
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="600"
                      letterSpacing="0.04em"
                      fill={isActive ? "#fbf9f4" : "#3f1e3f"}
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {layer.number}
                    </text>
                  </g>
                )}
              </svg>
            </motion.div>
          );
        })}
    </div>
  );
}
