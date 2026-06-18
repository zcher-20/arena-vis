"use client";

import { useState } from "react";
import { CHANNELS, ARENA_HOME_URL } from "@/lib/config";
import DiskSelector from "./DiskSelector";

export default function Navbar({ currentChannel }: { currentChannel?: string }) {
  const [selectorOpen, setSelectorOpen] = useState(false);

  const current = CHANNELS.find((c) => c.slug === currentChannel);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-3 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 text-xs bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <a
            href={ARENA_HOME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-black transition-colors"
          >
            Are.na
          </a>
          <span className="text-gray-300">/</span>
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="flex items-center gap-1 font-medium text-black hover:text-gray-600 transition-colors"
          >
            {current?.name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") ?? "Select Channel"}
            <svg
              className={`w-3 h-3 transition-transform ${selectorOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </nav>
      {selectorOpen && <DiskSelector onClose={() => setSelectorOpen(false)} />}
    </>
  );
}
