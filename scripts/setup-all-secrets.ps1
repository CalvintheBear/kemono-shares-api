# Cloudflare Workers 批量设置敏感环境变量脚本 (PowerShell)
Write-Host "🔐 批量设置 Cloudflare Workers 敏感环境变量..." -ForegroundColor Green

# 定义所有敏感环境变量
$secrets = @{
    "IMGBB_API_KEY" = "f62c400dfa7cffdbe66ebcdbf6f2d783"
    "CLOUDFLARE_API_TOKEN" = "hgBa5xiIRLis-elTtjKI6WZgpt09e20Y8v4SGwnI"
}

# 设置每个敏感环境变量
foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "设置 $($secret.Key)..." -ForegroundColor Yellow
    
    # 使用 echo 命令传递值给 wrangler secret put
    $secret.Value | wrangler secret put $secret.Key --name kemono-shares-api
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $($secret.Key) 设置成功" -ForegroundColor Green
    } else {
        Write-Host "❌ $($secret.Key) 设置失败" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 所有敏感环境变量设置完成！" -ForegroundColor Green
Write-Host "📝 现在可以部署到 Cloudflare Workers 了！" -ForegroundColor Yellow
Write-Host "   运行: wrangler deploy" -ForegroundColor Yellow 