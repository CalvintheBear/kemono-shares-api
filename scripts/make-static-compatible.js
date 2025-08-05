#!/usr/bin/env node

/**
 * 使 API 路由兼容静态导出
 */

const fs = require('fs');
const path = require('path');

const apiRoutes = [
  'src/app/api/upload-image/route.ts',
  'src/app/api/image-details/route.ts',
  'src/app/api/share/route.ts',
  'src/app/api/share/debug/route.ts',
  'src/app/api/download-url/route.ts',
  'src/app/api/poll-task/route.ts',
  'src/app/api/task-status/route.ts',
  'src/app/api/check-r2-config/route.ts',
  'src/app/api/check-afterimage-r2-config/route.ts',
  'src/app/api/test-afterimage-upload/route.ts',
  'src/app/api/test-kie-connection/route.ts',
  'src/app/api/temp-file/route.ts'
];

const staticTemplate = `import { NextRequest, NextResponse } from 'next/server'

// 静态导出兼容路由
export async function GET() {
  return NextResponse.json({ 
    error: 'API not available in static export mode',
    message: 'This feature requires server-side processing',
    status: 'static_mode'
  }, { status: 501 })
}

export async function POST() {
  return NextResponse.json({ 
    error: 'API not available in static export mode',
    message: 'This feature requires server-side processing',
    status: 'static_mode'
  }, { status: 501 })
}`;

apiRoutes.forEach(routePath => {
  const fullPath = path.join(process.cwd(), routePath);
  if (fs.existsSync(fullPath)) {
    console.log(`🔄 更新 ${routePath}...`);
    fs.writeFileSync(fullPath, staticTemplate);
    console.log(`✅ ${routePath} 已更新为静态兼容`);
  }
});

console.log('🎉 所有 API 路由已更新为静态导出兼容');