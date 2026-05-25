"use client";

import { MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AuthShell } from "@/components/auth-shell";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOTP, resendOTP } = useForgeWeb();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const email = searchParams.get("email") || "";

  const handleSubmit = async (values: { email: string; otp: string }) => {
    setLoading(true);
    setMessage(null);
    const result = await verifyOTP(values.email, values.otp);
    setLoading(false);

    if (result.success) {
      router.push("/");
      return;
    }

    setMessage(result.message || "Unable to verify code");
  };

  const handleResend = async () => {
    if (!email) return;
    const result = await resendOTP(email);
    setMessage(result.message || "Verification code resent");
  };

  return (
    <>
      <Space direction="vertical" size={6} className="full-width auth-card-head">
        <Text className="dashboard-kicker">Email verification</Text>
        <Title level={2}>Enter OTP</Title>
      </Space>

      {message ? <Alert showIcon type="info" message={message} /> : null}

      <Form
        layout="vertical"
        requiredMark={false}
        initialValues={{ email }}
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

        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
          Verify account
        </Button>
      </Form>

      <Space>
        <Button type="link" onClick={handleResend} disabled={!email}>
          Resend code
        </Button>
        <Link href="/login">Back to login</Link>
      </Space>
    </>
  );
}

export default function VerifyOtpPage() {
  return (
    <AuthShell eyebrow="Verify account" title="Confirm your email">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </AuthShell>
  );
}
