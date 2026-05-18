/**
 * RayMatrix AI 服务层
 * 
 * 【奶奶看这里】这个文件是"AI接线员"
 * 它负责：把您页面上填写的信息 → 打包发给AI → 把AI的回答传回页面
 * 
 * 您不需要修改这个文件，它已经写好了所有逻辑
 */

// ==================== 基础配置 ====================

const API_KEY = import.meta.env.VITE_AI_API_KEY || ''
const BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'https://api.deepseek.com'
const MODEL = import.meta.env.VITE_AI_MODEL || 'deepseek-chat'

// DashScope 配置
const DASHSCOPE_API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || ''
const DASHSCOPE_BASE_URL = import.meta.env.VITE_DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com'
const DASHSCOPE_IMAGE_MODEL = import.meta.env.VITE_DASHSCOPE_IMAGE_MODEL || 'wan2.7-image-pro'
const DASHSCOPE_VIDEO_T2V_MODEL = import.meta.env.VITE_DASHSCOPE_VIDEO_T2V_MODEL || 'happyhorse-1.0-t2v'
const DASHSCOPE_VIDEO_I2V_MODEL = import.meta.env.VITE_DASHSCOPE_VIDEO_I2V_MODEL || 'happyhorse-1.0-i2v'

// ==================== 通用请求函数 ====================

/**
 * 向AI发送消息并获取回复
 * 
 * 简单理解：就像给AI写一封信，AI读完之后回您一封信
 * 
 * @param systemPrompt - 系统提示词（告诉AI它的角色和任务）
 * @param userPrompt - 用户消息（具体要AI做的事情）
 * @returns AI的回复文本
 */
async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  // 检查是否配置了API密钥
  if (!API_KEY || API_KEY === 'your-api-key-here') {
    throw new Error('请先配置API密钥！请在项目根目录的 .env 文件中设置 VITE_AI_API_KEY')
  }

  // 构建请求地址
  const url = BASE_URL.endsWith('/v1') 
    ? `${BASE_URL}/chat/completions` 
    : `${BASE_URL}/v1/chat/completions`

  // 发送请求给AI
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,  // 创造性程度，0.7是比较平衡的值
      max_tokens: 4096,  // AI回复的最大长度
    }),
  })

  // 检查请求是否成功
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `AI服务请求失败 (${response.status}): ${errorData.error?.message || response.statusText}`
    )
  }

  // 解析AI的回复
  const data = await response.json()
  const aiReply = data.choices?.[0]?.message?.content

  if (!aiReply) {
    throw new Error('AI返回了空内容，请重试')
  }

  return aiReply
}

// ==================== 缝合生成器 - AI功能 ====================

/** 智能映射结果 */
export interface MappingResult {
  mappings: Array<{
    slotId: string
    slotName: string
    productField: string
    matched: boolean
    confidence: number  // 匹配置信度 0-1
    suggestion?: string // AI的补充建议
  }>
  overallAnalysis: string // AI对整体匹配情况的分析
}

/**
 * AI智能映射：把商品参数自动匹配到基模槽位
 * 
 * 简单理解：AI帮您看看"商品的哪些信息"应该填到"模板的哪个位置"
 * 就像帮您整理行李箱——AI知道什么东西放哪个格子最合适
 */
