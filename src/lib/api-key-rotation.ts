// API Key rotation system for load balancing across multiple Kie.ai keys

export interface ApiKeyInfo {
  key: string;
  userId: string;
  usageCount: number;
  lastUsed: number;
  failures: number;
  isActive: boolean;
}

export class ApiKeyRotation {
  private keys: ApiKeyInfo[] = [];
  private currentIndex = 0;
  private maxFailures = 3;

  constructor() {
    this.initializeKeys();
  }

  private initializeKeys() {
    // Load all available API keys from environment
    const keyConfigs = [
      { key: process.env.KIE_AI_API_KEY, userId: process.env.KIE_AI_USER_ID },
      { key: process.env.KIE_AI_API_KEY_2, userId: process.env.KIE_AI_USER_ID },
      { key: process.env.KIE_AI_API_KEY_3, userId: process.env.KIE_AI_USER_ID },
      { key: process.env.KIE_AI_API_KEY_4, userId: process.env.KIE_AI_USER_ID },
      { key: process.env.KIE_AI_API_KEY_5, userId: process.env.KIE_AI_USER_ID },
    ];

    this.keys = keyConfigs
      .filter(config => config.key && config.userId)
      .map((config) => ({
        key: config.key!,
        userId: config.userId!,
        usageCount: 0,
        lastUsed: 0,
        failures: 0,
        isActive: true,
      }));

    console.log(`🔑 API Key Rotation initialized with ${this.keys.length} keys`);
  }

  // Get next available key using round-robin
  getNextKey(): ApiKeyInfo | null {
    if (this.keys.length === 0) {
      console.error('❌ No API keys available');
      return null;
    }

    let attempts = 0;

    while (attempts < this.keys.length) {
      const keyInfo = this.keys[this.currentIndex];
      
      if (keyInfo.isActive && keyInfo.failures < this.maxFailures) {
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        return keyInfo;
      }

      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      attempts++;
    }

    // If all keys are exhausted, reset failures and try again
    console.warn('⚠️ All keys exhausted, resetting failures');
    this.keys.forEach(key => {
      key.failures = 0;
      key.isActive = true;
    });

    return this.keys[0];
  }

  // Record successful usage
  recordSuccess(key: string) {
    const keyInfo = this.keys.find(k => k.key === key);
    if (keyInfo) {
      keyInfo.usageCount++;
      keyInfo.lastUsed = Date.now();
      keyInfo.failures = 0; // Reset failures on success
      console.log(`✅ Key ${key.substring(0, 8)}... used successfully (${keyInfo.usageCount} total)`);
    }
  }

  // Record failure and potentially disable key
  recordFailure(key: string) {
    const keyInfo = this.keys.find(k => k.key === key);
    if (keyInfo) {
      keyInfo.failures++;
      
      if (keyInfo.failures >= this.maxFailures) {
        keyInfo.isActive = false;
        console.warn(`🚫 Key ${key.substring(0, 8)}... disabled after ${keyInfo.failures} failures`);
      } else {
        console.log(`⚠️ Key ${key.substring(0, 8)}... failure ${keyInfo.failures}/${this.maxFailures}`);
      }
    }
  }

  // Get statistics for monitoring
  getStats() {
    return {
      totalKeys: this.keys.length,
      activeKeys: this.keys.filter(k => k.isActive).length,
      keys: this.keys.map(k => ({
        key: k.key.substring(0, 8) + '...',
        usage: k.usageCount,
        failures: k.failures,
        isActive: k.isActive,
      }))
    };
  }

  // Get all available keys (for debugging)
  getAllKeys(): ApiKeyInfo[] {
    return [...this.keys];
  }
}

// Singleton instance
let apiKeyRotationInstance: ApiKeyRotation | null = null;

export function getApiKeyRotation(): ApiKeyRotation {
  if (!apiKeyRotationInstance) {
    apiKeyRotationInstance = new ApiKeyRotation();
  }
  return apiKeyRotationInstance;
}