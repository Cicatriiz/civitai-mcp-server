#!/usr/bin/env node

import { CivitaiClient } from './dist/civitai-client.js';

async function runTest(testName, testFn) {
  try {
    console.log(`\n🧪 Testing ${testName}...`);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Test timeout after 5 seconds')), 5000)
    );
    
    await Promise.race([testFn(), timeoutPromise]);
    console.log(`✅ ${testName} passed`);
  } catch (error) {
    console.error(`❌ ${testName} failed:`, error.message);
    return false;
  }
  return true;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function comprehensiveTest() {
  console.log('🚀 Starting Comprehensive Civitai MCP Server Test\n');
  console.log('=' .repeat(60));
  
  const client = new CivitaiClient();
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Get Tags
  totalTests++;
  if (await runTest('Get Tags', async () => {
    const tags = await client.getTags({ limit: 3 });
    console.log(`   Found ${tags.items.length} tags`);
    if (tags.items.length > 0) {
      console.log(`   Sample tags: ${tags.items.map(t => t.name).join(', ')}`);
    }
    if (tags.items.length === 0) throw new Error('No tags returned');
  })) passedTests++;
  await delay(500);

  // Test 2: Get Creators
  totalTests++;
  if (await runTest('Get Creators', async () => {
    const creators = await client.getCreators({ limit: 3 });
    console.log(`   Found ${creators.items.length} creators`);
    if (creators.items.length > 0) {
      const creator = creators.items[0];
      console.log(`   Top creator: ${creator.username} (${creator.modelCount || 0} models)`);
    }
    if (creators.items.length === 0) throw new Error('No creators returned');
  })) passedTests++;
  await delay(500);

  // Test 3: Search Models (basic)
  totalTests++;
  if (await runTest('Search Models (basic)', async () => {
    const models = await client.getModels({ limit: 2 });
    console.log(`   Found ${models.metadata.totalItems} total models, showing ${models.items.length}`);
    if (models.items.length > 0) {
      const model = models.items[0];
      console.log(`   First model: "${model.name}" by ${model.creator.username}`);
      console.log(`   Type: ${model.type}, NSFW: ${model.nsfw}`);
    }
    if (models.items.length === 0) throw new Error('No models returned');
  })) passedTests++;

  // Test 4: Search Models by Type
  totalTests++;
  if (await runTest('Search Models by Type (LORA)', async () => {
    const models = await client.getModelsByType('LORA', { limit: 2 });
    console.log(`   Found ${models.items.length} LORA models`);
    if (models.items.length > 0) {
      const model = models.items[0];
      console.log(`   Sample LORA: "${model.name}" by ${model.creator.username}`);
    }
    // LORA models might be less common, so don't fail if none found
  })) passedTests++;

  // Test 5: Get Specific Model Details
  totalTests++;
  if (await runTest('Get Specific Model Details', async () => {
    // Use a well-known model ID (this is a popular model that should exist)
    const modelId = 4201; // This is usually a stable/popular model
    try {
      const model = await client.getModel(modelId);
      console.log(`   Model: "${model.name}" by ${model.creator.username}`);
      console.log(`   Versions: ${model.modelVersions.length}`);
      console.log(`   Tags: ${model.tags.slice(0, 3).join(', ')}`);
      if (model.modelVersions.length > 0) {
        const version = model.modelVersions[0];
        console.log(`   Latest version: ${version.name} (ID: ${version.id})`);
      }
    } catch (error) {
      // Try a different approach - get models and pick the first one
      console.log('   Fallback: Getting any available model...');
      const models = await client.getModels({ limit: 1 });
      if (models.items.length > 0) {
        const modelId = models.items[0].id;
        const model = await client.getModel(modelId);
        console.log(`   Fallback model: "${model.name}" (ID: ${modelId})`);
      } else {
        throw new Error('Could not retrieve any model');
      }
    }
  })) passedTests++;

  // Test 6: Browse Images
  totalTests++;
  if (await runTest('Browse Images', async () => {
    const images = await client.getImages({ limit: 2, nsfw: false });
    console.log(`   Found ${images.metadata.totalItems || images.items.length} total images, showing ${images.items.length}`);
    if (images.items.length > 0) {
      const image = images.items[0];
      console.log(`   Sample image: ${image.width}x${image.height} by ${image.username || 'Unknown'}`);
      console.log(`   NSFW Level: ${image.nsfwLevel || 'Unknown'}`);
    }
    if (images.items.length === 0) throw new Error('No images returned');
  })) passedTests++;

  // Test 7: Search Models with Query
  totalTests++;
  if (await runTest('Search Models with Query', async () => {
    const models = await client.searchModels('anime', { limit: 2 });
    console.log(`   Found ${models.metadata.totalItems} anime-related models, showing ${models.items.length}`);
    if (models.items.length > 0) {
      const model = models.items[0];
      console.log(`   Sample result: "${model.name}"`);
    }
    // Search might return 0 results depending on the query, so don't fail
  })) passedTests++;

  // Test 8: Get Popular Models
  totalTests++;
  if (await runTest('Get Popular Models', async () => {
    const models = await client.getPopularModels('Week', 2);
    console.log(`   Found ${models.items.length} popular models this week`);
    if (models.items.length > 0) {
      const model = models.items[0];
      console.log(`   Most popular: "${model.name}" (${model.stats?.downloadCount || 0} downloads)`);
    }
    if (models.items.length === 0) throw new Error('No popular models returned');
  })) passedTests++;

  // Test 9: Get Latest Models  
  totalTests++;
  if (await runTest('Get Latest Models', async () => {
    const models = await client.getLatestModels(2);
    console.log(`   Found ${models.items.length} latest models`);
    if (models.items.length > 0) {
      const model = models.items[0];
      console.log(`   Latest: "${model.name}" by ${model.creator.username}`);
    }
    if (models.items.length === 0) throw new Error('No latest models returned');
  })) passedTests++;

  // Test 10: Get Download URL
  totalTests++;
  if (await runTest('Get Download URL', async () => {
    // First get a model with versions
    const models = await client.getModels({ limit: 1 });
    if (models.items.length > 0 && models.items[0].modelVersions.length > 0) {
      const versionId = models.items[0].modelVersions[0].id;
      const downloadUrl = client.getDownloadUrl(versionId);
      console.log(`   Generated download URL for version ${versionId}`);
      console.log(`   URL: ${downloadUrl.substring(0, 50)}...`);
      if (!downloadUrl.includes('civitai.com')) {
        throw new Error('Invalid download URL format');
      }
    } else {
      throw new Error('No model versions available for download URL test');
    }
  })) passedTests++;

  // Final Results
  console.log('\n' + '='.repeat(60));
  console.log(`🏁 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The Civitai MCP server is working perfectly!');
    console.log('\n📋 Available MCP Tools:');
    console.log('  • search_models - Search models with filters');
    console.log('  • get_model - Get detailed model information');
    console.log('  • get_model_version - Get version details');
    console.log('  • get_model_version_by_hash - Find model by hash');
    console.log('  • browse_images - Browse AI-generated images');
    console.log('  • get_creators - Browse model creators');
    console.log('  • get_tags - Browse available tags');
    console.log('  • get_popular_models - Get most downloaded models');
    console.log('  • get_latest_models - Get newest models');
    console.log('  • get_top_rated_models - Get highest rated models');
    console.log('  • search_models_by_tag - Search by specific tag');
    console.log('  • search_models_by_creator - Search by creator');
    console.log('  • get_models_by_type - Filter by model type');
    console.log('  • get_download_url - Get download URLs');
    
    console.log('\n🔧 To use with Claude Desktop, add this to your MCP config:');
    console.log(JSON.stringify({
      "mcpServers": {
        "civitai": {
          "command": "node",
          "args": [`${process.cwd()}/dist/index.js`],
          "env": {
            "CIVITAI_API_KEY": "your_api_key_here_optional"
          }
        }
      }
    }, null, 2));
  } else {
    console.log(`⚠️  Some tests failed. The server may have limited functionality.`);
    console.log('   This could be due to API rate limiting or temporary issues.');
  }
}

comprehensiveTest().catch(console.error);
