import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { UserModel, UserType } from "../../../domain/users/user.model";
import { UserRepository } from "../../../domain/users/user.repository";

interface RegisterRequest {
  body: {
    name: string;
    email: string;
    password: string;
    userType: UserType;
  };
  headers: Record<string, string | string[] | undefined>;
}

interface RegisterResponse {
  status: number;
  data?: {
    id: string;
    name: string;
    email: string;
    userType: UserType;
  };
  message?: string;
}

export class RegisterService {
  constructor(private readonly userRepository: UserRepository) {}

  public async query(request: RegisterRequest): Promise<RegisterResponse> {
    const { name, email, password, userType } = request.body;

    if (!name || !email || !password) {
      return {
        status: 400,
        message: "Nombre, email y password son obligatorios.",
      };
    }

    if (userType !== "admin" && userType !== "candidate") {
      return {
        status: 400,
        message: "El tipo de usuario debe ser admin o candidate.",
      };
    }

    const existingUser = await this.userRepository.findByEmail(
      email.trim().toLowerCase()
    );

    if (existingUser) {
      return {
        status: 409,
        message: "El email ya está registrado.",
      };
    }

    const passwordHash = await hash(password, 10);

    const user: UserModel = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      userType,
      createdAt: new Date().toISOString(),
    };

    await this.userRepository.create(user);

    return {
      status: 201,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    };
  }
}
