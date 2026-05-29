"use client";

import { Button, Empty, Skeleton, Space, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { buildMediaItems, DetailPageLayout } from "@/components/detail-page-layout";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

const fallbackImage =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop";

export default function LandDetailPage() {
  const params = useParams<{ id: string }>();
  const { lands, isInitialLoading, isRefreshing, fetchPublicData } = useForgeWeb();
  const land = lands.find((item) => item.id === params.id);
  const recommendations = lands
    .filter((item) => item.id !== params.id)
    .slice(0, 3)
    .map((item) => ({
      key: item.id,
      href: `/lands/${item.id}`,
      title: item.title,
      subtitle: item.location,
      price: item.price,
      image: item.images?.[0],
      tag: item.status,
    }));

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  return (
    <AppShell>
      <section className="page-section">
        {isInitialLoading || (isRefreshing && !land) ? (
          <DetailPageLayout
            loading
            media={[]}
            fallbackImage={fallbackImage}
            recommendationsTitle="Similar Land Listings"
            recommendations={[]}
            details={
              <Space direction="vertical" size={12} className="full-width">
                <Skeleton.Button active style={{ width: 120 }} />
                <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 3 }} />
                <Skeleton.Button active block size="large" />
              </Space>
            }
          />
        ) : land ? (
          <DetailPageLayout
            media={buildMediaItems(land.images, land.media)}
            fallbackImage={fallbackImage}
            recommendationsTitle="Similar Land Listings"
            recommendations={recommendations}
            details={
              <Space direction="vertical" size={12}>
                <Tag color="processing">{land.status}</Tag>
                <Title level={1}>{land.title}</Title>
                <Text type="secondary">{land.location}</Text>
                <Text strong>UGX {land.price.toLocaleString()}</Text>
                <Text>{land.size}</Text>
                {land.descriptionMarkdown ? <Text>{land.descriptionMarkdown}</Text> : null}
                <Button type="primary" href="/login">
                  Login to enquire
                </Button>
              </Space>
            }
          />
        ) : (
          <Empty description="Land listing not found" />
        )}
      </section>
    </AppShell>
  );
}
