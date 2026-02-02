import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  basicInfo: {
    fullName: string;
    preferredName?: string;
    email?: string;
    school?: string;
    year?: string;
    location?: string;
  };
  skillsAndLinks: {
    skills: string[];
    githubUrl?: string;
    portfolioUrl?: string;
    otherLinks?: string[];
  };
  accessibility: {
    allergies?: string;
    dietaryRestrictions?: string;
    accommodations?: string;
  };
  accepted: boolean;
  rsvpd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
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
      year: {
        type: String,
        match: [/^\d{4}$/, "Graduation year must be 4 digits"],
      },
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
  },
);

const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema,
);
export default Application;
