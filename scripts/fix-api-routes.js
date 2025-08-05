const fs = require('fs');
const path = require('path');

// 静态导出配置
const staticConfig = `
// 静态导出配置
export const dynamic = 'force-static'
export const revalidate = false

`;

// 需要修复的API路由文件
const apiFiles = [
  'src/app/api/test-kie-connection/route.ts',
  'src/app/api/test-afterimage-upload/route.ts',
  'src/app/api/temp-file/route.ts',
  'src/app/api/task-status/route.ts',
  'src/app/api/share/route.ts',
  'src/app/api/share/debug/route.ts',
  'src/app/api/poll-task/route.ts',
  'src/app/api/image-details/route.ts',
  'src/app/api/generate-image/route.ts',
  'src/app/api/download-url/route.ts',
  'src/app/api/check-r2-config/route.ts',
  'src/app/api/check-afterimage-r2-config/route.ts'
];

console.log('🔧 开始修复API路由静态导出配置...');

apiFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经有静态导出配置
    if (!content.includes('export const dynamic')) {
      // 在import语句后添加静态导出配置
      const importEndIndex = content.indexOf('\n\n');
      if (importEndIndex !== -1) {
        const beforeImport = content.substring(0, importEndIndex + 2);
        const afterImport = content.substring(importEndIndex + 2);
        content = beforeImport + staticConfig + afterImport;
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ 已修复: ${filePath}`);
      } else {
        console.log(`⚠️ 无法找到插入位置: ${filePath}`);
      }
    } else {
      console.log(`⏭️ 已存在配置: ${filePath}`);
    }
  } else {
    console.log(`❌ 文件不存在: ${filePath}`);
  }
});

console.log('🎉 API路由静态导出配置修复完成！'); 