#!/usr/bin/env node

/**
 * 文生图调试脚本
 * 用于验证文生图模式在画廊中的显示
 */

const https = require('https');

// 配置
const BASE_URL = 'https://kemono-shares-api.y2983236233.workers.dev';
// 或者使用本地测试
// const BASE_URL = 'http://localhost:3000';

async function testTextToImageGallery() {
  console.log('🎨 开始文生图画廊调试...\n');
  
  try {
    // 1. 测试文生图分享创建
    console.log('📋 步骤1: 创建文生图分享...');
    const shareData = {
      generatedUrl: 'https://tempfile.aiquickdraw.com/s/test-text-to-image-001.png',
      originalUrl: null, // 这是文生图模式的关键
      prompt: 'かわいいアニメ少女、青い髪、大きな瞳、微笑んでいる',
      style: 'テキスト→画像',
      timestamp: Date.now()
    };
    
    const createResponse = await fetch(`${BASE_URL}/api/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shareData)
    });
    
    const createResult = await createResponse.json();
    console.log('✅ 分享创建结果:', {
      success: createResult.success,
      shareId: createResult.shareId,
      shareUrl: createResult.shareUrl,
      generationType: createResult.generationType
    });
    
    // 2. 测试画廊列表
    console.log('\n📋 步骤2: 检查文生图画廊显示...');
    const listResponse = await fetch(`${BASE_URL}/api/share/list?debug=true`);
    const listResult = await listResponse.json();
    
    console.log('📊 画廊数据:', {
      totalItems: listResult.data?.total || 0,
      textToImageItems: listResult.data?.items?.length || 0,
      sampleItems: listResult.data?.items?.slice(0, 3).map(item => ({
        id: item.id,
        title: item.title,
        generationType: item.generationType,
        originalUrl: item.originalUrl
      }))
    });
    
    // 3. 检查文生图过滤
    if (listResult.data?.items) {
      const textToImageItems = listResult.data.items.filter(item => 
        !item.originalUrl || item.originalUrl === null || item.originalUrl === 'null'
      );
      console.log('\n🎯 文生图项目统计:', {
        totalInGallery: listResult.data.items.length,
        textToImageCount: textToImageItems.length,
        percentage: Math.round((textToImageItems.length / listResult.data.items.length) * 100) + '%'
      });
    }
    
    // 4. 检查Cloudflare Workers环境
    console.log('\n🔍 步骤3: 检查Cloudflare环境...');
    const envResponse = await fetch(`${BASE_URL}/api/share/monitor`);
    const envResult = await envResponse.json();
    console.log('🌐 环境状态:', {
      isCloudflareWorkers: envResult.environment?.isWorkers,
      hasKV: envResult.environment?.hasKV,
      storageSize: envResult.storage?.size
    });
    
    // 5. 验证分享详情
    if (createResult.shareId) {
      console.log('\n📋 步骤4: 验证分享详情...');
      const detailResponse = await fetch(`${BASE_URL}/api/share/${createResult.shareId}`);
      const detailResult = await detailResponse.json();
      
      if (detailResult.success) {
        console.log('✅ 分享详情验证:', {
          id: detailResult.data.id,
          style: detailResult.data.style,
          originalUrl: detailResult.data.originalUrl,
          isTextToImage: detailResult.data.isTextToImage,
          generationType: detailResult.data.generationType
        });
      }
    }
    
  } catch (error) {
    console.error('❌ 调试失败:', error.message);
  }
}

// 运行调试
console.log('🚀 FuryCode 文生图画廊调试工具\n');
console.log('这个脚本将帮助你验证：');
console.log('1. 文生图分享能否被正确创建');
console.log('2. 文生图图片是否显示在画廊中');
console.log('3. Cloudflare KV存储是否正常工作\n');

// 等待用户确认
if (process.argv.includes('--run')) {
  testTextToImageGallery();
} else {
  console.log('使用方法:');
  console.log('  node debug-text-to-image.js --run');
  console.log('\n或者直接访问以下URL进行测试:');
  console.log(`  ${BASE_URL}/api/share/list`);
}