export async function aiSmartMapping(params: {
  templateName: string
  templateDescription: string
  slots: Array<{ id: string; name: string; description: string; placeholder: string }>
  product: {
    name: string
    category: string
    coreParams: string
    sellingPoints: string
    usageScene: string
    painPoint: string
    brandStory: string
    price: string
  }
}): Promise<MappingResult> {
  const systemPrompt = `你是RayMatrix平台的AI映射引擎。你的任务是将商品参数智能匹配到内容基模的槽位中。

匹配规则：
1. 根据槽位名称和描述，找到最相关的商品字段
2. 评估匹配置信度（0-1）
3. 如果某个槽位没有直接匹配的商品字段，给出补充建议
4. 对整体匹配情况给出分析

你必须以JSON格式回复，格式如下：
{
  "mappings": [
    {
      "slotId": "槽位ID",
      "slotName": "槽位名称", 
      "productField": "匹配到的商品字段值（没匹配到则为空字符串）",
      "matched": true或false,
      "confidence": 0.0到1.0的数字,
      "suggestion": "如果没匹配到或置信度低，给出补充建议"
    }
  ],
  "overallAnalysis": "整体匹配分析说明"
}

只返回JSON，不要其他文字。`

  const userPrompt = `请为以下商品和基模进行智能映射：

【基模信息】
名称：${params.templateName}
描述：${params.templateDescription}

【基模槽位】
${params.slots.map(s => `- ID:${s.id} | 名称:${s.name} | 描述:${s.description} | 示例:${s.placeholder}`).join('\n')}

【商品信息】
产品名称：${params.product.name}
品类：${params.product.category}
核心参数：${params.product.coreParams}
核心卖点：${params.product.sellingPoints}
使用场景：${params.product.usageScene}
痛点描述：${params.product.painPoint}
品牌故事：${params.product.brandStory}
价格：${params.product.price}`

  const result = await callAI(systemPrompt, userPrompt)
  
  try {
    // 尝试从AI回复中提取JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('AI返回格式不正确')
  } catch {
    // 如果JSON解析失败，返回一个基本的映射结果
    return {
      mappings: params.slots.map(slot => ({
        slotId: slot.id,
        slotName: slot.name,
        productField: '',
        matched: false,
        confidence: 0,
        suggestion: 'AI映射解析异常，请手动确认'
      })),
      overallAnalysis: 'AI映射结果解析异常，建议手动确认映射关系'
    }
  }
}

/** 生成内容结果 */
export interface GeneratedContentResult {
  copywriting: string   // 推广文案
  detailPage: string    // 详情页排版
  videoScript: string   // 视频分镜脚本
}

/**
 * AI内容生成：根据映射关系生成本土化内容
 * 
 * 简单理解：AI根据模板的"剧本"和您填的商品信息，
 * 帮您写出适合外国人的广告文案、产品页面和视频脚本
 */
export async function aiGenerateContent(params: {
  templateName: string
  templateDescription: string
  structure: Array<{ label: string; type: string }>
  logicPath: Array<{ from: string; to: string; label: string; type: string }>
  styleTags: string[]
  mappings: Array<{ slotName: string; productField: string }>
  targetMarket: string
  targetLanguage: string
}): Promise<GeneratedContentResult> {
  const systemPrompt = `你是RayMatrix平台的内容生成引擎。你需要根据基模逻辑和商品信息，生成三种本土化营销内容。

生成要求：
1. 推广文案：社交媒体风格的推广文案，符合目标市场文化和语言习惯
2. 详情页排版：电商平台产品详情页的完整内容排版
3. 视频分镜脚本：短视频脚本，包含时间轴、画面描述、文字叠加、音效说明

你必须以JSON格式回复，格式如下：
{
  "copywriting": "推广文案内容",
  "detailPage": "详情页内容",  
  "videoScript": "视频脚本内容"
}

每种内容都要严格遵循基模的结构逻辑和风格标签。只返回JSON，不要其他文字。`

  const userPrompt = `请基于以下信息生成本土化营销内容：

【基模信息】
名称：${params.templateName}
描述：${params.templateDescription}

【内容结构】
${params.structure.map(s => `- ${s.label} (${s.type})`).join('\n')}

【说服逻辑】
${params.logicPath.map(l => `- ${l.from} → ${l.to}：${l.label} (${l.type})`).join('\n')}

【风格标签】
${params.styleTags.join('、')}

【商品与槽位映射】
${params.mappings.map(m => `- ${m.slotName}：${m.productField}`).join('\n')}

【目标市场】${params.targetMarket}
【目标语言】${params.targetLanguage}`

  const result = await callAI(systemPrompt, userPrompt)

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('AI返回格式不正确')
  } catch {
    // 如果解析失败，把AI的原始回复放到文案里
    return {
      copywriting: result,
      detailPage: 'AI生成详情页内容解析异常，请重新生成',
      videoScript: 'AI生成视频脚本解析异常，请重新生成',
    }
  }
}

// ==================== 爆款逆推器 - AI功能 ====================

/** 逆推分析结果 */
export interface ReverseAnalysisResult {
  // 多模态识别结果
  recognition: {
    contentType: string    // 内容类型
    language: string       // 检测到的语言
    platform: string       // 来源平台
    summary: string        // 内容摘要
  }
  // 结构切片
  structure: Array<{
    id: string
    label: string
    type: 'hook' | 'pain' | 'feature' | 'scene' | 'proof' | 'cta'
    order: number
    content: string  // 该模块的原始内容
  }>
  // 逻辑提取
  logicPath: Array<{
    id: string
    from: string
    to: string
    label: string
    type: 'cause' | 'transition' | 'reinforce'
  }>
  // 风格标签
  styleTags: string[]
  // 可填充的模板槽位
  slots: Array<{
    id: string
    name: string
    type: 'text' | 'number' | 'select' | 'image'
    description: string
    placeholder: string
    required: boolean
    extractedValue: string  // AI从内容中提取的值
  }>
  // 整体分析
  analysis: string
}

