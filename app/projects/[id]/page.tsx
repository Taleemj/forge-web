"use client";

import { Card, Empty, Progress, Space, Statistic, Typography } from "antd";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { isAuthenticated, projects, fetchProjects } = useForgeWeb();
  const project = projects.find((item) => item.id === params.id);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <AppShell>
      <section className="page-section">
        {!isAuthenticated ? <AuthRequired description="Login to view this project." /> : null}
        {isAuthenticated && project ? (
          <Space direction="vertical" size={16} className="full-width">
            <Card className="dashboard-card">
              <Space direction="vertical" size={12} className="full-width">
                <Text className="dashboard-kicker">{project.type}</Text>
                <Title level={1}>{project.title}</Title>
                <Text type="secondary">{project.stage}</Text>
                <Progress percent={project.progress} />
              </Space>
            </Card>
            <Card className="dashboard-card" title="Budget">
              <Space size={24} wrap>
                <Statistic title="Total" value={project.budget?.total || 0} prefix="UGX" />
                <Statistic title="Paid" value={project.budget?.paid || 0} prefix="UGX" />
              </Space>
            </Card>
          </Space>
        ) : null}
        {isAuthenticated && !project ? <Empty description="Project not found" /> : null}
      </section>
    </AppShell>
  );
}
