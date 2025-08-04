const fs = require('fs');
const path = require('path');

// 需要添加 generateStaticParams 的页面目录
const pages = [
  'ai-image-conversion-free',
  'ai-image-generation-guide',
  'anime-icon-creation',
  'chibi-character-maker',
  'faq',
  'line-sticker-creation',
  'privacy',
  'share',
  'terms',
  'workspace'
];

// generateStaticParams 函数代码
const staticParamsCode = `
// 生成静态参数
export function generateStaticParams() {
  return [
    { locale: 'ja' }
  ];
}
`;

// 为每个页面添加 generateStaticParams
pages.forEach(pageName => {
  const pagePath = path.join(__dirname, '..', 'src', 'app', '[locale]', pageName, 'page.tsx');
  
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // 检查是否已经有 generateStaticParams
    if (!content.includes('generateStaticParams')) {
      // 在第一个 import 语句后添加
      const importMatch = content.match(/^import.*?;?\s*\n/m);
      if (importMatch) {
        const insertIndex = importMatch.index + importMatch[0].length;
        content = content.slice(0, insertIndex) + staticParamsCode + content.slice(insertIndex);
        
        fs.writeFileSync(pagePath, content, 'utf8');
        console.log(`✅ 已为 ${pageName} 添加 generateStaticParams`);
      }
    } else {
      console.log(`⚠️  ${pageName} 已有 generateStaticParams`);
    }
  } else {
    console.log(`❌ 找不到页面: ${pageName}`);
  }
});

console.log('🎉 所有页面处理完成！'); 