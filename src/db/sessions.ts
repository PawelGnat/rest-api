import { Schema, model } from "mongoose";
import { SessionSchema } from "types";

const SessionSchema = new Schema<SessionSchema>(
  {
    sessionToken: { type: String, unique: true, required: true },
    userId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Session = model("Session", SessionSchema);

export const getSessionByToken = (sessionToken: string) =>
  Session.findOne({ sessionToken });
export const getSessionByUserId = (userId: string) =>
  Session.findOne({ userId });
export const createSession = (sessionToken: string, userId: string) =>
  new Session({ sessionToken, userId }).save();
export const updateSession = (sessionToken: string, userId: string) =>
  Session.findOneAndUpdate({ userId }, { sessionToken }, { new: true });
