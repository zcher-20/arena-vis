"use client";

import { useState } from "react";
import type { ArenaBlock } from "@/lib/arena";
import Canvas from "./Canvas";
import GridView from "./GridView";
import DiskPage from "./DiskPage";
import ViewToggle, { type ViewMode } from "./ViewToggle";

export default function ChannelView({
  blocks,
  allBlocks,
}: {
  blocks: ArenaBlock[];
  allBlocks: ArenaBlock[];
}) {
  const [mode, setMode] = useState<ViewMode>("canvas");

  return (
    <>
      {mode === "disks" && <DiskPage onSelectDisk={() => setMode("canvas")} />}
      {mode === "canvas" && <Canvas blocks={blocks} />}
      {mode === "grid" && <GridView blocks={allBlocks} />}
      <ViewToggle mode={mode} onChange={setMode} />
    </>
  );
}
