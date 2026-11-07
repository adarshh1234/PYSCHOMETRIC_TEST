import { Assessment } from "@/types";
import { simulatedLatency, ApiResponse } from "./client";
import { MOCK_ASSESSMENTS } from "../mock/data/assessments.mock";

export const AssessmentApi = {
  async getAll(): Promise<ApiResponse<Assessment[]>> {
    return simulatedLatency(MOCK_ASSESSMENTS);
  },

  async getById(id: string): Promise<ApiResponse<Assessment | null>> {
    const item = MOCK_ASSESSMENTS.find((a) => a.id === id) || null;
    return simulatedLatency(item);
  },
};

