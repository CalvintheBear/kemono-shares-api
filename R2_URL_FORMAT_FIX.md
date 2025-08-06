# 🔧 R2 URL格式修复总结

## 问题根源

根据Cloudflare R2文档，您的R2 URL格式不正确。正确的格式应该是：

```
https://pub-{account-id}.r2.dev/{bucket-name}/{object-key}
```

而不是：
```
https://pub-{account-id}.r2.dev/{object-key}  ❌ 错误
```

## 修复内容

### 1. 修复R2客户端URL构建逻辑

**文件**: `src/lib/r2-client-cloudflare.ts`

**修复前**:
```typescript
const publicUrl = env.CLOUDFLARE_R2_PUBLIC_URL 
  ? `${env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
  : `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${key}`;
```

**修复后**:
```typescript
const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME || 'kemono-uploadimage';
const publicUrl = env.CLOUDFLARE_R2_PUBLIC_URL 
  ? `${env.CLOUDFLARE_R2_PUBLIC_URL}/${bucketName}/${key}`
  : `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${bucketName}/${key}`;
```

### 2. 修复环境变量配置

**文件**: `wrangler.pages.toml`

**修复前**:
```toml
CLOUDFLARE_R2_PUBLIC_URL = "https://pub-9a5ff316a26b8abb696af519e515d2de.r2.dev"
CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL = "https://pub-9a5ff316a26b8abb696af519e515d2de.r2.dev"
```

**修复后**:
```toml
CLOUDFLARE_R2_PUBLIC_URL = "https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev"
CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL = "https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev"
```

### 3. 修复轮询逻辑

**文件**: `src/components/Workspace.tsx`

- 修复成功判断逻辑，确保正确处理回调已处理的情况
- 添加调试日志，便于问题排查
- 优化URL处理逻辑，区分临时URL和R2 URL

## 正确的URL格式示例

### 上传图片URL
```
https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev/uploads/1754454431160-gl2z86hasq5.jpg
```

### 生成图片URL
```
https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/generated/ef5a8f6c837341545eeed156c149b481_1.jpg
```

## 验证步骤

1. **运行验证脚本**:
   ```bash
   node scripts/verify-r2-config.js
   ```

2. **测试图片上传**:
   - 上传一张图片
   - 验证生成的URL格式是否正确

3. **测试图生图功能**:
   - 上传图片
   - 选择图生图模式
   - 输入提示词
   - 验证生成的图片是否基于上传的图片

4. **检查轮询逻辑**:
   - 确认轮询能正确处理成功状态
   - 验证图片能正确显示在结果区

## 预期结果

修复后，您应该能够：

1. ✅ 正常访问上传的图片URL（正确的格式）
2. ✅ 图生图模式正常工作
3. ✅ 生成的图片正确显示
4. ✅ 轮询逻辑正确处理成功状态
5. ✅ 不再出现401错误

## 相关文档

- [Cloudflare R2文档](https://developers.cloudflare.com/r2/)
- [R2公共存储桶配置](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [R2 CORS配置](https://developers.cloudflare.com/r2/buckets/configure-cors/)

## 注意事项

1. **URL格式必须包含桶名**：这是Cloudflare R2的要求
2. **使用正确的Account ID**：确保使用正确的Cloudflare账户ID
3. **启用公共访问权限**：确保R2存储桶已启用公共访问
4. **配置CORS策略**：如果需要跨域访问，请配置适当的CORS策略 