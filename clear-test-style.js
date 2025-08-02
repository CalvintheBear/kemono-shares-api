const fs = require('fs');
const path = require('path');

// 读取shares-dev.json文件
const filePath = path.join(__dirname, 'local-storage', 'shares-dev.json');

try {
  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContent);
  
  console.log('原始数据条目数量:', Object.keys(data).length);
  
  // 找到所有"测试风格"的条目
  const testStyleEntries = [];
  Object.keys(data).forEach(key => {
    if (data[key].style === '测试风格') {
      testStyleEntries.push(key);
    }
  });
  
  console.log('找到的"测试风格"条目:', testStyleEntries);
  
  // 删除"测试风格"的条目
  testStyleEntries.forEach(key => {
    delete data[key];
    console.log(`已删除条目: ${key}`);
  });
  
  console.log('删除后的数据条目数量:', Object.keys(data).length);
  
  // 写回文件
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  
  console.log('成功清除所有"测试风格"数据！');
  
} catch (error) {
  console.error('处理文件时出错:', error);
} 