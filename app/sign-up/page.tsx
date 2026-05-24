"use client";

import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth-shell";
import { useForgeWeb } from "@/context/forge-web-context";
import type { SignUpPayload } from "@/types";

const { Text, Title } = Typography;

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useForgeWeb();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: SignUpPayload) => {
    setLoading(true);
    setError(null);
    const result = await signUp(values);
    setLoading(false);

    if (result.success && result.email) {
      router.push(`/verify-otp?email=${encodeURIComponent(result.email)}`);
      return;
    }

    setError(result.message || "Unable to create account");
  };

  return (
    <AuthShell eyebrow="Create account" title="Start your home journey">
      <Space direction="vertical" size={6} className="full-width auth-card-head">
        <Text className="dashboard-kicker">Forge account</Text>
        <Title level={2}>Sign up</Title>
      </Space>

      {error ? <Alert type="error" showIcon message={error} /> : null}

      <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item label="Full name" name="name" rules={[{ required: true }]}>
          <Input size="large" prefix={<UserOutlined />} autoComplete="name" />
        </Form.Item>
        <Form.Item
          label="Email address"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input size="large" prefix={<MailOutlined />} autoComplete="email" />
        </Form.Item>
        <Form.Item label="Phone number" name="phone">
          <Input size="large" prefix={<PhoneOutlined />} autoComplete="tel" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }, { min: 6, message: "Use at least 6 characters." }]}
        >
          <Input.Password size="large" prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
          Create account
        </Button>
      </Form>

      <Text type="secondary">
        Already have an account? <Link href="/login">Login</Link>
      </Text>
    </AuthShell>
  );
}
