import { Question } from "./question";

export interface QuestionRepository {
  create(question: Question): Promise<Question>;

  findById(id: string): Promise<Question | null>;

  findAll(): Promise<Question[]>;

  update(question: Question): Promise<void>;

  delete(id: string): Promise<void>;
}
