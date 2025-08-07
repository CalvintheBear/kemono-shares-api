const fs = require('fs');
const path = require('path');

console.log('🧪 测试构建输出...');

try {
  // 检查out目录是否存在
  if (!fs.existsSync('out')) {
    throw new Error('❌ out目录不存在');
  }

  console.log('✅ out目录存在');

  // 检查关键文件
  const requiredFiles = [
    'index.html',
    '_redirects',
    '_headers',
    '_routes.json'
  ];

  const requiredDirs = [
    '_next',
    'static'
  ];

  console.log('📄 检查关键文件...');
  for (const file of requiredFiles) {
    const filePath = path.join('out', file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.warn(`⚠️  ${file} 不存在`);
    }
  }

  console.log('📁 检查关键目录...');
  for (const dir of requiredDirs) {
    const dirPath = path.join('out', dir);
    if (fs.existsSync(dirPath)) {
      console.log(`✅ ${dir} 目录存在`);
    } else {
      console.warn(`⚠️  ${dir} 目录不存在`);
    }
  }

  // 检查文件大小
  console.log('📊 检查文件大小...');
  const files = fs.readdirSync('out');
  let totalSize = 0;
  
  for (const file of files) {
    const filePath = path.join('out', file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      totalSize += stats.size;
      console.log(`📄 ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
    }
  }

  console.log(`📊 总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  // 检查_redirects文件内容
  const redirectsPath = path.join('out', '_redirects');
  if (fs.existsSync(redirectsPath)) {
    const content = fs.readFileSync(redirectsPath, 'utf8');
    console.log('📝 _redirects 内容:');
    console.log(content);
  }

  // 检查_headers文件内容
  const headersPath = path.join('out', '_headers');
  if (fs.existsSync(headersPath)) {
    const content = fs.readFileSync(headersPath, 'utf8');
    console.log('📝 _headers 内容:');
    console.log(content);
  }

  console.log('✅ 构建输出测试完成');

} catch (error) {
  console.error('❌ 测试失败:', error.message);
  process.exit(1);
}