/**
 * AI爆款逆推分析
 * 
 * 简单理解：您给AI一个爆款广告/视频的链接或内容，
 * AI帮您拆解它的"配方"——它用了什么套路、什么逻辑、什么风格
 * 就像大厨品尝一道菜后，能告诉您用了什么食材和做法
 */
export async function aiReverseAnalysis(params: {
  inputType: 'link' | 'screenshot' | 'video'
  inputContent: string  // 链接或文本内容
  screenshotBase64?: string  // 截图的base64编码（如果有）
}): Promise<ReverseAnalysisResult> {
  const systemPrompt = `你是RayMatrix平台的爆款逆推引擎。你需要分析爆款营销内容，逆向提取其逻辑骨架，生成可复用的基模。

分析流程：
1. 多模态识别：识别内容类型、语言、来源平台、内容摘要
2. 结构切片：将内容拆解为独立模块（钩子/痛点/卖点/场景/背书/行动召唤）
3. 逻辑提取：提取模块间的说服逻辑路径（因果/过渡/强化）
4. 风格提取：提取内容风格和文化偏好标签
5. 槽位提取：提取可复用的模板变量槽位

你必须以JSON格式回复，格式如下：
{
  "recognition": {
    "contentType": "内容类型",
    "language": "语言",
    "platform": "平台",
    "summary": "内容摘要"
  },
  "structure": [
    {"id": "s1", "label": "模块名", "type": "hook/pain/feature/scene/proof/cta", "order": 1, "content": "该模块内容"}
  ],
  "logicPath": [
    {"id": "l1", "from": "s1", "to": "s2", "label": "逻辑名", "type": "cause/transition/reinforce"}
  ],
  "styleTags": ["标签1", "标签2"],
  "slots": [
    {"id": "slot1", "name": "槽位名", "type": "text", "description": "说明", "placeholder": "示例", "required": true, "extractedValue": "提取的值"}
  ],
  "analysis": "整体分析说明"
}

只返回JSON，不要其他文字。`

  let userPrompt = ''

  if (params.inputType === 'link') {
    userPrompt = `请分析以下爆款链接的内容，逆向提取逻辑骨架：

【链接】${params.inputContent}

注意：如果无法直接访问链接，请根据链接的域名和路径信息推断可能的平台和内容类型，并给出一个合理的逆推分析示例。`
  } else if (params.inputType === 'screenshot') {
    userPrompt = `请分析以下爆款截图内容，逆向提取逻辑骨架：

【用户提供的描述】${params.inputContent}

请基于描述信息进行逆推分析。`
  } else {
    userPrompt = `请分析以下爆款视频内容，逆向提取逻辑骨架：

【视频链接/描述】${params.inputContent}

请根据提供的信息进行逆推分析。`
  }

  const result = await callAI(systemPrompt, userPrompt)

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('AI返回格式不正确')
  } catch {
    // 解析失败时返回默认结构
    return {
      recognition: {
        contentType: '未知',
        language: '未知',
        platform: '未知',
        summary: 'AI分析结果解析异常，请重试'
      },
      structure: [
        { id: 's1', label: '钩子', type: 'hook', order: 1, content: '解析异常' },
        { id: 's2', label: '卖点', type: 'feature', order: 2, content: '解析异常' },
        { id: 's3', label: '行动召唤', type: 'cta', order: 3, content: '解析异常' },
      ],
      logicPath: [
        { id: 'l1', from: 's1', to: 's2', label: '吸引→展示', type: 'transition' },
        { id: 'l2', from: 's2', to: 's3', label: '展示→行动', type: 'transition' },
      ],
      styleTags: ['解析异常'],
      slots: [
        { id: 'slot1', name: '产品名称', type: 'text', description: '产品名称', placeholder: '请填写', required: true, extractedValue: '' },
      ],
      analysis: 'AI分析结果解析异常，建议重新分析'
    }
  }
}

// ==================== 检查API配置 ====================

