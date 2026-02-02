import { z } from "zod";

// Base Schema parts (Shared)
export const BasicInfoSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  preferredName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  school: z.string().min(1, { message: "School is required" }),
  year: z.string().min(1, { message: "Graduation year is required" }),
  major: z.string().min(1, { message: "Major is required" }),
  educationLevel: z.string().min(1, { message: "Education level is required" }),
  age: z.string().min(1, { message: "Age is required" }),
  discord: z.string().optional(),
});

export const HackerExperienceSchema = z.object({
  hackathonCount: z.enum([
    "First time here",
    "Built a few projects (1-2)",
    "Hackathons are life (3+)",
  ]),
  hackerType: z.enum(["Developer", "Designer", "Multitasker", "Other"]),
  workshops: z.array(z.string()).optional(),
  referral: z.array(z.string()).optional(),
  referralOther: z.string().optional(),
});

export const WorkSchema = z.object({
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  resumeUrl: z.string().optional().or(z.literal("")),
  roles: z.array(z.string()).optional(), // Future opportunities
  coops: z.array(z.string()).optional(), // Co-op terms
});

export const AdditionalNeedsSchema = z.object({
  dietary: z.array(z.string()).optional(),
  dietaryOther: z.string().optional(),
  accessibility: z.string().optional(),
});

export const DiversitySchema = z.object({
  gender: z.string().optional(),
  genderOther: z.string().optional(),
  pronouns: z.string().optional(),
  pronounsOther: z.string().optional(),
  ethnicity: z.string().optional(),
});

export const ConsentSchema = z.object({
  shareWithSponsors: z.boolean().refine((val) => val === true, {
    message: "You must agree to share your resume with sponsors.",
  }),
  mlhCodeOfConduct: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH Code of Conduct.",
  }),
  mlhPrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must authorize sharing information with MLH.",
  }),
  mlhEmails: z.boolean().optional(),
  commute: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the travel policy.",
  }),
  accurateInfo: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information is accurate.",
  }),
});

// Backend Schema (The "True" Data Shape)
export const ApplicationSchema = z.object({
  basicInfo: BasicInfoSchema,
  hackerExperience: HackerExperienceSchema,
  work: WorkSchema,
  additionalNeeds: AdditionalNeedsSchema,
  diversity: DiversitySchema,
  consent: ConsentSchema,
});

export type ApplicationData = z.infer<typeof ApplicationSchema>;
