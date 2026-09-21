import { SupportedLanguage } from "../../../domain/questions/question";

export interface ExecuteCodeDto {
  language: SupportedLanguage;
  code: string;
  input: string;
}
