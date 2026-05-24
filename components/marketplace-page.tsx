"use client";

import { Alert, Empty, Segmented, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { AppShell } from "@/components/app-shell";
import { ListingCard } from "@/components/listing-card";
import { useForgeWeb } from "@/context/forge-web-context";

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
  const { lands, designs, houses, errors, fetchPublicData } = useForgeWeb();

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
            onChange={(value) => router.push(categoryRoutes[value as MarketplaceCategory])}
            options={[
              { label: "Land Listings", value: "lands" },
              { label: "House Listings", value: "houses" },
              { label: "House Designs", value: "designs" },
            ]}
          />
        </div>

        {errors.publicData ? (
          <Alert type="warning" showIcon message={errors.publicData} style={{ marginBottom: 18 }} />
        ) : null}

        {items.length ? (
          <div className="listing-grid">
            {items.map(({ key, ...item }) => (
              <ListingCard key={key} {...item} />
            ))}
          </div>
        ) : (
          <Empty description="No listings available yet" />
        )}
      </section>
    </AppShell>
  );
}
