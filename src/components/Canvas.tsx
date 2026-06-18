"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { ArenaBlock } from "@/lib/arena";
import Lightbox from "./Lightbox";
import { useSelectorOpen } from "./SelectorContext";

const COL_WIDTH = 280;
const GAP = 6;
const REPEAT = 6;

function computeMasonry(blocks: ArenaBlock[], cols: number) {
  const colHeights = new Array(cols).fill(0);
  const positions: { x: number; y: number; w: number; h: number; blockIdx: number }[] = [];

  const repeated = Array.from({ length: REPEAT }, () => blocks).flat();

  for (let i = 0; i < repeated.length; i++) {
    const block = repeated[i];
    if (!block.image || !block.image.width || !block.image.height) continue;
    const aspect = block.image.width / block.image.height;
    const h = COL_WIDTH / aspect;
    const minCol = colHeights.indexOf(Math.min(...colHeights));
    positions.push({
      x: minCol * (COL_WIDTH + GAP),
      y: colHeights[minCol],
      w: COL_WIDTH,
      h,
      blockIdx: i % blocks.length,
    });
    colHeights[minCol] += h + GAP;
  }

  const totalW = cols * (COL_WIDTH + GAP) - GAP;
  const totalH = Math.max(...colHeights);
  return { positions, totalW, totalH };
}

export default function Canvas({ blocks }: { blocks: ArenaBlock[] }) {
  const { selectorOpen } = useSelectorOpen();
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [lightbox, setLightbox] = useState<ArenaBlock | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const pan = useRef({ x: 0, y: 0 });
  const zoom = useRef(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const updateTilesRef = useRef<(() => void) | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setContainerWidth(r.width);
      setContainerHeight(r.height);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ready = containerWidth > 0 && containerHeight > 0;

  useEffect(() => {
    if (ready) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [ready]);
  const cols = Math.max(1, Math.floor((containerWidth * 2) / (COL_WIDTH + GAP)));
  const layout = useMemo(
    () => (ready ? computeMasonry(blocks, cols) : { positions: [], totalW: 0, totalH: 0 }),
    [blocks, cols, ready]
  );
  const { positions, totalW, totalH } = layout;

  const tileOffsets = useMemo(() => {
    const offsets: [number, number][] = [];
    for (let ty = -1; ty <= 1; ty++) {
      for (let tx = -1; tx <= 1; tx++) {
        offsets.push([tx * totalW, ty * totalH]);
      }
    }
    return offsets;
  }, [totalW, totalH]);

  useEffect(() => {
    if (!ready || totalW === 0 || totalH === 0) return;

    function updateTiles() {
      const z = zoom.current;
      const bx = totalW > 0 ? ((pan.current.x % totalW) + totalW) % totalW : 0;
      const by = totalH > 0 ? ((pan.current.y % totalH) + totalH) % totalH : 0;
      const ox = bx - totalW + (containerWidth - totalW) / 2;
      const oy = by - totalH + (containerHeight - totalH) / 2;

      tileRefs.current.forEach((el, i) => {
        if (!el) return;
        const [tx, ty] = tileOffsets[i];
        el.style.transform = `translate(${ox + tx}px, ${oy + ty}px) scale(${z})`;
        el.style.transformOrigin = `${containerWidth / 2 - (ox + tx)}px ${containerHeight / 2 - (oy + ty)}px`;
      });
    }

    updateTilesRef.current = updateTiles;
    updateTiles();

    const el = containerRef.current;
    if (!el) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const delta = -e.deltaY * 0.005;
        zoom.current = Math.min(3, Math.max(0.3, zoom.current + delta));
        setZoomLevel(zoom.current);
      } else {
        pan.current.x -= e.deltaX;
        pan.current.y -= e.deltaY;
      }
      updateTiles();
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ready, totalW, totalH, containerWidth, containerHeight, tileOffsets]);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden select-none transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          filter: selectorOpen ? "grayscale(100%)" : "grayscale(0%)",
          overscrollBehavior: "none",
          touchAction: "none",
        }}
        onMouseLeave={() => setHoveredId(null)}
      >
        {ready &&
          tileOffsets.map(([ox, oy], tIdx) => (
            <div
              key={tIdx}
              ref={(el) => { tileRefs.current[tIdx] = el; }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: totalW,
                height: totalH,
                willChange: "transform",
              }}
            >
              {positions.map((pos, i) => {
                const block = blocks[pos.blockIdx];
                if (!block.image) return null;
                const isHovered = hoveredId === block.id;
                const somethingHovered = hoveredId !== null;
                const shouldGray = somethingHovered && !isHovered;

                return (
                  <div
                    key={`${i}-${block.id}`}
                    style={{
                      position: "absolute",
                      left: pos.x,
                      top: pos.y,
                      width: pos.w,
                      height: pos.h,
                    }}
                    onMouseEnter={() => setHoveredId(block.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setLightbox(block)}
                  >
                    <img
                      src={block.image.medium?.src ?? block.image.src}
                      alt={block.title || ""}
                      className="w-full h-full object-cover transition-[filter] duration-500"
                      style={{
                        filter: shouldGray ? "grayscale(100%)" : "grayscale(0%)",
                        transform: isHovered ? "scale(1.03)" : "scale(1)",
                        transition: "filter 0.5s, transform 0.3s",
                      }}
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>
          ))}
      </div>
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md shadow-sm text-xs overflow-hidden">
        <button
          onClick={() => {
            zoom.current = Math.max(0.3, zoom.current - 0.15);
            setZoomLevel(zoom.current);
            updateTilesRef.current?.();
          }}
          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          −
        </button>
        <span className="w-10 text-center text-gray-400 select-none">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={() => {
            zoom.current = Math.min(3, zoom.current + 0.15);
            setZoomLevel(zoom.current);
            updateTilesRef.current?.();
          }}
          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          +
        </button>
      </div>
      {lightbox && <Lightbox block={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}
