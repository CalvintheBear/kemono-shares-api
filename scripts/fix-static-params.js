const fs = require('fs');
const path = require('path');

// 静态导出配置
const staticConfig = `
// 静态导出配置
export const dynamic = 'force-static'
export const revalidate = false

// 生成静态参数
export async function generateStaticParams() {
  return [
    { locale: 'ja' }
  ]
}

`;

// 需要修复的页面文件
const pageFiles = [
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/workspace/page.tsx',
  'src/app/[locale]/share/page.tsx',
  'src/app/[locale]/faq/page.tsx',
  'src/app/[locale]/privacy/page.tsx',
  'src/app/[locale]/terms/page.tsx',
  'src/app/[locale]/ai-image-conversion-free/page.tsx',
  'src/app/[locale]/ai-image-generation-guide/page.tsx',
  'src/app/[locale]/anime-icon-creation/page.tsx',
  'src/app/[locale]/chibi-character-maker/page.tsx',
  'src/app/[locale]/line-sticker-creation/page.tsx',
  'src/app/[locale]/personification-ai/page.tsx'
];

console.log('🔧 开始修复静态参数生成配置...');

pageFiles.forEach(filePath => {
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

console.log('�� 静态参数生成配置修复完成！'); 