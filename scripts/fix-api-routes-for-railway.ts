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

// 修复单个API路由文件
function fixApiRoute(filePath: string): void {
  console.log(`修复API路由: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 检查是否已经有runtime配置
  if (content.includes("export const runtime = 'nodejs'") || content.includes("export const runtime = 'edge'")) {
    console.log(`  - 已有runtime配置，跳过`);
    return;
  }
  
  // 查找dynamic配置的位置
  const dynamicMatch = content.match(/export const dynamic = 'force-dynamic'/);
  
  if (dynamicMatch) {
    // 在dynamic配置后添加runtime配置
    const newContent = content.replace(
      /export const dynamic = 'force-dynamic'/,
      `export const dynamic = 'force-dynamic'

// 禁用静态生成，确保只在运行时执行
export const runtime = 'nodejs'`
    );
    
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`  - 已添加runtime配置`);
  } else {
    console.log(`  - 未找到dynamic配置，跳过`);
  }
}

// 主函数
function main() {
  console.log('开始修复API路由以支持Railway构建...\n');
  
  const apiRoutes = findApiRoutes(apiDir);
  console.log(`找到 ${apiRoutes.length} 个API路由文件:\n`);
  
  for (const route of apiRoutes) {
    fixApiRoute(route);
  }
  
  console.log('\n✅ API路由修复完成！');
}

main(); 