# Cloudflare Workers 敏感环境变量设置脚本 (PowerShell)
Write-Host "🔐 设置 Cloudflare Workers 敏感环境变量..." -ForegroundColor Green

# 定义敏感环境变量
$secrets = @{
    "KIE_AI_API_KEY" = "2800cbec975bf014d815f4e5353c826a"
    "KIE_AI_API_KEY_2" = "6a77fe3ca6856170f6618d4f249cfc6a"
    "KIE_AI_API_KEY_3" = "db092e9551f4631136cab1b141fdfd21"
    "KIE_AI_API_KEY_4" = "3f06398cf9d8dc02a243f2dd5f2f9489"
    "KIE_AI_API_KEY_5" = "c982688b5c6938943dd721ed1d576edb"
    "IMGBB_API_KEY" = "f62c400dfa7cffdbe66ebcdbf6f2d783"
    "CLOUDFLARE_R2_ACCESS_KEY_ID" = "8072494c2581823ba4eefd7da9e910ca"
    "CLOUDFLARE_R2_SECRET_ACCESS_KEY" = "ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59"
    "CLOUDFLARE_API_TOKEN" = "hgBa5xiIRLis-elTtjKI6WZgpt09e20Y8v4SGwnI"
}

# 设置每个敏感环境变量
foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "设置 $($secret.Key)..." -ForegroundColor Yellow
    $result = wrangler secret put $secret.Key --name kemono-shares-api
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $($secret.Key) 设置成功" -ForegroundColor Green
    } else {
        Write-Host "❌ $($secret.Key) 设置失败" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 敏感环境变量设置完成！" -ForegroundColor Green
Write-Host "Now you can deploy to Cloudflare Workers!" -ForegroundColor Yellow
Write-Host "   Run: wrangler deploy" -ForegroundColor Yellow 