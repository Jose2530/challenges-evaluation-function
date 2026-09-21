import { expect } from "chai";

import { CreateQuestionService } from "../src/application/services/questions/question.service";
import { ListQuestionsService } from "../src/application/services/questions/listQuestions.service";

class FakeQuestionRepository {
  public async create(question: any) {
    return question;
  }

  public async findAll() {
    return [
      {
        id: "q-1",
        title: "Java challenge",
        description: "desc",
        challengeType: "java",
        allowedLanguages: ["java"],
        testCases: [],
        score: 100,
        createdAt: new Date().toISOString(),
      },
      {
        id: "q-2",
        title: "Cloud challenge",
        description: "desc",
        challengeType: "cloud",
        allowedLanguages: ["javascript"],
        testCases: [],
        score: 100,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

describe("Challenge type flow", () => {
  it("should persist challengeType when creating a question", async () => {
    const service = new CreateQuestionService(
      new FakeQuestionRepository() as any
    );

    const result = await service.query({
      body: {
        title: "Challenge Java",
        description: "Descripcion",
        challengeType: "java",
        allowedLanguages: ["java"],
        testCases: [],
        score: 50,
      },
      headers: {},
    });

    expect(result.status).to.equal(201);
    expect(result.data?.challengeType).to.equal("java");
  });

  it("should filter questions by challengeType", async () => {
    const service = new ListQuestionsService(
      new FakeQuestionRepository() as any
    );

    const result = await service.query({
      headers: {},
      body: { challengeType: "cloud" },
    });

    expect(result.status).to.equal(200);
    expect(
      result.data.every((question) => question.challengeType === "cloud")
    ).to.equal(true);
  });

  it("should filter questions by challengeType from query parameters", async () => {
    const service = new ListQuestionsService(
      new FakeQuestionRepository() as any
    );

    const result = await service.query({
      headers: {},
      query: { challengeType: "java" },
    });

    expect(result.status).to.equal(200);
    expect(
      result.data.every((question) => question.challengeType === "java")
    ).to.equal(true);
  });
});
