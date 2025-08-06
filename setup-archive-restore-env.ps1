# Cloudflare Pages 存档点恢复 - 环境变量设置脚本
# 使用方法: 在 PowerShell 中运行此脚本，会输出所有需要在 Cloudflare Pages 控制台设置的环境变量

Write-Host "🚀 Cloudflare Pages 存档点恢复 - 环境变量设置" -ForegroundColor Green
Write-Host "存档点: master 90bb218 修复kv兼容问题" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 需要在 Cloudflare Pages 控制台 > Settings > Environment variables 中设置以下变量：" -ForegroundColor Cyan
Write-Host ""

$env_vars = @{
    "CLOUDFLARE_ACCOUNT_ID" = "9a5ff316a26b8abb696af519e515d2de"
    "CLOUDFLARE_API_TOKEN" = "HJ5ugyPnYiDdOjK_OjsFoZI8KgVytyIjN4GWNpZ9"
    "CLOUDFLARE_R2_ACCESS_KEY_ID" = "8072494c2581823ba4eefd7da9e910ca"
    "CLOUDFLARE_R2_ACCOUNT_ID" = "9a5ff316a26b8abb696af519e515d2de"
    "CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME" = "kemono-afterimage"
    "CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL" = "https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev"
    "CLOUDFLARE_R2_BUCKET_NAME" = "kemono-uploadimage"
    "CLOUDFLARE_R2_PUBLIC_URL" = "https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev"
    "CLOUDFLARE_R2_SECRET_ACCESS_KEY" = "ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59"
    "IMGBB_API_KEY" = "f62c400dfa7cffdbe66ebcdbf6f2d783"
    "KIE_AI_4O_BASE_URL" = "https://api.kie.ai"
    "KIE_AI_API_KEY" = "2800cbec975bf014d815f4e5353c826a"
    "KIE_AI_API_KEY_2" = "6a77fe3ca6856170f6618d4f249cfc6a"
    "KIE_AI_API_KEY_3" = "db092e9551f4631136cab1b141fdfd21"
    "KIE_AI_API_KEY_4" = "3f06398cf9d8dc02a243f2dd5f2f9489"
    "KIE_AI_API_KEY_5" = "c982688b5c6938943dd721ed1d576edb"
    "KIE_AI_EDGE_BASE" = "https://api.kie.ai/api/v1"
    "KIE_AI_USER_ID" = "j2983236233@gmail.com"
    "NEXT_PUBLIC_APP_URL" = "https://2kawaii.com"
    "NODE_ENV" = "production"
}

foreach ($key in $env_vars.Keys) {
    $value = $env_vars[$key]
    Write-Host "变量名称: $key" -ForegroundColor White
    Write-Host "值: $value" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "🔑 KV 命名空间绑定设置:" -ForegroundColor Cyan
Write-Host "变量名称: SHARE_DATA_KV" -ForegroundColor White
Write-Host "KV 命名空间: SHARE_DATA_KV" -ForegroundColor Gray
Write-Host ""

Write-Host "🏗️ 构建设置:" -ForegroundColor Cyan
Write-Host "构建命令: npm run build:pages:static" -ForegroundColor White
Write-Host "构建输出目录: out" -ForegroundColor White
Write-Host "根目录: (留空)" -ForegroundColor White
Write-Host "构建系统版本: v3" -ForegroundColor White
Write-Host ""

Write-Host "📝 安全头 (已在 wrangler.pages.toml 中配置):" -ForegroundColor Cyan
Write-Host "X-Frame-Options: DENY"
Write-Host "X-Content-Type-Options: nosniff"
Write-Host "Referrer-Policy: strict-origin-when-cross-origin"
Write-Host "Permissions-Policy: camera=(), microphone=(), geolocation=()"
Write-Host ""

Write-Host "🔄 重定向 (已在 _redirects 中配置):" -ForegroundColor Cyan
Write-Host "/* /index.html 200"
Write-Host ""

Write-Host "✅ 设置完成后，在 Cloudflare Pages 控制台触发重新部署" -ForegroundColor Green
Write-Host "🌐 访问 https://2kawaii.com 验证部署成功" -ForegroundColor Green
Write-Host ""

Write-Host "📖 详细说明请参考: CLOUDFLARE_ARCHIVE_RESTORE_GUIDE.md" -ForegroundColor Yellow
