"use client";

import { useState, useMemo, useEffect } from "react";
import type { ArenaBlock } from "@/lib/arena";
import { HIDDEN_BLOCK_IDS } from "@/lib/config";
import Lightbox from "./Lightbox";

const ALL_IMAGES = "All Images";

const CATEGORY_NAMES = [
  ALL_IMAGES,
  "Space",
  "Data & Networks",
  "Art Direction",
  "Photography",
  "Diagrams",
  "Typography",
  "Cosmology",
  "Abstract",
];

function categorize(block: ArenaBlock): string[] {
  const t = (block.title || "").toLowerCase();
  const desc = block.description;
  const d =
    typeof desc === "string"
      ? desc.toLowerCase()
      : (desc as { plain?: string } | null)?.plain?.toLowerCase() ?? "";
  const s = block.source?.title?.toLowerCase() ?? "";
  const all = `${t} ${d} ${s}`;

  const cats: string[] = [];

  if (/photo|portrait|camera|film|kodak|headshot|face/.test(all)) cats.push("Photography");
  if (/diagram|schematic|blueprint|harness|parachute|valve|flow/.test(all)) cats.push("Diagrams");
  if (/typo|font|letter|text|gift vol|tuamie|print|poster|magazine/.test(all)) cats.push("Typography");
  if (/cosmos|star|galaxy|nebula|moon|planet|sun|solar|parallax|telescope|webb|nasa|hubble|orbit|jupiter|io|universe|milky|light.?ray|horizon|gaia/.test(all)) cats.push("Space");
  if (/data|viz|visual|network|graph|chart|map|math|equation|statistics|calibration|timeline|structure/.test(all)) cats.push("Data & Networks");
  if (/art.?direct|fashion|campaign|editorial|incubator|luncheon|celine|aeryne/.test(all)) cats.push("Art Direction");
  if (/abstract|implosion|pattern|generative|geometric/.test(all)) cats.push("Abstract");
  if (/cosmo|astro|space|star|planet/.test(all) && !cats.includes("Space")) cats.push("Cosmology");

  if (cats.length === 0) cats.push("Abstract");
  return cats;
}

function CategoryCard({
  name,
  index,
  images,
  onClick,
}: {
  name: string;
  index: number;
  images: ArenaBlock[];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const coverOffsets: Record<string, number> = {
    [ALL_IMAGES]: 27,
    "Space": 0,
    "Photography": 1,
    "Typography": 2,
    "Art Direction": 0,
  };
  const coverIdx = coverOffsets[name] ?? 0;
  const cover = images[coverIdx]?.image ?? images[0]?.image;
  const second = images[coverIdx + 1]?.image ?? images[1]?.image;
  const num = String(index + 1).padStart(2, "0");
  const tilt = 2;
  const flipped = index % 3 === 1;

  return (
    <div
      className="cursor-pointer flex items-center gap-3"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 self-center">{num}.</span>
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 140, height: 180 }}>
          {cover && (
            <div
              className="absolute inset-0 shadow-md"
              style={{
                transform: `rotate(${tilt}deg)`,
                zIndex: 0,
              }}
            >
              <img
                src={cover.medium?.src ?? cover.src}
                alt={name}
                className="w-full h-full object-cover bg-gray-100 dark:bg-neutral-800"
              />
            </div>
          )}
          {second && (
            <div
              className="absolute inset-0 transition-all duration-500 ease-out shadow-lg"
              style={{
                transformOrigin: "center center",
                transform: hovered
                  ? `rotate(${flipped ? 90 : 1}deg) scale(1)`
                  : `rotate(${flipped ? 90 : 2}deg) scale(0.5)`,
                opacity: hovered ? 1 : 0,
                zIndex: 1,
              }}
            >
              <img
                src={second.medium?.src ?? second.src}
                alt=""
                className="w-full h-full object-cover bg-gray-100 dark:bg-neutral-800"
              />
            </div>
          )}
        </div>
        <p
          className="text-2xl text-black dark:text-white text-center mt-5"
          style={{ fontFamily: "'Bastliga One', cursive" }}
         
        >
          {name}
        </p>
      </div>
    </div>
  );
}

