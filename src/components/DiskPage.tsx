"use client";

import { useEffect, useState, useRef } from "react";

import { CHANNELS, type ChannelConfig } from "@/lib/config";
import {
  fetchChannelMeta,
  fetchChannelContents,
  getImageBlocks,
  type ArenaChannel,
} from "@/lib/arena";

interface DiskInfo {
  config: ChannelConfig;
  meta: ArenaChannel | null;
  imageUrls: string[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Disk({ disk, onSelect }: { disk: DiskInfo; onSelect: () => void }) {
  const [bgIdx, setBgIdx] = useState(0);
  const [fgIdx, setFgIdx] = useState(1);
  const [fgOpacity, setFgOpacity] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (disk.imageUrls.length <= 1) return;

    function cycle() {
      timerRef.current = setTimeout(() => {
        setTransitionOn(true);
        setFgOpacity(1);

        timerRef.current = setTimeout(() => {
          setTransitionOn(false);
          setBgIdx((prev) => {
            const next = (prev + 1) % disk.imageUrls.length;
            setFgIdx((next + 1) % disk.imageUrls.length);
            return next;
          });
          setFgOpacity(0);

          timerRef.current = setTimeout(() => {
            cycle();
          }, 50);
        }, 2500);
      }, 3500);
    }

    cycle();
    return () => clearTimeout(timerRef.current);
  }, [disk.imageUrls.length]);

  const bgUrl = disk.imageUrls[bgIdx] ?? null;
  const fgUrl = disk.imageUrls[fgIdx] ?? null;

  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-52 h-52">
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            animation: "spin-slow 8s linear infinite",
            animationPlayState: hovered ? "paused" : "running",
          }}
        >
          {bgUrl && (
            <img src={bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
          {fgUrl && (
            <img
              src={fgUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: fgOpacity,
                transition: transitionOn ? "opacity 2.5s ease-in-out" : "none",
              }}
            />
          )}
          {!bgUrl && <div className="w-full h-full bg-gray-100 dark:bg-neutral-800" />}
        </div>
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.7) 90%, rgba(0,0,0,0.9) 100%)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.25) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "repeating-radial-gradient(circle, transparent 0px, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(255,100,100,0.06), rgba(100,255,100,0.06), rgba(100,100,255,0.06), rgba(255,100,255,0.06), rgba(100,255,255,0.06), rgba(255,255,100,0.06), rgba(255,100,100,0.06))",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, white 40%, rgba(200,200,200,0.8) 60%, rgba(150,150,150,0.5) 80%, transparent 100%)",
            boxShadow: "0 0 6px 2px rgba(0,0,0,0.15) inset",
          }}
        />
        <div
          className="absolute -inset-1 rounded-full pointer-events-none"
          style={{
            boxShadow: "0 0 20px 4px rgba(0,0,0,0.15), 0 0 40px 8px rgba(0,0,0,0.05)",
          }}
        />
      </div>
      <div className="text-center">
        <p className="font-medium text-black dark:text-white text-sm">
          {disk.config.name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
        </p>
        {disk.meta && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Last Update: {formatDate(disk.meta.updated_at)}
          </p>
        )}
      </div>
    </button>
  );
}

export default function DiskPage({ onSelectDisk }: { onSelectDisk: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const [disks, setDisks] = useState<DiskInfo[]>(
    CHANNELS.map((c) => ({ config: c, meta: null, imageUrls: [] }))
  );

  useEffect(() => {
    CHANNELS.forEach((ch, i) => {
      Promise.all([
        fetchChannelMeta(ch.slug).catch(() => null),
        fetchChannelContents(ch.slug).catch(() => []),
      ]).then(([meta, contents]) => {
        const images = getImageBlocks(contents);
        const urls = images
          .map((img) => img.image?.medium?.src ?? img.image?.src)
          .filter((u): u is string => !!u);
        setDisks((prev) => {
          const next = [...prev];
          next[i] = { config: ch, meta, imageUrls: urls };
          return next;
        });
      });
    });
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 transition-opacity duration-500 px-12 overflow-y-auto" style={{ opacity: visible ? 1 : 0 }}>
      <p className="text-gray-700 dark:text-gray-300 mb-10 w-full text-center" style={{ fontFamily: "'Bastliga One', cursive", fontSize: "5.5rem", lineHeight: 1.1 }}>
        Curated channels by{" "}
        <a
          href="https://zaynebcherif.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
        >
          Zayneb Cherif
        </a>
      </p>
      <div className="flex justify-center gap-10 flex-wrap">
        {disks.map((disk) => (
          <Disk key={disk.config.slug} disk={disk} onSelect={onSelectDisk} />
        ))}
      </div>
    </div>
  );
}
