import type { Metadata } from "next";

import { MarketplacePage } from "@/components/marketplace-page";

export const metadata: Metadata = {
  title: "Land Listings | Forge Housing",
  description:
    "Browse verified land listings from Forge Housing with location, size, and pricing details.",
};

export default function LandListingsPage() {
  return (
    <MarketplacePage
      category="lands"
      title="Land Listings"
      description="Browse verified land opportunities with clear location, size, and pricing details."
    />
  );
}