/**
 * 检查API是否已正确配置
 * 在页面加载时可以调用这个函数检查
 */
export function isAIConfigured(): boolean {
  return !!(API_KEY && API_KEY !== 'your-api-key-here')
}

/**
 * 获取当前配置信息（隐藏密钥中间部分）
 */
export function getConfigInfo(): { provider: string; model: string; keyHint: string } {
  const keyHint = API_KEY.length > 8 
    ? API_KEY.slice(0, 4) + '****' + API_KEY.slice(-4)
    : '未配置'
  
  let provider = '未知'
  if (BASE_URL.includes('deepseek')) provider = 'DeepSeek'
  else if (BASE_URL.includes('openai')) provider = 'OpenAI'
  else if (BASE_URL.includes('siliconflow')) provider = '硅基流动'
  else if (BASE_URL.includes('dashscope')) provider = '阿里云百炼'

  return { provider, model: MODEL, keyHint }
}

// ==================== DashScope 图像/视频生成服务 ====================

/**
 * 检查DashScope API是否已配置
 */
export function isDashScopeConfigured(): boolean {
  return !!(DASHSCOPE_API_KEY && DASHSCOPE_API_KEY !== 'your-api-key-here')
}

/** 图像生成结果 */
export interface ImageGenerationResult {
  imageUrl: string       // 生成图像的URL
  requestId: string     // 请求ID
  imageCount: number    // 生成图像数量
  size: string          // 图像分辨率
}

/**
 * 万相2.7 文生图（同步调用）
 *
 * 简单理解：告诉AI您想要什么画面，AI直接画出来
 * 适用于：产品图、宣传图、场景图等
 *
 * @param prompt - 图像描述提示词
 * @param options - 可选参数
 */
export async function generateImage(
  prompt: string,
  options?: {
    size?: string        // 分辨率：'1K' | '2K' | '4K'，默认 '2K'
    n?: number           // 生成数量 1-4，默认 1
    seed?: number        // 随机种子
    thinkingMode?: boolean // 思考模式，默认 true
  }
): Promise<ImageGenerationResult> {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('请先配置DashScope API密钥！请在 .env 文件中设置 VITE_DASHSCOPE_API_KEY')
  }

  const url = `${DASHSCOPE_BASE_URL}/api/v1/services/aigc/multimodal-generation/generation`

  const body: Record<string, unknown> = {
    model: DASHSCOPE_IMAGE_MODEL,
    input: {
      messages: [
        {
          role: 'user',
          content: [{ text: prompt }],
        },
      ],
    },
    parameters: {
      size: options?.size || '2K',
      n: options?.n || 1,
      watermark: false,
      thinking_mode: options?.thinkingMode !== undefined ? options.thinkingMode : true,
      ...(options?.seed !== undefined ? { seed: options.seed } : {}),
    },
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `图像生成失败 (${response.status}): ${errorData.message || response.statusText}`
    )
  }

  const data = await response.json()

  // 提取图像URL
  const imageContent = data.output?.choices?.[0]?.message?.content?.find(
    (c: { type: string }) => c.type === 'image'
  )

  if (!imageContent?.image) {
    throw new Error('图像生成结果中未找到图像URL')
  }

  return {
    imageUrl: imageContent.image,
    requestId: data.request_id,
    imageCount: data.usage?.image_count || 1,
    size: data.usage?.size || '',
  }
}

/**
 * 万相2.7 图像编辑（同步调用）
 *
 * 简单理解：给AI一张图片和编辑指令，AI帮你修图
 * 适用于：产品换背景、涂鸦喷绘、交互式编辑等
 *
 * @param images - 输入图像URL数组（1-9张）
 * @param prompt - 编辑指令
 * @param options - 可选参数
 */
