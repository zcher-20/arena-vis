"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/channel/${disk.config.slug}`}
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
            <img
              src={bgUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
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
          {!bgUrl && <div className="w-full h-full bg-gray-100" />}
        </div>
        {/* Faded edge vignette */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.7) 90%, rgba(0,0,0,0.9) 100%)",
          }}
        />
        {/* Glossy highlight / glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.25) 0%, transparent 50%)",
          }}
        />
        {/* Subtle ring lines like a real CD */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "repeating-radial-gradient(circle, transparent 0px, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)",
          }}
        />
        {/* Center hole */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, white 40%, rgba(200,200,200,0.8) 60%, rgba(150,150,150,0.5) 80%, transparent 100%)",
            boxShadow: "0 0 6px 2px rgba(0,0,0,0.15) inset",
          }}
        />
        {/* Outer glow */}
        <div
          className="absolute -inset-1 rounded-full pointer-events-none"
          style={{
            boxShadow: "0 0 20px 4px rgba(0,0,0,0.15), 0 0 40px 8px rgba(0,0,0,0.05)",
          }}
        />
      </div>
      <div className="text-center">
        <p className="font-medium text-black text-sm capitalize">{disk.config.name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</p>
        {disk.meta && (
          <p className="text-xs text-gray-400">
            Last Update: {formatDate(disk.meta.updated_at)}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function DiskSelector({ onClose }: { onClose: () => void }) {
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-black">Select a disk</h2>
        <p className="text-base text-gray-400 mb-8 flex items-center gap-3">
          Curated channels by{" "}
          <a
            href="https://zaynebcherif.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700 text-sm font-medium"
          >
            <img
              src="/profile.jpg"
              alt="Zayneb"
              className="w-5 h-5 rounded-full object-cover"
            />
            Zayneb
          </a>
        </p>

        <div className="flex justify-center gap-10 flex-wrap">
          {disks.map((disk) => (
            <Disk key={disk.config.slug} disk={disk} onSelect={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}
