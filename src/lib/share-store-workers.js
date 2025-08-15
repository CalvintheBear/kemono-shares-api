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

  // 简易 slug 化，作为索引键的组成部分
  _slugify(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-\u3040-\u30FF\u4E00-\u9FFF]/g, '')
      .slice(0, 64)
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

  getStyleIndexKey(style) {
    return `share:index:style:${this._slugify(style)}`
  }

  getModelIndexKey(model) {
    return `share:index:model:${this._slugify(model)}`
  }

  getTagIndexKey(tag) {
    return `share:index:tag:${this._slugify(tag)}`
  }

  // 文生图（无 originalUrl）全局索引键
  getPublishedIndexKey() {
    return 'share:index:published:all'
  }

  // 文生图最新条目（精简字段）索引键
  getPublishedLatestKey() {
    return 'share:index:published:latest'
  }

  // 维护最新条目列表，存储精简对象，便于首页极速读取
  async _addToLatestList(key, item, limit = 200) {
    try {
      const raw = await this._kvGet(key)
      let list = raw ? JSON.parse(raw) : []
      if (!Array.isArray(list)) list = []
      // 去重并插入头部
      list = list.filter((x) => x && x.id !== item.id)
      list.unshift(item)
      if (list.length > limit) list = list.slice(0, limit)
      await this._kvPut(key, JSON.stringify(list), 60 * 60 * 24 * 7)
    } catch (e) {
      // 索引失败不影响主流程
    }
  }

  async _addToIndexList(key, id, limit = 500) {
    try {
      const raw = await this._kvGet(key)
      let ids = raw ? JSON.parse(raw) : []
      ids = Array.isArray(ids) ? ids : []
      ids = ids.filter(x => x !== id)
      ids.unshift(id)
      if (ids.length > limit) ids = ids.slice(0, limit)
      await this._kvPut(key, JSON.stringify(ids), 60 * 60 * 24 * 365)
    } catch (e) {
      // 索引失败不影响主流程
    }
  }

  // 生成发布令牌（简单随机串）
  _generatePublishToken() {
    return `ptk_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`
  }

  // 创建分享（默认未发布）
  async createShare(data) {
    try {
      const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const published = typeof data.published === 'boolean' ? data.published : false
      const publishToken = this._generatePublishToken()
      const shareData = {
        id: shareId,
        generatedUrl: data.generatedUrl,
        originalUrl: data.originalUrl || '',
        prompt: data.prompt || '',
        style: data.style,
        timestamp: data.timestamp || Date.now(),
        createdAt: new Date().toISOString(),
        isR2Stored: data.isR2Stored || false,
        // 存储可选seo标签（数组）并兼容新结构
        seoTags: Array.isArray(data.seoTags) ? data.seoTags.slice(0, 20) : [],
        seo: data.seo || undefined,
        model: data.model || undefined,
        published,
        publishToken,
        contributedAt: published ? Date.now() : undefined
      };

      // 存储分享数据
      await this._kvPut(this.getShareKey(shareId), JSON.stringify(shareData), 60 * 60 * 24 * 30);

      // 更新分享列表
      await this.updateShareList(shareId, shareData);

      // 若已发布，建立索引；未发布不入任何索引
      if (published) {
        await this._addToIndexList(this.getPublishedIndexKey(), shareId, 5000)
        await this._addToLatestList(this.getPublishedLatestKey(), {
          id: shareId,
          generatedUrl: shareData.generatedUrl,
          style: shareData.style,
          timestamp: shareData.timestamp,
        }, 200)
        await this._addToIndexList(this.getStyleIndexKey(shareData.style), shareId, 500)
        if (shareData.model) {
          await this._addToIndexList(this.getModelIndexKey(shareData.model), shareId, 500)
        }
        const tagSource = (shareData.seo && Array.isArray(shareData.seo.keywordsJa) && shareData.seo.keywordsJa.length > 0)
          ? shareData.seo.keywordsJa
          : (Array.isArray(shareData.seoTags) ? shareData.seoTags : [])
        const uniqueTags = Array.from(new Set((tagSource || []).map(t => String(t).trim()).filter(Boolean))).slice(0, 3)
        for (const t of uniqueTags) {
          await this._addToIndexList(this.getTagIndexKey(t), shareId, 200)
        }
      }

      // 更新统计信息
      await this.updateStats();

      // 更新缓存
      this.cache.set(shareId, {
        data: shareData,
        timestamp: Date.now()
      });

      console.log('✅ 分享数据已存储到KV:', shareId);
      // 创建返回可包含 publishToken，便于前端后续发布
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
        // 历史兼容：无 published 视为 true
        if (typeof shareData.published !== 'boolean') shareData.published = true
        // 移除 publishToken 防止泄露
        if (shareData.publishToken) delete shareData.publishToken
        
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

  // 获取分享列表（仅已发布）
  async getShareList(limit = 20, offset = 0) {
    try {
      // 优先从“已发布索引”分页
      const raw = await this._kvGet(this.getPublishedIndexKey())
      const idList = raw ? JSON.parse(raw) : []
      if (Array.isArray(idList) && idList.length > 0) {
        const total = idList.length
        const slice = idList.slice(offset, offset + limit)
        const items = []
        for (const id of slice) {
          const share = await this.getShare(id)
          if (!share) continue
          if (share.published === false) continue
          items.push({
            id: share.id,
            title: `${share.style}変換`,
            style: share.style,
            timestamp: share.timestamp,
            createdAt: share.createdAt,
            generatedUrl: share.generatedUrl,
            originalUrl: share.originalUrl || ''
          })
        }
        return { items, total, limit, offset, hasMore: offset + items.length < total }
      }

      // 回退：扫描 share:list，仅取 published=true
      const listData = await this._kvGet(this.getListKey());
      const shareIds = listData ? JSON.parse(listData) : []
      const totalIds = shareIds.length
      const pageItems = []
      let matched = 0
      let hasMore = false
      for (let i = 0; i < totalIds; i++) {
        const id = shareIds[i]
        const share = await this.getShare(id)
        if (!share || share.published === false) continue
        matched++
        if (matched > offset && pageItems.length < limit) {
          pageItems.push({
            id: share.id,
            title: `${share.style}変換`,
            style: share.style,
            timestamp: share.timestamp,
            createdAt: share.createdAt,
            generatedUrl: share.generatedUrl,
            originalUrl: share.originalUrl || ''
          })
        }
        if (pageItems.length >= limit) {
          // 是否还有更多
          for (let j = i + 1; j < totalIds; j++) {
            const nid = shareIds[j]
            const nshare = await this.getShare(nid)
            if (nshare && nshare.published !== false) { hasMore = true; break }
          }
          break
        }
      }
      return { items: pageItems, total: matched, limit, offset, hasMore }
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

  // 发布分享（验证 token，建立索引）
  async publishShare(shareId, token) {
    try {
      const raw = await this._kvGet(this.getShareKey(shareId))
      if (!raw) return { success: false, error: 'NOT_FOUND' }
      const data = JSON.parse(raw)
      // 历史兼容：无 published 字段视为已发布，直接返回成功
      if (typeof data.published !== 'boolean') {
        data.published = true
        delete data.publishToken
        data.contributedAt = data.contributedAt || Date.now()
      } else {
        if (data.published === true) return { success: true, already: true, published: true, contributedAt: data.contributedAt }
        if (!data.publishToken || token !== data.publishToken) return { success: false, error: 'INVALID_TOKEN' }
        data.published = true
        data.contributedAt = Date.now()
        delete data.publishToken
      }

      await this._kvPut(this.getShareKey(shareId), JSON.stringify(data), 60 * 60 * 24 * 30)

      // 建立索引
      await this._addToIndexList(this.getPublishedIndexKey(), shareId, 5000)
      await this._addToLatestList(this.getPublishedLatestKey(), {
        id: shareId,
        generatedUrl: data.generatedUrl,
        style: data.style,
        timestamp: data.timestamp,
      }, 200)
      await this._addToIndexList(this.getStyleIndexKey(data.style), shareId, 500)
      if (data.model) await this._addToIndexList(this.getModelIndexKey(data.model), shareId, 500)
      const tagSource = (data.seo && Array.isArray(data.seo.keywordsJa) && data.seo.keywordsJa.length > 0)
        ? data.seo.keywordsJa
        : (Array.isArray(data.seoTags) ? data.seoTags : [])
      const uniqueTags = Array.from(new Set((tagSource || []).map(t => String(t).trim()).filter(Boolean))).slice(0, 3)
      for (const t of uniqueTags) await this._addToIndexList(this.getTagIndexKey(t), shareId, 200)

      // 更新缓存（不带 token）
      if (this.cache.has(shareId)) {
        const cached = this.cache.get(shareId)
        if (cached?.data) {
          const { publishToken: _omit, ...safe } = { ...cached.data, published: true, contributedAt: data.contributedAt }
          this.cache.set(shareId, { data: safe, timestamp: Date.now() })
        }
      }

      return { success: true, published: true, contributedAt: data.contributedAt }
    } catch (e) {
      return { success: false, error: 'INTERNAL_ERROR' }
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