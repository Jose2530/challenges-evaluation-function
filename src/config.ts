const VERSIONS = {
  V1: "/V1",
};

export default {
  PORT: process.env.APPLICATION_PORT ?? "8001",
  ENV: process.env.NODE_ENV ?? "LOCAL",

  AWS_REGION: process.env.AWS_REGION ?? "us-east-1",
  AWS_ACCESS_KEY_ID: "",
  AWS_SECRET_ACCESS_KEY: "",

  CONTEXT: process.env.CONTEXT ?? "",
  AI: {
    GROQ_API_KEY: "",
    MODEL: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  },
  JWT: {
    SECRET: process.env.JWT_SECRET ?? "challenges-evaluation-secret-key",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "8h",
  },
  DYNAMODB: {
    ASSESSMENTS_TABLE:
      process.env.ASSESSMENTS_TABLE ?? "tech-assess-assessments",
    QUESTIONS_TABLE: process.env.QUESTIONS_TABLE ?? "tech-assess-questions",
    CHALLENGE_EVALUATION:
      process.env.CHALLENGE_EVALUATION ?? "challenges-evaluation",
    USERS_TABLE: process.env.USERS_TABLE ?? "tech-assess-users",
  },
  EXECUTION: {
    TIMEOUT_MS: Number(process.env.EXECUTION_TIMEOUT_MS ?? 5000),
    MEMORY: process.env.EXECUTION_MEMORY ?? "128m",
    CPU: process.env.EXECUTION_CPU ?? "0.5",
    PIDS_LIMIT: Number(process.env.EXECUTION_PIDS_LIMIT ?? 50),
  },
  PATHS: {
    OPERATIONS: {
      AUTHENTICATION: `${VERSIONS.V1}/auth/login`,
      AUTHENTICATION_REGISTRATION: `${VERSIONS.V1}/auth/register`,
      ASSESSMENTS: `${VERSIONS.V1}/assessments`,
      ASSESSMENTS_LIST: `${VERSIONS.V1}/assessments/list`,
      ASSESSMENT_BY_ID: `${VERSIONS.V1}/assessments/:id`,
      AI_HINT: `${VERSIONS.V1}/hint`,
      AI_GENERATE: `${VERSIONS.V1}/challenges/generate`,
      QUESTIONS: `${VERSIONS.V1}/questions`,
      QUESTIONS_LIST: `${VERSIONS.V1}/questions/list`,
      QUESTION_BY_ID: `${VERSIONS.V1}/questions/:id`,
      EXECUTIONS: `${VERSIONS.V1}/execution`,
      EXECUTION_BY_ID: `${VERSIONS.V1}/executions/:id`,
      EVALUATIONS: `${VERSIONS.V1}/evaluation`,
      EVALUATIONS_ASSESSMENT: `${VERSIONS.V1}/evaluation/assessment`,
      EVALUATIONS_BY_ID: `${VERSIONS.V1}/evaluation/:id`,
      EVALUATIONS_LIST: `${VERSIONS.V1}/evaluation/list`,
      SUBMISSIONS: `${VERSIONS.V1}/submissions`,
      RESULTS: `${VERSIONS.V1}/results/:assessmentId`,
    },
  },
  RESOURCE: "./static",
  OAS: {
    FILE: "./static/OAS.json",
    PATH: "/api-docs",
  },
};
