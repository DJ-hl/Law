import { model, models, Schema } from "mongoose";

export type UserDocument = {
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const User = models.User || model<UserDocument>("User", UserSchema);

export default User;
