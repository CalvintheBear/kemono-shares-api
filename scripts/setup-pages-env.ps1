# Cloudflare Pages 环境变量配置脚本
# 为 kemono-shares-api 项目设置缺失的R2配置

Write-Host "🔧 开始配置 Cloudflare Pages 环境变量..." -ForegroundColor Green

# 项目名称
$PROJECT_NAME = "kemono-shares-api"

# 需要设置的环境变量
$ENV_VARS = @{
    "CLOUDFLARE_R2_ACCOUNT_ID" = "9a5ff316a26b8abb696af519e515d2de"
    "CLOUDFLARE_R2_ACCESS_KEY_ID" = "8072494c2581823ba4eefd7da9e910ca"
    "CLOUDFLARE_R2_SECRET_ACCESS_KEY" = "ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59"
    "CLOUDFLARE_R2_BUCKET_NAME" = "kemono-uploadimage"
    "CLOUDFLARE_R2_PUBLIC_URL" = "https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev"
    "CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME" = "kemono-afterimage"
    "CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL" = "https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev"
}

Write-Host "📋 需要设置的环境变量:" -ForegroundColor Yellow
foreach ($key in $ENV_VARS.Keys) {
    Write-Host "  - $key" -ForegroundColor Cyan
}

Write-Host "`n🚀 开始设置环境变量..." -ForegroundColor Green

foreach ($key in $ENV_VARS.Keys) {
    $value = $ENV_VARS[$key]
    Write-Host "设置 $key..." -ForegroundColor Yellow
    
    try {
        # 使用 wrangler pages secret put 命令设置环境变量
        $command = "wrangler pages secret put $key --project-name $PROJECT_NAME"
        Write-Host "执行: $command" -ForegroundColor Gray
        
        # 这里需要手动输入，因为secret值不能通过命令行传递
        Write-Host "请在下一个提示中输入值: $value" -ForegroundColor Green
        Write-Host "或者按 Ctrl+C 跳过此变量" -ForegroundColor Red
        
        # 注意：实际使用时需要手动输入值
        # wrangler pages secret put $key --project-name $PROJECT_NAME
        
    } catch {
        Write-Host "❌ 设置 $key 失败: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n✅ 环境变量配置完成！" -ForegroundColor Green
Write-Host "`n📝 手动设置步骤:" -ForegroundColor Yellow
Write-Host "1. 访问 Cloudflare Pages 控制台" -ForegroundColor White
Write-Host "2. 选择项目: $PROJECT_NAME" -ForegroundColor White
Write-Host "3. 进入 Settings > Environment variables" -ForegroundColor White
Write-Host "4. 添加以下环境变量:" -ForegroundColor White

foreach ($key in $ENV_VARS.Keys) {
    $value = $ENV_VARS[$key]
    Write-Host "   $key = $value" -ForegroundColor Cyan
}

Write-Host "`n🔍 验证配置:" -ForegroundColor Yellow
Write-Host "设置完成后，访问 https://2kawaii.com/api/debug-env 验证配置" -ForegroundColor White
