/**
 * RSA 加密工具模块
 * 用于登录/注册时密码的加密传输
 * 
 * 注意：Next.js standalone 模式下，每个 API route 会被打包为独立 bundle，
 * 内存中的变量不共享。因此密钥对必须通过环境变量注入，确保所有路由使用同一对密钥。
 */

import crypto from 'crypto';

/**
 * 从环境变量中读取 Base64 编码的 RSA 密钥对并解码为 PEM 格式
 */
function getKeyPair(): { publicKey: string; privateKey: string } {
  const pubB64 = process.env.RSA_PUBLIC_KEY_BASE64;
  const privB64 = process.env.RSA_PRIVATE_KEY_BASE64;

  if (!pubB64 || !privB64) {
    throw new Error(
      '[Crypto] 缺少 RSA 密钥环境变量 RSA_PUBLIC_KEY_BASE64 / RSA_PRIVATE_KEY_BASE64，请在 docker-compose.yml 或 .env 中配置'
    );
  }

  return {
    publicKey: Buffer.from(pubB64, 'base64').toString('utf8'),
    privateKey: Buffer.from(privB64, 'base64').toString('utf8'),
  };
}

/**
 * 获取 RSA 公钥（PEM 格式）
 */
export function getPublicKey(): string {
  return getKeyPair().publicKey;
}

/**
 * 使用 RSA 私钥解密数据
 * @param encryptedBase64 - Base64 编码的加密数据
 * @returns 解密后的明文字符串
 */
export function rsaDecrypt(encryptedBase64: string): string {
  const { privateKey } = getKeyPair();
  const buffer = Buffer.from(encryptedBase64, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return decrypted.toString('utf8');
}