export async function editImage(
  images: string[],
  prompt: string,
  options?: {
    size?: string
    n?: number
    bboxList?: number[][][]  // 交互式编辑框选区域
  }
): Promise<ImageGenerationResult> {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('请先配置DashScope API密钥！')
  }

  const url = `${DASHSCOPE_BASE_URL}/api/v1/services/aigc/multimodal-generation/generation`

  const content: Array<Record<string, unknown>> = [{ text: prompt }]
  images.forEach(img => {
    content.push({ image: img })
  })

  const parameters: Record<string, unknown> = {
    size: options?.size || '2K',
    n: options?.n || 1,
    watermark: false,
  }
  if (options?.bboxList) {
    parameters.bbox_list = options.bboxList
  }

  const body = {
    model: DASHSCOPE_IMAGE_MODEL,
    input: {
      messages: [{ role: 'user', content }],
    },
    parameters,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `图像编辑失败 (${response.status}): ${errorData.message || response.statusText}`
    )
  }

  const data = await response.json()
  const imageContent = data.output?.choices?.[0]?.message?.content?.find(
    (c: { type: string }) => c.type === 'image'
  )

  if (!imageContent?.image) {
    throw new Error('图像编辑结果中未找到图像URL')
  }

  return {
    imageUrl: imageContent.image,
    requestId: data.request_id,
    imageCount: data.usage?.image_count || 1,
    size: data.usage?.size || '',
  }
}

/** 视频生成任务状态 */
export type VideoTaskStatus = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' | 'UNKNOWN'

/** 视频生成结果 */
export interface VideoGenerationResult {
  taskId: string
  status: VideoTaskStatus
  videoUrl?: string      // 仅 SUCCEEDED 时有值
  prompt?: string        // 原始提示词
  duration?: number      // 视频时长(秒)
  resolution?: number    // 分辨率档位
  submitTime?: string
  endTime?: string
  errorCode?: string
  errorMessage?: string
}

/**
 * HappyHorse 文生视频（异步调用）
 *
 * 简单理解：告诉AI你想看什么场景，AI帮你生成一段视频
 * 耗时较长(1-5分钟)，返回任务ID后需要轮询查询结果
 *
 * @param prompt - 视频内容描述
 * @param options - 可选参数
 */
export async function createTextToVideoTask(
  prompt: string,
  options?: {
    resolution?: string   // '720P' | '1080P'，默认 '720P'
    ratio?: string        // '16:9' | '9:16' | '1:1' 等，默认 '16:9'
    duration?: number     // 3-15秒，默认 5
    seed?: number
  }
): Promise<VideoGenerationResult> {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('请先配置DashScope API密钥！')
  }

  const url = `${DASHSCOPE_BASE_URL}/api/v1/services/aigc/video-generation/video-synthesis`

  const parameters: Record<string, unknown> = {
    resolution: options?.resolution || '720P',
    duration: options?.duration || 5,
  }
  if (options?.ratio) parameters.ratio = options.ratio
  if (options?.seed !== undefined) parameters.seed = options.seed

  const body = {
    model: DASHSCOPE_VIDEO_T2V_MODEL,
    input: { prompt },
    parameters,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      'X-DashScope-Async': 'enable',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `文生视频任务创建失败 (${response.status}): ${errorData.message || response.statusText}`
    )
  }

  const data = await response.json()

  if (data.code) {
    throw new Error(`文生视频任务创建失败: ${data.code} - ${data.message}`)
  }

  return {
    taskId: data.output.task_id,
    status: data.output.task_status,
  }
}

/**
 * HappyHorse 图生视频（异步调用）
 *
 * 简单理解：给AI一张图片，AI让图片动起来变成视频
 * 耗时较长(1-5分钟)，返回任务ID后需要轮询查询结果
 *
 * @param imageUrl - 首帧图片URL
 * @param prompt - 视频运动描述（可选）
 * @param options - 可选参数
 */
export async function createImageToVideoTask(
  imageUrl: string,
  prompt?: string,
  options?: {
    resolution?: string   // '720P' | '1080P'，默认 '720P'
    duration?: number     // 3-15秒，默认 5
    seed?: number
  }
): Promise<VideoGenerationResult> {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('请先配置DashScope API密钥！')
  }

  const url = `${DASHSCOPE_BASE_URL}/api/v1/services/aigc/video-generation/video-synthesis`

  const input: Record<string, unknown> = {
    media: [{ type: 'first_frame', url: imageUrl }],
  }
  if (prompt) input.prompt = prompt

  const parameters: Record<string, unknown> = {
    resolution: options?.resolution || '720P',
    duration: options?.duration || 5,
  }
  if (options?.seed !== undefined) parameters.seed = options.seed

  const body = {
    model: DASHSCOPE_VIDEO_I2V_MODEL,
    input,
    parameters,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      'X-DashScope-Async': 'enable',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `图生视频任务创建失败 (${response.status}): ${errorData.message || response.statusText}`
    )
  }

  const data = await response.json()

  if (data.code) {
    throw new Error(`图生视频任务创建失败: ${data.code} - ${data.message}`)
  }

  return {
    taskId: data.output.task_id,
    status: data.output.task_status,
  }
}

