import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  discordId: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
  password?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    discriminator: { type: String },
    avatar: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
