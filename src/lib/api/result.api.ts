import { CandidateResult } from "@/types";
import { simulatedLatency, ApiResponse } from "./client";
import { MOCK_RESULTS } from "../mock/data/results.mock";

export const ResultApi = {
  async getByCandidateId(candidateId: string): Promise<ApiResponse<CandidateResult | null>> {
    const res = MOCK_RESULTS[candidateId] || null;
    return simulatedLatency(res);
  },
};

