#!/usr/bin/env node

/**
 * Cloudflare KV配置验证脚本
 * 用于确保Cloudflare Workers的KV存储正确配置
 */

const https = require('https');

const CONFIG = {
  // 生产环境
  BASE_URL: 'https://kemono-shares-api.y2983236233.workers.dev',
  // 本地测试
  // BASE_URL: 'http://localhost:3000',
};

async function fetchWithTimeout(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'FuryCode-KV-Debug/1.0'
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function verifyKVConfiguration() {
  console.log('🔧 Cloudflare KV配置验证开始...\n');
  
  const results = {
    kvAccessible: false,
    shareCreation: false,
    galleryFiltering: false,
    environmentDetected: false
  };
  
  try {
    // 1. 检查Cloudflare Workers环境识别
    console.log('🔍 步骤1: 检查Cloudflare Workers环境...');
    const envResponse = await fetchWithTimeout(`${CONFIG.BASE_URL}/api/share/monitor`);
    
    if (envResponse.ok) {
      const envData = await envResponse.json();
      console.log('✅ 环境状态:', {
        isWorkers: envData.environment?.isWorkers,
        hasKV: envData.environment?.hasKV,
        storageSize: envData.storage?.size,
        memoryCache: envData.storage?.memoryCacheSize
      });
      
      results.environmentDetected = envData.environment?.isWorkers || false;
      results.kvAccessible = envData.environment?.hasKV || false;
    } else {
      console.log('⚠️ 环境监控API响应异常:', envResponse.status);
    }
    
    // 2. 创建测试文生图分享
    console.log('\n🎯 步骤2: 创建测试文生图分享...');
    const testData = {
      generatedUrl: 'https://example.com/test-text-to-image.png',
      originalUrl: null, // 文生图模式
      prompt: '测试用文生图分享',
      style: 'テスト文生图',
      timestamp: Date.now()
    };
    
    const createResponse = await fetchWithTimeout(`${CONFIG.BASE_URL}/api/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log('✅ 分享创建成功:', {
        shareId: createResult.shareId,
        shareUrl: createResult.shareUrl,
        generationType: createResult.generationType
      });
      results.shareCreation = true;
      
      // 3. 验证文生图过滤
      console.log('\n📊 步骤3: 验证文生图过滤...');
      const galleryResponse = await fetchWithTimeout(`${CONFIG.BASE_URL}/api/share/list?debug=true`);
      
      if (galleryResponse.ok) {
        const galleryData = await galleryResponse.json();
        
        const textToImageItems = galleryData.data?.items?.filter(item => 
          !item.originalUrl || item.originalUrl === null || item.originalUrl === 'null' || item.generationType === 'text2img'
        );
        
        console.log('📈 画廊统计:', {
          totalItems: galleryData.data?.total || 0,
          textToImageItems: textToImageItems?.length || 0,
          textToImagePercentage: Math.round(((textToImageItems?.length || 0) / (galleryData.data?.total || 1)) * 100) + '%'
        });
        
        results.galleryFiltering = textToImageItems?.length > 0;
        
        // 4. 检查最新的文生图项目
        if (textToImageItems?.length > 0) {
          const latestTextToImage = textToImageItems[0];
          console.log('🎯 最新文生图项目:', {
            id: latestTextToImage.id,
            style: latestTextToImage.style,
            originalUrl: latestTextToImage.originalUrl,
            generationType: latestTextToImage.generationType
          });
        }
      }
    } else {
      console.error('❌ 分享创建失败:', createResponse.status, await createResponse.text());
    }
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
  
  // 5. 生成报告
  console.log('\n📋 === Cloudflare KV验证报告 ===');
  console.log(`环境检测: ${results.environmentDetected ? '✅ 正常' : '❌ 异常'}`);
  console.log(`KV存储: ${results.kvAccessible ? '✅ 可访问' : '❌ 不可访问'}`);
  console.log(`分享创建: ${results.shareCreation ? '✅ 成功' : '❌ 失败'}`);
  console.log(`文生图过滤: ${results.galleryFiltering ? '✅ 正常' : '❌ 异常'}`);
  
  const overallStatus = results.environmentDetected && results.kvAccessible && results.shareCreation && results.galleryFiltering;
  
  console.log(`\n🎯 总体状态: ${overallStatus ? '✅ 配置正常' : '❌ 需要修复'}`);
  
  if (!overallStatus) {
    console.log('\n🔧 修复建议:');
    if (!results.environmentDetected) {
      console.log('1. 在Cloudflare Workers环境变量中添加 CF_WORKER=true');
    }
    if (!results.kvAccessible) {
      console.log('2. 在Cloudflare Workers设置中配置KV绑定');
      console.log('   - 创建新的KV命名空间');
      console.log('   - 在Workers设置中绑定到 SHARE_DATA_KV');
    }
    if (!results.shareCreation) {
      console.log('3. 检查API权限和网络连接');
    }
    if (!results.galleryFiltering) {
      console.log('4. 检查文生图检测逻辑');
    }
  }
  
  return results;
}

// 运行验证
if (require.main === module) {
  console.log('🚀 Cloudflare KV配置验证工具');
  console.log('=================================\n');
  
  if (process.argv.includes('--run')) {
    verifyKVConfiguration().catch(console.error);
  } else {
    console.log('使用方法:');
    console.log('  node verify-cloudflare-kv.js --run');
    console.log('\n这个脚本将验证:');
    console.log('1. Cloudflare Workers环境识别');
    console.log('2. KV存储可访问性');
    console.log('3. 文生图分享创建');
    console.log('4. 文生图在画廊中的显示');
    console.log('');
    console.log('手动验证命令:');
    console.log(`  curl "${CONFIG.BASE_URL}/api/share/monitor"`);
    console.log(`  curl "${CONFIG.BASE_URL}/api/share/list?debug=true"`);
  }
}

module.exports = { verifyKVConfiguration };