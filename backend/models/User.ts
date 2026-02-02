import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  discordId: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
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
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
