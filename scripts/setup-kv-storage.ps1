# Cloudflare KV 存储设置脚本 (PowerShell)
# 使用方法: .\scripts\setup-kv-storage.ps1

Write-Host "🔧 设置 Cloudflare KV 存储..." -ForegroundColor Green

# 创建生产环境 KV 命名空间
Write-Host "📦 创建生产环境 KV 命名空间..." -ForegroundColor Yellow
$productionResult = wrangler kv:namespace create "SHARE_DATA_KV" --preview=false --format=json
$productionKvId = ($productionResult | ConvertFrom-Json).id

if ($LASTEXITCODE -eq 0 -and $productionKvId) {
    Write-Host "✅ 生产环境 KV 命名空间创建成功: $productionKvId" -ForegroundColor Green
} else {
    Write-Host "❌ 生产环境 KV 命名空间创建失败" -ForegroundColor Red
    exit 1
}

# 创建预览环境 KV 命名空间
Write-Host "📦 创建预览环境 KV 命名空间..." -ForegroundColor Yellow
$previewResult = wrangler kv:namespace create "SHARE_DATA_KV" --preview=true --format=json
$previewKvId = ($previewResult | ConvertFrom-Json).id

if ($LASTEXITCODE -eq 0 -and $previewKvId) {
    Write-Host "✅ 预览环境 KV 命名空间创建成功: $previewKvId" -ForegroundColor Green
} else {
    Write-Host "❌ 预览环境 KV 命名空间创建失败" -ForegroundColor Red
    exit 1
}

# 更新 wrangler.jsonc 文件
Write-Host "📝 更新 wrangler.jsonc 配置..." -ForegroundColor Yellow
$wranglerContent = Get-Content "wrangler.jsonc" -Raw
$wranglerContent = $wranglerContent -replace "your-kv-namespace-id", $productionKvId
$wranglerContent = $wranglerContent -replace "your-preview-kv-namespace-id", $previewKvId
Set-Content "wrangler.jsonc" $wranglerContent

Write-Host "✅ KV 存储配置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 配置信息:" -ForegroundColor Cyan
Write-Host "   - 生产环境 KV ID: $productionKvId" -ForegroundColor White
Write-Host "   - 预览环境 KV ID: $previewKvId" -ForegroundColor White
Write-Host ""
Write-Host "🚀 现在可以部署到 Cloudflare Workers 了！" -ForegroundColor Green
Write-Host "   运行: wrangler deploy" -ForegroundColor Yellow 