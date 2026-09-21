export interface AssessmentModel {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  questionIds: string[];
  createdAt: string;
}
