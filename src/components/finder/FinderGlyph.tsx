import type { FinderGlyph as Glyph } from "@/data/finder";

/**
 * Small line illustrations for the Mattress Finder options. Drawn on a 64 × 40
 * grid with a single stroke weight so they read as one family.
 */
const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Bed({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <path d="M6 30h52M8 30v4M56 30v4" {...S} />
      <rect x="8" y="24" width="48" height="6" rx="1.5" {...S} />
      {children}
    </>
  );
}

export function FinderGlyph({ glyph, meta }: { glyph: Glyph; meta?: number[] }) {
  let body: React.ReactNode = null;
  switch (glyph) {
    case "side":
      body = (
        <Bed>
          <circle cx="15" cy="17.5" r="3.2" {...S} />
          <path d="M19 19c5-1 8 1 11 3 2 1 5 1 7-1 2-1.5 5-1 6 1l3 2h6" {...S} />
          <path d="M30 22c2 2 6 2 9 2" {...S} />
        </Bed>
      );
      break;
    case "back":
      body = (
        <Bed>
          <circle cx="15" cy="18.5" r="3.2" {...S} />
          <path d="M19 21.5h33M24 19h20" {...S} />
        </Bed>
      );
      break;
    case "front":
      body = (
        <Bed>
          <circle cx="15" cy="19.5" r="3.2" {...S} />
          <path d="M19 22h33M22 20c4-3 10-3 16-1" {...S} />
          <path d="M14 16l3-2" {...S} />
        </Bed>
      );
      break;
    case "combination":
      body = (
        <Bed>
          <circle cx="32" cy="16" r="3.2" {...S} />
          <path d="M22 13a11 11 0 0 1 4-4M42 13a11 11 0 0 0-4-4" {...S} />
          <path d="M20 10.5l2 2.6 2.7-1.5M44 10.5l-2 2.6-2.7-1.5" {...S} />
        </Bed>
      );
      break;
    case "me":
    case "solo":
      body = (
        <>
          <circle cx="32" cy="13" r="5" {...S} />
          <path d="M22 34c0-6 4.5-10 10-10s10 4 10 10" {...S} />
        </>
      );
      break;
    case "partner":
      body = (
        <>
          <circle cx="25" cy="13" r="5" {...S} />
          <path d="M15 34c0-6 4.5-10 10-10 3 0 5.5 1 7 3" {...S} />
          <circle cx="39" cy="14" r="4.6" {...S} />
          <path d="M30 34c0-5.5 4-9.4 9-9.4s9 3.9 9 9.4" {...S} />
        </>
      );
      break;
    case "child":
      body = (
        <>
          <circle cx="32" cy="17" r="4" {...S} />
          <path d="M24.5 34c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8" {...S} />
          <path d="M44 10l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.3 1.3.4-2.6-1.9-1.8 2.6-.4z" {...S} />
        </>
      );
      break;
    case "guest":
      body = (
        <>
          <path d="M14 34V12h36v22" {...S} />
          <path d="M14 34h36M20 34V22h24v12M20 26h24" {...S} />
          <circle cx="44.5" cy="17" r="1" fill="currentColor" />
        </>
      );
      break;
    case "firm-1":
    case "firm-2":
    case "firm-3":
    case "firm-4": {
      const level = Number(glyph.slice(-1));
      const sag = [7, 4.5, 2.5, 0.8][level - 1];
      body = (
        <>
          <path d={`M8 22 Q32 ${22 + sag * 2} 56 22`} {...S} />
          <path d="M8 22v8h48v-8" {...S} />
          <circle cx="32" cy={14 + sag} r="4" {...S} />
        </>
      );
      break;
    }
    case "unsure":
      body = (
        <>
          <path d="M26.5 14.5a5.5 5.5 0 1 1 7.6 5.1c-1.4.6-2.1 1.6-2.1 3v1.4" {...S} />
          <circle cx="32" cy="29" r="0.9" fill="currentColor" />
        </>
      );
      break;
    case "hot":
    case "warm":
    case "cool": {
      const rays = glyph === "hot" ? 8 : glyph === "warm" ? 5 : 0;
      body = (
        <>
          {glyph === "cool" ? (
            <path d="M32 8v24M21.6 14l20.8 12M21.6 26l20.8-12M28 10l4 3 4-3M28 30l4-3 4 3" {...S} />
          ) : (
            <>
              <circle cx="32" cy="20" r="6" {...S} />
              {Array.from({ length: rays }, (_, i) => {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                return (
                  <path
                    key={i}
                    d={`M${32 + Math.cos(a) * 10} ${20 + Math.sin(a) * 10}L${32 + Math.cos(a) * 13.5} ${20 + Math.sin(a) * 13.5}`}
                    {...S}
                  />
                );
              })}
            </>
          )}
        </>
      );
      break;
    }
    case "pet":
      body = (
        <>
          <ellipse cx="32" cy="24" rx="7" ry="6" {...S} />
          <circle cx="21" cy="15" r="2.6" {...S} />
          <circle cx="28" cy="10.5" r="2.6" {...S} />
          <circle cx="36" cy="10.5" r="2.6" {...S} />
          <circle cx="43" cy="15" r="2.6" {...S} />
        </>
      );
      break;
    case "pressure":
      body = (
        <>
          <path d="M8 26 Q20 26 24 22 Q32 14 40 22 Q44 26 56 26" {...S} />
          <path d="M8 32h48" {...S} />
          <path d="M32 8v6M29 11.5l3 3 3-3" {...S} />
        </>
      );
      break;
    case "support":
      body = (
        <>
          <path d="M8 16h48M8 32h48" {...S} />
          {[14, 22, 30, 38, 46].map((x) => (
            <path key={x} d={`M${x} 16c3 2-3 4 0 6s-3 4 0 6 0 4 0 4`} {...S} />
          ))}
        </>
      );
      break;
    case "value":
      body = (
        <text x="32" y="28" textAnchor="middle" fontSize="20" fill="currentColor" style={{ fontFamily: "var(--font-serif)" }}>
          £
        </text>
      );
      break;
    case "natural":
      body = (
        <>
          <path d="M20 32c0-12 8-20 24-22-1 14-8 22-20 22h-4z" {...S} />
          <path d="M20 32c4-6 9-11 16-15" {...S} />
        </>
      );
      break;
    case "motion":
      body = (
        <Bed>
          <path d="M16 18c2-2 4-2 6 0M14 14c3.5-3.5 8.5-3.5 12 0" {...S} opacity="0.45" />
          <circle cx="44" cy="19" r="2.6" {...S} />
          <path d="M40 22.5h10" {...S} />
        </Bed>
      );
      break;
    case "size": {
      const [w, l] = meta ?? [135, 190];
      const sw = (w / 200) * 34;
      const sh = (l / 200) * 30;
      body = <rect x={32 - sw / 2} y={36 - sh} width={sw} height={sh} rx="1.5" {...S} />;
      break;
    }
    case "budget": {
      const n = meta?.[0] ?? 0;
      body =
        n === 0 ? (
          <path d="M20 20c0-4 3-6 6-6 6 0 6 12 12 12 3 0 6-2 6-6s-3-6-6-6c-6 0-6 12-12 12-3 0-6-2-6-6z" {...S} />
        ) : (
          <text
            x="32"
            y="27"
            textAnchor="middle"
            fontSize="16"
            letterSpacing="1"
            fill="currentColor"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {"£".repeat(n)}
          </text>
        );
      break;
    }
  }
  return (
    <svg viewBox="0 0 64 40" className="h-10 w-16" aria-hidden="true">
      {body}
    </svg>
  );
}
