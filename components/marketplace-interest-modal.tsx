"use client";

import { Button, Form, Input, Modal, Space, Typography } from "antd";
import { useState } from "react";

import { useForgeWeb } from "@/context/forge-web-context";
import type { House, Land } from "@/types";

const { Text } = Typography;

type InterestValues = {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export function MarketplaceInterestModal({
  item,
  type,
  open,
  onClose,
}: {
  item: Land | House;
  type: "land" | "house";
  open: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, requestMarketplaceInquiry } = useForgeWeb();
  const [form] = Form.useForm<InterestValues>();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: InterestValues) => {
    setErrorMessage(null);
    setResultMessage(null);

    setLoading(true);
    const result = await requestMarketplaceInquiry({
      itemType: type,
      landId: type === "land" ? item.id : undefined,
      houseId: type === "house" ? item.id : undefined,
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
      setResultMessage(result.message || "Interest submitted");
      form.resetFields();
      return;
    }

    setErrorMessage(result.message || "Unable to submit interest");
  };

  return (
    <Modal
      title={`Interested in ${item.title}?`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <Space direction="vertical" size={10} className="full-width">
        <Text type="secondary">
          {type === "land"
            ? "Want to visit the site or know more about this land? Share your details and Forge will get back to you."
            : "Interested in this house? Request a viewing or ask for more details below."}
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

          <Form.Item label="How can we help?" name="notes">
            <Input.TextArea
              rows={4}
              placeholder="e.g. I want to visit the site next week, or please send more documents."
            />
          </Form.Item>

          {errorMessage ? <Text type="danger">{errorMessage}</Text> : null}
          {resultMessage ? <Text type="success">{resultMessage}</Text> : null}

          <Space className="request-modal-actions">
            <Button onClick={onClose}>Close</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit interest
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
}
