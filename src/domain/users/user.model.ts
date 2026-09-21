export type UserType = "admin" | "candidate";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  userType: UserType;
  createdAt: string;
}
