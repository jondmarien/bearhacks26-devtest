import mongoose, { Schema } from "mongoose";
import { type IApplication, applicationSchemaFields } from "./Application";

// Re-use the interface but it will be stored in a different collection
export interface IAdminApplication extends IApplication {}

const adminApplicationSchema = new Schema<IAdminApplication>(
  applicationSchemaFields,
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
