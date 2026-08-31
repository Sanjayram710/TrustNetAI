import { AnalysisResponse, AnalysisListResponse, TrustEngineConfig, ContentType } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      errorMsg = errJson.detail || errJson.message || errorMsg;
    } catch {
      // fallback to status text
    }
    throw new ApiError(errorMsg, res.status);
  }
  return res.json();
}

export const api = {
  async analyzeImage(file: File, claim?: string): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (claim && claim.trim()) {
      formData.append('claim', claim.trim());
    }

    const res = await fetch(`${API_BASE_URL}/api/analyze/image`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async analyzeText(text: string, sourceUrl?: string): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/api/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source_url: sourceUrl || undefined,
      }),
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async analyzeVideo(file: File, claim?: string): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (claim) formData.append('claim', claim);

    const res = await fetch(`${API_BASE_URL}/api/analyze/video`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async analyzeAudio(file: File, claim?: string): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (claim) formData.append('claim', claim);

    const res = await fetch(`${API_BASE_URL}/api/analyze/audio`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async analyzeDocument(file: File, claim?: string): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (claim) formData.append('claim', claim);

    const res = await fetch(`${API_BASE_URL}/api/analyze/document`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async getAnalysisById(id: string): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/api/analysis/${id}`);
    return handleResponse<AnalysisResponse>(res);
  },

  async listAnalyses(params?: {
    contentType?: ContentType;
    riskFilter?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<AnalysisListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.contentType) searchParams.set('content_type', params.contentType);
    if (params?.riskFilter && params.riskFilter !== 'all') searchParams.set('risk_filter', params.riskFilter);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.pageSize) searchParams.set('page_size', params.pageSize.toString());

    const url = `${API_BASE_URL}/api/analysis?${searchParams.toString()}`;
    const res = await fetch(url, { cache: 'no-store' });
    return handleResponse<AnalysisListResponse>(res);
  },

  async getTrustEngineConfig(): Promise<TrustEngineConfig> {
    const res = await fetch(`${API_BASE_URL}/api/config/trust-engine`);
    return handleResponse<TrustEngineConfig>(res);
  }
};
