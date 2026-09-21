import { UserModel } from "./user.model";

export interface UserRepository {
  create(user: UserModel): Promise<UserModel>;
  findByEmail(email: string): Promise<UserModel | null>;
  findById(id: string): Promise<UserModel | null>;
}
