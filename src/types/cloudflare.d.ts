// Cloudflare Workers 类型声明

declare global {
  interface Env {
    SHARE_DATA_KV: KVNamespace;
    ASSETS: Fetcher;
  }

  // 扩展全局类型
  var SHARE_DATA_KV: KVNamespace;
}

// 确保这是模块
export {};

// KVNamespace 接口定义（简化版）
declare interface KVNamespace {
  get(key: string): Promise<string | null>;
  get(key: string, type: "text"): Promise<string | null>;
  get(key: string, type: "json"): Promise<unknown>;
  get(key: string, type: "arrayBuffer"): Promise<ArrayBuffer | null>;
  get(key: string, type: "stream"): Promise<ReadableStream | null>;

  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: KVNamespacePutOptions): Promise<void>;
  
  delete(key: string): Promise<void>;
  
  list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult>;
}

interface KVNamespacePutOptions {
  expiration?: string | number;
  expirationTtl?: string | number;
  metadata?: Record<string, unknown>;
}

interface KVNamespaceListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

interface KVNamespaceListResult {
  keys: Array<{
    name: string;
    expiration?: number;
    metadata?: Record<string, unknown>;
  }>;
  list_complete: boolean;
  cursor?: string;
}