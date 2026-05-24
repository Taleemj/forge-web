"use client";

import { LockOutlined } from "@ant-design/icons";
import { Button, Empty, Space, Typography } from "antd";

import { useForgeWeb } from "@/context/forge-web-context";

const { Text } = Typography;

export function AuthRequired({
  title = "Login required",
  description = "Sign in to see your Forge account information.",
}: {
  title?: string;
  description?: string;
}) {
  const { isAuthenticated } = useForgeWeb();

  if (isAuthenticated) return null;

  return (
    <div className="auth-required">
      <Empty
        image={<LockOutlined className="auth-required-icon" />}
        description={
          <Space direction="vertical" size={4}>
            <Text strong>{title}</Text>
            <Text type="secondary">{description}</Text>
          </Space>
        }
      >
        <Button type="primary" href="/login">
          Login
        </Button>
      </Empty>
    </div>
  );
}
