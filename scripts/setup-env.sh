#!/bin/bash

# Cloudflare Workers 环境变量设置脚本
# 使用方法: ./scripts/setup-env.sh

echo "🔧 设置 Cloudflare Workers 环境变量..."

# 设置基础环境变量
wrangler secret put KIE_AI_API_KEY --name kemono-shares-api
wrangler secret put KIE_AI_API_KEY_2 --name kemono-shares-api
wrangler secret put KIE_AI_API_KEY_3 --name kemono-shares-api
wrangler secret put KIE_AI_API_KEY_4 --name kemono-shares-api
wrangler secret put KIE_AI_API_KEY_5 --name kemono-shares-api

# 设置应用配置
wrangler secret put NEXT_PUBLIC_APP_URL --name kemono-shares-api
wrangler secret put KIE_AI_40_BASE_URL --name kemono-shares-api
wrangler secret put KIE_AI_USER_ID --name kemono-shares-api
wrangler secret put KIE_AI_EDGE_BASE --name kemono-shares-api
wrangler secret put IMGBB_API_KEY --name kemono-shares-api

# 设置 R2 配置
wrangler secret put CLOUDFLARE_R2_ACCOUNT_ID --name kemono-shares-api
wrangler secret put CLOUDFLARE_R2_ACCESS_KEY_ID --name kemono-shares-api
wrangler secret put CLOUDFLARE_R2_SECRET_ACCESS_KEY --name kemono-shares-api
wrangler secret put CLOUDFLARE_R2_BUCKET_NAME --name kemono-shares-api
wrangler secret put CLOUDFLARE_R2_PUBLIC_URL --name kemono-shares-api

# 设置 API Token
wrangler secret put CLOUDFLARE_API_TOKEN --name kemono-shares-api

# 设置 AI 生成图片存储桶配置
wrangler secret put CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME --name kemono-shares-api
wrangler secret put CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL --name kemono-shares-api

echo "✅ 环境变量设置完成！"
echo "📝 注意：请手动输入每个变量的值" 