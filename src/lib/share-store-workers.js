// Cloudflare Workers 专用的分享数据存储实现
export class ShareStoreWorkers {
  constructor(kvOrEnv) {
    // 既支持直接 KV 绑定，也支持传入 env 使用 REST 回退
    this.kv = kvOrEnv && typeof kvOrEnv.get === 'function' ? kvOrEnv : null;
    this.env = this.kv ? null : kvOrEnv;
    this.apiToken = this.env?.CLOUDFLARE_API_TOKEN;
    this.accountId = this.env?.CLOUDFLARE_ACCOUNT_ID || this.env?.CLOUDFLARE_R2_ACCOUNT_ID;
    this.namespaceId = this.env?.SHARE_KV_NAMESPACE_ID || this.env?.SHARE_DATA_KV_NAMESPACE_ID;
    this.useRest = !this.kv && !!(this.apiToken && this.accountId && this.namespaceId);
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5分钟缓存
  }

  // 生成KV键名
  getShareKey(shareId) {
    return `share:${shareId}`;
  }

  getListKey() {
    return 'share:list';
  }

  getStatsKey() {
    return 'share:stats';
  }

  // 创建分享
  async createShare(data) {
    try {
      const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shareData = {
        id: shareId,
        generatedUrl: data.generatedUrl,
        originalUrl: data.originalUrl || '',
        prompt: data.prompt || '',
        style: data.style,
        timestamp: data.timestamp || Date.now(),
        createdAt: new Date().toISOString(),
        isR2Stored: data.isR2Stored || false,
        // 存储可选seo标签（数组）
        seoTags: Array.isArray(data.seoTags) ? data.seoTags.slice(0, 20) : []
      };

      // 存储分享数据
      await this._kvPut(this.getShareKey(shareId), JSON.stringify(shareData), 60 * 60 * 24 * 30);

      // 更新分享列表
      await this.updateShareList(shareId, shareData);

      // 更新统计信息
      await this.updateStats();

      // 更新缓存
      this.cache.set(shareId, {
        data: shareData,
        timestamp: Date.now()
      });

      console.log('✅ 分享数据已存储到KV:', shareId);
      return shareData;
    } catch (error) {
      console.error('❌ 创建分享失败:', error);
      throw error;
    }
  }

