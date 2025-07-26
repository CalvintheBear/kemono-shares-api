#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

console.log('🧪 测试Cloudflare R2图片上传功能...\n');

// 检查环境变量
const requiredEnvVars = [
  'CLOUDFLARE_R2_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME',
  'CLOUDFLARE_R2_PUBLIC_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ 缺少必需的环境变量:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n💡 请先配置环境变量再运行测试');
  process.exit(1);
}

// 创建测试图片
function createTestImage() {
  const testImagePath = path.join(__dirname, 'test-image.png');
  
  // 创建一个简单的1x1像素PNG图片
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, // bit depth
    0x02, // color type (RGB)
    0x00, // compression
    0x00, // filter
    0x00, // interlace
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  fs.writeFileSync(testImagePath, pngHeader);
  return testImagePath;
}

// 测试上传API
async function testUpload() {
  try {
    console.log('📤 开始测试上传...');
    
    // 创建测试图片
    const testImagePath = createTestImage();
    console.log(`✅ 创建测试图片: ${testImagePath}`);
    
    // 准备FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    // 获取应用URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const uploadUrl = `${appUrl}/api/upload-image`;
    
    console.log(`🌐 上传到: ${uploadUrl}`);
    
    // 发送请求
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ 上传测试成功!');
      console.log(`📁 文件URL: ${result.fileUrl}`);
      console.log(`📊 文件大小: ${result.fileSize} bytes`);
      console.log(`📝 文件类型: ${result.fileType}`);
      
      // 测试访问上传的图片
      console.log('\n🔍 测试图片访问...');
      const imageResponse = await fetch(result.fileUrl);
      if (imageResponse.ok) {
        console.log('✅ 图片访问正常');
      } else {
        console.log('❌ 图片访问失败');
      }
      
    } else {
      console.log('❌ 上传测试失败:');
      console.log('状态码:', response.status);
      console.log('错误信息:', result.error || result);
    }
    
    // 清理测试文件
    fs.unlinkSync(testImagePath);
    console.log('🧹 清理测试文件完成');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 建议:');
      console.log('1. 确保应用正在运行: npm run dev');
      console.log('2. 检查端口是否正确 (默认: 3000)');
    }
  }
}

// 测试R2配置API
async function testR2Config() {
  try {
    console.log('🔧 测试R2配置API...');
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const configUrl = `${appUrl}/api/check-r2-config`;
    
    const response = await fetch(configUrl);
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ R2配置检查成功');
      console.log('配置状态:', result.r2Config.status);
      console.log('配置信息:', result.r2Config.info);
    } else {
      console.log('❌ R2配置检查失败:', result.error);
    }
    
  } catch (error) {
    console.error('❌ 配置检查失败:', error.message);
  }
}

// 主函数
async function main() {
  console.log('🚀 开始Cloudflare R2功能测试\n');
  
  // 测试配置
  await testR2Config();
  console.log('');
  
  // 测试上传
  await testUpload();
  
  console.log('\n✨ 测试完成!');
}

// 运行测试
main().catch(console.error); 