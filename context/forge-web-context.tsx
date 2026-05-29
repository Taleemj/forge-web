"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AUTH_TOKEN_KEY, getApiErrorMessage } from "@/lib/api";
import { forgeApi } from "@/lib/forge-api";
import type {
  ConstructionRequestPayload,
  ConstructionService,
  Design,
  DesignRequestPayload,
  House,
  Land,
  LoginPayload,
  MaintenanceRequestPayload,
  ManagementService,
  MarketplaceInquiryPayload,
  Notification,
  Project,
  ResetPasswordPayload,
  SignUpPayload,
  User,
} from "@/types";

const STALE_AFTER_MS = 60_000;

type SectionErrors = {
  publicData?: string;
  auth?: string;
  projects?: string;
  notifications?: string;
};

type ForgeWebContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  lands: Land[];
  designs: Design[];
  houses: House[];
  services: ManagementService[];
  constructionService: ConstructionService | null;
  projects: Project[];
  notifications: Notification[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  errors: SectionErrors;
  fetchPublicData: (force?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
  fetchProjects: (force?: boolean) => Promise<void>;
  fetchNotifications: (force?: boolean) => Promise<void>;
  signIn: (
    payload: LoginPayload,
  ) => Promise<{ success: boolean; message?: string; email?: string }>;
  signUp: (
    payload: SignUpPayload,
  ) => Promise<{ success: boolean; message?: string; email?: string }>;
  verifyOTP: (
    email: string,
    otp: string,
  ) => Promise<{ success: boolean; message?: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (
    payload: ResetPasswordPayload,
  ) => Promise<{ success: boolean; message?: string }>;
  requestMaintenanceService: (
    payload: MaintenanceRequestPayload,
  ) => Promise<{ success: boolean; message?: string }>;
  requestConstructionService: (
    payload: ConstructionRequestPayload,
  ) => Promise<{ success: boolean; message?: string }>;
  requestDesign: (
    payload: DesignRequestPayload,
  ) => Promise<{ success: boolean; message?: string }>;
  requestMarketplaceInquiry: (
    payload: MarketplaceInquiryPayload,
  ) => Promise<{ success: boolean; message?: string }>;
  signOut: () => void;
};

const ForgeWebContext = createContext<ForgeWebContextValue | undefined>(
  undefined,
);

function getStoredToken() {
  return typeof window !== "undefined"
    ? window.localStorage.getItem(AUTH_TOKEN_KEY)
    : null;
}

function createFallbackId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeId<T extends { _id?: string; id?: string }>(
  item: T,
): T & { id: string } {
  return { ...item, id: item._id || item.id || createFallbackId() };
}

export function ForgeWebProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [lands, setLands] = useState<Land[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [services, setServices] = useState<ManagementService[]>([]);
  const [constructionService, setConstructionService] =
    useState<ConstructionService | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errors, setErrors] = useState<SectionErrors>({});
  const [lastPublicFetch, setLastPublicFetch] = useState(0);
  const [lastProjectsFetch, setLastProjectsFetch] = useState(0);
  const [lastNotificationsFetch, setLastNotificationsFetch] = useState(0);

  const clearError = useCallback((key: keyof SectionErrors) => {
    setErrors((current) => ({ ...current, [key]: undefined }));
  }, []);

  const signOut = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    setToken(null);
    setUser(null);
    setProjects([]);
    setNotifications([]);
    setLastProjectsFetch(0);
    setLastNotificationsFetch(0);
  }, []);

  const fetchPublicData = useCallback(async (force = false) => {
    if (
      !force &&
      lastPublicFetch &&
      Date.now() - lastPublicFetch < STALE_AFTER_MS
    ) {
      return;
    }

    setIsRefreshing(true);
    try {
      const data = await forgeApi.getPublicData();
      setLands(data.lands.map(normalizeId));
      setDesigns(data.designs.map(normalizeId));
      setHouses(data.houses.map(normalizeId));
      setServices(
        data.services
          .filter((service) => service.status !== "archived")
          .map(normalizeId),
      );
      setConstructionService(
        data.constructionService ? normalizeId(data.constructionService) : null,
      );
      setLastPublicFetch(Date.now());
      clearError("publicData");
    } catch (error) {
      setErrors((current) => ({
        ...current,
        publicData: getApiErrorMessage(error),
      }));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getStoredToken()) return;

    setIsRefreshing(true);
    try {
      const nextUser = await forgeApi.me();
      setUser(nextUser);
      clearError("auth");
    } catch (error) {
      setErrors((current) => ({ ...current, auth: getApiErrorMessage(error) }));
      signOut();
    } finally {
      setIsRefreshing(false);
    }
  }, [clearError, signOut]);

  const fetchProjects = useCallback(
    async (force = false) => {
      if (!getStoredToken()) return;
      if (
        !force &&
        lastProjectsFetch &&
        Date.now() - lastProjectsFetch < STALE_AFTER_MS
      ) {
        return;
      }

      setIsRefreshing(true);
      try {
        const nextProjects = await forgeApi.projects();
        setProjects(nextProjects.map(normalizeId));
        setLastProjectsFetch(Date.now());
        clearError("projects");
      } catch (error) {
        setErrors((current) => ({
          ...current,
          projects: getApiErrorMessage(error),
        }));
      } finally {
        setIsRefreshing(false);
      }
    },
    [clearError, lastProjectsFetch],
  );

  const fetchNotifications = useCallback(
    async (force = false) => {
      if (!getStoredToken()) return;
      if (
        !force &&
        lastNotificationsFetch &&
        Date.now() - lastNotificationsFetch < STALE_AFTER_MS
      ) {
        return;
      }

      setIsRefreshing(true);
      try {
        const nextNotifications = await forgeApi.notifications();
        setNotifications(nextNotifications.map(normalizeId));
        setLastNotificationsFetch(Date.now());
        clearError("notifications");
      } catch (error) {
        setErrors((current) => ({
          ...current,
          notifications: getApiErrorMessage(error),
        }));
      } finally {
        setIsRefreshing(false);
      }
    },
    [clearError, lastNotificationsFetch],
  );

  const signIn = useCallback(async (payload: LoginPayload) => {
    try {
      const response = await forgeApi.login(payload);
      window.localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return { success: true };
    } catch (error: unknown) {
      const maybeError = error as { response?: { data?: { email?: string } } };
      return {
        success: false,
        message: getApiErrorMessage(error),
        email: maybeError.response?.data?.email,
      };
    }
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    try {
      const response = await forgeApi.register(payload);
      return {
        success: true,
        message: response.message,
        email: response.email,
      };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) };
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    try {
      const response = await forgeApi.verifyOTP(email, otp);
      window.localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) };
    }
  }, []);

  const resendOTP = useCallback(async (email: string) => {
    try {
      const response = await forgeApi.resendOTP(email);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) };
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await forgeApi.forgotPassword(email);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) };
    }
  }, []);

  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    try {
      const response = await forgeApi.resetPassword(payload);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) };
    }
  }, []);

  const requestMaintenanceService = useCallback(
    async (payload: MaintenanceRequestPayload) => {
      try {
        const response = await forgeApi.requestMaintenance(
          payload,
          Boolean(getStoredToken()),
        );
        return { success: true, message: response.message };
      } catch (error) {
        return { success: false, message: getApiErrorMessage(error) };
      }
    },
    [],
  );

  const requestConstructionService = useCallback(
    async (payload: ConstructionRequestPayload) => {
      try {
        const response = await forgeApi.requestConstruction(
          payload,
          Boolean(getStoredToken()),
        );
        return { success: true, message: response.message };
      } catch (error) {
        return { success: false, message: getApiErrorMessage(error) };
      }
    },
    [],
  );

  const requestDesign = useCallback(async (payload: DesignRequestPayload) => {
    try {
      const response = await forgeApi.requestDesign(
        payload,
        Boolean(getStoredToken()),
      );
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) };
    }
  }, []);

  const requestMarketplaceInquiry = useCallback(
    async (payload: MarketplaceInquiryPayload) => {
      try {
        const response = await forgeApi.requestMarketplaceInquiry(
          payload,
          Boolean(getStoredToken()),
        );
        return { success: true, message: response.message };
      } catch (error) {
        return { success: false, message: getApiErrorMessage(error) };
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      fetchPublicData(true),
      token ? refreshUser() : Promise.resolve(),
      token ? fetchProjects(true) : Promise.resolve(),
      token ? fetchNotifications(true) : Promise.resolve(),
    ]).finally(() => {
      if (isMounted) setIsInitialLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [fetchNotifications, fetchProjects, fetchPublicData, refreshUser, token]);

  useEffect(() => {
    const handleExpired = () => signOut();
    window.addEventListener("forge-user-auth-expired", handleExpired);
    return () =>
      window.removeEventListener("forge-user-auth-expired", handleExpired);
  }, [signOut]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      lands,
      designs,
      houses,
      services,
      constructionService,
      projects,
      notifications,
      isInitialLoading,
      isRefreshing,
      errors,
      fetchPublicData,
      refreshUser,
      fetchProjects,
      fetchNotifications,
      signIn,
      signUp,
      verifyOTP,
      resendOTP,
      forgotPassword,
      resetPassword,
      requestMaintenanceService,
      requestConstructionService,
      requestDesign,
      requestMarketplaceInquiry,
      signOut,
    }),
    [
      user,
      token,
      lands,
      designs,
      houses,
      services,
      constructionService,
      projects,
      notifications,
      isInitialLoading,
      isRefreshing,
      errors,
      fetchPublicData,
      refreshUser,
      fetchProjects,
      fetchNotifications,
      signIn,
      signUp,
      verifyOTP,
      resendOTP,
      forgotPassword,
      resetPassword,
      requestMaintenanceService,
      requestConstructionService,
      requestDesign,
      requestMarketplaceInquiry,
      signOut,
    ],
  );

  return (
    <ForgeWebContext.Provider value={value}>
      {children}
    </ForgeWebContext.Provider>
  );
}

export function useForgeWeb() {
  const context = useContext(ForgeWebContext);
  if (!context) {
    throw new Error("useForgeWeb must be used inside ForgeWebProvider");
  }
  return context;
}
