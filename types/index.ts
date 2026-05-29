export type UserRole =
  | "client"
  | "builder"
  | "architect"
  | "admin"
  | "property_manager";

export type LandStatus = "available" | "sold";
export type HouseStatus = "available" | "sold" | "under-construction";
export type MediaType = "image" | "video";
export type ProjectType = "construction" | "design" | "management";
export type ProjectStatus =
  | "planning"
  | "construction"
  | "completed"
  | "pending"
  | "initialized"
  | "waiting_for_payment";
export type NotificationType = "progress" | "payment" | "document" | "alert";

export type User = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  ownedLandIds?: string[];
  ownedDesignIds?: string[];
  ownedPropertyIds?: string[];
};

export type MediaItem = {
  id?: string;
  _id?: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  title?: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Land = {
  id: string;
  _id?: string;
  title: string;
  location: string;
  size: string;
  price: number;
  images: string[];
  status: LandStatus;
  descriptionMarkdown?: string;
  coordinates?: Coordinates;
  media?: MediaItem[];
};

export type Design = {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  floorPlan?: string;
  media?: MediaItem[];
  descriptionMarkdown?: string;
};

export type House = {
  id: string;
  _id?: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: string;
  images: string[];
  status: HouseStatus;
  descriptionMarkdown?: string;
  coordinates?: Coordinates;
  media?: MediaItem[];
};

export type ManagementService = {
  id: string;
  _id?: string;
  title: string;
  description: string;
  helpText?: string;
  price: number;
  billingPeriod?: "once" | "month" | "quarter" | "year";
  category?: string;
  status?: "active" | "draft" | "archived";
  images: string[];
  media?: MediaItem[];
  descriptionMarkdown?: string;
};

export type ConstructionService = {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  processMarkdown?: string;
  consultationText?: string;
  startingPrice?: number;
  status: "active" | "draft" | "archived";
  images: string[];
  media?: MediaItem[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectUpdate = {
  id?: string;
  _id?: string;
  date: string;
  title: string;
  description: string;
  image?: string;
};

export type Project = {
  id: string;
  _id?: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  progress: number;
  stage: string;
  client: string | User;
  landId?: string | Pick<Land, "id" | "_id" | "title" | "location">;
  designId?: string | Pick<Design, "id" | "_id" | "title">;
  serviceId?: string;
  budget?: {
    total: number;
    paid: number;
  };
  updates?: ProjectUpdate[];
  createdAt?: string;
  updatedAt?: string;
};

export type Notification = {
  id: string;
  _id?: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  projectId?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export type MaintenanceRequestPayload = {
  serviceId: string;
  location: {
    label?: string;
    latitude?: number;
    longitude?: number;
    pinX?: number;
    pinY?: number;
  };
  propertyNotes?: string;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
};

export type ConstructionRequestPayload = {
  location?: {
    label?: string;
    latitude?: number;
    longitude?: number;
  };
  budgetRange?: string;
  timeline?: string;
  meetingPreference?: string;
  notes?: string;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
};

export type DesignRequestPayload = {
  designId: string;
  notes?: string;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
};

export type MarketplaceInquiryPayload = {
  itemType: "land" | "house";
  landId?: string;
  houseId?: string;
  notes?: string;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
};

export type AuthResponse = {
  token: string;
  user: User;
};
