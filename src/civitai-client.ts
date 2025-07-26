import fetch from 'node-fetch';
import {
  ModelsResponse,
  ImagesResponse,
  CreatorsResponse,
  TagsResponse,
  Model,
  ModelVersionResponse,
  ModelsResponseSchema,
  ImagesResponseSchema,
  CreatorsResponseSchema,
  TagsResponseSchema,
  ModelSchema,
  ModelVersionResponseSchema,
  ModelType,
  SortOrder,
  TimePeriod,
  ImageSort,
  NSFWLevel,
  CommercialUse
} from './types.js';

export interface ModelsParams {
  limit?: number;
  page?: number;
  query?: string;
  tag?: string;
  username?: string;
  types?: string[];
  sort?: string;
  period?: string;
  favorites?: boolean;
  hidden?: boolean;
  primaryFileOnly?: boolean;
  allowNoCredit?: boolean;
  allowDerivatives?: boolean;
  allowDifferentLicenses?: boolean;
  allowCommercialUse?: string;
  nsfw?: boolean;
  supportsGeneration?: boolean;
  ids?: number[];
  baseModels?: string[];
}

export interface ImagesParams {
  limit?: number;
  page?: number;
  postId?: number;
  modelId?: number;
  modelVersionId?: number;
  username?: string;
  nsfw?: boolean | string;
  sort?: string;
  period?: string;
}

export interface CreatorsParams {
  limit?: number;
  page?: number;
  query?: string;
}

export interface TagsParams {
  limit?: number;
  page?: number;
  query?: string;
}

export class CivitaiClient {
  private baseUrl = 'https://civitai.com/api/v1';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add API key if available
    if (this.apiKey) {
      url.searchParams.set('token', this.apiKey);
    }

    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v.toString()));
        } else {
          url.searchParams.set(key, value.toString());
        }
      }
    });

    return url.toString();
  }

  private async makeRequest<T>(url: string, schema: any): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return schema.parse(data);
    } catch (error) {
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getModels(params: ModelsParams = {}): Promise<ModelsResponse> {
    const url = this.buildUrl('/models', params);
    return this.makeRequest<ModelsResponse>(url, ModelsResponseSchema);
  }

  async getModel(modelId: number): Promise<Model> {
    const url = this.buildUrl(`/models/${modelId}`);
    return this.makeRequest<Model>(url, ModelSchema);
  }

  async getModelVersion(modelVersionId: number): Promise<ModelVersionResponse> {
    const url = this.buildUrl(`/model-versions/${modelVersionId}`);
    return this.makeRequest<ModelVersionResponse>(url, ModelVersionResponseSchema);
  }

  async getModelVersionByHash(hash: string): Promise<ModelVersionResponse> {
    const url = this.buildUrl(`/model-versions/by-hash/${hash}`);
    return this.makeRequest<ModelVersionResponse>(url, ModelVersionResponseSchema);
  }

  async getImages(params: ImagesParams = {}): Promise<ImagesResponse> {
    const url = this.buildUrl('/images', params);
    return this.makeRequest<ImagesResponse>(url, ImagesResponseSchema);
  }

  async getCreators(params: CreatorsParams = {}): Promise<CreatorsResponse> {
    const url = this.buildUrl('/creators', params);
    return this.makeRequest<CreatorsResponse>(url, CreatorsResponseSchema);
  }

  async getTags(params: TagsParams = {}): Promise<TagsResponse> {
    const url = this.buildUrl('/tags', params);
    return this.makeRequest<TagsResponse>(url, TagsResponseSchema);
  }

  // Helper methods for downloading
  getDownloadUrl(modelVersionId: number): string {
    return this.buildUrl(`/download/models/${modelVersionId}`);
  }

  // Search helper methods
  async searchModels(query: string, options: Partial<ModelsParams> = {}): Promise<ModelsResponse> {
    return this.getModels({ query, ...options });
  }

  async searchModelsByTag(tag: string, options: Partial<ModelsParams> = {}): Promise<ModelsResponse> {
    return this.getModels({ tag, ...options });
  }

  async searchModelsByCreator(username: string, options: Partial<ModelsParams> = {}): Promise<ModelsResponse> {
    return this.getModels({ username, ...options });
  }

  async getModelsByType(type: string, options: Partial<ModelsParams> = {}): Promise<ModelsResponse> {
    return this.getModels({ types: [type], ...options });
  }

  // Utility methods
  async getPopularModels(period: string = 'Week', limit: number = 20): Promise<ModelsResponse> {
    return this.getModels({
      sort: 'Most Downloaded',
      period,
      limit,
      nsfw: false
    });
  }

  async getLatestModels(limit: number = 20): Promise<ModelsResponse> {
    return this.getModels({
      sort: 'Newest',
      limit,
      nsfw: false
    });
  }

  async getTopRatedModels(period: string = 'AllTime', limit: number = 20): Promise<ModelsResponse> {
    return this.getModels({
      sort: 'Highest Rated',
      period,
      limit,
      nsfw: false
    });
  }
}
