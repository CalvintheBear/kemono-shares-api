const fs = require('fs');
const path = require('path');

// 读取shares-dev.json文件
const filePath = path.join(__dirname, 'local-storage', 'shares-dev.json');

try {
  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContent);
  
  console.log('当前数据条目数量:', Object.keys(data).length);
  
  // 检查是否还有"测试风格"的条目
  const testStyleEntries = [];
  Object.keys(data).forEach(key => {
    if (data[key].style === '测试风格') {
      testStyleEntries.push(key);
    }
  });
  
  if (testStyleEntries.length === 0) {
    console.log('✅ 所有"测试风格"数据已成功清除！');
  } else {
    console.log('❌ 仍存在"测试风格"条目:', testStyleEntries);
  }
  
  // 显示所有不同的风格类型
  const styles = new Set();
  Object.keys(data).forEach(key => {
    styles.add(data[key].style);
  });
  
  console.log('\n当前文件中的所有风格类型:');
  Array.from(styles).sort().forEach(style => {
    console.log(`- ${style}`);
  });
  
} catch (error) {
  console.error('处理文件时出错:', error);
} 