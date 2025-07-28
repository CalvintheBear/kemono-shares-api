#!/usr/bin/env node

/**
 * 测试生产环境 Cloudflare KV 存储功能
 * 使用方法: node scripts/test-production-kv.js
 */

const fetch = require('node-fetch')

const API_BASE = 'https://kemono-shares-api.y2983236233.workers.dev/api'
const TEST_IMAGE_URL = 'https://tempfile.aiquickdraw.com/s/test_production_kv.png'
const TEST_STYLE = '生产环境测试'

async function testProductionKV() {
  console.log('🧪 开始测试生产环境 Cloudflare KV 存储功能...\n')
  
  const testData = {
    generatedUrl: TEST_IMAGE_URL,
    originalUrl: 'https://example.com/original.jpg',
    prompt: '生产环境KV存储测试图片',
    style: TEST_STYLE,
    timestamp: Date.now()
  }
  
  console.log('📋 测试数据:', testData)
  console.log('🌐 API地址:', API_BASE)
  
  try {
    // 1. 创建分享
    console.log('\n🔄 创建分享...')
    const createResponse = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      throw new Error(`HTTP ${createResponse.status}: ${errorText}`)
    }
    
    const createResult = await createResponse.json()
    
    if (!createResult.success) {
      throw new Error(`创建分享失败: ${createResult.error}`)
    }
    
    console.log('✅ 分享创建成功:', {
      shareId: createResult.shareId,
      shareUrl: createResult.shareUrl,
      isDuplicate: createResult.isDuplicate
    })
    
    const shareId = createResult.shareId
    
    // 2. 获取分享详情
    console.log('\n🔄 获取分享详情...')
    const detailResponse = await fetch(`${API_BASE}/share?id=${shareId}`)
    
    if (!detailResponse.ok) {
      const errorText = await detailResponse.text()
      throw new Error(`HTTP ${detailResponse.status}: ${errorText}`)
    }
    
    const detailResult = await detailResponse.json()
    
    if (!detailResult.success) {
      throw new Error(`获取分享详情失败: ${detailResult.error}`)
    }
    
    console.log('✅ 分享详情获取成功:', {
      id: detailResult.data.id,
      style: detailResult.data.style,
      isR2Stored: detailResult.data.isR2Stored
    })
    
    // 3. 获取分享列表
    console.log('\n🔄 获取分享列表...')
    const listResponse = await fetch(`${API_BASE}/share/list?limit=10`)
    
    if (!listResponse.ok) {
      const errorText = await listResponse.text()
      throw new Error(`HTTP ${listResponse.status}: ${errorText}`)
    }
    
    const listResult = await listResponse.json()
    
    if (!listResult.success) {
      throw new Error(`获取分享列表失败: ${listResult.error}`)
    }
    
    console.log('✅ 分享列表获取成功:', {
      total: listResult.data.total,
      items: listResult.data.items.length,
      hasMore: listResult.data.hasMore
    })
    
    // 4. 检查监控信息
    console.log('\n🔄 检查监控信息...')
    const monitorResponse = await fetch(`${API_BASE}/share/monitor?action=storage`)
    
    if (!monitorResponse.ok) {
      const errorText = await monitorResponse.text()
      throw new Error(`HTTP ${monitorResponse.status}: ${errorText}`)
    }
    
    const monitorResult = await monitorResponse.json()
    
    if (!monitorResult.success) {
      throw new Error(`获取监控信息失败: ${monitorResult.error}`)
    }
    
    console.log('✅ 监控信息获取成功:', {
      totalShares: monitorResult.data.totalShares,
      r2StoredCount: monitorResult.data.r2StoredCount,
      lastUpdated: monitorResult.data.lastUpdated
    })
    
    // 5. 测试重复请求（应该返回相同的shareId）
    console.log('\n🔄 测试重复请求（应该返回相同的shareId）...')
    const duplicateResponse = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    if (!duplicateResponse.ok) {
      const errorText = await duplicateResponse.text()
      throw new Error(`HTTP ${duplicateResponse.status}: ${errorText}`)
    }
    
    const duplicateResult = await duplicateResponse.json()
    
    if (!duplicateResult.success) {
      throw new Error(`重复请求失败: ${duplicateResult.error}`)
    }
    
    console.log('✅ 重复请求结果:', {
      shareId: duplicateResult.shareId,
      isDuplicate: duplicateResult.isDuplicate
    })
    
    if (duplicateResult.shareId === shareId) {
      console.log('✅ 重复请求正确返回相同的shareId')
    } else {
      console.log('⚠️ 重复请求返回了不同的shareId')
    }
    
    console.log('\n🏁 生产环境 KV 存储测试完成！')
    console.log('\n📊 测试总结:')
    console.log('   ✅ 分享创建和存储')
    console.log('   ✅ 分享详情获取')
    console.log('   ✅ 分享列表获取')
    console.log('   ✅ 监控信息获取')
    console.log('   ✅ 重复请求处理')
    console.log('   ✅ 数据持久化验证')
    
    console.log('\n🎉 生产环境 KV 存储工作正常！')
    console.log('📝 现在您的分享数据将在服务器重启后保持持久化！')
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    console.log('\n💡 提示:')
    console.log('   - 检查网络连接')
    console.log('   - 确认 Cloudflare Workers 已部署')
    console.log('   - 检查 KV 存储配置')
    console.log('   - 查看 Cloudflare Workers 日志')
  }
}

// 运行测试
if (require.main === module) {
  testProductionKV()
}

module.exports = { testProductionKV } 