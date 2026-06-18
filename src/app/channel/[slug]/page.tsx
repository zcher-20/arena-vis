import { fetchChannelContents, getImageBlocks } from "@/lib/arena";
import { CHANNELS } from "@/lib/config";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChannelView from "@/components/ChannelView";
import SelectorProvider from "@/components/SelectorContext";

export const dynamic = "force-dynamic";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!CHANNELS.find((c) => c.slug === slug)) notFound();

  let contents;
  try {
    contents = await fetchChannelContents(slug);
  } catch {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-neutral-950">
        <Navbar currentChannel={slug} />
        <div className="flex-1 pt-14 flex items-center justify-center text-gray-400 dark:text-gray-500">
          This channel is private or unavailable.
        </div>
      </div>
    );
  }

  const blocks = getImageBlocks(contents);

  const allResults = await Promise.all(
    CHANNELS.map((ch) => fetchChannelContents(ch.slug).catch(() => []))
  );
  const allBlocks = allResults.flatMap((c) => getImageBlocks(c));

  return (
    <SelectorProvider>
      <div className="flex flex-col h-screen bg-white dark:bg-neutral-950">
        <Navbar currentChannel={slug} />
        <div className="flex-1 relative pt-14">
          <ChannelView blocks={blocks} allBlocks={allBlocks} />
        </div>
      </div>
    </SelectorProvider>
  );
}
