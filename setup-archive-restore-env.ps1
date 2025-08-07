# Cloudflare 存档点恢复环境变量设置脚本
# 根据 CLOUDFLARE_ARCHIVE_RESTORE_GUIDE.md 自动设置环境变量

Write-Host "🚀 开始设置 Cloudflare 存档点恢复环境变量..." -ForegroundColor Green

# R2 配置
$env:CLOUDFLARE_ACCOUNT_ID = "9a5ff316a26b8abb696af519e515d2de"
$env:CLOUDFLARE_API_TOKEN = "HJ5ugyPnYiDdOjK_OjsFoZI8KgVytyIjN4GWNpZ9"
$env:CLOUDFLARE_R2_ACCESS_KEY_ID = "8072494c2581823ba4eefd7da9e910ca"
$env:CLOUDFLARE_R2_ACCOUNT_ID = "9a5ff316a26b8abb696af519e515d2de"
$env:CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME = "kemono-afterimage"
$env:CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL = "https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev"
$env:CLOUDFLARE_R2_BUCKET_NAME = "kemono-uploadimage"
$env:CLOUDFLARE_R2_PUBLIC_URL = "https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev"
$env:CLOUDFLARE_R2_SECRET_ACCESS_KEY = "ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59"

# KIE AI 配置
$env:IMGBB_API_KEY = "f62c400dfa7cffdbe66ebcdbf6f2d783"
$env:KIE_AI_4O_BASE_URL = "https://api.kie.ai"
$env:KIE_AI_API_KEY = "2800cbec975bf014d815f4e5353c826a"
$env:KIE_AI_API_KEY_2 = "6a77fe3ca6856170f6618d4f249cfc6a"
$env:KIE_AI_API_KEY_3 = "db092e9551f4631136cab1b141fdfd21"
$env:KIE_AI_API_KEY_4 = "3f06398cf9d8dc02a243f2dd5f2f9489"
$env:KIE_AI_API_KEY_5 = "c982688b5c6938943dd721ed1d576edb"
$env:KIE_AI_EDGE_BASE = "https://api.kie.ai/api/v1"
$env:KIE_AI_USER_ID = "j2983236233@gmail.com"

# 应用配置
$env:NEXT_PUBLIC_APP_URL = "https://2kawaii.com"
$env:NODE_ENV = "production"

# Cloudflare Pages 配置
$env:CF_PAGES = "true"
$env:STATIC_EXPORT = "true"

Write-Host "✅ 环境变量设置完成!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 已设置的环境变量:" -ForegroundColor Yellow
Write-Host "- CLOUDFLARE_ACCOUNT_ID: $env:CLOUDFLARE_ACCOUNT_ID" -ForegroundColor Gray
Write-Host "- CLOUDFLARE_R2_BUCKET_NAME: $env:CLOUDFLARE_R2_BUCKET_NAME" -ForegroundColor Gray
Write-Host "- CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME: $env:CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME" -ForegroundColor Gray
Write-Host "- NEXT_PUBLIC_APP_URL: $env:NEXT_PUBLIC_APP_URL" -ForegroundColor Gray
Write-Host "- NODE_ENV: $env:NODE_ENV" -ForegroundColor Gray
Write-Host "- CF_PAGES: $env:CF_PAGES" -ForegroundColor Gray
Write-Host "- STATIC_EXPORT: $env:STATIC_EXPORT" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 下一步操作:" -ForegroundColor Cyan
Write-Host "1. 运行构建测试: npm run build:pages:static" -ForegroundColor White
Write-Host "2. 验证输出目录: ls out" -ForegroundColor White
Write-Host "3. 部署到 Cloudflare Pages: npm run deploy:pages" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  注意: 在 Cloudflare Pages 控制台中也需要设置相同的环境变量!" -ForegroundColor Red