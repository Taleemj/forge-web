import { apiClient } from "@/lib/api";
import type {
  AuthResponse,
  Design,
  House,
  Land,
  LoginPayload,
  ManagementService,
  Notification,
  Project,
  ResetPasswordPayload,
  SignUpPayload,
  User,
} from "@/types";

export const forgeApi = {
  async getPublicData() {
    const [lands, designs, houses, services] = await Promise.all([
      apiClient.get<Land[]>("/public/lands"),
      apiClient.get<Design[]>("/public/designs"),
      apiClient.get<House[]>("/public/houses"),
      apiClient.get<ManagementService[]>("/public/management-services"),
    ]);

    return {
      lands: lands.data,
      designs: designs.data,
      houses: houses.data,
      services: services.data,
    };
  },

  async getLand(id: string) {
    const response = await apiClient.get<Land>(`/public/lands/${id}`);
    return response.data;
  },

  async getDesign(id: string) {
    const response = await apiClient.get<Design>(`/public/designs/${id}`);
    return response.data;
  },

  async getHouse(id: string) {
    const response = await apiClient.get<House>(`/public/houses/${id}`);
    return response.data;
  },

  async getService(id: string) {
    const response = await apiClient.get<ManagementService>(
      `/public/management-services/${id}`,
    );
    return response.data;
  },

  async login(payload: LoginPayload) {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  async register(payload: SignUpPayload) {
    const response = await apiClient.post<{ message: string; email: string }>(
      "/auth/register",
      payload,
    );
    return response.data;
  },

  async verifyOTP(email: string, otp: string) {
    const response = await apiClient.post<AuthResponse & { message: string }>(
      "/auth/verify-otp",
      { email, otp },
    );
    return response.data;
  },

  async resendOTP(email: string) {
    const response = await apiClient.post<{ message: string }>("/auth/resend-otp", {
      email,
    });
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await apiClient.post<{ message: string }>(
      "/auth/forgot-password",
      { email },
    );
    return response.data;
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const response = await apiClient.post<{ message: string }>(
      "/auth/reset-password",
      payload,
    );
    return response.data;
  },

  async me() {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  async projects() {
    const response = await apiClient.get<Project[]>("/auth/projects");
    return response.data;
  },

  async notifications() {
    const response = await apiClient.get<Notification[]>("/auth/notifications");
    return response.data;
  },
};
