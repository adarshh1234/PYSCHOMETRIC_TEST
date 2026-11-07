import { Candidate } from "@/types";
import { simulatedLatency, ApiResponse } from "./client";
import { MOCK_CANDIDATES } from "../mock/data/candidates.mock";

export const CandidateApi = {
  async getAll(): Promise<ApiResponse<Candidate[]>> {
    return simulatedLatency(MOCK_CANDIDATES);
  },

  async getById(id: string): Promise<ApiResponse<Candidate | null>> {
    const item = MOCK_CANDIDATES.find((c) => c.id === id) || null;
    return simulatedLatency(item);
  },
};

