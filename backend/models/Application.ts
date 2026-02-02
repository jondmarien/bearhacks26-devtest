import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  basicInfo: {
    firstName: string;
    lastName: string;
    preferredName?: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    school: string;
    year: string;
    major: string;
    educationLevel: string;
    age: string;
    discord?: string;
  };
  hackerExperience: {
    hackathonCount: string;
    hackerType: string;
    workshops?: string[];
    referral?: string[];
    referralOther?: string;
  };
  work: {
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    resumeUrl?: string;
    roles?: string[];
    coops?: string[];
  };
  additionalNeeds: {
    dietary?: string[];
    dietaryOther?: string;
    accessibility?: string;
  };
  diversity: {
    gender?: string;
    genderOther?: string;
    pronouns?: string;
    pronounsOther?: string;
    ethnicity?: string;
  };
  accepted: boolean;
  rsvpd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const applicationSchemaFields = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  basicInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    preferredName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    school: { type: String, required: true },
    year: { type: String, required: true },
    major: { type: String, required: true },
    educationLevel: { type: String, required: true },
    age: { type: String, required: true },
    discord: { type: String },
  },
  hackerExperience: {
    hackathonCount: { type: String },
    hackerType: { type: String },
    workshops: [{ type: String }],
    referral: [{ type: String }],
    referralOther: { type: String },
  },
  work: {
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    portfolioUrl: { type: String },
    resumeUrl: { type: String },
    roles: [{ type: String }],
    coops: [{ type: String }],
  },
  additionalNeeds: {
    dietary: [{ type: String }],
    dietaryOther: { type: String },
    accessibility: { type: String },
  },
  diversity: {
    gender: { type: String },
    genderOther: { type: String },
    pronouns: { type: String },
    pronounsOther: { type: String },
    ethnicity: { type: String },
  },
  consent: {
    marketing: { type: Boolean, default: false },
    shared: { type: Boolean, default: false },
    mlhCodeOfConduct: { type: Boolean, default: false },
    mlhPrivacyPolicy: { type: Boolean, default: false },
    mlhEmailSubscription: { type: Boolean, default: false },
  },
  accepted: { type: Boolean, default: false },
  rsvpd: { type: Boolean, default: false },
};

const applicationSchema = new Schema<IApplication>(applicationSchemaFields, {
  timestamps: true,
});

const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema,
);
export default Application;
