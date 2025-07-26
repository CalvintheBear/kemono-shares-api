#!/usr/bin/env node

/**
 * 测试防重复分享机制
 * 使用方法: node scripts/test-duplicate-prevention.js
 */

const fetch = require('node-fetch')

const API_BASE = 'http://localhost:3000/api'
const TEST_IMAGE_URL = 'https://tempfile.aiquickdraw.com/s/test_image.png'
const TEST_STYLE = '少女'

async function testDuplicatePrevention() {
  console.log('🧪 开始测试防重复分享机制...\n')
  
  const testData = {
    generatedUrl: TEST_IMAGE_URL,
    originalUrl: 'https://example.com/original.jpg',
    prompt: '测试图片',
    style: TEST_STYLE,
    timestamp: Date.now()
  }
  
  console.log('📋 测试数据:', testData)
  console.log('⏰ 开始时间:', new Date().toLocaleString())
  
  try {
    // 第一次请求
    console.log('\n🔄 发送第一次分享请求...')
    const startTime1 = Date.now()
    const response1 = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    const result1 = await response1.json()
    const time1 = Date.now() - startTime1
    
    console.log('✅ 第一次请求结果:', {
      success: result1.success,
      shareId: result1.shareId,
      isDuplicate: result1.isDuplicate,
      time: `${time1}ms`
    })
    
    // 立即发送第二次请求（模拟重复点击）
    console.log('\n🔄 立即发送第二次分享请求（模拟重复点击）...')
    const startTime2 = Date.now()
    const response2 = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    const result2 = await response2.json()
    const time2 = Date.now() - startTime2
    
    console.log('✅ 第二次请求结果:', {
      success: result2.success,
      shareId: result2.shareId,
      isDuplicate: result2.isDuplicate,
      time: `${time2}ms`
    })
    
    // 验证结果
    console.log('\n🔍 验证结果:')
    if (result1.success && result2.success) {
      if (result1.shareId === result2.shareId) {
        console.log('✅ 防重复机制工作正常！两次请求返回相同的shareId')
        console.log('✅ 第二次请求被识别为重复请求')
      } else {
        console.log('❌ 防重复机制失效！两次请求返回不同的shareId')
        console.log('   - 第一次shareId:', result1.shareId)
        console.log('   - 第二次shareId:', result2.shareId)
      }
      
      if (result2.isDuplicate) {
        console.log('✅ 重复请求标记正确')
      } else {
        console.log('⚠️ 重复请求标记缺失')
      }
    } else {
      console.log('❌ 请求失败')
      console.log('   - 第一次:', result1.error || '成功')
      console.log('   - 第二次:', result2.error || '成功')
    }
    
    // 测试延迟后的请求（应该创建新的分享）
    console.log('\n⏳ 等待6秒后发送第三次请求（应该创建新的分享）...')
    await new Promise(resolve => setTimeout(resolve, 6000))
    
    const startTime3 = Date.now()
    const response3 = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    const result3 = await response3.json()
    const time3 = Date.now() - startTime3
    
    console.log('✅ 第三次请求结果:', {
      success: result3.success,
      shareId: result3.shareId,
      isDuplicate: result3.isDuplicate,
      time: `${time3}ms`
    })
    
    if (result3.shareId !== result1.shareId) {
      console.log('✅ 延迟后的请求正确创建了新的分享')
    } else {
      console.log('⚠️ 延迟后的请求仍然返回相同的shareId')
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
  
  console.log('\n🏁 测试完成')
}

// 运行测试
if (require.main === module) {
  testDuplicatePrevention()
}

module.exports = { testDuplicatePrevention } 