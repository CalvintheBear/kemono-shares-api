const fs = require('fs');
const path = require('path');

// 需要添加share按钮的页面列表
const pages = [
  'privacy',
  'terms',
  'anime-icon-creation',
  'chibi-character-maker',
  'line-sticker-creation',
  'personification-ai',
  'ai-image-generation-guide',
  'ai-image-conversion-free'
];

function addShareButton(pageName) {
  const pagePath = path.join(__dirname, '..', 'src', 'app', '[locale]', pageName, 'page.tsx');
  
  if (!fs.existsSync(pagePath)) {
    console.log(`❌ 页面不存在: ${pageName}`);
    return;
  }

  let content = fs.readFileSync(pagePath, 'utf8');
  
  // 查找CTA按钮的位置并添加share按钮
  const ctaPatterns = [
    /(href="\/workspace"[^>]*>.*?<\/a>)/g,
    /(今すぐ始める.*?<\/a>)/g,
    /(今すぐ変換.*?<\/a>)/g
  ];

  let modified = false;
  
  for (const pattern of ctaPatterns) {
    if (pattern.test(content)) {
      // 替换单个按钮为按钮组
      content = content.replace(pattern, (match) => {
        // 检查是否已经有按钮组
        if (match.includes('flex') || match.includes('gap')) {
          return match;
        }
        
        // 创建按钮组
        const buttonGroup = `
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              ${match}
              <a href="/share" className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-md transition-all">
                ギャラリーを見る
              </a>
            </div>`;
        
        modified = true;
        return buttonGroup;
      });
    }
  }

  if (modified) {
    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`✅ 已为 ${pageName} 添加share按钮`);
  } else {
    console.log(`⚠️  ${pageName} 未找到合适的CTA按钮位置`);
  }
}

console.log('🚀 开始为所有页面添加share锚点按钮...\n');

pages.forEach(page => {
  addShareButton(page);
});

console.log('\n🎉 完成！所有页面已添加share锚点按钮。'); 