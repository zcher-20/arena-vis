"use client";

import { useEffect } from "react";
import type { ArenaBlock } from "@/lib/arena";

export default function Lightbox({
  block,
  onClose,
}: {
  block: ArenaBlock;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!block.image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 cursor-pointer"
      onClick={onClose}
    >
      <img
        src={block.image.large?.src ?? block.image.src}
        alt={block.title || ""}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
