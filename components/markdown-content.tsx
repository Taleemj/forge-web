"use client";

import { Typography } from "antd";
import Link from "next/link";
import type { ReactNode } from "react";

const { Paragraph, Title } = Typography;

type InlineSegment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; value: string; href: string };

function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const pattern = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }

    if (match[2]) {
      segments.push({ type: "bold", value: match[2] });
    } else if (match[4] && match[5]) {
      segments.push({ type: "link", value: match[4], href: match[5] });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

function InlineMarkdown({ text }: { text: string }) {
  return parseInline(text).map((segment, index) => {
    if (segment.type === "bold") {
      return <strong key={`${segment.value}-${index}`}>{segment.value}</strong>;
    }

    if (segment.type === "link") {
      return (
        <Link key={`${segment.href}-${index}`} href={segment.href}>
          {segment.value}
        </Link>
      );
    }

    return <span key={`${segment.value}-${index}`}>{segment.value}</span>;
  });
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let bullets: string[] = [];
  let ordered: string[] = [];

  const flushBullets = () => {
    if (!bullets.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`}>
        {bullets.map((item, index) => (
          <li key={`${item}-${index}`}>
            <InlineMarkdown text={item} />
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  const flushOrdered = () => {
    if (!ordered.length) return;
    nodes.push(
      <ol key={`ol-${nodes.length}`}>
        {ordered.map((item, index) => (
          <li key={`${item}-${index}`}>
            <InlineMarkdown text={item} />
          </li>
        ))}
      </ol>,
    );
    ordered = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushBullets();
      flushOrdered();
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushOrdered();
      bullets.push(trimmed.slice(2));
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushBullets();
      ordered.push(trimmed.replace(/^\d+\.\s/, ""));
      return;
    }

    flushBullets();
    flushOrdered();

    if (trimmed.startsWith("### ")) {
      nodes.push(
        <Title level={4} key={index}>
          <InlineMarkdown text={trimmed.slice(4)} />
        </Title>,
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      nodes.push(
        <Title level={3} key={index}>
          <InlineMarkdown text={trimmed.slice(3)} />
        </Title>,
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      nodes.push(
        <Title level={2} key={index}>
          <InlineMarkdown text={trimmed.slice(2)} />
        </Title>,
      );
      return;
    }

    nodes.push(
      <Paragraph key={index}>
        <InlineMarkdown text={trimmed} />
      </Paragraph>,
    );
  });

  flushBullets();
  flushOrdered();

  return <div className="web-markdown-content">{nodes}</div>;
}