function CategoryDetail({
  name,
  images,
  onBack,
}: {
  name: string;
  images: ArenaBlock[];
  onBack: () => void;
}) {
  const [lightbox, setLightbox] = useState<ArenaBlock | null>(null);

  return (
    <>
      <div className="h-full overflow-y-auto bg-white dark:bg-neutral-950 px-8 pt-4 pb-20">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-6 flex items-center gap-1"
         
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to categories
        </button>
        <h2
          className="text-3xl text-black dark:text-white mb-8 text-center"
          style={{ fontFamily: "'Bastliga One', cursive" }}
        >
          {name}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-14 max-w-6xl mx-auto">
          {images.map((block, i) => {
            if (!block.image) return null;
            const num = String(i + 1).padStart(2, "0");
            const title =
              block.title && !block.title.match(/\.[a-z]{3,4}$/i)
                ? block.title
                : block.source?.title?.split(" - ")[0] || "Untitled";

            return (
              <div
                key={block.id}
                className="group cursor-pointer flex flex-col items-center"
                onClick={() => setLightbox(block)}
              >
                <div
                  className="relative overflow-hidden bg-gray-50 dark:bg-neutral-800 shadow-md transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-[1.02] w-full mb-3"
                  style={{
                    aspectRatio: `${block.image.width} / ${block.image.height}`,
                    maxHeight: 280,
                  }}
                >
                  <img
                    src={block.image.medium?.src ?? block.image.src}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-sm text-black dark:text-white font-medium text-center truncate w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  {title.length > 30 ? title.slice(0, 30) + "…" : title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {lightbox && <Lightbox block={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

export default function GridView({ blocks }: { blocks: ArenaBlock[] }) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setShown(true)); }, []);

  const visible = blocks.filter((b) => !HIDDEN_BLOCK_IDS.has(b.id));

  const categoryMap = useMemo(() => {
    const map: Record<string, ArenaBlock[]> = {};
    for (const cat of CATEGORY_NAMES) map[cat] = [];
    map[ALL_IMAGES] = [...visible];
    for (const block of visible) {
      const cats = categorize(block);
      for (const cat of cats) {
        if (map[cat]) map[cat].push(block);
      }
    }
    return map;
  }, [visible]);

  const activeCategories = CATEGORY_NAMES.filter((c) => categoryMap[c].length > 0);

  if (selectedCat && categoryMap[selectedCat]) {
    return (
      <CategoryDetail
        name={selectedCat}
        images={categoryMap[selectedCat]}
        onBack={() => setSelectedCat(null)}
      />
    );
  }

  const row1 = activeCategories.slice(0, 4);
  const row2 = activeCategories.slice(4);

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-neutral-950 px-12 pt-10 pb-32 transition-opacity duration-500" style={{ opacity: shown ? 1 : 0 }}>
      {/* Row 1 */}
      <div className="grid grid-cols-4 gap-x-24 max-w-5xl mx-auto justify-items-center">
        {row1.map((cat, i) => (
          <CategoryCard
            key={cat}
            name={cat}
            index={i}
            images={categoryMap[cat]}
            onClick={() => setSelectedCat(cat)}
          />
        ))}
      </div>

      {/* Filter tabs between rows */}
      <div className="flex items-center justify-center gap-8 my-20 max-w-5xl mx-auto">
        <span
          className="text-xs text-black dark:text-white underline underline-offset-4"
         
        >
          All Projects ({String(visible.length).padStart(2, "0")})
        </span>
        {activeCategories.filter(c => c !== ALL_IMAGES).slice(0, 2).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
           
          >
            {cat} ({String(categoryMap[cat].length).padStart(2, "0")})
          </button>
        ))}
      </div>

      {/* Row 2 */}
      {row2.length > 0 && (
        <div className="grid grid-cols-4 gap-x-24 max-w-5xl mx-auto justify-items-center">
          {row2.map((cat, i) => (
            <CategoryCard
              key={cat}
              name={cat}
              index={i + 4}
              images={categoryMap[cat]}
              onClick={() => setSelectedCat(cat)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
