#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 为静态导出添加配置
const staticExportConfig = `export const dynamic = "force-static";
export const revalidate = false;

`;

// API 路由目录
const apiDir = 'src/app/api';

// 递归查找所有 route.ts 文件
function findRouteFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findRouteFiles(fullPath));
    } else if (item === 'route.ts' || item === 'route.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 修复单个文件
function fixRouteFile(filePath: string): boolean {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经有配置
    if (content.includes('export const dynamic = "force-static"')) {
      console.log(`✅ ${filePath} 已经配置`);
      return true;
    }
    
    // 移除 edge runtime 配置
    content = content.replace(/export const runtime = ['"]edge['"];?\s*/g, '');
    
    // 添加配置到文件开头
    const newContent = staticExportConfig + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ 已修复: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ 修复失败: ${filePath}`, error);
    return false;
  }
}

// 主函数
function main() {
  console.log('🔧 开始修复 API 路由以支持静态导出...');
  
  const routeFiles = findRouteFiles(apiDir);
  
  if (routeFiles.length === 0) {
    console.log('⚠️  未找到 API 路由文件');
    return;
  }
  
  console.log(`📁 找到 ${routeFiles.length} 个 API 路由文件:`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of routeFiles) {
    if (fixRouteFile(file)) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\n📊 修复结果:');
  console.log(`✅ 成功: ${successCount} 个文件`);
  console.log(`❌ 失败: ${failCount} 个文件`);
  
  if (failCount === 0) {
    console.log('🎉 所有 API 路由已修复完成！');
  } else {
    console.log('⚠️  部分文件修复失败，请手动检查');
  }
}

main(); 