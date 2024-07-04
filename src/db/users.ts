import mongoose, { Schema, model } from "mongoose";
import { UserSchema } from "types";

const UserSchema = new Schema<UserSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, unique: true, required: true, trim: true },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id;
  await mongoose
    .model("Client")
    .updateMany({ userId: userId }, { $set: { userId: "" } });
  next();
});

export const User = model("User", UserSchema);

export const getUsers = () => User.find();
export const getUserByEmail = (email: string) => User.findOne({ email });
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string, any>) =>
  new User(values).save();
export const deleteUserById = (id: string) =>
  User.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  User.findByIdAndUpdate({ _id: id }, values, { new: true });
