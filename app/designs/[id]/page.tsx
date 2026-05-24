"use client";

import { Button, Empty, Space, Typography } from "antd";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { buildMediaItems, DetailPageLayout } from "@/components/detail-page-layout";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

const fallbackImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop";

export default function DesignDetailPage() {
  const params = useParams<{ id: string }>();
  const { designs, fetchPublicData } = useForgeWeb();
  const design = designs.find((item) => item.id === params.id);
  const recommendations = designs
    .filter((item) => item.id !== params.id)
    .slice(0, 3)
    .map((item) => ({
      key: item.id,
      href: `/designs/${item.id}`,
      title: item.title,
      subtitle: item.description,
      price: item.price,
      image: item.images?.[0],
      tag: "House Design",
    }));

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  return (
    <AppShell>
      <section className="page-section">
        {design ? (
          <DetailPageLayout
            media={buildMediaItems(design.images, design.media)}
            fallbackImage={fallbackImage}
            recommendationsTitle="Similar House Designs"
            recommendations={recommendations}
            details={
              <Space direction="vertical" size={12}>
                <Text className="dashboard-kicker">House design</Text>
                <Title level={1}>{design.title}</Title>
                <Text>{design.description}</Text>
                {design.floorPlan ? <Text type="secondary">Floor plan: {design.floorPlan}</Text> : null}
                {design.descriptionMarkdown ? <Text>{design.descriptionMarkdown}</Text> : null}
                <Text strong>UGX {design.price.toLocaleString()}</Text>
                <Button type="primary" href="/login">
                  Login to request consultation
                </Button>
              </Space>
            }
          />
        ) : (
          <Empty description="Design not found" />
        )}
      </section>
    </AppShell>
  );
}
