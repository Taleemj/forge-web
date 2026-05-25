"use client";

import { BuildOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { ConstructionInterestModal } from "@/components/construction-interest-modal";
import { buildMediaItems, DetailPageLayout } from "@/components/detail-page-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

const fallbackImage =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop";

const fallbackProcess = `# Construction Process

1. Consultation and project scope
2. Site review, requirements, and budget alignment
3. Quote and milestone plan
4. Project setup under your Forge account
5. Construction tracking, updates, documents, and payments`;

const otherServices = [
  {
    key: "property-maintenance",
    href: "/property-maintenance",
    title: "Property Maintenance",
    subtitle: "Request care, repairs, and inspections for your property.",
    image: "/explore.jpg",
    tag: "Service",
  },
  {
    key: "land-listings",
    href: "/land-listings",
    title: "Land Listings",
    subtitle: "Browse verified land opportunities for your next build.",
    image: "/hero.jpg",
    tag: "Marketplace",
  },
  {
    key: "house-designs",
    href: "/house-designs",
    title: "House Designs",
    subtitle: "Explore house designs before starting construction.",
    image: "/explore.jpg",
    tag: "Designs",
  },
];

export default function ConstructionPage() {
  const { constructionService, fetchPublicData } = useForgeWeb();
  const [requestOpen, setRequestOpen] = useState(false);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  const service = constructionService || {
    id: "fallback-construction",
    title: "Construction Service",
    subtitle: "Build your home remotely with Forge.",
    description:
      "Forge helps clients structure construction requirements, confirm budgets, and set up transparent project tracking.",
    processMarkdown: fallbackProcess,
    consultationText:
      "Submit your interest and our admin team will reach out to confirm the details, quote, and meeting schedule.",
    startingPrice: undefined,
    status: "active" as const,
    images: [],
    media: [],
  };

  return (
    <AppShell>
      <section className="page-section">
        <DetailPageLayout
          media={buildMediaItems(service.images, service.media)}
          fallbackImage={fallbackImage}
          recommendationsTitle="Other Services"
          recommendations={otherServices}
          details={
            <Space direction="vertical" size={12}>
              <Text className="dashboard-kicker">Construction service</Text>
              <Title level={1}>{service.title}</Title>
              {service.subtitle ? <Text type="secondary">{service.subtitle}</Text> : null}
              <Text>{service.description}</Text>
              {service.startingPrice !== undefined ? (
                <Text strong>Starting from UGX {service.startingPrice.toLocaleString()}</Text>
              ) : null}
              <Button
                type="primary"
                icon={<BuildOutlined />}
                onClick={() => setRequestOpen(true)}
              >
                Request follow-up
              </Button>
            </Space>
          }
        />

        <section className="construction-process">
          <div className="section-head">
            <Space direction="vertical" size={4}>
              <Text className="dashboard-kicker">How it works</Text>
              <Title level={2}>Construction Process</Title>
            </Space>
          </div>
          <Card className="dashboard-card">
            <MarkdownContent content={service.processMarkdown || fallbackProcess} />
          </Card>
        </section>

        {service.consultationText ? (
          <Card className="dashboard-card construction-cta">
            <Space direction="vertical" size={12}>
              <Title level={3}>Ready to discuss your build?</Title>
              <Text>{service.consultationText}</Text>
              <Button type="primary" onClick={() => setRequestOpen(true)}>
                Submit construction interest
              </Button>
            </Space>
          </Card>
        ) : null}

        <ConstructionInterestModal
          open={requestOpen}
          onClose={() => setRequestOpen(false)}
        />
      </section>
    </AppShell>
  );
}
