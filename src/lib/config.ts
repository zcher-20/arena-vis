export interface ChannelConfig {
  slug: string;
  name: string;
}

export const CHANNELS: ChannelConfig[] = [
  { slug: "cosmology-2sqh70bmv0g", name: "cosmology" },
  { slug: "data-visualization-4dtkzmzbrsy", name: "data visualization" },
  { slug: "art-direction-wjdprzd7lsa", name: "art direction" },
];

export const ARENA_PROFILE_URL = "https://www.are.na/zayneb-c/channels";
export const ARENA_HOME_URL = "https://www.are.na";

export const HIDDEN_BLOCK_IDS = new Set([26767622, 16298562]);
