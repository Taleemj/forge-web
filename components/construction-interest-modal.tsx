"use client";

import { Button, Form, Input, Modal, Select, Space, Typography } from "antd";
import { useState } from "react";

import { GoogleMapPicker } from "@/components/google-map-picker";
import { useForgeWeb } from "@/context/forge-web-context";

const { Text } = Typography;

type LocationValue = {
  label?: string;
  latitude?: number;
  longitude?: number;
};

type InterestValues = {
  name?: string;
  email?: string;
  phone?: string;
  budgetRange?: string;
  timeline?: string;
  meetingPreference?: string;
  notes?: string;
};

export function ConstructionInterestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, requestConstructionService } = useForgeWeb();
  const [form] = Form.useForm<InterestValues>();
  const [location, setLocation] = useState<LocationValue>({});
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: InterestValues) => {
    setErrorMessage(null);
    setResultMessage(null);

    if (!location.label?.trim()) {
      setErrorMessage("Enter the project location or address.");
      return;
    }

    setLoading(true);
    const result = await requestConstructionService({
      location,
      budgetRange: values.budgetRange,
      timeline: values.timeline,
      meetingPreference: values.meetingPreference,
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
      setResultMessage(result.message || "Construction interest submitted");
      form.resetFields();
      setLocation({});
      return;
    }

    setErrorMessage(result.message || "Unable to submit request");
  };

  return (
    <Modal
      title="Request construction follow-up"
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      centered={false}
      style={{ top: 28 }}
      destroyOnClose
    >
      <Space direction="vertical" size={6} className="full-width construction-interest-form">
        <Text type="secondary">
          Share the location, budget, and timing. Forge admin will follow up to
          confirm the requirements, quote, and next steps.
        </Text>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          className="compact-request-form"
        >
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

          <Form.Item label="Project location" required>
            <GoogleMapPicker value={location} onChange={setLocation} />
          </Form.Item>

          <div className="guest-field-grid">
            <Form.Item label="Budget range" name="budgetRange">
              <Select
                options={[
                  { label: "Below UGX 100M", value: "below_100m" },
                  { label: "UGX 100M - 300M", value: "100m_300m" },
                  { label: "UGX 300M - 700M", value: "300m_700m" },
                  { label: "Above UGX 700M", value: "above_700m" },
                  { label: "Not sure yet", value: "not_sure" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Timeline" name="timeline">
              <Select
                options={[
                  { label: "Immediately", value: "immediately" },
                  { label: "1 - 3 months", value: "1_3_months" },
                  { label: "3 - 6 months", value: "3_6_months" },
                  { label: "Later", value: "later" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Preferred follow-up" name="meetingPreference">
              <Select
                options={[
                  { label: "Phone call", value: "phone" },
                  { label: "Video meeting", value: "video" },
                  { label: "In-person meeting", value: "in_person" },
                  { label: "Email", value: "email" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item label="Project notes" name="notes">
            <Input.TextArea
              rows={4}
              placeholder="Describe the land status, desired house type, number of rooms, approvals, or any known constraints."
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
