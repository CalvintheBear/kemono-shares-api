#!/usr/bin/env node

/**
 * 生产环境配置检查脚本
 * 用于验证部署前的配置是否正确
 */

const https = require('https');
const http = require('http');

// 配置检查项
const configChecks = {
  // 环境变量检查
  environment: {
    NODE_ENV: process.env.NODE_ENV,
    CF_WORKER: process.env.CF_WORKER,
    KV_NAMESPACE_ID: process.env.KV_NAMESPACE_ID,
    CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
    CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME: process.env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME,
    KIE_AI_API_KEY: process.env.KIE_AI_API_KEY,
    KIE_AI_USER_ID: process.env.KIE_AI_USER_ID
  },

  // API端点检查
  endpoints: [
    'https://kemono-shares-api.y2983236233.workers.dev/api/test-env',
    'https://kemono-shares-api.y2983236233.workers.dev/api/share/monitor',
    'https://kemono-shares-api.y2983236233.workers.dev/api/check-r2-config',
    'https://kemono-shares-api.y2983236233.workers.dev/api/check-afterimage-r2-config'
  ],

  // R2存储检查
  r2Buckets: [
    'https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev',
    'https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev'
  ]
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(50)}`, 'cyan');
  log(title, 'bright');
  log(`${'='.repeat(50)}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// 检查环境变量
function checkEnvironmentVariables() {
  logSection('环境变量检查');
  
  const requiredVars = [
    'NODE_ENV',
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME',
    'KIE_AI_API_KEY',
    'KIE_AI_USER_ID'
  ];

  const optionalVars = [
    'CF_WORKER',
    'KV_NAMESPACE_ID'
  ];

  let allRequiredPresent = true;

  // 检查必需变量
  for (const varName of requiredVars) {
    const value = configChecks.environment[varName];
    if (value) {
      if (varName.includes('KEY') || varName.includes('SECRET')) {
        logSuccess(`${varName}: ${value.substring(0, 8)}...`);
      } else {
        logSuccess(`${varName}: ${value}`);
      }
    } else {
      logError(`${varName}: 未设置`);
      allRequiredPresent = false;
    }
  }

  // 检查可选变量
  for (const varName of optionalVars) {
    const value = configChecks.environment[varName];
    if (value) {
      logInfo(`${varName}: ${value}`);
    } else {
      logWarning(`${varName}: 未设置（可选）`);
    }
  }

  return allRequiredPresent;
}

// 检查API端点
async function checkEndpoints() {
  logSection('API端点检查');
  
  const results = [];
  
  for (const endpoint of configChecks.endpoints) {
    try {
      const result = await checkEndpoint(endpoint);
      results.push({ endpoint, ...result });
      
      if (result.success) {
        logSuccess(`${endpoint}: ${result.status} - ${result.responseTime}ms`);
      } else {
        logError(`${endpoint}: ${result.error}`);
      }
    } catch (error) {
      logError(`${endpoint}: ${error.message}`);
      results.push({ endpoint, success: false, error: error.message });
    }
  }

  return results;
}

// 检查单个端点
function checkEndpoint(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      const success = res.statusCode >= 200 && res.statusCode < 300;
      
      resolve({
        success,
        status: res.statusCode,
        responseTime,
        headers: res.headers
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout'
      });
    });
  });
}

// 检查R2存储
async function checkR2Storage() {
  logSection('R2存储检查');
  
  const results = [];
  
  for (const bucketUrl of configChecks.r2Buckets) {
    try {
      const result = await checkEndpoint(bucketUrl);
      results.push({ bucketUrl, ...result });
      
      if (result.success) {
        logSuccess(`${bucketUrl}: 可访问`);
      } else {
        logError(`${bucketUrl}: ${result.error}`);
      }
    } catch (error) {
      logError(`${bucketUrl}: ${error.message}`);
      results.push({ bucketUrl, success: false, error: error.message });
    }
  }

  return results;
}

// 检查KV存储
async function checkKVStorage() {
  logSection('KV存储检查');
  
  try {
    const monitorUrl = 'https://kemono-shares-api.y2983236233.workers.dev/api/share/monitor';
    const result = await checkEndpoint(monitorUrl);
    
    if (result.success) {
      logSuccess('KV存储监控端点可访问');
      logInfo('请访问监控端点查看详细KV状态');
    } else {
      logError(`KV存储检查失败: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    logError(`KV存储检查失败: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// 生成检查报告
function generateReport(envCheck, endpointsCheck, r2Check, kvCheck) {
  logSection('检查报告');
  
  const totalChecks = 1 + endpointsCheck.length + r2Check.length + 1;
  const passedChecks = [
    envCheck,
    ...endpointsCheck.filter(r => r.success),
    ...r2Check.filter(r => r.success),
    kvCheck.success
  ].filter(Boolean).length;
  
  const successRate = ((passedChecks / totalChecks) * 100).toFixed(1);
  
  log(`总检查项: ${totalChecks}`, 'bright');
  log(`通过检查: ${passedChecks}`, 'green');
  log(`失败检查: ${totalChecks - passedChecks}`, 'red');
  log(`成功率: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');
  
  if (successRate >= 90) {
    log('\n🎉 生产环境配置检查通过！', 'green');
    log('✅ 可以安全部署到生产环境', 'green');
  } else if (successRate >= 70) {
    log('\n⚠️ 生产环境配置基本正常，但有一些问题需要关注', 'yellow');
    log('🔧 建议修复失败项后再部署', 'yellow');
  } else {
    log('\n❌ 生产环境配置存在严重问题', 'red');
    log('🚫 不建议部署到生产环境', 'red');
  }
  
  return {
    totalChecks,
    passedChecks,
    successRate: parseFloat(successRate),
    isReady: successRate >= 90
  };
}

// 主函数
async function main() {
  log('🚀 开始生产环境配置检查...', 'bright');
  
  try {
    // 检查环境变量
    const envCheck = checkEnvironmentVariables();
    
    // 检查API端点
    const endpointsCheck = await checkEndpoints();
    
    // 检查R2存储
    const r2Check = await checkR2Storage();
    
    // 检查KV存储
    const kvCheck = await checkKVStorage();
    
    // 生成报告
    const report = generateReport(envCheck, endpointsCheck, r2Check, kvCheck);
    
    // 输出详细建议
    if (!report.isReady) {
      logSection('修复建议');
      
      if (!envCheck) {
        logError('环境变量配置不完整');
        logInfo('请检查 .env 文件或 Cloudflare Workers 环境变量设置');
      }
      
      const failedEndpoints = endpointsCheck.filter(r => !r.success);
      if (failedEndpoints.length > 0) {
        logError('部分API端点无法访问');
        logInfo('请检查 Workers 部署状态和网络连接');
      }
      
      const failedR2 = r2Check.filter(r => !r.success);
      if (failedR2.length > 0) {
        logError('部分R2存储桶无法访问');
        logInfo('请检查 R2 存储桶配置和权限设置');
      }
      
      if (!kvCheck.success) {
        logError('KV存储检查失败');
        logInfo('请检查 KV 命名空间绑定和权限设置');
      }
    }
    
    process.exit(report.isReady ? 0 : 1);
    
  } catch (error) {
    logError(`检查过程中发生错误: ${error.message}`);
    process.exit(1);
  }
}

// 运行检查
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironmentVariables,
  checkEndpoints,
  checkR2Storage,
  checkKVStorage,
  generateReport
}; 