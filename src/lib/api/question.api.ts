import { Question } from "@/types";
import { simulatedLatency, ApiResponse } from "./client";
import { MOCK_QUESTIONS } from "../mock/data/questions.mock";

export const QuestionApi = {
  async getAll(): Promise<ApiResponse<Question[]>> {
    return simulatedLatency(MOCK_QUESTIONS);
  },

  async getById(id: string): Promise<ApiResponse<Question | null>> {
    const item = MOCK_QUESTIONS.find((q) => q.id === id) || null;
    return simulatedLatency(item);
  },
};

