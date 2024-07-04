export type ClientSchema = {
  name: string;
  address: string;
  settled: boolean;
  userId: string;
};

export type UserSchema = {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

export type SessionSchema = {
  sessionToken: string;
  userId: string;
};
