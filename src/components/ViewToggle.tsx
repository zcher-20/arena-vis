"use client";

export type ViewMode = "disks" | "canvas" | "grid";

export default function ViewToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex bg-white border border-gray-200 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs overflow-hidden">
      <button
        onClick={() => onChange("disks")}
        className={`w-20 py-1.5 text-center transition-colors ${
          mode === "disks" ? "bg-black text-white" : "text-gray-500 hover:text-black"
        }`}
      >
        Disks
      </button>
      <button
        onClick={() => onChange("canvas")}
        className={`w-20 py-1.5 text-center transition-colors ${
          mode === "canvas" ? "bg-black text-white" : "text-gray-500 hover:text-black"
        }`}
      >
        Canvas
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`w-20 py-1.5 text-center transition-colors ${
          mode === "grid" ? "bg-black text-white" : "text-gray-500 hover:text-black"
        }`}
      >
        Grid
      </button>
    </div>
  );
}
