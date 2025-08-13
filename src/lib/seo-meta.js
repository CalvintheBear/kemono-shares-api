// 轻量级 SEO 元数据生成器（无第三方依赖，可在 CF Pages Functions 运行）
// 输入 prompt/style/model，输出多语言的标题、描述、标签与关键词

function deduplicate(array) {
  const seen = new Set()
  const result = []
  for (const item of array) {
    const key = (item || '').toLowerCase().trim()
    if (!key) continue
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  return result
}

function splitTokens(text) {
  if (!text || typeof text !== 'string') return []
  const raw = text
    .replace(/[\n\r]/g, ' ')
    .replace(/[|]/g, ' ')
  const parts = raw.split(/[、，。・,.;:!？?！\-_/()\[\]\s]+/g)
  return parts
    .map(t => t.trim())
    .filter(t => t.length >= 2)
}

function filterJa(tokens) {
  const jaStop = ['の', 'と', 'に', 'を', 'が', 'へ', 'や', 'で', 'から', 'まで', 'より', 'また', 'そして', 'です', 'ます']
  const jaRegex = /[\u3040-\u30FF\u4E00-\u9FFF]/
  return tokens.filter(t => jaRegex.test(t) && !jaStop.includes(t))
}

function filterEn(tokens) {
  const stop = new Set(['the','a','an','and','or','of','for','to','with','in','on','at','by','from','this','that','is','are','be','as','it','its','into','your','our'])
  return tokens
    .map(t => t.toLowerCase())
    .filter(t => /^[a-z0-9\-]+$/.test(t) && !stop.has(t))
}

function labelForModel(model) {
  if (model === 'flux-kontext-pro' || model === 'flux-kontext-max') return 'Flux Kontext'
  if (model === 'gpt4o-image') return 'GPT-4o Image'
  if (!model) return 'GPT-4o / Flux Kontext'
  return model
}

export function buildSeoMeta({ prompt = '', style = 'カスタム', model = '' }) {
  const modelLabel = labelForModel(model)
  const tokens = splitTokens(prompt)
  const jaTokens = filterJa(tokens)
  const enTokens = filterEn(tokens)

  const baseJa = [
    style,
    'チャットgpt 画像生成',
    '画像生成ai 無料',
    'ai画像生成 サイト 無料 登録不要',
    modelLabel
  ]
  const baseEn = [
    style,
    'ai image generation',
    'free ai image',
    'ai art',
    modelLabel
  ]

  const tagsJa = deduplicate([...baseJa, ...jaTokens]).slice(0, 20)
  const tagsEn = deduplicate([...baseEn, ...enTokens]).slice(0, 20)

  const shortPromptJa = (prompt || '').slice(0, 50)
  const shortPromptEn = (prompt || '').slice(0, 60)

  const titleJa = `${style} | チャットGPT 画像生成 プロンプト | ${shortPromptJa}`
  const descJa = `チャットGPT 画像生成 プロンプト: ${(prompt || '').slice(0, 140)}`.slice(0, 160)
  const titleEn = `${style} | ${modelLabel} | ChatGPT AI Prompt | ${shortPromptEn}`
  const descEn = `${modelLabel} — ChatGPT AI Prompt: ${(prompt || '').slice(0, 140)}`.slice(0, 160)

  return {
    modelLabel,
    tagsJa,
    tagsEn,
    keywordsJa: tagsJa,
    keywordsEn: tagsEn,
    titleJa,
    titleEn,
    descJa,
    descEn
  }
}

export default buildSeoMeta


