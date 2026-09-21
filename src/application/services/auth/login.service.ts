import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import CONFIG from "../../../config";
import { UserRepository } from "../../../domain/users/user.repository";

interface LoginRequest {
  body: {
    email: string;
    password: string;
  };
  headers: Record<string, string | string[] | undefined>;
}

interface LoginResponse {
  status: number;
  data?: {
    token: string;
    userType: "admin" | "candidate";
    user: {
      id: string;
      name: string;
      email: string;
      userType: "admin" | "candidate";
    };
  };
  message?: string;
}

export class LoginService {
  constructor(private readonly userRepository: UserRepository) {}

  public async query(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request.body;

    if (!email || !password) {
      return {
        status: 400,
        message: "Email y password son obligatorios.",
      };
    }

    const user = await this.userRepository.findByEmail(
      email.trim().toLowerCase()
    );

    if (!user) {
      return {
        status: 401,
        message: "Credenciales inválidas.",
      };
    }

    const isValidPassword = await compare(password, user.passwordHash);

    if (!isValidPassword) {
      return {
        status: 401,
        message: "Credenciales inválidas.",
      };
    }

    const token = (sign as any)(
      {
        sub: user.id,
        email: user.email,
        userType: user.userType,
        name: user.name,
      },
      String(CONFIG.JWT.SECRET),
      {
        expiresIn: String(CONFIG.JWT.EXPIRES_IN),
      }
    );

    return {
      status: 200,
      data: {
        token,
        userType: user.userType,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
      },
    };
  }
}
