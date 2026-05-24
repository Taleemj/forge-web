"use client";

import { Button, Empty, Space, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { buildMediaItems, DetailPageLayout } from "@/components/detail-page-layout";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

const fallbackImage =
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop";

export default function HouseDetailPage() {
  const params = useParams<{ id: string }>();
  const { houses, fetchPublicData } = useForgeWeb();
  const house = houses.find((item) => item.id === params.id);
  const recommendations = houses
    .filter((item) => item.id !== params.id)
    .slice(0, 3)
    .map((item) => ({
      key: item.id,
      href: `/houses/${item.id}`,
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
        {house ? (
          <DetailPageLayout
            media={buildMediaItems(house.images, house.media)}
            fallbackImage={fallbackImage}
            recommendationsTitle="Similar House Listings"
            recommendations={recommendations}
            details={
              <Space direction="vertical" size={12}>
                <Tag color="processing">{house.status}</Tag>
                <Title level={1}>{house.title}</Title>
                <Text type="secondary">{house.location}</Text>
                <Text>
                  {house.bedrooms} bedrooms · {house.bathrooms} bathrooms · {house.size}
                </Text>
                {house.descriptionMarkdown ? <Text>{house.descriptionMarkdown}</Text> : null}
                <Text strong>UGX {house.price.toLocaleString()}</Text>
                <Button type="primary" href="/login">
                  Login to enquire
                </Button>
              </Space>
            }
          />
        ) : (
          <Empty description="House not found" />
        )}
      </section>
    </AppShell>
  );
}