/**
 * 查询异步任务状态（图像/视频通用）
 *
 * 用于轮询视频生成、异步图像生成等耗时任务的结果
 *
 * @param taskId - 任务ID
 */
export async function queryTaskStatus(taskId: string): Promise<VideoGenerationResult> {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('请先配置DashScope API密钥！')
  }

  const url = `${DASHSCOPE_BASE_URL}/api/v1/tasks/${taskId}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`查询任务状态失败 (${response.status})`)
  }

  const data = await response.json()
  const output = data.output || {}

  const result: VideoGenerationResult = {
    taskId: output.task_id || taskId,
    status: output.task_status || 'UNKNOWN',
    submitTime: output.submit_time,
    endTime: output.end_time,
  }

  // 视频任务成功时
  if (output.task_status === 'SUCCEEDED' && output.video_url) {
    result.videoUrl = output.video_url
    result.prompt = output.orig_prompt
    result.duration = data.usage?.duration
    result.resolution = data.usage?.SR
  }

  // 图像异步任务成功时
  if (output.task_status === 'SUCCEEDED' && output.choices) {
    const imageContent = output.choices?.[0]?.message?.content?.find(
      (c: { type: string }) => c.type === 'image'
    )
    if (imageContent?.image) {
      result.videoUrl = imageContent.image  // 复用videoUrl字段存图像URL
    }
  }

  // 任务失败时
  if (output.task_status === 'FAILED') {
    result.errorCode = output.code
    result.errorMessage = output.message
  }

  return result
}

/**
 * 轮询等待异步任务完成
 *
 * 简单理解：自动反复查询任务状态，直到完成或失败
 * 适合视频生成等耗时操作
 *
 * @param taskId - 任务ID
 * @param intervalMs - 轮询间隔(毫秒)，默认 15000 (15秒)
 * @param maxAttempts - 最大尝试次数，默认 40 (约10分钟)
 * @param onProgress - 进度回调，每次查询后调用
 */
export async function waitForTask(
  taskId: string,
  options?: {
    intervalMs?: number
    maxAttempts?: number
    onProgress?: (result: VideoGenerationResult) => void
  }
): Promise<VideoGenerationResult> {
  const interval = options?.intervalMs || 15000
  const maxAttempts = options?.maxAttempts || 40
  const onProgress = options?.onProgress

  for (let i = 0; i < maxAttempts; i++) {
    const result = await queryTaskStatus(taskId)

    // 通知调用方当前进度
    if (onProgress) onProgress(result)

    // 任务完成（成功或失败），直接返回
    if (result.status === 'SUCCEEDED' || result.status === 'FAILED' || result.status === 'CANCELED') {
      return result
    }

    // 等待下一次轮询
    await new Promise(resolve => setTimeout(resolve, interval))
  }

  // 超时
  return {
    taskId,
    status: 'UNKNOWN',
    errorMessage: '任务查询超时，请稍后手动查询',
  }
}

/**
 * 一键文生视频：创建任务 + 自动等待结果
 *
 * 使用方式：
 *   const result = await generateVideoFromText('一只猫在草地上奔跑')
 *   console.log(result.videoUrl)  // 视频下载链接
 */
export async function generateVideoFromText(
  prompt: string,
  options?: {
    resolution?: string
    ratio?: string
    duration?: number
    seed?: number
    onProgress?: (result: VideoGenerationResult) => void
  }
): Promise<VideoGenerationResult> {
  const { onProgress, ...taskOptions } = options || {}
  const task = await createTextToVideoTask(prompt, taskOptions)
  return waitForTask(task.taskId, { onProgress })
}

/**
 * 一键图生视频：创建任务 + 自动等待结果
 *
 * 使用方式：
 *   const result = await generateVideoFromImage(imageUrl, '猫在奔跑')
 *   console.log(result.videoUrl)  // 视频下载链接
 */
export async function generateVideoFromImage(
  imageUrl: string,
  prompt?: string,
  options?: {
    resolution?: string
    duration?: number
    seed?: number
    onProgress?: (result: VideoGenerationResult) => void
  }
): Promise<VideoGenerationResult> {
  const { onProgress, ...taskOptions } = options || {}
  const task = await createImageToVideoTask(imageUrl, prompt, taskOptions)
  return waitForTask(task.taskId, { onProgress })
}
