import { expect } from "chai";
import { hash } from "bcryptjs";

import { LoginService } from "../src/application/services/auth/login.service";

class FakeUserRepository {
  public async findByEmail(email: string) {
    if (email === "admin@test.com") {
      return {
        id: "user-1",
        email: "admin@test.com",
        passwordHash: await hash("123456", 10),
        userType: "admin",
        name: "Admin User",
        createdAt: new Date().toISOString(),
      };
    }

    return null;
  }
}

describe("LoginService", () => {
  it("should return a JWT and role for a valid admin user", async () => {
    const loginService = new LoginService(new FakeUserRepository() as any);

    const result = await loginService.query({
      body: {
        email: "admin@test.com",
        password: "123456",
      },
      headers: {},
    });

    expect(result.status).to.equal(200);
    expect(result.data).to.have.property("token");
    expect(result.data?.userType).to.equal("admin");
    expect(result.data?.user).to.have.property("email", "admin@test.com");
  });

  it("should reject invalid credentials", async () => {
    const loginService = new LoginService(new FakeUserRepository() as any);

    const result = await loginService.query({
      body: {
        email: "admin@test.com",
        password: "wrong-password",
      },
      headers: {},
    });

    expect(result.status).to.equal(401);
    expect(result.message).to.equal("Credenciales inválidas.");
  });
});
