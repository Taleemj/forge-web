"use client";

import { App, ConfigProvider } from "antd";
import type { ReactNode } from "react";

import { ForgeWebProvider } from "@/context/forge-web-context";
import { forgeTheme } from "@/app/theme";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={forgeTheme}>
      <App>
        <ForgeWebProvider>{children}</ForgeWebProvider>
      </App>
    </ConfigProvider>
  );
}
