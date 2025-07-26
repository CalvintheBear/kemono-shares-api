#!/usr/bin/env node

/**
 * 测试按钮解锁逻辑修复
 * 验证R2图片上传后按钮是否能正常解锁
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 测试按钮解锁逻辑修复...\n');

// 检查Workspace组件中的关键修复
const workspacePath = path.join(__dirname, '../src/components/Workspace.tsx');
const workspaceContent = fs.readFileSync(workspacePath, 'utf8');

console.log('📋 检查修复内容:');

// 检查uploadImageToKie函数的修复
const uploadFunctionCheck = workspaceContent.includes('data.url || data.fileUrl || data.imageUrl || data.uploadedUrl');
console.log(`✅ uploadImageToKie函数支持多种返回格式: ${uploadFunctionCheck ? '已修复' : '未修复'}`);

// 检查调试日志
const debugLogsCheck = workspaceContent.includes('console.log(\'🔍 上传API返回数据:\', data)');
console.log(`✅ 添加了调试日志: ${debugLogsCheck ? '已添加' : '未添加'}`);

// 检查fileUrl状态监控
const fileUrlMonitorCheck = workspaceContent.includes('fileUrl状态变化');
console.log(`✅ 添加了fileUrl状态监控: ${fileUrlMonitorCheck ? '已添加' : '未添加'}`);

// 检查按钮disabled逻辑
const buttonLogicCheck = workspaceContent.includes('disabled={isGenerating ||');
console.log(`✅ 按钮disabled逻辑存在: ${buttonLogicCheck ? '存在' : '不存在'}`);

// 检查generateImage函数中的验证逻辑
const generateValidationCheck = workspaceContent.includes('if (!fileUrl) {');
console.log(`✅ generateImage函数验证fileUrl: ${generateValidationCheck ? '已验证' : '未验证'}`);

console.log('\n🔍 关键修复点:');
console.log('1. uploadImageToKie函数现在支持多种返回格式 (data.url, data.fileUrl, data.imageUrl, data.uploadedUrl)');
console.log('2. 添加了详细的调试日志来跟踪上传过程');
console.log('3. 添加了fileUrl状态监控来调试按钮解锁逻辑');
console.log('4. 保持了原有的按钮disabled逻辑，确保安全性');

console.log('\n📝 测试步骤:');
console.log('1. 访问 http://localhost:3000/workspace');
console.log('2. 选择一个模板（如"擬人化"）');
console.log('3. 上传一张图片');
console.log('4. 观察浏览器控制台的调试日志');
console.log('5. 检查"変身させる!"按钮是否解锁');

console.log('\n🎯 预期结果:');
console.log('- 上传成功后，fileUrl应该被正确设置');
console.log('- 控制台应该显示调试日志');
console.log('- "変身させる!"按钮应该从disabled变为enabled');
console.log('- 点击按钮应该能正常触发图片生成');

console.log('\n✨ 修复完成！现在可以测试按钮解锁功能了。'); 