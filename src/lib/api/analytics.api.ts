import { simulatedLatency, ApiResponse } from "./client";
import {
  MOCK_ANALYTICS_KPIS,
  MOCK_COMPLETION_TRENDS,
  MOCK_SCORE_DISTRIBUTION,
  MOCK_CATEGORY_DISTRIBUTION,
  MOCK_DEPARTMENT_METRICS,
} from "../mock/data/analytics.mock";

export const AnalyticsApi = {
  async getDashboardMetrics(): Promise<ApiResponse<any>> {
    return simulatedLatency({
      kpis: MOCK_ANALYTICS_KPIS,
      completionTrends: MOCK_COMPLETION_TRENDS,
      scoreDistribution: MOCK_SCORE_DISTRIBUTION,
      categoryDistribution: MOCK_CATEGORY_DISTRIBUTION,
      departmentMetrics: MOCK_DEPARTMENT_METRICS,
    });
  },
};

