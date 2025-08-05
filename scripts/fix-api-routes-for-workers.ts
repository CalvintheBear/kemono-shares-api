import fs from 'fs';
import path from 'path';

// 需要添加动态配置的API路由文件
const apiRoutes = [
  'src/app/api/upload-image/route.ts',
  'src/app/api/test-kie-connection/route.ts',
  'src/app/api/test-env/route.ts',
  'src/app/api/test-afterimage-upload/route.ts',
  'src/app/api/temp-file/route.ts',
  'src/app/api/task-status/route.ts',
  'src/app/api/share/route.ts',
  'src/app/api/share/monitor/route.ts',
  'src/app/api/share/list/route.ts',
  'src/app/api/share/debug/route.ts',
  'src/app/api/poll-task/route.ts',
  'src/app/api/image-details/route.ts',
  'src/app/api/generate-image/route.ts',
  'src/app/api/download-url/route.ts',
  'src/app/api/check-r2-config/route.ts',
  'src/app/api/check-afterimage-r2-config/route.ts',
];

function addDynamicConfig(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经有动态配置
    if (content.includes('export const dynamic = \'force-dynamic\'')) {
      console.log(`✅ ${filePath} 已经有动态配置`);
      return;
    }
    
    // 查找import语句的位置
    const importMatch = content.match(/^import.*$/m);
    if (!importMatch) {
      console.log(`❌ ${filePath} 没有找到import语句`);
      return;
    }
    
    // 在import语句后添加动态配置
    const newContent = content.replace(
      importMatch[0],
      `${importMatch[0]}\n\n// 配置为动态路由，避免静态导出错误\nexport const dynamic = 'force-dynamic'`
    );
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${filePath} 已添加动态配置`);
  } catch (error) {
    console.error(`❌ 处理 ${filePath} 时出错:`, error);
  }
}

// 执行修复
console.log('🔧 开始修复API路由配置...\n');

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    addDynamicConfig(route);
  } else {
    console.log(`⚠️  ${route} 文件不存在`);
  }
});

console.log('\n✅ API路由配置修复完成！'); 