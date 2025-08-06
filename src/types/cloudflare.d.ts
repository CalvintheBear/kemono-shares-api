// Cloudflare Workers 类型声明

declare global {
  interface Env {
    SHARE_DATA_KV: KVNamespace;
    ASSETS: Fetcher;
    AFTERIMAGE_BUCKET: R2Bucket;
    UPLOAD_BUCKET: R2Bucket;
  }

  // 扩展全局类型
  var SHARE_DATA_KV: KVNamespace;
  var AFTERIMAGE_BUCKET: R2Bucket;
  var UPLOAD_BUCKET: R2Bucket;
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

// R2Bucket 接口定义
declare interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  get(key: string, options: R2GetOptions): Promise<R2Object | null>;
  
  put(key: string, value: ArrayBuffer | ArrayBufferView | string | null | ReadableStream): Promise<R2Object | null>;
  put(key: string, value: ArrayBuffer | ArrayBufferView | string | null | ReadableStream, options: R2PutOptions): Promise<R2Object | null>;
  
  delete(key: string | string[]): Promise<void>;
  
  list(options?: R2ListOptions): Promise<R2Objects>;
  
  head(key: string): Promise<R2Object | null>;
}

interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  range?: R2Range;
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T>(): Promise<T>;
  blob(): Promise<Blob>;
}

interface R2GetOptions {
  onlyIf?: R2Conditional;
  range?: R2Range;
}

interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  md5?: ArrayBuffer | string;
  sha1?: ArrayBuffer | string;
  sha256?: ArrayBuffer | string;
  sha384?: ArrayBuffer | string;
  sha512?: ArrayBuffer | string;
  onlyIf?: R2Conditional;
}

interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

interface R2Range {
  offset?: number;
  length?: number;
  suffix?: number;
}

interface R2Conditional {
  etagMatches?: string;
  etagDoesNotMatch?: string;
  uploadedBefore?: Date;
  uploadedAfter?: Date;
}

interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
  startAfter?: string;
  include?: ("httpMetadata" | "customMetadata")[];
}

interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}