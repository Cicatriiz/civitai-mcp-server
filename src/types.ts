import { z } from 'zod';

// Enums
export const NSFWLevel = z.enum(['None', 'Soft', 'Mature', 'X']);
export const ModelType = z.enum([
  'Checkpoint',
  'TextualInversion', 
  'Hypernetwork',
  'AestheticGradient',
  'LORA',
  'Controlnet',
  'Poses'
]);

export const ModelMode = z.enum(['Archived', 'TakenDown']).nullable().optional();
export const SortOrder = z.enum(['Highest Rated', 'Most Downloaded', 'Newest']);  
export const TimePeriod = z.enum(['AllTime', 'Year', 'Month', 'Week', 'Day']);
export const ImageSort = z.enum(['Most Reactions', 'Most Comments', 'Newest']);
export const CommercialUse = z.enum(['None', 'Image', 'Rent', 'Sell']);
export const FileFormat = z.enum(['SafeTensor', 'PickleTensor', 'Other']);
export const FileSize = z.enum(['full', 'pruned']);
export const FloatingPoint = z.enum(['fp16', 'fp32', 'bf16']); // Added bf16

// Base schemas - API has inconsistent metadata structure
export const MetadataSchema = z.object({
  totalItems: z.number().optional(),
  currentPage: z.number().optional(), 
  pageSize: z.number().optional(),
  totalPages: z.number().optional(),
  nextPage: z.string().optional(),
  prevPage: z.string().optional(),
  nextCursor: z.union([z.number(), z.string()]).optional(), // Sometimes string, sometimes number
});

export const StatsSchema = z.object({
  downloadCount: z.number().optional(),
  favoriteCount: z.number().optional(),
  commentCount: z.number().optional(),
  ratingCount: z.number().optional(),
  rating: z.number().optional(),
  cryCount: z.number().optional(),
  laughCount: z.number().optional(),
  likeCount: z.number().optional(),
  heartCount: z.number().optional(),
  dislikeCount: z.number().optional(),
});

export const CreatorSchema = z.object({
  username: z.string(),
  image: z.string().nullable().optional(),
  modelCount: z.number().optional(),
  link: z.string().optional(),
});

export const FileMetadataSchema = z.object({
  fp: FloatingPoint.nullable().optional(),
  size: FileSize.nullable().optional(),
  format: FileFormat.nullable().optional(),
}).optional();

export const ModelFileSchema = z.object({
  sizeKb: z.number().optional(),
  pickleScanResult: z.string().optional(),
  virusScanResult: z.string().optional(),
  scannedAt: z.string().nullable().optional(),
  primary: z.boolean().optional(),
  metadata: FileMetadataSchema,
});

export const ImageSchema = z.object({
  id: z.number().optional(), // Some API responses don't include ID
  url: z.string(),
  hash: z.string(),
  width: z.number(),
  height: z.number(),
  nsfw: z.boolean().optional(),
  nsfwLevel: z.union([NSFWLevel, z.number()]).optional(), // API sometimes returns numbers
  createdAt: z.string().optional(),
  postId: z.number().optional(),
  stats: StatsSchema.optional(),
  meta: z.record(z.any()).nullable().optional(),
  username: z.string().optional(),
  modelVersionIds: z.array(z.number()).optional(),
  type: z.string().optional(),
  browsingLevel: z.number().optional(),
});

export const ModelVersionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  downloadUrl: z.string().optional(),
  trainedWords: z.array(z.string()).optional(),
  files: z.array(ModelFileSchema).optional(),
  images: z.array(ImageSchema).optional(),
  stats: StatsSchema.optional(),
  index: z.number().optional(),
  baseModel: z.string().optional(),
});

export const ModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  type: ModelType,
  nsfw: z.boolean(),
  tags: z.array(z.string()),
  mode: ModelMode,
  creator: CreatorSchema,
  stats: StatsSchema.optional(),
  modelVersions: z.array(ModelVersionSchema),
  poi: z.boolean().optional(),
});

export const TagSchema = z.object({
  name: z.string(),
  modelCount: z.number().optional(),
  link: z.string().optional(),
});

// API Response schemas
export const ModelsResponseSchema = z.object({
  items: z.array(ModelSchema),
  metadata: MetadataSchema,
});

export const ImagesResponseSchema = z.object({
  items: z.array(ImageSchema),
  metadata: MetadataSchema,
});

export const CreatorsResponseSchema = z.object({
  items: z.array(CreatorSchema),
  metadata: MetadataSchema,
});

export const TagsResponseSchema = z.object({
  items: z.array(TagSchema),
  metadata: MetadataSchema,
});

export const ModelVersionResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  model: z.object({
    name: z.string(),
    type: ModelType,
    nsfw: z.boolean(),
    poi: z.boolean().optional(),
    mode: ModelMode,
  }),
  modelId: z.number(),
  createdAt: z.string(),
  downloadUrl: z.string(),
  trainedWords: z.array(z.string()),
  files: z.array(ModelFileSchema),
  stats: StatsSchema,
  images: z.array(ImageSchema),
});

// Type exports
export type Model = z.infer<typeof ModelSchema>;
export type ModelVersion = z.infer<typeof ModelVersionSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type Creator = z.infer<typeof CreatorSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type ModelsResponse = z.infer<typeof ModelsResponseSchema>;
export type ImagesResponse = z.infer<typeof ImagesResponseSchema>;
export type CreatorsResponse = z.infer<typeof CreatorsResponseSchema>;
export type TagsResponse = z.infer<typeof TagsResponseSchema>;
export type ModelVersionResponse = z.infer<typeof ModelVersionResponseSchema>;
