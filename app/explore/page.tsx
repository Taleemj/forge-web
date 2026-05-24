import type { Metadata } from "next";

import { MarketplacePage } from "@/components/marketplace-page";

export const metadata: Metadata = {
  title: "Explore Forge | Land, Houses, and House Designs",
  description:
    "Explore Forge Housing land listings, house listings, and modern house designs.",
};

export default function ExplorePage() {
  return (
    <MarketplacePage
      category="lands"
      title="Explore Forge"
      description="Browse land listings, house listings, and house designs."
    />
  );
}
