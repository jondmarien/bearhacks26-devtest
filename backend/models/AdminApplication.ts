import mongoose, { Document, Schema } from "mongoose";
import type { IApplication } from "./Application"; // Import interface

// Re-use the interface but it will be stored in a different collection
export interface IAdminApplication extends IApplication {}

const adminApplicationSchema = new Schema<IAdminApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    basicInfo: {
      fullName: { type: String, required: true },
      preferredName: { type: String },
      email: { type: String },
      school: { type: String },
      year: { type: String },
      location: { type: String },
    },
    skillsAndLinks: {
      skills: [{ type: String }],
      githubUrl: { type: String },
      portfolioUrl: { type: String },
      otherLinks: [{ type: String }],
    },
    accessibility: {
      allergies: { type: String },
      dietaryRestrictions: { type: String },
      accommodations: { type: String },
    },
    accepted: { type: Boolean, default: false },
    rsvpd: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "admin_applications", // Explicitly set collection name
  },
);

const AdminApplication = mongoose.model<IAdminApplication>(
  "AdminApplication",
  adminApplicationSchema,
);
export default AdminApplication;
