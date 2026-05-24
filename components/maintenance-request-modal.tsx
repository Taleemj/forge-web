"use client";

import { Button, Form, Input, Modal, Space, Typography } from "antd";
import { useState } from "react";

import { GoogleMapPicker } from "@/components/google-map-picker";
import { useForgeWeb } from "@/context/forge-web-context";
import type { ManagementService } from "@/types";

const { Text } = Typography;

type LocationValue = {
  label?: string;
  latitude?: number;
  longitude?: number;
};

type RequestValues = {
  name?: string;
  email?: string;
  phone?: string;
  propertyNotes?: string;
};

export function MaintenanceRequestModal({
  service,
  open,
  onClose,
}: {
  service: ManagementService;
  open: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, requestMaintenanceService } = useForgeWeb();
  const [form] = Form.useForm<RequestValues>();
  const [location, setLocation] = useState<LocationValue>({});
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: RequestValues) => {
    setErrorMessage(null);
    setResultMessage(null);

    if (!location.label?.trim()) {
      setErrorMessage("Enter the property address or location label.");
      return;
    }

    if (location.latitude === undefined || location.longitude === undefined) {
      setErrorMessage("Pin the property location on the map or enter coordinates.");
      return;
    }

    setLoading(true);
    const result = await requestMaintenanceService({
      serviceId: service.id,
      location,
      propertyNotes: values.propertyNotes,
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
      setLocation({});
      return;
    }

    setErrorMessage(result.message || "Unable to submit request");
  };

  return (
    <Modal
      title={`Request ${service.title}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      centered={false}
      style={{ top: 28 }}
      destroyOnClose
    >
      <Space direction="vertical" size={10} className="full-width">
        <Text type="secondary">
          Pin your property location and share enough detail for Forge to prepare a quote.
        </Text>

        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          {!isAuthenticated ? (
            <div className="guest-field-grid">
              <Form.Item label="Full name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
                <Input />
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

          <Form.Item label="Property location" required>
            <GoogleMapPicker value={location} onChange={setLocation} />
          </Form.Item>

          <Form.Item label="Property notes" name="propertyNotes">
            <Input.TextArea
              rows={4}
              placeholder="Describe the property condition, access details, urgency, or service expectations."
            />
          </Form.Item>

          {errorMessage ? <Text type="danger">{errorMessage}</Text> : null}
          {resultMessage ? <Text type="success">{resultMessage}</Text> : null}

          <Space className="request-modal-actions">
            <Button onClick={onClose}>Close</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit request
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
}
