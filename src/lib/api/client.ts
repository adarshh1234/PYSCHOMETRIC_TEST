/**
 * API Client Abstraction Layer
 * Structured for future Node.js / Express.js / MongoDB backend integration.
 * In production, requests will route to process.env.NEXT_PUBLIC_API_URL.
 * In current standalone frontend mode, services return mock datasets asynchronously.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.psychometric-platform.internal/v1";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export async function simulatedLatency<T>(data: T, delayMs: number = 150): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        success: true,
      });
    }, delayMs);
  });
}

