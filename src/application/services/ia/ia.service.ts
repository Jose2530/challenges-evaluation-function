interface AIService {
  generate(prompt: string): Promise<string>;
}

export { AIService };
