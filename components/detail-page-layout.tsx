"use client";

import { Card, Empty, Space, Typography } from "antd";
import { useMemo, useState, type ReactNode } from "react";

import { ListingCard } from "@/components/listing-card";
import { resolveAssetUrl } from "@/lib/api";

const { Text, Title } = Typography;

type DetailMediaItem = {
  id?: string;
  type?: "image" | "video";
  url?: string;
  thumbnail?: string;
  title?: string;
};

type RecommendationItem = {
  key: string;
  href: string;
  title: string;
  subtitle?: string;
  price?: number;
  image?: string;
  tag?: string;
};

function isVideo(item: DetailMediaItem) {
  return item.type === "video" || /\.(mp4|webm|mov|m4v)$/i.test(item.url || "");
}

export function buildMediaItems(images?: string[], media?: DetailMediaItem[]) {
  const imageItems =
    images?.map((url, index) => ({
      id: `image-${index}`,
      type: "image" as const,
      url,
      thumbnail: url,
    })) || [];

  return [...imageItems, ...(media || [])].filter((item) => Boolean(item.url));
}

export function DetailPageLayout({
  media,
  fallbackImage,
  details,
  recommendationsTitle,
  recommendations,
}: {
  media: DetailMediaItem[];
  fallbackImage: string;
  details: ReactNode;
  recommendationsTitle: string;
  recommendations: RecommendationItem[];
}) {
  const normalizedMedia = useMemo(
    () => (media.length ? media : [{ id: "fallback", type: "image" as const, url: fallbackImage }]),
    [fallbackImage, media],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = normalizedMedia[activeIndex] || normalizedMedia[0];
  const activeUrl = resolveAssetUrl(activeMedia.url) || fallbackImage;
  const activePoster =
    resolveAssetUrl(activeMedia.thumbnail) ||
    (isVideo(activeMedia) ? undefined : activeUrl);

  return (
    <Space direction="vertical" size={28} className="full-width">
      <div className="detail-layout">
        <Card className="detail-media-card">
          <div className="detail-media-stage">
            {isVideo(activeMedia) ? (
              <video controls playsInline poster={activePoster} src={activeUrl} />
            ) : (
              <img src={activeUrl} alt={activeMedia.title || "Property media"} />
            )}
          </div>

          {normalizedMedia.length > 1 ? (
            <div className="detail-media-strip" aria-label="Media gallery">
              {normalizedMedia.map((item, index) => {
                const thumb =
                  resolveAssetUrl(item.thumbnail || item.url) ||
                  fallbackImage;
                return (
                  <button
                    key={item.id || `${item.url}-${index}`}
                    type="button"
                    className={index === activeIndex ? "is-active" : ""}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show media ${index + 1}`}
                  >
                    {isVideo(item) ? (
                      <span className="detail-video-thumb">Video</span>
                    ) : (
                      <img src={thumb} alt="" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : null}
        </Card>

        <Card className="dashboard-card detail-info-card">{details}</Card>
      </div>

      <section>
        <div className="section-head">
          <Space direction="vertical" size={4}>
            <Text className="dashboard-kicker">Recommended</Text>
            <Title level={2}>{recommendationsTitle}</Title>
          </Space>
        </div>
        {recommendations.length ? (
          <div className="listing-grid">
            {recommendations.map((item) => (
              <ListingCard key={item.key} {...item} />
            ))}
          </div>
        ) : (
          <Empty description="No similar items available yet" />
        )}
      </section>
    </Space>
  );
}
