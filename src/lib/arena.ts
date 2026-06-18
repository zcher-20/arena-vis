const BASE = "https://api.are.na/v3";

export interface ArenaImage {
  src: string;
  width: number;
  height: number;
  aspect_ratio: number;
  content_type: string;
  small: { src: string };
  medium: { src: string };
  large: { src: string };
}

export interface ArenaBlock {
  id: number;
  type: "Image" | "Text" | "Link" | "Attachment" | "Embed";
  base_type: "Block";
  title: string;
  description: string | null;
  content: string | null;
  image: ArenaImage | null;
  source: { url: string; title: string } | null;
  updated_at: string;
  created_at: string;
}

export interface ArenaChannelRef {
  id: number;
  type: "Channel";
  slug: string;
  title: string;
  updated_at: string;
}

export type ArenaContent = ArenaBlock | ArenaChannelRef;

export interface ArenaChannel {
  id: number;
  slug: string;
  title: string;
  updated_at: string;
  metadata: Record<string, string> | null;
  counts: { blocks: number; channels: number; contents: number };
}

function isBlock(item: ArenaContent): item is ArenaBlock {
  return "base_type" in item && item.base_type === "Block";
}

export function getImageBlocks(contents: ArenaContent[]): ArenaBlock[] {
  return contents.filter(
    (item): item is ArenaBlock => isBlock(item) && item.type === "Image" && item.image !== null
  );
}

export async function fetchChannelContents(slug: string): Promise<ArenaContent[]> {
  const res = await fetch(`${BASE}/channels/${slug}/contents?per=100`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Failed to fetch channel ${slug}: ${res.status}`);
  const json = await res.json();
  return json.data ?? json.contents ?? [];
}

export async function fetchChannelMeta(slug: string): Promise<ArenaChannel> {
  const res = await fetch(`${BASE}/channels/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Failed to fetch channel meta ${slug}: ${res.status}`);
  return res.json();
}
