require('dotenv').config({ path: '.env.local' });

console.log('�� 环境变量检查:');
console.log('KIE_AI_API_KEY:', process.env.KIE_AI_API_KEY ? `${process.env.KIE_AI_API_KEY.substring(0, 8)}...` : '❌ 未设置');
console.log('KIE_AI_USER_ID:', process.env.KIE_AI_USER_ID || '❌ 未设置');
console.log('完整 API Key:', process.env.KIE_AI_API_KEY || '❌ 未设置');