"use client";

import { Button, Form, Input, Modal, Space, Typography } from "antd";
import { useState } from "react";

import { useForgeWeb } from "@/context/forge-web-context";
import type { Design } from "@/types";

const { Text } = Typography;

type RequestValues = {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export function DesignRequestModal({
  design,
  open,
  onClose,
}: {
  design: Design;
  open: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, requestDesign } = useForgeWeb();
  const [form] = Form.useForm<RequestValues>();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: RequestValues) => {
    setErrorMessage(null);
    setResultMessage(null);

    setLoading(true);
    const result = await requestDesign({
      designId: design.id,
      notes: values.notes,
      guestInfo: isAuthenticated
        ? undefined
        : {
            name: values.name || "",
            email: values.email || "",
            phone: values.phone || "",
          },
    });
    setLoading(false);

    if (result.success) {
      setResultMessage(result.message || "Request submitted");
      form.resetFields();
      return;
    }

    setErrorMessage(result.message || "Unable to submit request");
  };

  return (
    <Modal
      title={`Request Design: ${design.title}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <Space direction="vertical" size={10} className="full-width">
        <Text type="secondary">
          Interested in this design? Share your details and a Forge specialist will
          get in touch to discuss customization, site fit, and next steps.
        </Text>

        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          {!isAuthenticated ? (
            <div className="guest-field-grid">
              <Form.Item label="Full name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone (WhatsApp preferred)"
                name="phone"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. +256 700 000 000" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }, { type: "email" }]}
              >
                <Input />
              </Form.Item>
            </div>
          ) : null}

          <Form.Item label="Notes (optional)" name="notes">
            <Input.TextArea
              rows={4}
              placeholder="Tell us more about your plot location or any specific requirements."
            />
          </Form.Item>

          {errorMessage ? <Text type="danger">{errorMessage}</Text> : null}
          {resultMessage ? <Text type="success">{resultMessage}</Text> : null}

          <Space className="request-modal-actions">
            <Button onClick={onClose}>Close</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Send request
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
}
