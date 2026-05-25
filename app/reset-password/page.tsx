"use client";

import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AuthShell } from "@/components/auth-shell";
import { useForgeWeb } from "@/context/forge-web-context";
import type { ResetPasswordPayload } from "@/types";

const { Text, Title } = Typography;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useForgeWeb();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (values: ResetPasswordPayload) => {
    setLoading(true);
    setMessage(null);
    const result = await resetPassword(values);
    setLoading(false);

    if (result.success) {
      router.push("/login");
      return;
    }

    setMessage(result.message || "Unable to reset password");
  };

  return (
    <>
      <Space direction="vertical" size={6} className="full-width auth-card-head">
        <Text className="dashboard-kicker">Reset password</Text>
        <Title level={2}>Enter OTP</Title>
      </Space>

      {message ? <Alert type="info" showIcon message={message} /> : null}

      <Form
        layout="vertical"
        requiredMark={false}
        initialValues={{ email: searchParams.get("email") || "" }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Email address"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input size="large" prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item label="OTP code" name="otp" rules={[{ required: true }]}>
          <Input size="large" prefix={<SafetyCertificateOutlined />} maxLength={6} />
        </Form.Item>
        <Form.Item
          label="New password"
          name="newPassword"
          rules={[{ required: true }, { min: 6, message: "Use at least 6 characters." }]}
        >
          <Input.Password size="large" prefix={<LockOutlined />} />
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
          Reset password
        </Button>
      </Form>

      <Link href="/login">Back to login</Link>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell eyebrow="Account recovery" title="Choose a new password">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
