import type { Metadata } from "next";

import { MarketplacePage } from "@/components/marketplace-page";

export const metadata: Metadata = {
  title: "House Designs | Forge Housing",
  description:
    "Explore modern Forge Housing house designs and request consultation for a build-ready plan.",
};

export default function HouseDesignsPage() {
  return (
    <MarketplacePage
      category="designs"
      title="House Designs"
      description="Compare modern house designs and prepare for a guided design consultation."
    />
  );
}
