export interface CreateAssessmentDto {
  name: string;
  description: string;
  durationMinutes: number;
  questionIds: string[];
}
