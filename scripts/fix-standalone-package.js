#!/usr/bin/env node

/**
 * 修复 standalone 目录中的 package.json
 * 确保 start 脚本指向正确的 server.js
 */

const fs = require('fs');
const path = require('path');

function fixStandalonePackage() {
  console.log('🔧 修复 standalone package.json...');
  
  const standalonePackagePath = path.join(process.cwd(), '.next', 'standalone', 'package.json');
  
  if (!fs.existsSync(standalonePackagePath)) {
    console.log('❌ standalone package.json 不存在');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(standalonePackagePath, 'utf8'));
    
    // 修改 start 脚本
    packageJson.scripts.start = 'node server.js';
    
    // 只保留生产依赖
    const productionDeps = {};
    for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
      // 只保留运行时必需的依赖
      if (['next', 'react', 'react-dom'].includes(name)) {
        productionDeps[name] = version;
      }
    }
    packageJson.dependencies = productionDeps;
    
    // 移除 devDependencies
    delete packageJson.devDependencies;
    
    // 写回文件
    fs.writeFileSync(standalonePackagePath, JSON.stringify(packageJson, null, 2));
    
    console.log('✅ standalone package.json 已修复');
    console.log('📋 修改内容:');
    console.log('  - start 脚本: node server.js');
    console.log('  - 清理了不必要的依赖');
    
    return true;
  } catch (error) {
    console.error('❌ 修复失败:', error.message);
    return false;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const success = fixStandalonePackage();
  process.exit(success ? 0 : 1);
}

module.exports = { fixStandalonePackage };
