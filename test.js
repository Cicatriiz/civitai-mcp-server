#!/usr/bin/env node

import { CivitaiClient } from './dist/civitai-client.js';

async function test() {
  console.log('Testing Civitai MCP Server...');
  
  const client = new CivitaiClient();
  
  try {
    // Test getting tags first - simpler endpoint
    console.log('Testing tags endpoint...');
    const tags = await client.getTags({ limit: 5 });
    console.log(`✅ Found ${tags.items.length} tags`);
    
    if (tags.items.length > 0) {
      console.log(`   First tag: "${tags.items[0].name}"`);
    }
    
    console.log('✅ Basic API connection successful! MCP server should work correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

test();