  // 获取分享数据
  async getShare(shareId) {
    try {
      // 检查缓存
      const cached = this.cache.get(shareId);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        console.log('📦 从缓存获取分享数据:', shareId);
        return cached.data;
      }

      // 从KV获取
      const data = await this._kvGet(this.getShareKey(shareId));
      if (data) {
        const shareData = JSON.parse(data);
        
        // 更新缓存
        this.cache.set(shareId, {
          data: shareData,
          timestamp: Date.now()
        });

        console.log('📦 从KV获取分享数据:', shareId);
        return shareData;
      }

      return null;
    } catch (error) {
      console.error('❌ 获取分享数据失败:', error);
      return null;
    }
  }

  // 获取分享列表
  async getShareList(limit = 20, offset = 0) {
    try {
      // 从KV获取列表
      const listData = await this._kvGet(this.getListKey());
      if (!listData) {
        return {
          items: [],
          total: 0,
          limit,
          offset,
          hasMore: false
        };
      }

      const shareIds = JSON.parse(listData);
      const totalIds = shareIds.length;

      // 单次遍历，边过滤边做分页，直到判断出 hasMore
      const pageItems = [];
      let textCount = 0;
      let scanned = 0;
      let hasMore = false;

      for (let i = 0; i < totalIds; i++) {
        const id = shareIds[i];
        const share = await this.getShare(id);
        scanned++;
        if (!share) continue;
        if (share.originalUrl && share.originalUrl !== '') continue; // 仅文生图

        // 当前已匹配的文生图数量
        textCount++;

        // 收集当前页数据：索引区间 (offset, offset+limit]
        if (textCount > offset && pageItems.length < limit) {
          pageItems.push({
            id: share.id,
            title: `${share.style}変換`,
            style: share.style,
            // 保持为原始数值，前端按语言格式化
            timestamp: share.timestamp,
            createdAt: share.createdAt,
            generatedUrl: share.generatedUrl,
            originalUrl: share.originalUrl || ''
          });
        }

        // 如果已经凑满当前页，再看看是否还能找到下一条以确定 hasMore
        if (pageItems.length >= limit) {
          // 继续向后找是否还有第 (offset+limit+1) 条
          for (let j = i + 1; j < totalIds; j++) {
            const nid = shareIds[j];
            const nshare = await this.getShare(nid);
            scanned++;
            if (!nshare) continue;
            if (nshare.originalUrl && nshare.originalUrl !== '') continue;
            hasMore = true;
            break;
          }
          break;
        }
      }

      console.log(`📊 分享列表（文生图）: 扫描${scanned}/${totalIds}，匹配${textCount}个，返回${pageItems.length}个，hasMore=${hasMore}`);

      return {
        items: pageItems,
        total: textCount,
        limit,
        offset,
        hasMore
      };
    } catch (error) {
      console.error('❌ 获取分享列表失败:', error);
      return {
        items: [],
        total: 0,
        limit,
        offset,
        hasMore: false
      };
    }
  }

  // 删除分享
  async deleteShare(shareId) {
    try {
      // 从KV删除
      await this._kvDelete(this.getShareKey(shareId));
      
      // 从列表移除
      await this.removeFromShareList(shareId);
      
      // 从缓存移除
      this.cache.delete(shareId);
      
      // 更新统计信息
      await this.updateStats();

      console.log('✅ 分享数据已删除:', shareId);
      return true;
    } catch (error) {
      console.error('❌ 删除分享失败:', error);
      return false;
    }
  }

  // 获取统计信息
  async getStats() {
    try {
      const statsData = await this._kvGet(this.getStatsKey());
      if (statsData) {
        return JSON.parse(statsData);
      }

      // 如果没有统计信息，重新计算
      return await this.calculateStats();
    } catch (error) {
      console.error('❌ 获取统计信息失败:', error);
      return {
        totalShares: 0,
        r2StoredCount: 0,
        storageSize: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // 更新分享列表
  async updateShareList(shareId, _shareData) {
    try {
      const listData = await this._kvGet(this.getListKey());
      let shareIds = listData ? JSON.parse(listData) : [];
      
      // 避免重复添加
      if (!shareIds.includes(shareId)) {
        shareIds.unshift(shareId); // 添加到开头
        // 限制列表长度，避免无限增长
        if (shareIds.length > 1000) {
          shareIds = shareIds.slice(0, 1000);
        }
        
        await this._kvPut(this.getListKey(), JSON.stringify(shareIds), 60 * 60 * 24 * 365);
      }
    } catch (error) {
      console.error('❌ 更新分享列表失败:', error);
    }
  }

  // 从列表移除分享
  async removeFromShareList(shareId) {
    try {
      const listData = await this._kvGet(this.getListKey());
      if (listData) {
        let shareIds = JSON.parse(listData);
        shareIds = shareIds.filter(id => id !== shareId);
        
        await this._kvPut(this.getListKey(), JSON.stringify(shareIds), 60 * 60 * 24 * 365);
      }
    } catch (error) {
      console.error('❌ 从列表移除分享失败:', error);
    }
  }

  // 更新统计信息
  async updateStats() {
    try {
      const listData = await this._kvGet(this.getListKey());
      if (!listData) {
        return;
      }

      const shareIds = JSON.parse(listData);
      let r2StoredCount = 0;
      let totalSize = 0;

      // 统计R2存储的分享数量
      for (const shareId of shareIds.slice(0, 100)) { // 限制检查数量
        const shareData = await this.getShare(shareId);
        if (shareData && shareData.isR2Stored) {
          r2StoredCount++;
        }
      }

      const stats = {
        totalShares: shareIds.length,
        r2StoredCount,
        storageSize: totalSize,
        lastUpdated: new Date().toISOString()
      };

      await this._kvPut(this.getStatsKey(), JSON.stringify(stats), 60 * 60 * 24 * 7);
    } catch (error) {
      console.error('❌ 更新统计信息失败:', error);
    }
  }

  // 计算统计信息
  async calculateStats() {
    try {
      const listData = await this._kvGet(this.getListKey());
      if (!listData) {
        return {
          totalShares: 0,
          r2StoredCount: 0,
          storageSize: 0,
          lastUpdated: new Date().toISOString()
        };
      }

      const shareIds = JSON.parse(listData);
      let r2StoredCount = 0;

      // 统计R2存储的分享数量
      for (const shareId of shareIds.slice(0, 100)) {
        const shareData = await this.getShare(shareId);
        if (shareData && shareData.isR2Stored) {
          r2StoredCount++;
        }
      }

      const stats = {
        totalShares: shareIds.length,
        r2StoredCount,
        storageSize: 0,
        lastUpdated: new Date().toISOString()
      };

      await this._kvPut(this.getStatsKey(), JSON.stringify(stats), 60 * 60 * 24 * 7);

      return stats;
    } catch (error) {
      console.error('❌ 计算统计信息失败:', error);
      return {
        totalShares: 0,
        r2StoredCount: 0,
        storageSize: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // 清理过期数据
  async cleanup() {
    try {
      const listData = await this._kvGet(this.getListKey());
      if (!listData) {
        return;
      }

      const shareIds = JSON.parse(listData);
      const now = Date.now();
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

      let cleanedCount = 0;
      const validIds = [];

      for (const shareId of shareIds) {
        const shareData = await this.getShare(shareId);
        if (shareData && shareData.timestamp > thirtyDaysAgo) {
          validIds.push(shareId);
        } else {
          // 删除过期数据
          await this._kvDelete(this.getShareKey(shareId));
          this.cache.delete(shareId);
          cleanedCount++;
        }
      }

      // 更新列表
      await this._kvPut(this.getListKey(), JSON.stringify(validIds), 60 * 60 * 24 * 365);

      console.log(`🧹 清理完成: 删除了${cleanedCount}个过期分享`);
    } catch (error) {
      console.error('❌ 清理失败:', error);
    }
  }

  // KV 封装：支持 binding 或 REST 回退
  async _kvGet(key) {
    if (this.kv) return await this.kv.get(key);
    if (!this.useRest) return null;
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/storage/kv/namespaces/${this.namespaceId}/values/${encodeURIComponent(key)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${this.apiToken}` } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return await res.text();
  }

  async _kvPut(key, value, expirationTtlSeconds) {
    if (this.kv) return await this.kv.put(key, value, { expirationTtl: expirationTtlSeconds });
    if (!this.useRest) return;
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/storage/kv/namespaces/${this.namespaceId}/values/${encodeURIComponent(key)}?expiration_ttl=${expirationTtlSeconds}`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'text/plain'
      },
      body: value
    });
  }

  async _kvDelete(key) {
    if (this.kv) return await this.kv.delete(key);
    if (!this.useRest) return;
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/storage/kv/namespaces/${this.namespaceId}/values/${encodeURIComponent(key)}`;
    await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiToken}` }
    });
  }
} 