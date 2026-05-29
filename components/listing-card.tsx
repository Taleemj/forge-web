"use client";

import { EnvironmentOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Tag, Typography } from "antd";
import Link from "next/link";
import type { ReactNode } from "react";

import { resolveAssetUrl } from "@/lib/api";

const { Text, Title } = Typography;

type ListingCardProps = {
  href: string;
  title: string;
  subtitle?: string;
  price?: number;
  image?: string;
  tag?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
];

export function ListingCard({
  href,
  title,
  subtitle,
  price,
  image,
  tag,
  actionLabel,
  onAction,
}: ListingCardProps) {
  const imageUrl =
    resolveAssetUrl(image) ||
    fallbackImages[Math.abs(title.length) % fallbackImages.length];

  return (
    <Link href={href} className="listing-card-link">
      <Card
        hoverable
        className="listing-card"
        cover={
          <div
            className="listing-card-media"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        }
      >
        <Flex align="center" justify="space-between" gap={12}>
          <Title level={5}>{title}</Title>
          {tag ? <Tag color="processing">{tag}</Tag> : null}
        </Flex>
        {subtitle ? (
          <Text type="secondary" className="listing-card-subtitle">
            <EnvironmentOutlined /> {subtitle}
          </Text>
        ) : null}
        <Flex align="center" justify="space-between" style={{ marginTop: 8 }}>
          {price !== undefined ? (
            <Text strong className="listing-card-price">
              UGX {Number(price).toLocaleString()}
            </Text>
          ) : (
            <div />
          )}
          {actionLabel && onAction ? (
            <Button
              size="small"
              type="primary"
              ghost
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onAction();
              }}
            >
              {actionLabel}
            </Button>
          ) : null}
        </Flex>
      </Card>
    </Link>
  );
}
