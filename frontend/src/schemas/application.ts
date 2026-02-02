import { z } from "zod";
import {
  BasicInfoSchema,
  AccessibilitySchema,
  UrlOrEmpty,
} from "@shared/schemas/application";

// Schema for the FORM (skills is a string)
export const ApplicationFormSchema = z.object({
  basicInfo: BasicInfoSchema,
  skillsAndLinks: z.object({
    skills: z.string().optional(), // In form, this is a comma-separated string
    githubUrl: UrlOrEmpty,
    portfolioUrl: UrlOrEmpty,
    otherLinks: z.array(z.string()).optional(),
  }),
  accessibility: AccessibilitySchema,
});

export type ApplicationFormValues = z.infer<typeof ApplicationFormSchema>;
