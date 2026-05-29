"use client";

import { Alert, Empty, Segmented, Skeleton, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { DesignRequestModal } from "@/components/design-request-modal";
import { ListingCard } from "@/components/listing-card";
import { ListingSkeletonGrid } from "@/components/listing-skeleton";
import { MarketplaceInterestModal } from "@/components/marketplace-interest-modal";
import { useForgeWeb } from "@/context/forge-web-context";
import type { Design, House, Land } from "@/types";

const { Text, Title } = Typography;

type MarketplaceCategory = "lands" | "houses" | "designs";

const categoryRoutes: Record<MarketplaceCategory, string> = {
  lands: "/land-listings",
  houses: "/house-listings",
  designs: "/house-designs",
};

export function MarketplacePage({
  category,
  title,
  description,
}: {
  category: MarketplaceCategory;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const {
    lands,
    designs,
    houses,
    isInitialLoading,
    isRefreshing,
    errors,
    fetchPublicData,
  } = useForgeWeb();

  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  const items = useMemo(() => {
    if (category === "designs") {
      return designs.map((design) => ({
        key: design.id,
        href: `/designs/${design.id}`,
        title: design.title,
        subtitle: design.description,
        price: design.price,
        image: design.images?.[0],
        tag: "House Design",
        actionLabel: "Interested",
        onAction: () => setSelectedDesign(design),
      }));
    }

    if (category === "houses") {
      return houses.map((house) => ({
        key: house.id,
        href: `/houses/${house.id}`,
        title: house.title,
        subtitle: house.location,
        price: house.price,
        image: house.images?.[0],
        tag: house.status,
        actionLabel: "Interested",
        onAction: () => setSelectedHouse(house),
      }));
    }

    return lands.map((land) => ({
      key: land.id,
      href: `/lands/${land.id}`,
      title: land.title,
      subtitle: land.location,
      price: land.price,
      image: land.images?.[0],
      tag: land.status,
      actionLabel: "Interested",
      onAction: () => setSelectedLand(land),
    }));
  }, [category, designs, houses, lands]);

  return (
    <AppShell>
      <section className="page-section">
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Marketplace</Text>
            <Title level={1}>{title}</Title>
            <Text type="secondary">{description}</Text>
          </Space>
          <Segmented
            className="explore-tabs"
            value={category}
            onChange={(value) =>
              router.push(categoryRoutes[value as MarketplaceCategory])
            }
            options={[
              { label: "Land Listings", value: "lands" },
              { label: "House Listings", value: "houses" },
              { label: "House Designs", value: "designs" },
            ]}
          />
        </div>

        {errors.publicData ? (
          <Alert
            type="warning"
            showIcon
            message={errors.publicData}
            style={{ marginBottom: 18 }}
          />
        ) : null}

        {isInitialLoading || (isRefreshing && !items.length) ? (
          <ListingSkeletonGrid count={6} />
        ) : items.length ? (
          <div className="listing-grid">
            {items.map(({ key, ...item }) => (
              <ListingCard key={key} {...item} />
            ))}
          </div>
        ) : (
          <Empty description="No listings available yet" />
        )}
      </section>

      {selectedLand && (
        <MarketplaceInterestModal
          item={selectedLand}
          type="land"
          open={Boolean(selectedLand)}
          onClose={() => setSelectedLand(null)}
        />
      )}

      {selectedHouse && (
        <MarketplaceInterestModal
          item={selectedHouse}
          type="house"
          open={Boolean(selectedHouse)}
          onClose={() => setSelectedHouse(null)}
        />
      )}

      {selectedDesign && (
        <DesignRequestModal
          design={selectedDesign}
          open={Boolean(selectedDesign)}
          onClose={() => setSelectedDesign(null)}
        />
      )}
    </AppShell>
  );
}
