import type { Metadata } from "next";

import { MarketplacePage } from "@/components/marketplace-page";

export const metadata: Metadata = {
  title: "House Listings | Forge Housing",
  description:
    "Browse available house listings from Forge Housing with pricing, bedrooms, bathrooms, and location details.",
};

export default function HouseListingsPage() {
  return (
    <MarketplacePage
      category="houses"
      title="House Listings"
      description="Explore available houses with pricing, bedrooms, bathrooms, and location details."
    />
  );
}
