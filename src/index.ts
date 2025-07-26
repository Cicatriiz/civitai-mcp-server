#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { CivitaiClient } from './civitai-client.js';
import { z } from 'zod';

class CivitaiMCPServer {
  private server: Server;
  private client: CivitaiClient;

  constructor() {
    this.server = new Server(
      {
        name: 'civitai-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize client with API key from environment variable
    const apiKey = process.env.CIVITAI_API_KEY;
    this.client = new CivitaiClient(apiKey);

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getTools(),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_models':
            return await this.searchModels(args);
          case 'get_model':
            return await this.getModel(args);
          case 'get_model_version':
            return await this.getModelVersion(args);
          case 'get_model_version_by_hash':
            return await this.getModelVersionByHash(args);
          case 'browse_images':
            return await this.browseImages(args);
          case 'get_creators':
            return await this.getCreators(args);
          case 'get_tags':
            return await this.getTags(args);
          case 'get_popular_models':
            return await this.getPopularModels(args);
          case 'get_latest_models':
            return await this.getLatestModels(args);
          case 'get_top_rated_models':
            return await this.getTopRatedModels(args);
          case 'search_models_by_tag':
            return await this.searchModelsByTag(args);
          case 'search_models_by_creator':
            return await this.searchModelsByCreator(args);
          case 'get_models_by_type':
            return await this.getModelsByType(args);
          case 'get_download_url':
            return await this.getDownloadUrl(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'search_models',
        description: 'Search for AI models on Civitai with various filters',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query to filter models by name' },
            limit: { type: 'number', description: 'Number of results (1-100, default 20)', minimum: 1, maximum: 100 },
            page: { type: 'number', description: 'Page number for pagination', minimum: 1 },
            types: { 
              type: 'array', 
              items: { 
                type: 'string',
                enum: ['Checkpoint', 'TextualInversion', 'Hypernetwork', 'AestheticGradient', 'LORA', 'Controlnet', 'Poses']
              },
              description: 'Filter by model types'
            },
            sort: { 
              type: 'string', 
              enum: ['Highest Rated', 'Most Downloaded', 'Newest'],
              description: 'Sort order for results'
            },
            period: {
              type: 'string',
              enum: ['AllTime', 'Year', 'Month', 'Week', 'Day'],
              description: 'Time period for sorting'
            },
            nsfw: { type: 'boolean', description: 'Include NSFW content' },
            baseModels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter by base model types (e.g., ["SD 1.5", "SDXL 1.0"])'
            }
          },
        },
      },
      {
        name: 'get_model',
        description: 'Get detailed information about a specific model by ID',
        inputSchema: {
          type: 'object',
          properties: {
            modelId: { type: 'number', description: 'The ID of the model to retrieve' },
          },
          required: ['modelId'],
        },
      },
      {
        name: 'get_model_version',
        description: 'Get detailed information about a specific model version',
        inputSchema: {
          type: 'object',
          properties: {
            modelVersionId: { type: 'number', description: 'The ID of the model version to retrieve' },
          },
          required: ['modelVersionId'],
        },
      },
      {
        name: 'get_model_version_by_hash',
        description: 'Get model version information by file hash',
        inputSchema: {
          type: 'object',
          properties: {
            hash: { type: 'string', description: 'The hash of the model file (AutoV1, AutoV2, SHA256, CRC32, or Blake3)' },
          },
          required: ['hash'],
        },
      },
      {
        name: 'browse_images',
        description: 'Browse AI-generated images from Civitai',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Number of images to return (1-200, default 100)', minimum: 1, maximum: 200 },
            page: { type: 'number', description: 'Page number for pagination', minimum: 1 },
            modelId: { type: 'number', description: 'Filter images from a specific model' },
            modelVersionId: { type: 'number', description: 'Filter images from a specific model version' },
            postId: { type: 'number', description: 'Get images from a specific post' },
            username: { type: 'string', description: 'Filter images by creator username' },
            nsfw: { 
              type: 'string',
              enum: ['None', 'Soft', 'Mature', 'X'],
              description: 'NSFW content level filter'
            },
            sort: {
              type: 'string',
              enum: ['Most Reactions', 'Most Comments', 'Newest'],
              description: 'Sort order for images'
            },
            period: {
              type: 'string',
              enum: ['AllTime', 'Year', 'Month', 'Week', 'Day'],
              description: 'Time period for sorting'
            }
          },
        },
      },
      {
        name: 'get_creators',
        description: 'Browse and search for model creators on Civitai',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Number of creators to return (0-200, default 20)', minimum: 0, maximum: 200 },
            page: { type: 'number', description: 'Page number for pagination', minimum: 1 },
            query: { type: 'string', description: 'Search query to filter creators by username' },
          },
        },
      },
      {
        name: 'get_tags',
        description: 'Browse and search for model tags on Civitai',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Number of tags to return (1-200, default 20)', minimum: 1, maximum: 200 },
            page: { type: 'number', description: 'Page number for pagination', minimum: 1 },
            query: { type: 'string', description: 'Search query to filter tags by name' },
          },
        },
      },
      {
        name: 'get_popular_models',
        description: 'Get the most popular/downloaded models',
        inputSchema: {
          type: 'object',
          properties: {
            period: {
              type: 'string',
              enum: ['AllTime', 'Year', 'Month', 'Week', 'Day'],
              description: 'Time period for popularity ranking (default: Week)'
            },
            limit: { type: 'number', description: 'Number of models to return (default: 20)', minimum: 1, maximum: 100 },
          },
        },
      },
      {
        name: 'get_latest_models',
        description: 'Get the newest models uploaded to Civitai',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Number of models to return (default: 20)', minimum: 1, maximum: 100 },
          },
        },
      },
      {
        name: 'get_top_rated_models',
        description: 'Get the highest rated models',
        inputSchema: {
          type: 'object',
          properties: {
            period: {
              type: 'string',
              enum: ['AllTime', 'Year', 'Month', 'Week', 'Day'],
              description: 'Time period for rating ranking (default: AllTime)'
            },
            limit: { type: 'number', description: 'Number of models to return (default: 20)', minimum: 1, maximum: 100 },
          },
        },
      },
      {
        name: 'search_models_by_tag',
        description: 'Search for models by a specific tag',
        inputSchema: {
          type: 'object',
          properties: {
            tag: { type: 'string', description: 'Tag name to search for' },
            limit: { type: 'number', description: 'Number of models to return (default: 20)', minimum: 1, maximum: 100 },
            sort: { 
              type: 'string', 
              enum: ['Highest Rated', 'Most Downloaded', 'Newest'],
              description: 'Sort order for results'
            },
          },
          required: ['tag'],
        },
      },
      {
        name: 'search_models_by_creator',
        description: 'Search for models by a specific creator',
        inputSchema: {
          type: 'object',
          properties: {
            username: { type: 'string', description: 'Creator username to search for' },
            limit: { type: 'number', description: 'Number of models to return (default: 20)', minimum: 1, maximum: 100 },
            sort: { 
              type: 'string', 
              enum: ['Highest Rated', 'Most Downloaded', 'Newest'],
              description: 'Sort order for results'
            },
          },
          required: ['username'],
        },
      },
      {
        name: 'get_models_by_type',
        description: 'Get models filtered by type (Checkpoint, LORA, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            type: { 
              type: 'string',
              enum: ['Checkpoint', 'TextualInversion', 'Hypernetwork', 'AestheticGradient', 'LORA', 'Controlnet', 'Poses'],
              description: 'Model type to filter by'
            },
            limit: { type: 'number', description: 'Number of models to return (default: 20)', minimum: 1, maximum: 100 },
            sort: { 
              type: 'string', 
              enum: ['Highest Rated', 'Most Downloaded', 'Newest'],
              description: 'Sort order for results'
            },
          },
          required: ['type'],
        },
      },
      {
        name: 'get_download_url',
        description: 'Get the download URL for a specific model version',
        inputSchema: {
          type: 'object',
          properties: {
            modelVersionId: { type: 'number', description: 'The ID of the model version to get download URL for' },
          },
          required: ['modelVersionId'],
        },
      },
    ];
  }

  private formatModelsResponse(response: any) {
    const models = response.items.map((model: any) => {
      const latestVersion = model.modelVersions[0];
      return {
        id: model.id,
        name: model.name,
        type: model.type,
        creator: model.creator.username,
        description: model.description.substring(0, 200) + (model.description.length > 200 ? '...' : ''),
        tags: model.tags.slice(0, 5), // Limit tags for readability
        nsfw: model.nsfw,
        stats: {
          downloads: model.stats?.downloadCount || 0,
          rating: model.stats?.rating || 0,
          favorites: model.stats?.favoriteCount || 0,
        },
        latestVersion: latestVersion ? {
          id: latestVersion.id,
          name: latestVersion.name,
          createdAt: latestVersion.createdAt,
          trainedWords: latestVersion.trainedWords,
        } : null,
      };
    });

    return {
      models,
      pagination: {
        currentPage: response.metadata.currentPage || 1,
        totalPages: response.metadata.totalPages || 1,
        totalItems: response.metadata.totalItems || models.length,
        hasNextPage: response.metadata.nextPage ? true : false,
      },
    };
  }

  private formatSingleModel(model: any) {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      type: model.type,
      creator: {
        username: model.creator.username,
        avatar: model.creator.image,
      },
      tags: model.tags,
      nsfw: model.nsfw,
      stats: model.stats,
      versions: model.modelVersions.map((version: any) => ({
        id: version.id,
        name: version.name,
        description: version.description,
        createdAt: version.createdAt,
        trainedWords: version.trainedWords,
        downloadUrl: version.downloadUrl,
        stats: version.stats,
        files: version.files.map((file: any) => ({
          sizeKb: file.sizeKb,
          format: file.metadata?.format,
          fp: file.metadata?.fp,
          primary: file.primary,
          scanStatus: {
            pickle: file.pickleScanResult,
            virus: file.virusScanResult,
          },
        })),
        imageCount: version.images.length,
      })),
    };
  }

  // Tool implementation methods
  private async searchModels(args: any) {
    const response = await this.client.getModels(args);
    const formatted = this.formatModelsResponse(response);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${formatted.pagination.totalItems} models:\\n\\n${formatted.models.map((model: any) => 
            `**${model.name}** (${model.type})\\n` +
            `Creator: ${model.creator}\\n` +
            `Downloads: ${model.stats.downloads.toLocaleString()} | Rating: ${model.stats.rating.toFixed(1)}\\n` +
            `Tags: ${model.tags.join(', ')}\\n` +
            `${model.description}\\n`
          ).join('\\n---\\n')}\\n\\nPage ${formatted.pagination.currentPage} of ${formatted.pagination.totalPages}`,
        },
      ],
    };
  }

  private async getModel(args: any) {
    const { modelId } = args;
    const model = await this.client.getModel(modelId);
    const formatted = this.formatSingleModel(model);
    
    return {
      content: [
        {
          type: 'text',
          text: `# ${formatted.name}\\n\\n` +
            `**Type:** ${formatted.type}\\n` +
            `**Creator:** ${formatted.creator.username}\\n` +
            `**Downloads:** ${formatted.stats.downloadCount?.toLocaleString() || 0}\\n` +
            `**Rating:** ${formatted.stats.rating?.toFixed(1) || 'N/A'} (${formatted.stats.ratingCount || 0} ratings)\\n` +
            `**NSFW:** ${formatted.nsfw ? 'Yes' : 'No'}\\n\\n` +
            `**Tags:** ${formatted.tags.join(', ')}\\n\\n` +
            `**Description:**\\n${formatted.description}\\n\\n` +
            `**Versions (${formatted.versions.length}):**\\n${formatted.versions.map((v: any) => 
              `- **${v.name}** (ID: ${v.id})\\n  ` +
              `Created: ${new Date(v.createdAt).toLocaleDateString()}\\n  ` +
              `Downloads: ${v.stats.downloadCount?.toLocaleString() || 0}\\n  ` +
              `Trained words: ${v.trainedWords.join(', ') || 'None'}\\n  ` +
              `Files: ${v.files.length} file(s)\\n`
            ).join('\\n')}`,
        },
      ],
    };
  }

  private async getModelVersion(args: any) {
    const { modelVersionId } = args;
    const version = await this.client.getModelVersion(modelVersionId);
    
    return {
      content: [
        {
          type: 'text',
          text: `# ${version.model.name} - ${version.name}\\n\\n` +
            `**Model Type:** ${version.model.type}\\n` +
            `**Version ID:** ${version.id}\\n` +
            `**Created:** ${new Date(version.createdAt).toLocaleDateString()}\\n` +
            `**Downloads:** ${version.stats.downloadCount?.toLocaleString() || 0}\\n` +
            `**Rating:** ${version.stats.rating?.toFixed(1) || 'N/A'}\\n\\n` +
            `**Trained Words:** ${version.trainedWords.join(', ') || 'None'}\\n\\n` +
            `**Description:**\\n${version.description}\\n\\n` +
            `**Files (${version.files?.length || 0}):**\\n${version.files?.map(file => 
              `- Size: ${file.sizeKb ? (file.sizeKb / 1024).toFixed(1) : 'Unknown'} MB\\n` +
              `  Format: ${file.metadata?.format || 'Unknown'}\\n` +
              `  FP: ${file.metadata?.fp || 'Unknown'}\\n` +
              `  Scans: Pickle=${file.pickleScanResult || 'Unknown'}, Virus=${file.virusScanResult || 'Unknown'}\\n`
            ).join('\\n') || 'No files available'}\\n` +
            `**Sample Images:** ${version.images.length} available`,
        },
      ],
    };
  }

  private async getModelVersionByHash(args: any) {
    const { hash } = args;
    const version = await this.client.getModelVersionByHash(hash);
    
    return {
      content: [
        {
          type: 'text',
          text: `# Model Found by Hash\\n\\n` +
            `**Model:** ${version.model.name}\\n` +
            `**Version:** ${version.name} (ID: ${version.id})\\n` +
            `**Type:** ${version.model.type}\\n` +
            `**Hash:** ${hash}\\n\\n` +
            `**Created:** ${new Date(version.createdAt).toLocaleDateString()}\\n` +
            `**Downloads:** ${version.stats.downloadCount?.toLocaleString() || 0}\\n` +
            `**Trained Words:** ${version.trainedWords.join(', ') || 'None'}\\n\\n` +
            `**Description:**\\n${version.description}`,
        },
      ],
    };
  }

  private async browseImages(args: any) {
    const response = await this.client.getImages(args);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${response.metadata.totalItems || response.items.length} images:\\n\\n${response.items.map(image => 
            `**Image ID:** ${image.id}\\n` +
            `**Creator:** ${image.username || 'Unknown'}\\n` +
            `**Dimensions:** ${image.width}x${image.height}\\n` +
            `**NSFW Level:** ${image.nsfwLevel || 'Unknown'}\\n` +
            `**Reactions:** ❤️ ${image.stats?.heartCount || 0} | 👍 ${image.stats?.likeCount || 0} | 💬 ${image.stats?.commentCount || 0}\\n` +
            `**URL:** ${image.url}\\n` +
            `**Created:** ${image.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Unknown'}\\n` +
            (image.meta ? `**Generation Info:** ${JSON.stringify(image.meta, null, 2).substring(0, 200)}...\\n` : '') +
            '\\n'
          ).join('---\\n')}\\nPage ${response.metadata.currentPage || 1}`,
        },
      ],
    };
  }

  private async getCreators(args: any) {
    const response = await this.client.getCreators(args);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${response.metadata.totalItems || response.items.length} creators:\\n\\n${response.items.map(creator => 
            `**${creator.username}**\\n` +
            `Models: ${creator.modelCount || 0}\\n` +
            (creator.link ? `Profile: ${creator.link}\\n` : '') +
            '\\n'
          ).join('---\\n')}\\nPage ${response.metadata.currentPage || 1} of ${response.metadata.totalPages || 1}`,
        },
      ],
    };
  }

  private async getTags(args: any) {
    const response = await this.client.getTags(args);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${response.metadata.totalItems || response.items.length} tags:\\n\\n${response.items.map(tag => 
            `**${tag.name}** (${tag.modelCount || 0} models)\\n`
          ).join('')}\\nPage ${response.metadata.currentPage || 1} of ${response.metadata.totalPages || 1}`,
        },
      ],
    };
  }

  private async getPopularModels(args: any) {
    const response = await this.client.getPopularModels(args.period, args.limit);
    const formatted = this.formatModelsResponse(response);
    
    return {
      content: [
        {
          type: 'text',
          text: `# Most Popular Models (${args.period || 'Week'})\\n\\n${formatted.models.map((model: any, index: number) => 
            `${index + 1}. **${model.name}** (${model.type})\\n` +
            `   Creator: ${model.creator}\\n` +
            `   Downloads: ${model.stats.downloads.toLocaleString()}\\n` +
            `   Rating: ${model.stats.rating.toFixed(1)} ⭐\\n\\n`
          ).join('')}`,
        },
      ],
    };
  }

  private async getLatestModels(args: any) {
    const response = await this.client.getLatestModels(args.limit);
    const formatted = this.formatModelsResponse(response);
    
    return {
      content: [
        {
          type: 'text',
          text: `# Latest Models\\n\\n${formatted.models.map((model: any) => 
            `**${model.name}** (${model.type})\\n` +
            `Creator: ${model.creator}\\n` +
            `Created: ${model.latestVersion ? new Date(model.latestVersion.createdAt).toLocaleDateString() : 'Unknown'}\\n` +
            `${model.description}\\n\\n`
          ).join('---\\n')}`,
        },
      ],
    };
  }

  private async getTopRatedModels(args: any) {
    const response = await this.client.getTopRatedModels(args.period, args.limit);
    const formatted = this.formatModelsResponse(response);
    
    return {
      content: [
        {
          type: 'text',
          text: `# Top Rated Models (${args.period || 'AllTime'})\\n\\n${formatted.models.map((model: any, index: number) => 
            `${index + 1}. **${model.name}** (${model.type})\\n` +
            `   Creator: ${model.creator}\\n` +
            `   Rating: ${model.stats.rating.toFixed(1)} ⭐ (${model.stats.downloads.toLocaleString()} downloads)\\n\\n`
          ).join('')}`,
        },
      ],
    };
  }

  private async searchModelsByTag(args: any) {
    const response = await this.client.searchModelsByTag(args.tag, args);
    const formatted = this.formatModelsResponse(response);
    
    return {
      content: [
        {
          type: 'text',
          text: `# Models tagged "${args.tag}"\\n\\n${formatted.models.map((model: any) => 
            `**${model.name}** (${model.type})\\n` +
            `Creator: ${model.creator}\\n` +
            `Downloads: ${model.stats.downloads.toLocaleString()} | Rating: ${model.stats.rating.toFixed(1)}\\n` +
            `${model.description}\\n\\n`
          ).join('---\\n')}`,
        },
      ],
    };
  }

  private async searchModelsByCreator(args: any) {
    const response = await this.client.searchModelsByCreator(args.username, args);
    const formatted = this.formatModelsResponse(response);
    
    return {
      content: [
        {
          type: 'text',
          text: `# Models by ${args.username}\\n\\n${formatted.models.map((model: any) => 
            `**${model.name}** (${model.type})\\n` +
            `Downloads: ${model.stats.downloads.toLocaleString()} | Rating: ${model.stats.rating.toFixed(1)}\\n` +
            `Tags: ${model.tags.join(', ')}\\n` +
            `${model.description}\\n\\n`
          ).join('---\\n')}`,
        },
      ],
    };
  }

  private async getModelsByType(args: any) {
    const response = await this.client.getModelsByType(args.type, args);
    const formatted = this.formatModelsResponse(response);
    
    return {
      content: [
        {
          type: 'text',
          text: `# ${args.type} Models\\n\\n${formatted.models.map((model: any) => 
            `**${model.name}**\\n` +
            `Creator: ${model.creator}\\n` +
            `Downloads: ${model.stats.downloads.toLocaleString()} | Rating: ${model.stats.rating.toFixed(1)}\\n` +
            `${model.description}\\n\\n`
          ).join('---\\n')}`,
        },
      ],
    };
  }

  private async getDownloadUrl(args: any) {
    const { modelVersionId } = args;
    const downloadUrl = this.client.getDownloadUrl(modelVersionId);
    
    return {
      content: [
        {
          type: 'text',
          text: `Download URL for model version ${modelVersionId}:\\n\\n${downloadUrl}\\n\\n` +
            `**Note:** Use \`wget "${downloadUrl}" --content-disposition\` to download with proper filename.\\n` +
            `If the model requires authentication, add your API key: \`?token=YOUR_API_KEY\``,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Civitai MCP server running on stdio');
  }
}

const server = new CivitaiMCPServer();
server.run().catch(console.error);
