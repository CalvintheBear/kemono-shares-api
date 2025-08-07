#!/usr/bin/env node

/**
 * 修复 _routes.json 中的重叠规则问题
 * 解决 Cloudflare Pages 部署时的 "Overlapping rules" 错误
 */

const fs = require('fs');
const path = require('path');

function fixRoutesOverlap() {
  console.log('🔧 开始修复 _routes.json 重叠规则问题...');
  
  // 可能的 _routes.json 文件路径
  const possiblePaths = [
    '_routes.json',
    '.vercel/output/_routes.json',
    '.vercel/output/config/routes.json',
    'out/_routes.json'
  ];
  
  let routesFile = null;
  let routesPath = null;
  
  // 查找 _routes.json 文件
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        routesFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        routesPath = filePath;
        console.log(`📁 找到路由文件: ${filePath}`);
        break;
      } catch (error) {
        console.log(`⚠️ 无法解析 ${filePath}: ${error.message}`);
      }
    }
  }
  
  if (!routesFile) {
    console.log('❌ 未找到有效的 _routes.json 文件');
    return false;
  }
  
  console.log('📋 当前路由配置:', JSON.stringify(routesFile, null, 2));
  
  // 检查是否有重叠规则
  const includes = routesFile.include || [];
  const excludes = routesFile.exclude || [];
  
  // 检查 include 规则中的重叠
  const overlappingIncludes = [];
  for (let i = 0; i < includes.length; i++) {
    for (let j = i + 1; j < includes.length; j++) {
      const rule1 = includes[i];
      const rule2 = includes[j];
      
      // 检查是否重叠
      if (isOverlapping(rule1, rule2)) {
        overlappingIncludes.push([rule1, rule2]);
      }
    }
  }
  
  if (overlappingIncludes.length > 0) {
    console.log('⚠️ 发现重叠的 include 规则:');
    overlappingIncludes.forEach(([rule1, rule2]) => {
      console.log(`   ${rule1} 与 ${rule2} 重叠`);
    });
  }
  
  // 修复重叠规则
  let fixed = false;
  
  // 处理常见的重叠情况
  const newIncludes = [...includes];
  const newExcludes = [...excludes];
  
  // 检查并修复 /_next/* 和 /_next/static/* 的重叠
  if (newIncludes.includes('/_next/*') && newIncludes.includes('/_next/static/*')) {
    console.log('🔧 修复 /_next/* 和 /_next/static/* 重叠...');
    newIncludes.splice(newIncludes.indexOf('/_next/static/*'), 1);
    newExcludes.push('/_next/static/*');
    fixed = true;
  }
  
  // 检查并修复 /api/* 和 /api/ 的重叠
  if (newIncludes.includes('/api/*') && newIncludes.includes('/api/')) {
    console.log('🔧 修复 /api/* 和 /api/ 重叠...');
    newIncludes.splice(newIncludes.indexOf('/api/'), 1);
    fixed = true;
  }
  
  // 检查并修复 /* 与其他规则的重叠
  if (newIncludes.includes('/*')) {
    const otherRules = newIncludes.filter(rule => rule !== '/*');
    if (otherRules.length > 0) {
      console.log('🔧 修复 /* 与其他规则重叠...');
      // 保留 /* 作为主规则，将其他规则移到 exclude
      newIncludes.splice(0, newIncludes.length, '/*');
      newExcludes.push(...otherRules);
      fixed = true;
    }
  }
  
  if (fixed) {
    // 更新路由配置
    routesFile.include = newIncludes;
    routesFile.exclude = [...new Set(newExcludes)]; // 去重
    
    // 确保版本号存在
    if (!routesFile.version) {
      routesFile.version = 1;
    }
    
    console.log('✅ 修复后的路由配置:', JSON.stringify(routesFile, null, 2));
    
    // 写回文件
    try {
      fs.writeFileSync(routesPath, JSON.stringify(routesFile, null, 2));
      console.log(`✅ 已修复 ${routesPath}`);
      return true;
    } catch (error) {
      console.error(`❌ 写入文件失败: ${error.message}`);
      return false;
    }
  } else {
    console.log('✅ 未发现需要修复的重叠规则');
    return true;
  }
}

function isOverlapping(rule1, rule2) {
  // 简单的重叠检测逻辑
  if (rule1 === rule2) return false;
  
  // 检查一个规则是否包含另一个
  if (rule1.endsWith('/*') && rule2.startsWith(rule1.slice(0, -1))) {
    return true;
  }
  if (rule2.endsWith('/*') && rule1.startsWith(rule2.slice(0, -1))) {
    return true;
  }
  
  return false;
}

// 如果直接运行此脚本
if (require.main === module) {
  const success = fixRoutesOverlap();
  process.exit(success ? 0 : 1);
}

module.exports = { fixRoutesOverlap };
