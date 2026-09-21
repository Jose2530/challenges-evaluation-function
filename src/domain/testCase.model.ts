export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  weight: number;
}
