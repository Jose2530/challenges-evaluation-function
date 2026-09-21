import { SupportedLanguage } from "../questions/question";

export interface ExecutionRequest {
  code: string;
  language: SupportedLanguage;
  input: string;
  timeoutMs: number;
}
