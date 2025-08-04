#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 递归查找所有 TypeScript 文件
function findTsFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 修复单个文件
function fixFile(filePath: string): boolean {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. 移除 edge runtime 配置
    const edgeRuntimeRegex = /export const runtime = ['"]edge['"];?\s*/g;
    if (edgeRuntimeRegex.test(content)) {
      content = content.replace(edgeRuntimeRegex, '');
      modified = true;
      console.log(`✅ 已移除 edge runtime: ${filePath}`);
    }
    
    // 2. 修复 request.url 使用（在 API 路由中）
    if (filePath.includes('/api/') && content.includes('request.url')) {
      // 替换为更兼容的方式
      content = content.replace(
        /request\.url/g,
        'new URL(request.url).href'
      );
      modified = true;
      console.log(`✅ 已修复 request.url: ${filePath}`);
    }
    
    // 3. 确保 API 路由有正确的静态配置
    if (filePath.includes('/api/') && !content.includes('export const dynamic = "force-static"')) {
      const staticConfig = `export const dynamic = "force-static";
export const revalidate = false;

`;
      content = staticConfig + content;
      modified = true;
      console.log(`✅ 已添加静态配置: ${filePath}`);
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ 修复失败: ${filePath}`, error);
    return false;
  }
}

// 主函数
function main() {
  console.log('🔧 开始全面修复静态导出问题...');
  
  const srcDir = 'src';
  const tsFiles = findTsFiles(srcDir);
  
  if (tsFiles.length === 0) {
    console.log('⚠️  未找到 TypeScript 文件');
    return;
  }
  
  console.log(`📁 找到 ${tsFiles.length} 个 TypeScript 文件`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of tsFiles) {
    if (fixFile(file)) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\n📊 修复结果:');
  console.log(`✅ 成功: ${successCount} 个文件`);
  console.log(`❌ 失败: ${failCount} 个文件`);
  
  if (failCount === 0) {
    console.log('🎉 所有静态导出问题已修复完成！');
  } else {
    console.log('⚠️  部分文件修复失败，请手动检查');
  }
}

main(); 