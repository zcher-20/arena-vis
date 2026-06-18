"use client";

import { CHANNELS, ARENA_HOME_URL } from "@/lib/config";
import DiskSelector from "./DiskSelector";
import { useSelectorOpen } from "./SelectorContext";

export default function Navbar({ currentChannel }: { currentChannel?: string }) {
  const { selectorOpen, setSelectorOpen } = useSelectorOpen();

  const current = CHANNELS.find((c) => c.slug === currentChannel);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-3 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md px-3 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <a
            href={ARENA_HOME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Are.na
          </a>
          <span className="text-gray-300 dark:text-neutral-600">/</span>
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            type="button"
            className="flex items-center gap-1 font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
      <DiskSelector open={selectorOpen} onClose={() => setSelectorOpen(false)} />
    </>
  );
}
