"use client";

import { Alert, Empty, Space, Typography } from "antd";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { ListingCard } from "@/components/listing-card";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

export function PropertyMaintenancePage() {
  const { services, errors, fetchPublicData } = useForgeWeb();

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  return (
    <AppShell>
      <section className="page-section">
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Property care</Text>
            <Title level={1}>Property Maintenance</Title>
            <Text type="secondary">Browse services and request property support.</Text>
          </Space>
        </div>

        {errors.publicData ? (
          <Alert type="warning" showIcon message={errors.publicData} style={{ marginBottom: 18 }} />
        ) : null}

        {services.length ? (
          <div className="listing-grid">
            {services.map((service) => (
              <ListingCard
                key={service.id}
                href={`/services/${service.id}`}
                title={service.title}
                subtitle={service.description}
                price={service.price}
                image={service.images?.[0]}
                tag={service.billingPeriod || "service"}
              />
            ))}
          </div>
        ) : (
          <Empty description="No maintenance services available yet" />
        )}
      </section>
    </AppShell>
  );
}
