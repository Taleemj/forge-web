"use client";

import { Card, Skeleton } from "antd";

export function ListingSkeleton() {
  return (
    <Card
      className="listing-card"
      cover={<Skeleton.Button active style={{ width: "100%", height: 180 }} />}
    >
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>
  );
}

export function ProjectSkeleton() {
  return (
    <Card className="project-card">
      <Skeleton active paragraph={{ rows: 2 }} />
      <Skeleton.Button active style={{ width: "100%", marginTop: 8 }} />
    </Card>
  );
}

export function ProjectSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="project-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListingSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="listing-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ListingSkeleton key={i} />
      ))}
    </div>
  );
}
