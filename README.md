# Civitai MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to Civitai's vast collection of AI models, creators, and generated content. Browse, search, and discover AI models seamlessly through your favorite MCP-compatible AI assistant.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Features

### 🔍 **Model Discovery**
- **Advanced Search**: Find AI models with flexible filtering by type, creator, tags, and more
- **Browse Categories**: Explore models by type (Checkpoints, LoRA, ControlNet, etc.)
- **Popular & Trending**: Discover the most downloaded and highest-rated models
- **Latest Models**: Stay up-to-date with newly uploaded models
- **Hash Lookup**: Find models by file hash for verification

### 👨‍💻 **Creator & Community**
- **Creator Profiles**: Browse and search for model creators
- **Creator Collections**: View all models from specific creators
- **Tag System**: Explore models through Civitai's comprehensive tagging system

### 🖼️ **Generated Content**
- **Image Gallery**: Browse AI-generated images with detailed metadata
- **Generation Parameters**: Access prompt, settings, and model information
- **Community Showcase**: Discover inspiring creations from the community

### 📊 **Model Intelligence**
- **Detailed Model Info**: Complete model specifications, versions, and files
- **Version History**: Track model updates and improvements
- **Download URLs**: Direct access to model downloads with authentication support
- **Content Safety**: Access scan results for pickle and virus safety

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Civitai API key (optional, but recommended for higher rate limits)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/Cicatriiz/civitai-mcp-server.git
cd civitai-mcp-server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the server:**
```bash
npm run build
```

4. **Set up your API key (optional):**
```bash
export CIVITAI_API_KEY="your_api_key_here"
```

5. **Run the server:**
```bash
npm start
```

### Getting a Civitai API Key

1. Visit [Civitai API Keys](https://civitai.com/user/account)
2. Log in to your Civitai account
3. Generate a new API key
4. Copy the key and set it as an environment variable

## Configuration

### MCP Client Setup

Add the server to your MCP client configuration:

#### Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "civitai": {
      "command": "node",
      "args": ["/path/to/civitai-mcp-server/dist/index.js"],
      "env": {
        "CIVITAI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Other MCP Clients
Configure according to your client's documentation, using:
- **Command**: `node /path/to/civitai-mcp-server/dist/index.js`
- **Transport**: stdio
- **Environment**: `CIVITAI_API_KEY=your_key`

## Usage Examples

### Basic Model Search
```
Search for SDXL LoRA models related to anime:
- Tool: search_models
- Query: "anime"
- Types: ["LORA"]
- BaseModels: ["SDXL 1.0"]
```

### Find Popular Models
```
Get the most downloaded models this week:
- Tool: get_popular_models
- Period: "Week"
- Limit: 10
```

### Model Details
```
Get comprehensive information about a specific model:
- Tool: get_model
- ModelId: 12345
```

### Browse Generated Images
```
Explore recent AI-generated images:
- Tool: browse_images
- Sort: "Newest"
- Limit: 50
- NSFW: "None"
```

## Available Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `search_models` | Search models with filters | `query`, `types`, `sort`, `baseModels` |
| `get_model` | Get detailed model info | `modelId` |
| `get_model_version` | Get version details | `modelVersionId` |
| `get_model_version_by_hash` | Find model by file hash | `hash` |
| `browse_images` | Browse generated images | `sort`, `period`, `modelId` |
| `get_creators` | Search creators | `query`, `limit` |
| `get_tags` | Browse model tags | `query`, `limit` |
| `get_popular_models` | Most popular models | `period`, `limit` |
| `get_latest_models` | Newest models | `limit` |
| `get_top_rated_models` | Highest rated models | `period`, `limit` |
| `search_models_by_tag` | Models with specific tag | `tag`, `sort` |
| `search_models_by_creator` | Models by creator | `username`, `sort` |
| `get_models_by_type` | Filter by model type | `type`, `sort` |
| `get_download_url` | Get model download URL | `modelVersionId` |

## API Reference

### Model Types
- `Checkpoint` - Full Stable Diffusion models
- `LORA` - Low-Rank Adaptation models
- `TextualInversion` - Embedding models
- `Hypernetwork` - Hypernetwork models
- `ControlNet` - ControlNet models
- `AestheticGradient` - Aesthetic gradient models
- `Poses` - Pose models

### Sort Options
- `Highest Rated` - Best community ratings
- `Most Downloaded` - Most popular downloads
- `Newest` - Recently uploaded

### Time Periods
- `AllTime` - No time restriction
- `Year` - Past 12 months
- `Month` - Past 30 days
- `Week` - Past 7 days
- `Day` - Past 24 hours

## API Coverage

This MCP server implements all major Civitai API v1 endpoints:

- ✅ `/api/v1/models` - List and search models
- ✅ `/api/v1/models/:id` - Get specific model
- ✅ `/api/v1/model-versions/:id` - Get model version
- ✅ `/api/v1/model-versions/by-hash/:hash` - Get version by hash
- ✅ `/api/v1/images` - Browse images
- ✅ `/api/v1/creators` - List creators
- ✅ `/api/v1/tags` - List tags
- ✅ Download URLs with authentication support

## Model Types Supported

- **Checkpoint**: Full Stable Diffusion models
- **LORA**: Low-Rank Adaptation models
- **TextualInversion**: Textual inversion embeddings
- **Hypernetwork**: Hypernetwork models
- **AestheticGradient**: Aesthetic gradient models
- **Controlnet**: ControlNet models
- **Poses**: Pose models

## Content Filtering

The server supports Civitai's content filtering system:
- NSFW content levels (None, Soft, Mature, X)
- Commercial use permissions
- Model licensing options

## Error Handling

The server includes comprehensive error handling for:
- API rate limiting
- Network connectivity issues
- Invalid parameters
- Authentication errors
- Data validation

## Development

### Project Structure
```
civitai-mcp-server/
├── src/
│   ├── index.ts          # Main server implementation
│   ├── civitai-client.ts # Civitai API client
│   └── types.ts          # TypeScript type definitions
├── dist/                 # Compiled JavaScript output
├── tests/                # Test files
└── docs/                 # Additional documentation
```

### Building from Source
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Development mode with hot reload
npm run dev
```

### Testing
```bash
# Run comprehensive test suite
npm test

# Test specific endpoints
node test.js
node comprehensive-test.js
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Limitations

- **Rate Limiting**: Civitai API has rate limits. Use an API key for higher limits.
- **NSFW Content**: Some content may be filtered based on your account settings.
- **Model Availability**: Some models may be temporarily unavailable or require authentication.

## Troubleshooting

### Common Issues

**Server won't start:**
- Ensure Node.js 18+ is installed
- Check that all dependencies are installed (`npm install`)
- Verify the build completed successfully (`npm run build`)

**API rate limiting:**
- Get a Civitai API key and set the `CIVITAI_API_KEY` environment variable
- Reduce request frequency if experiencing limits

**Models not found:**
- Check model ID accuracy
- Verify the model hasn't been removed or made private
- Ensure proper spelling in search queries

## License

MIT License - see LICENSE file for details

## Related Projects

- [Model Context Protocol](https://github.com/modelcontextprotocol/specification) - The MCP specification
- [Civitai](https://civitai.com) - The AI model sharing platform
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - Official MCP server implementations

## Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Cicatriiz/civitai-mcp-server/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Cicatriiz/civitai-mcp-server/discussions)
- 📚 **Documentation**: [Civitai API Reference](https://github.com/civitai/civitai/wiki/REST-API-Reference)
- 🔧 **MCP Documentation**: [Model Context Protocol](https://modelcontextprotocol.io/)
