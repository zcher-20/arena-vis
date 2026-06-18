import { redirect } from "next/navigation";
import { CHANNELS } from "@/lib/config";

export default function Home() {
  redirect(`/channel/${CHANNELS[0].slug}`);
}
