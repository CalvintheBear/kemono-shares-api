#!/bin/bash

# Cloudflare KV 存储设置脚本
# 使用方法: ./scripts/setup-kv-storage.sh

echo "🔧 设置 Cloudflare KV 存储..."

# 创建生产环境 KV 命名空间
echo "📦 创建生产环境 KV 命名空间..."
PRODUCTION_KV_ID=$(wrangler kv:namespace create "SHARE_DATA_KV" --preview=false --format=json | jq -r '.id')

if [ $? -eq 0 ] && [ "$PRODUCTION_KV_ID" != "null" ]; then
    echo "✅ 生产环境 KV 命名空间创建成功: $PRODUCTION_KV_ID"
else
    echo "❌ 生产环境 KV 命名空间创建失败"
    exit 1
fi

# 创建预览环境 KV 命名空间
echo "📦 创建预览环境 KV 命名空间..."
PREVIEW_KV_ID=$(wrangler kv:namespace create "SHARE_DATA_KV" --preview=true --format=json | jq -r '.id')

if [ $? -eq 0 ] && [ "$PREVIEW_KV_ID" != "null" ]; then
    echo "✅ 预览环境 KV 命名空间创建成功: $PREVIEW_KV_ID"
else
    echo "❌ 预览环境 KV 命名空间创建失败"
    exit 1
fi

# 更新 wrangler.jsonc 文件
echo "📝 更新 wrangler.jsonc 配置..."
sed -i.bak "s/your-kv-namespace-id/$PRODUCTION_KV_ID/g" wrangler.jsonc
sed -i.bak "s/your-preview-kv-namespace-id/$PREVIEW_KV_ID/g" wrangler.jsonc

echo "✅ KV 存储配置完成！"
echo ""
echo "📋 配置信息:"
echo "   - 生产环境 KV ID: $PRODUCTION_KV_ID"
echo "   - 预览环境 KV ID: $PREVIEW_KV_ID"
echo ""
echo "🚀 现在可以部署到 Cloudflare Workers 了！"
echo "   运行: wrangler deploy" 