"use client";

import {
  BellOutlined,
  BuildOutlined,
  CreditCardOutlined,
  CompassOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  ProjectOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Flex,
  Layout,
  Menu,
  Space,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

import { useForgeWeb } from "@/context/forge-web-context";

const { Content, Header } = Layout;
const { Text, Title } = Typography;

const primaryLinks = [
  { href: "/", label: "Home", icon: <HomeOutlined /> },
  { href: "/#services", label: "Services", icon: <BuildOutlined /> },
  {
    href: "/property-maintenance",
    label: "Property Maintenance",
    icon: <ToolOutlined />,
  },
  { href: "/explore", label: "Explore", icon: <CompassOutlined /> },
  { href: "/projects", label: "Projects", icon: <ProjectOutlined /> },
  { href: "/profile", label: "Profile", icon: <UserOutlined /> },
];

const secondaryLinks = [
  { href: "/payments", label: "Payments", icon: <CreditCardOutlined /> },
  {
    href: "/profile#notifications",
    label: "Notifications",
    icon: <BellOutlined />,
  },
  { href: "/privacy-policy", label: "Privacy Policy", icon: <HomeOutlined /> },
  { href: "/terms", label: "Terms", icon: <HomeOutlined /> },
  { href: "/support", label: "Support", icon: <ToolOutlined /> },
];

function selectedKey(pathname: string) {
  if (typeof window !== "undefined" && window.location.hash === "#services") {
    return "/#services";
  }

  const match = [...primaryLinks, ...secondaryLinks]
    .map((item) => item.href)
    .filter((href) => href !== "/")
    .filter((href) => !href.startsWith("/#"))
    .sort((a, b) => b.length - a.length)
    .find((href) => pathname.startsWith(href.split("#")[0]));

  return match || "/";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, notifications, signOut } = useForgeWeb();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const menuItems = useMemo<MenuProps["items"]>(
    () =>
      primaryLinks.map((item) => ({
        key: item.href,
        icon: item.icon,
        label: <Link href={item.href}>{item.label}</Link>,
      })),
    [],
  );

  const drawerItems = useMemo<MenuProps["items"]>(
    () => [
      ...primaryLinks.map((item) => ({
        key: item.href,
        icon: item.icon,
        label: <Link href={item.href}>{item.label}</Link>,
      })),
      { type: "divider" as const },
      ...secondaryLinks.map((item) => ({
        key: item.href,
        icon: item.icon,
        label: <Link href={item.href}>{item.label}</Link>,
      })),
    ],
    [],
  );

  return (
    <Layout className="web-shell">
      <Header className="web-topbar">
        <Link href="/" className="web-brand">
          <span className="web-brand-mark">
            <Image src="/app-logo.png" alt="" width={28} height={28} />
          </span>
          <span>
            <Text className="web-brand-kicker">Forge Housing</Text>
            <Title level={5}>For All</Title>
          </span>
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey(pathname)]}
          items={menuItems}
          className="web-desktop-menu"
        />

        <Flex align="center" gap={12} className="web-topbar-actions">
          <Button
            type="text"
            icon={<MenuOutlined />}
            aria-label="Open menu"
            className="web-menu-button"
            onClick={() => setDrawerOpen(true)}
          />
          {isAuthenticated ? (
            <Link href="/profile" className="web-account-link">
              <Badge count={unreadCount} size="small">
                <Avatar src={user?.avatar} icon={<UserOutlined />} />
              </Badge>
              <span>{user?.name || "Account"}</span>
            </Link>
          ) : (
            <Space>
              <Button href="/login" icon={<LoginOutlined />}>
                Login
              </Button>
              <Button type="primary" href="/sign-up">
                Sign up
              </Button>
            </Space>
          )}
        </Flex>
      </Header>

      <Content className="web-content">{children}</Content>

      <footer className="web-footer">
        <div className="web-footer-inner">
          <div className="web-footer-brand">
            <Link href="/" className="web-brand">
              <span className="web-brand-mark">
                <Image src="/app-logo.png" alt="" width={28} height={28} />
              </span>
              <span>
                <Text className="web-brand-kicker">Forge Housing</Text>
                <Title level={5}>For All</Title>
              </span>
            </Link>
            <Text className="web-footer-copy">
              Forge helps clients discover land, compare house designs, track
              construction, and manage property care from one transparent
              platform.
            </Text>
          </div>

          <div className="web-footer-links">
            <div>
              <Text className="web-footer-heading">Company</Text>
              <Link href="/">Home</Link>
              <Link href="/explore">Explore</Link>
              <Link href="/support">Support</Link>
            </div>
            <div>
              <Text className="web-footer-heading">Services</Text>
              <Link href="/construction">Construction</Link>
              <Link href="/property-maintenance">Property Maintenance</Link>
              <Link href="/land-listings">Land Listings</Link>
              <Link href="/house-listings">House Listings</Link>
              <Link href="/house-designs">House Designs</Link>
            </div>
            <div>
              <Text className="web-footer-heading">Account</Text>
              <Link href="/login">Login</Link>
              <Link href="/sign-up">Create Account</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/payments">Payments</Link>
            </div>
            <div>
              <Text className="web-footer-heading">Legal</Text>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="web-footer-bottom">
          <Text type="secondary">
            © {new Date().getFullYear()} Forge Housing. All rights reserved.
          </Text>
          <Text type="secondary">
            Housing, construction, and property care for remote clients.
          </Text>
        </div>
      </footer>

      <nav className="mobile-tabs" aria-label="Primary">
        {primaryLinks.map((item) => {
          const active = selectedKey(pathname) === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "is-active" : ""}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Drawer
        title="Forge Housing"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey(pathname)]}
          items={drawerItems}
          onClick={() => setDrawerOpen(false)}
        />
        <div className="drawer-account">
          {isAuthenticated ? (
            <Button
              danger
              block
              icon={<LogoutOutlined />}
              onClick={() => {
                signOut();
                setDrawerOpen(false);
                router.push("/");
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button block type="primary" href="/login">
              Login
            </Button>
          )}
        </div>
      </Drawer>
    </Layout>
  );
}
