import type { Metadata } from "next";

import { PropertyMaintenancePage } from "@/components/property-maintenance-page";

export const metadata: Metadata = {
  title: "Property Maintenance | Forge Housing",
  description:
    "Browse Forge Housing property maintenance services for repairs, recurring care, inspections, and managed property support.",
};

export default function PropertyMaintenanceRoute() {
  return <PropertyMaintenancePage />;
}
