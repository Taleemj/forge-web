"use client";

import {
  ApartmentOutlined,
  BuildOutlined,
  CompassOutlined,
  HomeOutlined,
  ProjectOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Empty,
  Flex,
  Progress,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { ListingCard } from "@/components/listing-card";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

const serviceCards = [
  {
    title: "Property Maintenance",
    description:
      "Request trusted service teams for recurring care, repairs, and inspections.",
    href: "/property-maintenance",
    icon: <ToolOutlined />,
    image: "/explore.jpg",
  },
  {
    title: "Construction",
    description:
      "Start and monitor a remote construction project with clear progress tracking.",
    href: "/projects",
    icon: <BuildOutlined />,
    image: "/projects.jpg",
  },
  {
    title: "Land",
    description:
      "Browse verified land listings and compare location, size, and pricing.",
    href: "/land-listings",
    icon: <CompassOutlined />,
    image: "/hero.jpg",
  },
  {
    title: "Designs",
    description:
      "Explore house designs and request guidance from Forge specialists.",
    href: "/house-designs",
    icon: <ApartmentOutlined />,
    image: "/explore.jpg",
  },
];

function ServiceCard({
  title,
  description,
  href,
  icon,
  image,
}: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  image: string;
}) {
  return (
    <Link href={href}>
      <Card
        hoverable
        className="service-card"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="service-card-overlay" />
        <div className="service-card-content">
          <span className="service-icon">{icon}</span>
          <Title level={4}>{title}</Title>
          <Text>{description}</Text>
        </div>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const {
    lands,
    designs,
    houses,
    services,
    projects,
    isAuthenticated,
    isInitialLoading,
    isRefreshing,
    errors,
    fetchPublicData,
    fetchProjects,
  } = useForgeWeb();

  useEffect(() => {
    fetchPublicData();
    fetchProjects();
  }, [fetchProjects, fetchPublicData]);

  const featuredListings = [
    ...lands.slice(0, 2).map((land) => ({
      key: `land-${land.id}`,
      href: `/lands/${land.id}`,
      title: land.title,
      subtitle: land.location,
      price: land.price,
      image: land.images?.[0],
      tag: "Land",
    })),
    ...houses.slice(0, 1).map((house) => ({
      key: `house-${house.id}`,
      href: `/houses/${house.id}`,
      title: house.title,
      subtitle: house.location,
      price: house.price,
      image: house.images?.[0],
      tag: "House",
    })),
    ...designs.slice(0, 1).map((design) => ({
      key: `design-${design.id}`,
      href: `/designs/${design.id}`,
      title: design.title,
      subtitle: design.description,
      price: design.price,
      image: design.images?.[0],
      tag: "Design",
    })),
  ].slice(0, 3);

  const featuredMaintenance = services.slice(0, 3).map((service) => ({
    key: `service-${service.id}`,
    href: `/services/${service.id}`,
    title: service.title,
    subtitle: service.description,
    price: service.price,
    image: service.images?.[0],
    tag: service.billingPeriod || "service",
  }));

  return (
    <AppShell>
      <section className="home-hero">
        <div className="home-hero-inner">
          <Space direction="vertical" size={22}>
            <Text className="dashboard-kicker">Remote housing development</Text>
            <Title level={1}>Build and manage your home from anywhere.</Title>
            <Text className="home-hero-copy">
              Forge connects land, house designs, construction tracking, and
              property care in one transparent housing platform.
            </Text>
            <Space className="home-hero-actions" wrap>
              <Button
                type="primary"
                size="large"
                href="/explore"
                icon={<CompassOutlined />}
              >
                Browse services
              </Button>
              <Button size="large" href="/sign-up">
                Create account
              </Button>
            </Space>
          </Space>
        </div>
      </section>

      <section className="page-section">
        {errors.publicData ? (
          <Alert
            showIcon
            type="warning"
            message="Some live service data could not be loaded"
            description={errors.publicData}
            style={{ marginBottom: 18 }}
          />
        ) : null}

        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Start here</Text>
            <Title level={2}>Our Services</Title>
          </Space>
          {/* <Text type="secondary">
            {isRefreshing && !isInitialLoading ? "Refreshing live data..." : "Publicly accessible"}
          </Text> */}
        </div>
        <div className="service-grid">
          {serviceCards.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Property care</Text>
            <Title level={2}>Featured Property Maintenance</Title>
          </Space>
          <Button href="/property-maintenance">View all</Button>
        </div>

        {featuredMaintenance.length ? (
          <div className="listing-grid">
            {featuredMaintenance.map(({ key, ...item }) => (
              <ListingCard key={key} {...item} />
            ))}
          </div>
        ) : (
          <Empty description="No maintenance services available yet" />
        )}
      </section>

      <section className="page-section">
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Marketplace</Text>
            <Title level={2}>Featured Opportunities</Title>
          </Space>
          <Button href="/explore">View all</Button>
        </div>

        {featuredListings.length ? (
          <div className="listing-grid">
            {featuredListings.map(({ key, ...item }) => (
              <ListingCard key={key} {...item} />
            ))}
          </div>
        ) : (
          <Empty description="No public listings available yet" />
        )}
      </section>

      <section className="page-section">
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Your workspace</Text>
            <Title level={2}>Ongoing Projects</Title>
          </Space>
          {isAuthenticated ? <Button href="/projects">View all</Button> : null}
        </div>

        {isAuthenticated ? (
          projects.length ? (
            <div className="project-grid">
              {projects.slice(0, 4).map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <Card hoverable className="project-card">
                    <Flex align="center" justify="space-between">
                      <span className="service-icon">
                        {project.type === "management" ? (
                          <HomeOutlined />
                        ) : (
                          <ProjectOutlined />
                        )}
                      </span>
                      <Text type="secondary">
                        {project.status.replaceAll("_", " ")}
                      </Text>
                    </Flex>
                    <Title level={4}>{project.title}</Title>
                    <Text type="secondary">{project.stage}</Text>
                    <Progress percent={project.progress} />
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Empty description="No projects linked to this account yet" />
          )
        ) : (
          <Card className="dashboard-card">
            <Flex align="center" justify="space-between" gap={20} wrap="wrap">
              <Space direction="vertical">
                <Title level={4}>Track projects after login</Title>
                <Text type="secondary">
                  Sign in to see your construction progress, documents, payment
                  history, and maintenance requests.
                </Text>
              </Space>
              <Space>
                <Button href="/login">Login</Button>
                <Button type="primary" href="/sign-up">
                  Sign up
                </Button>
              </Space>
            </Flex>
          </Card>
        )}
      </section>
    </AppShell>
  );
}
