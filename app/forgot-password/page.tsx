"use client";

import { MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth-shell";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useForgeWeb();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    setError(null);
    const result = await forgotPassword(values.email);
    setLoading(false);

    if (result.success) {
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
      return;
    }

    setError(result.message || "Unable to send reset code");
  };

  return (
    <AuthShell eyebrow="Account recovery" title="Reset your password">
      <Space direction="vertical" size={6} className="full-width auth-card-head">
        <Text className="dashboard-kicker">Forgot password</Text>
        <Title level={2}>Send reset code</Title>
      </Space>

      {error ? <Alert type="error" showIcon message={error} /> : null}

      <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item
          label="Email address"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input size="large" prefix={<MailOutlined />} />
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
          Send OTP
        </Button>
      </Form>

      <Link href="/login">Back to login</Link>
    </AuthShell>
  );
}
