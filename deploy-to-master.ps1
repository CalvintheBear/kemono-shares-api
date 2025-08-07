# 部署到master分支并触发Cloudflare Pages部署
Write-Host "🚀 开始部署到master分支..." -ForegroundColor Green

# 1. 添加所有更改
Write-Host "📝 添加文件更改..." -ForegroundColor Yellow
git add .

# 2. 提交更改
Write-Host "💾 提交更改..." -ForegroundColor Yellow
$commitMessage = "feat: 修复分享功能 - 采用动态导出策略支持API路由"
git commit -m $commitMessage

# 3. 推送到master分支
Write-Host "📤 推送到master分支..." -ForegroundColor Yellow
git push origin master

Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "🌐 Cloudflare Pages将自动触发构建和部署" -ForegroundColor Cyan
Write-Host "📋 请检查Cloudflare Pages控制台的构建状态" -ForegroundColor Cyan
