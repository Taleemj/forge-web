"use client";

import { Card, Empty, Progress, Space, Statistic, Typography } from "antd";
import { useMemo } from "react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

export default function PaymentsPage() {
  const { isAuthenticated, projects } = useForgeWeb();
  const totals = useMemo(() => {
    const budget = projects.reduce((sum, project) => sum + Number(project.budget?.total || 0), 0);
    const paid = projects.reduce((sum, project) => sum + Number(project.budget?.paid || 0), 0);
    return { budget, paid, rate: budget ? Math.round((paid / budget) * 100) : 0 };
  }, [projects]);

  return (
    <AppShell>
      <section className="page-section">
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Financial tracking</Text>
            <Title level={1}>Payments</Title>
            <Text type="secondary">Review project budgets and paid balances.</Text>
          </Space>
        </div>

        {!isAuthenticated ? <AuthRequired description="Login to see payment records." /> : null}

        {isAuthenticated ? (
          projects.length ? (
            <Space direction="vertical" size={16} className="full-width">
              <Card className="dashboard-card">
                <Space direction="vertical" size={14} className="full-width">
                  <Statistic title="Total project budget" value={totals.budget} prefix="UGX" />
                  <Statistic title="Paid to date" value={totals.paid} prefix="UGX" />
                  <Progress percent={totals.rate} />
                </Space>
              </Card>
              {projects.map((project) => (
                <Card key={project.id} className="dashboard-card">
                  <Title level={4}>{project.title}</Title>
                  <Text type="secondary">
                    UGX {Number(project.budget?.paid || 0).toLocaleString()} paid of UGX{" "}
                    {Number(project.budget?.total || 0).toLocaleString()}
                  </Text>
                  <Progress
                    percent={
                      project.budget?.total
                        ? Math.round((Number(project.budget.paid) / Number(project.budget.total)) * 100)
                        : 0
                    }
                  />
                </Card>
              ))}
            </Space>
          ) : (
            <Empty description="No payment records yet" />
          )
        ) : null}
      </section>
    </AppShell>
  );
}
