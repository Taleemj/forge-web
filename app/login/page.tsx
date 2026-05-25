"use client";

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AuthShell } from "@/components/auth-shell";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text, Title } = Typography;

type LoginValues = {
  email: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useForgeWeb();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    const result = await signIn(values);
    setLoading(false);

    if (result.success) {
      router.push(searchParams.get("next") || "/");
      return;
    }

    if (result.email) {
      router.push(`/verify-otp?email=${encodeURIComponent(result.email)}`);
      return;
    }

    setError(result.message || "Unable to sign in");
  };

  return (
    <>
      <Space direction="vertical" size={6} className="full-width auth-card-head">
        <Text className="dashboard-kicker">Forge account</Text>
        <Title level={2}>Login</Title>
      </Space>

      {error ? <Alert type="error" showIcon message={error} /> : null}

      <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item
          label="Email address"
          name="email"
          rules={[
            { required: true, message: "Enter your email." },
            { type: "email", message: "Enter a valid email address." },
          ]}
        >
          <Input size="large" prefix={<MailOutlined />} autoComplete="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Enter your password." }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            autoComplete="current-password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <div className="auth-form-meta">
          <Link href="/forgot-password">Forgot password?</Link>
        </div>

        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
          Sign In
        </Button>
      </Form>

      <Text type="secondary">
        New to Forge? <Link href="/sign-up">Create an account</Link>
      </Text>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell eyebrow="Client access" title="Welcome back">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
