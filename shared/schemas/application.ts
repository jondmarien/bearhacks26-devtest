import { z } from "zod";

// Base Schema parts (Shared)
export const BasicInfoSchema = z.object({
  fullName: z.string().min(1, { message: "Full Name is required" }),
  preferredName: z.string().optional(),
  email: z
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  school: z.string().optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: "Graduation year must be 4 digits" })
    .optional()
    .or(z.literal("")),
  location: z.string().optional(),
});

export const AccessibilitySchema = z.object({
  allergies: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  accommodations: z.string().optional(),
});

// Helper for URL or Empty
export const UrlOrEmpty = z
  .string()
  .url({ message: "Invalid URL" })
  .optional()
  .or(z.literal(""));

// Backend Schema (The "True" Data Shape)
export const ApplicationSchema = z.object({
  basicInfo: BasicInfoSchema,
  skillsAndLinks: z.object({
    skills: z.array(z.string()).optional(),
    githubUrl: UrlOrEmpty,
    portfolioUrl: UrlOrEmpty,
    otherLinks: z.array(z.string()).optional(),
  }),
  accessibility: AccessibilitySchema,
});

export type ApplicationData = z.infer<typeof ApplicationSchema>;
