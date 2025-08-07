#!/usr/bin/env node

/**
 * 手动修复 _routes.json 重叠规则
 * 专门解决 "/_next/static/*" 和 "/_next/*" 重叠问题
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 手动修复 _routes.json 重叠规则...');

// 可能的 _routes.json 文件路径
const possiblePaths = [
  '_routes.json',
  '.vercel/output/_routes.json',
  '.vercel/output/config/routes.json',
  'out/_routes.json'
];

let fixed = false;

for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    try {
      console.log(`📁 检查文件: ${filePath}`);
      const content = fs.readFileSync(filePath, 'utf8');
      const routes = JSON.parse(content);
      
      console.log('📋 当前配置:', JSON.stringify(routes, null, 2));
      
      let needsFix = false;
      
      // 检查 include 规则
      if (routes.include && Array.isArray(routes.include)) {
        const includes = routes.include;
        
        // 检查是否有重叠规则
        if (includes.includes('/_next/*') && includes.includes('/_next/static/*')) {
          console.log('⚠️ 发现重叠规则: /_next/* 和 /_next/static/*');
          needsFix = true;
          
          // 移除 /_next/static/*，保留 /_next/*
          const newIncludes = includes.filter(rule => rule !== '/_next/static/*');
          routes.include = newIncludes;
          
          // 确保 exclude 中有 /_next/static/*
          if (!routes.exclude) {
            routes.exclude = [];
          }
          if (!routes.exclude.includes('/_next/static/*')) {
            routes.exclude.push('/_next/static/*');
          }
        }
      }
      
      if (needsFix) {
        console.log('🔧 修复后的配置:', JSON.stringify(routes, null, 2));
        
        // 写回文件
        fs.writeFileSync(filePath, JSON.stringify(routes, null, 2));
        console.log(`✅ 已修复 ${filePath}`);
        fixed = true;
      } else {
        console.log(`✅ ${filePath} 无需修复`);
      }
      
    } catch (error) {
      console.log(`⚠️ 处理 ${filePath} 时出错: ${error.message}`);
    }
  }
}

if (!fixed) {
  console.log('❌ 未找到需要修复的文件');
  process.exit(1);
} else {
  console.log('🎉 修复完成！');
  process.exit(0);
}
