"use client";

import { Button, Empty, Space, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { buildMediaItems, DetailPageLayout } from "@/components/detail-page-layout";
import { MaintenanceRequestModal } from "@/components/maintenance-request-modal";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

const fallbackImage =
  "https://images.unsplash.com/photo-1558905619-17153ad27391?q=80&w=1600&auto=format&fit=crop";

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const { services, fetchPublicData } = useForgeWeb();
  const [requestOpen, setRequestOpen] = useState(false);
  const service = services.find((item) => item.id === params.id);
  const recommendations = services
    .filter((item) => item.id !== params.id)
    .slice(0, 3)
    .map((item) => ({
      key: item.id,
      href: `/services/${item.id}`,
      title: item.title,
      subtitle: item.description,
      price: item.price,
      image: item.images?.[0],
      tag: item.billingPeriod || "service",
    }));

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  return (
    <AppShell>
      <section className="page-section">
        {service ? (
          <>
            <DetailPageLayout
              media={buildMediaItems(service.images, service.media)}
              fallbackImage={fallbackImage}
              recommendationsTitle="Similar Maintenance Services"
              recommendations={recommendations}
              details={
                <Space direction="vertical" size={12}>
                  <Tag color="processing">{service.billingPeriod || "service"}</Tag>
                  <Title level={1}>{service.title}</Title>
                  <Text>{service.description}</Text>
                  {service.helpText ? <Text type="secondary">{service.helpText}</Text> : null}
                  {service.descriptionMarkdown ? <Text>{service.descriptionMarkdown}</Text> : null}
                  <Text strong>UGX {service.price.toLocaleString()}</Text>
                  <Button type="primary" onClick={() => setRequestOpen(true)}>
                    Request service quote
                  </Button>
                </Space>
              }
            />
            <MaintenanceRequestModal
              service={service}
              open={requestOpen}
              onClose={() => setRequestOpen(false)}
            />
          </>
        ) : (
          <Empty description="Service not found" />
        )}
      </section>
    </AppShell>
  );
}
