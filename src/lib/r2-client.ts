import { S3Client } from '@aws-sdk/client-s3';

// Cloudflare R2客户端配置
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

// R2配置验证
export function validateR2Config(): boolean {
  const requiredEnvVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID', 
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ 缺少Cloudflare R2配置:', missingVars);
    return false;
  }

  console.log('✅ Cloudflare R2配置验证通过');
  return true;
}

// 获取R2配置信息（用于调试）
export function getR2ConfigInfo() {
  return {
    accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID ? '已配置' : '未配置',
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? '已配置' : '未配置',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? '已配置' : '未配置',
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || '未配置',
    publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || '未配置',
    endpoint: process.env.CLOUDFLARE_R2_ACCOUNT_ID 
      ? `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : '未配置'
  };
} 