"use client";

import { Button, Card, Empty, Progress, Space, Typography } from "antd";
import Link from "next/link";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { ProjectSkeletonGrid } from "@/components/listing-skeleton";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

export default function ProjectsPage() {
  const { isAuthenticated, projects, isInitialLoading, isRefreshing, fetchProjects } = useForgeWeb();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <AppShell>
      <section className="page-section">
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Project tracking</Text>
            <Title level={1}>Projects</Title>
            <Text type="secondary">Track active construction, design, and management work.</Text>
          </Space>
          <Button type="primary" href="/explore">
            Start from marketplace
          </Button>
        </div>

        {!isAuthenticated ? <AuthRequired description="Login to view your project pipeline." /> : null}

        {isAuthenticated ? (
          isInitialLoading || (isRefreshing && !projects.length) ? (
            <ProjectSkeletonGrid count={6} />
          ) : projects.length ? (
            <div className="project-grid">
              {projects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <Card hoverable className="project-card">
                    <Text className="dashboard-kicker">{project.type}</Text>
                    <Title level={4}>{project.title}</Title>
                    <Text type="secondary">{project.stage}</Text>
                    <Progress percent={project.progress} />
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Empty description="No projects yet" />
          )
        ) : null}
      </section>
    </AppShell>
  );
}
