import type { ApplicationData } from "@shared/schemas/application";

export interface Application extends ApplicationData {
  _id: string;
  userId: {
    username: string;
    email: string;
    avatar: string;
    discordId: string;
  };
  accepted: boolean;
  rsvpd: boolean;
}

export interface TestApplication extends ApplicationData {
  _id: string;
  // Test apps might not have a real userId attached in the same way, or it's simulated.
  // The existing code expects userId NOT to be present for TestApplication to distinguish it.
  accepted: boolean;
  rsvpd: boolean;
  createdAt: string;
}
