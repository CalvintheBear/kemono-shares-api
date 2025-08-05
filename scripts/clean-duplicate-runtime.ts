import * as fs from 'fs';
import * as path from 'path';

// API路由目录
const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

// 递归查找所有API路由文件
function findApiRoutes(dir: string): string[] {
  const files: string[] = [];
  
  if (fs.existsSync(dir)) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findApiRoutes(fullPath));
      } else if (item === 'route.ts') {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// 清理重复的runtime配置
function cleanDuplicateRuntime(filePath: string): void {
  console.log(`清理重复runtime配置: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // 检查是否有重复的runtime配置
  const nodejsMatches = content.match(/export const runtime = 'nodejs';/g);
  const edgeMatches = content.match(/export const runtime = 'edge';/g);
  
  if (nodejsMatches && nodejsMatches.length > 1) {
    console.log(`  - 发现 ${nodejsMatches.length} 个重复的 nodejs runtime 配置`);
    // 保留第一个，删除其他的
    content = content.replace(/export const runtime = 'nodejs';/g, (match, index) => {
      if (index === 0) return match;
      return '';
    });
    modified = true;
  }
  
  if (edgeMatches && edgeMatches.length > 1) {
    console.log(`  - 发现 ${edgeMatches.length} 个重复的 edge runtime 配置`);
    // 保留第一个，删除其他的
    content = content.replace(/export const runtime = 'edge';/g, (match, index) => {
      if (index === 0) return match;
      return '';
    });
    modified = true;
  }
  
  // 如果同时有nodejs和edge配置，优先保留edge
  if (content.includes("export const runtime = 'nodejs'") && content.includes("export const runtime = 'edge'")) {
    console.log(`  - 同时存在nodejs和edge配置，保留edge配置`);
    content = content.replace(/export const runtime = 'nodejs';/g, '');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  - 已清理重复配置`);
  } else {
    console.log(`  - 无需清理`);
  }
}

// 主函数
function main() {
  console.log('开始清理重复的runtime配置...\n');
  
  const apiRoutes = findApiRoutes(apiDir);
  console.log(`找到 ${apiRoutes.length} 个API路由文件:\n`);
  
  for (const route of apiRoutes) {
    cleanDuplicateRuntime(route);
  }
  
  console.log('\n✅ 重复runtime配置清理完成！');
}

main(); 