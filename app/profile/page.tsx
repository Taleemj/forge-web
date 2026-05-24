"use client";

import { Avatar, Card, List, Space, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

export default function ProfilePage() {
  const { isAuthenticated, user, notifications } = useForgeWeb();

  return (
    <AppShell>
      <section className="page-section">
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Account</Text>
            <Title level={1}>Profile</Title>
            <Text type="secondary">Manage your Forge account and recent updates.</Text>
          </Space>
        </div>

        {!isAuthenticated ? <AuthRequired description="Login to view your profile." /> : null}

        {isAuthenticated ? (
          <Space direction="vertical" size={16} className="full-width">
            <Card className="dashboard-card">
              <Space align="center" size={16}>
                <Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
                <Space direction="vertical" size={0}>
                  <Title level={3}>{user?.name}</Title>
                  <Text type="secondary">{user?.email}</Text>
                  {user?.phone ? <Text type="secondary">{user.phone}</Text> : null}
                </Space>
              </Space>
            </Card>
            <Card id="notifications" title="Notifications" className="dashboard-card">
              <List
                dataSource={notifications}
                locale={{ emptyText: "No notifications yet" }}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.title}</Text>
                          <Tag color={item.isRead ? "default" : "processing"}>{item.type}</Tag>
                        </Space>
                      }
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        ) : null}
      </section>
    </AppShell>
  );
}
