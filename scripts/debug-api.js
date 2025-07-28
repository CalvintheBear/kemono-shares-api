#!/usr/bin/env node

const fetch = require('node-fetch')

const API_BASE = 'https://kemono-shares-api.y2983236233.workers.dev/api'

async function debugAPI() {
  console.log('🔍 调试 API 响应...\n')
  
  const testData = {
    generatedUrl: 'https://tempfile.aiquickdraw.com/s/test_debug.png',
    originalUrl: 'https://example.com/original.jpg',
    prompt: '调试测试',
    style: '调试',
    timestamp: Date.now()
  }
  
  try {
    console.log('📤 发送请求到:', `${API_BASE}/share`)
    console.log('📋 请求数据:', JSON.stringify(testData, null, 2))
    
    const response = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    console.log('\n📥 响应状态:', response.status)
    console.log('📥 响应头:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('\n📥 响应内容:')
    console.log(responseText)
    
    try {
      const responseJson = JSON.parse(responseText)
      console.log('\n📥 解析后的JSON:')
      console.log(JSON.stringify(responseJson, null, 2))
    } catch (parseError) {
      console.log('\n❌ JSON解析失败:', parseError.message)
    }
    
  } catch (error) {
    console.error('❌ 请求失败:', error.message)
  }
}

debugAPI() 