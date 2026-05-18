// ===== RayMatrix Mock 数据 =====

export interface BaseTemplate {
  id: string
  name: string
  description: string
  category: string
  targetMarket: string
  language: string
  price: number
  rating: number
  sales: number
  builderName: string
  builderAvatar: string
  tags: string[]
  structure: StructureNode[]
  logicPath: LogicStep[]
  styleTags: string[]
  slots: TemplateSlot[]
  createdAt: string
}

export interface StructureNode {
  id: string
  label: string
  type: 'hook' | 'pain' | 'feature' | 'scene' | 'proof' | 'cta'
  order: number
}

export interface LogicStep {
  id: string
  from: string
  to: string
  label: string
  type: 'cause' | 'transition' | 'reinforce'
}

export interface TemplateSlot {
  id: string
  name: string
  type: 'text' | 'number' | 'select' | 'image'
  description: string
  placeholder: string
  required: boolean
  options?: string[]
}

export interface GeneratedContent {
  id: string
  templateName: string
  productName: string
  targetMarket: string
  language: string
  type: 'copywriting' | 'detailPage' | 'videoScript'
  content: string
  createdAt: string
}

export interface Product {
  name: string
  category: string
  coreParams: string
  sellingPoints: string
  usageScene: string
  painPoint: string
  brandStory: string
  price: string
}

const typeColors: Record<string, string> = {
  hook: '#f59e0b',
  pain: '#ef4444',
  feature: '#3b82f6',
  scene: '#10b981',
  proof: '#8b5cf6',
  cta: '#ec4899',
}

export { typeColors }

export const mockTemplates: BaseTemplate[] = [
  {
    id: 'tpl-001',
    name: 'TikTok爆款美妆钩子模板',
    description: '适用于美妆类目，先制造容貌焦虑，再展示产品效果，最后达人背书促转化的经典TikTok爆款逻辑',
    category: '美妆个护',
    targetMarket: '北美',
    language: '英语',
    price: 29.9,
    rating: 4.8,
    sales: 1256,
    builderName: 'BeautyMaster',
    builderAvatar: '👩‍💼',
    tags: ['美妆', 'TikTok', '焦虑型', '达人背书'],
    structure: [
      { id: 's1', label: '痛点钩子', type: 'hook', order: 1 },
      { id: 's2', label: '放大焦虑', type: 'pain', order: 2 },
      { id: 's3', label: '产品亮相', type: 'feature', order: 3 },
      { id: 's4', label: '使用场景', type: 'scene', order: 4 },
      { id: 's5', label: '达人背书', type: 'proof', order: 5 },
      { id: 's6', label: '限时促单', type: 'cta', order: 6 },
    ],
    logicPath: [
      { id: 'l1', from: 's1', to: 's2', label: '引发共鸣', type: 'cause' },
      { id: 'l2', from: 's2', to: 's3', label: '痛点→方案', type: 'transition' },
      { id: 'l3', from: 's3', to: 's4', label: '功能落地', type: 'reinforce' },
      { id: 'l4', from: 's4', to: 's5', label: '效果验证', type: 'reinforce' },
      { id: 'l5', from: 's5', to: 's6', label: '信任→行动', type: 'transition' },
    ],
    styleTags: ['口语化', '快节奏', '卡点剪辑', '美式幽默', 'FOMO感'],
    slots: [
      { id: 'slot1', name: '痛点描述', type: 'text', description: '目标用户的核心痛点', placeholder: '例：暗沉肤色让你看起来比实际年龄老5岁', required: true },
      { id: 'slot2', name: '核心参数', type: 'text', description: '产品的核心卖点参数', placeholder: '例：含5%烟酰胺+2%熊果苷', required: true },
      { id: 'slot3', name: '使用场景', type: 'text', description: '产品最佳使用场景', placeholder: '例：晚间护肤第一步', required: true },
      { id: 'slot4', name: '效果数据', type: 'number', description: '可量化的效果数据', placeholder: '例：28天提亮37%', required: true },
      { id: 'slot5', name: '达人名称', type: 'text', description: '推荐达人/KOL名称', placeholder: '例：@skincarebymind', required: false },
      { id: 'slot6', name: '促销信息', type: 'text', description: '限时优惠或促销信息', placeholder: '例：限时6折+买一送一', required: false },
    ],
    createdAt: '2026-04-15',
  },
  {
    id: 'tpl-002',
    name: 'Amazon3C数码详情页逻辑',
    description: '适用于3C数码品类，技术参数对比+使用场景代入+评测背书的三段式Amazon高转化详情页模板',
    category: '3C数码',
    targetMarket: '全球',
    language: '英语',
    price: 49.9,
    rating: 4.9,
    sales: 892,
    builderName: 'TechGuru',
    builderAvatar: '👨‍💻',
    tags: ['3C', 'Amazon', '参数对比', '评测背书'],
    structure: [
      { id: 's1', label: '核心卖点Banner', type: 'hook', order: 1 },
      { id: 's2', label: '参数对比表', type: 'feature', order: 2 },
      { id: 's3', label: '场景化展示', type: 'scene', order: 3 },
      { id: 's4', label: '技术解读', type: 'feature', order: 4 },
      { id: 's5', label: '用户评测', type: 'proof', order: 5 },
      { id: 's6', label: 'FAQ促单', type: 'cta', order: 6 },
    ],
    logicPath: [
      { id: 'l1', from: 's1', to: 's2', label: '吸引→论证', type: 'transition' },
      { id: 'l2', from: 's2', to: 's3', label: '参数→感受', type: 'transition' },
      { id: 'l3', from: 's3', to: 's4', label: '感受→原理', type: 'reinforce' },
      { id: 'l4', from: 's4', to: 's5', label: '原理→口碑', type: 'reinforce' },
      { id: 'l5', from: 's5', to: 's6', label: '口碑→下单', type: 'transition' },
    ],
    styleTags: ['数据驱动', '专业感', '对比式', '图文并茂', '理性说服'],
    slots: [
      { id: 'slot1', name: '产品名称', type: 'text', description: '产品的全称', placeholder: '例：ProMax 100W氮化镓充电器', required: true },
      { id: 'slot2', name: '核心参数', type: 'text', description: '最核心的技术参数', placeholder: '例：100W快充/3C1A/折叠插脚', required: true },
      { id: 'slot3', name: '对比竞品', type: 'text', description: '主要竞品名称', placeholder: '例：Anker 737', required: true },
      { id: 'slot4', name: '使用场景', type: 'text', description: '产品典型使用场景', placeholder: '例：差旅多设备同时充电', required: true },
      { id: 'slot5', name: '技术亮点', type: 'text', description: '核心技术优势', placeholder: '例：GaN III芯片/智能温控', required: false },
      { id: 'slot6', name: '价格优势', type: 'text', description: '相对于竞品的价格优势', placeholder: '例：同性能价格仅1/2', required: false },
    ],
    createdAt: '2026-03-22',
  },
  {
    id: 'tpl-003',
    name: '家居好物短视频种草脚本',
    description: '适用于家居品类，日常生活痛点切入→产品妙用展示→生活品质提升的短视频种草逻辑',
    category: '家居生活',
    targetMarket: '东南亚',
    language: '泰语/越南语',
    price: 19.9,
    rating: 4.6,
    sales: 2103,
    builderName: 'HomeVibes',
    builderAvatar: '🏠',
    tags: ['家居', '短视频', '种草', '生活品质'],
    structure: [
      { id: 's1', label: '生活痛点', type: 'hook', order: 1 },
      { id: 's2', label: '产品出现', type: 'feature', order: 2 },
      { id: 's3', label: '使用过程', type: 'scene', order: 3 },
      { id: 's4', label: '前后对比', type: 'proof', order: 4 },
      { id: 's5', label: '品质提升', type: 'scene', order: 5 },
      { id: 's6', label: '引导下单', type: 'cta', order: 6 },
    ],
    logicPath: [
      { id: 'l1', from: 's1', to: 's2', label: '痛点引入', type: 'cause' },
      { id: 'l2', from: 's2', to: 's3', label: '方案展示', type: 'transition' },
      { id: 'l3', from: 's3', to: 's4', label: '效果验证', type: 'reinforce' },
      { id: 'l4', from: 's4', to: 's5', label: '效果升华', type: 'reinforce' },
      { id: 'l5', from: 's5', to: 's6', label: '行动召唤', type: 'transition' },
    ],
    styleTags: ['温暖治愈', 'ASMR', '慢节奏', '本土化', '生活仪式感'],
    slots: [
      { id: 'slot1', name: '痛点场景', type: 'text', description: '家居生活中的痛点', placeholder: '例：厨房总是湿漉漉', required: true },
      { id: 'slot2', name: '产品名称', type: 'text', description: '产品全称', placeholder: '例：竹纤维超吸水地垫', required: true },
      { id: 'slot3', name: '使用方法', type: 'text', description: '简单使用步骤', placeholder: '例：铺在洗手台下方即可', required: true },
      { id: 'slot4', name: '效果描述', type: 'text', description: '使用前后对比', placeholder: '例：3秒吸水/永不发霉', required: true },
      { id: 'slot5', name: '尺寸规格', type: 'select', description: '产品尺寸', placeholder: '选择尺寸', required: true, options: ['S', 'M', 'L', 'XL'] },
      { id: 'slot6', name: '价格信息', type: 'text', description: '促销价', placeholder: '例：限时199泰铢', required: false },
    ],
    createdAt: '2026-05-01',
  },
  {
    id: 'tpl-004',
    name: '宠物用品情感共鸣文案',
    description: '适用于宠物用品，以人宠情感纽带为核心驱动力的内容逻辑，特别适合欧美宠物市场',
    category: '宠物用品',
    targetMarket: '欧美',
    language: '英语',
    price: 34.9,
    rating: 4.7,
    sales: 756,
    builderName: 'PetLover',
    builderAvatar: '🐾',
    tags: ['宠物', '情感共鸣', '欧美市场', 'Ins风'],
    structure: [
      { id: 's1', label: '萌宠开场', type: 'hook', order: 1 },
      { id: 's2', label: '情感共鸣', type: 'pain', order: 2 },
      { id: 's3', label: '产品介绍', type: 'feature', order: 3 },
      { id: 's4', label: '使用画面', type: 'scene', order: 4 },
      { id: 's5', label: '主人反馈', type: 'proof', order: 5 },
      { id: 's6', label: '爱它就买', type: 'cta', order: 6 },
    ],
    logicPath: [
      { id: 'l1', from: 's1', to: 's2', label: '吸引→共鸣', type: 'transition' },
      { id: 'l2', from: 's2', to: 's3', label: '情感→方案', type: 'transition' },
      { id: 'l3', from: 's3', to: 's4', label: '方案→体验', type: 'reinforce' },
      { id: 'l4', from: 's4', to: 's5', label: '体验→口碑', type: 'reinforce' },
      { id: 'l5', from: 's5', to: 's6', label: '口碑→行动', type: 'transition' },
    ],
    styleTags: ['情感驱动', 'Ins风格', '温馨治愈', '萌宠经济', '拟人化表达'],
    slots: [
      { id: 'slot1', name: '宠物类型', type: 'select', description: '目标宠物种类', placeholder: '选择宠物', required: true, options: ['猫', '狗', '兔子', '仓鼠'] },
      { id: 'slot2', name: '情感痛点', type: 'text', description: '宠物主人的情感痛点', placeholder: '例：每次出门看到它不舍的眼神', required: true },
      { id: 'slot3', name: '产品名称', type: 'text', description: '产品名称', placeholder: '例：智能宠物陪伴机器人', required: true },
      { id: 'slot4', name: '核心功能', type: 'text', description: '产品核心功能', placeholder: '例：远程互动/自动投喂', required: true },
      { id: 'slot5', name: '用户评价', type: 'text', description: '典型用户评价', placeholder: '例："上班再也不担心它了"', required: false },
    ],
    createdAt: '2026-04-28',
  },
  {
    id: 'tpl-005',
    name: '运动健身权威背书模板',
    description: '适用于运动健身品类，专业数据+健身达人背书+效果对比的高信任度内容逻辑',
    category: '运动户外',
    targetMarket: '北美',
    language: '英语',
    price: 39.9,
    rating: 4.5,
    sales: 634,
    builderName: 'FitPro',
    builderAvatar: '💪',
    tags: ['运动', '健身', '权威背书', '数据驱动'],
    structure: [
      { id: 's1', label: '运动痛点', type: 'hook', order: 1 },
      { id: 's2', label: '科学原理解读', type: 'feature', order: 2 },
      { id: 's3', label: '产品展示', type: 'feature', order: 3 },
      { id: 's4', label: '训练场景', type: 'scene', order: 4 },
      { id: 's5', label: '效果数据', type: 'proof', order: 5 },
      { id: 's6', label: '教练推荐', type: 'cta', order: 6 },
    ],
    logicPath: [
      { id: 'l1', from: 's1', to: 's2', label: '痛点→科学', type: 'transition' },
      { id: 'l2', from: 's2', to: 's3', label: '原理→产品', type: 'transition' },
      { id: 'l3', from: 's3', to: 's4', label: '产品→场景', type: 'reinforce' },
      { id: 'l4', from: 's4', to: 's5', label: '场景→数据', type: 'reinforce' },
      { id: 'l5', from: 's5', to: 's6', label: '数据→推荐', type: 'transition' },
    ],
    styleTags: ['专业权威', '数据说话', '动感节奏', '对比展示', '教练人设'],
    slots: [
      { id: 'slot1', name: '运动痛点', type: 'text', description: '运动中的常见痛点', placeholder: '例：膝盖受伤不敢深蹲', required: true },
      { id: 'slot2', name: '产品名称', type: 'text', description: '产品名称', placeholder: '例：AI智能护膝', required: true },
      { id: 'slot3', name: '核心科技', type: 'text', description: '核心技术参数', placeholder: '例：6轴传感器/实时姿态矫正', required: true },
      { id: 'slot4', name: '训练场景', type: 'text', description: '典型训练场景', placeholder: '例：深蹲/跑步/HIIT', required: true },
      { id: 'slot5', name: '效果数据', type: 'text', description: '可量化的效果', placeholder: '例：减少67%膝盖压力', required: false },
    ],
    createdAt: '2026-05-10',
  },
  {
    id: 'tpl-006',
    name: '母婴好物信任链构建模板',
    description: '适用于母婴品类，安全焦虑→权威认证→妈妈口碑的三层信任构建逻辑',
    category: '母婴用品',
    targetMarket: '日韩',
    language: '日语/韩语',
    price: 44.9,
    rating: 4.8,
    sales: 567,
    builderName: 'MomCare',
    builderAvatar: '👶',
    tags: ['母婴', '安全认证', '口碑', '日韩市场'],
    structure: [
      { id: 's1', label: '安全焦虑', type: 'hook', order: 1 },
      { id: 's2', label: '成分/材质揭秘', type: 'feature', order: 2 },
      { id: 's3', label: '权威认证', type: 'proof', order: 3 },
      { id: 's4', label: '使用场景', type: 'scene', order: 4 },
      { id: 's5', label: '妈妈口碑', type: 'proof', order: 5 },
      { id: 's6', label: '安心下单', type: 'cta', order: 6 },
    ],
    logicPath: [
      { id: 'l1', from: 's1', to: 's2', label: '焦虑→透明', type: 'transition' },
      { id: 'l2', from: 's2', to: 's3', label: '透明→认证', type: 'reinforce' },
      { id: 'l3', from: 's3', to: 's4', label: '认证→体验', type: 'transition' },
      { id: 'l4', from: 's4', to: 's5', label: '体验→口碑', type: 'reinforce' },
      { id: 'l5', from: 's5', to: 's6', label: '口碑→安心', type: 'transition' },
    ],
    styleTags: ['安心感', '温和语气', '成分透明', '日式精致', '妈妈社群'],
    slots: [
      { id: 'slot1', name: '安全担忧', type: 'text', description: '妈妈们的安全担忧', placeholder: '例：宝宝皮肤过敏怎么办', required: true },
      { id: 'slot2', name: '产品名称', type: 'text', description: '产品名称', placeholder: '例：有机棉婴儿连体衣', required: true },
      { id: 'slot3', name: '核心材质', type: 'text', description: '安全材质说明', placeholder: '例：GOTS认证有机棉/零荧光剂', required: true },
      { id: 'slot4', name: '认证信息', type: 'text', description: '权威认证', placeholder: '例：SGS检测/欧盟CE认证', required: true },
      { id: 'slot5', name: '适用年龄', type: 'select', description: '适用年龄段', placeholder: '选择年龄段', required: true, options: ['0-3月', '3-6月', '6-12月', '1-2岁', '2-3岁'] },
    ],
    createdAt: '2026-05-05',
  },
]

// 商家仪表板数据
export const merchantDashboard = {
  myTemplates: 12,
  generatedContents: 87,
  savedDrafts: 6,
  recentGenerated: [
    { id: 'g1', templateName: 'TikTok爆款美妆钙子模板', productName: 'GlowUp VC亮肤精华液', targetMarket: '北美', type: 'copywriting' as const, createdAt: '2026-05-17' },
    { id: 'g2', templateName: 'Amazon3C数码详情页逻辑', productName: '100W氮化镓充电器', targetMarket: '全球', type: 'detailPage' as const, createdAt: '2026-05-16' },
    { id: 'g3', templateName: '家居好物短视频种草脚本', productName: '竹纤维吸水地垫', targetMarket: '东南亚', type: 'videoScript' as const, createdAt: '2026-05-16' },
    { id: 'g4', templateName: '宠物用品情感共鸣文案', productName: '智能宠物陪伴机器人', targetMarket: '欧美', type: 'copywriting' as const, createdAt: '2026-05-15' },
    { id: 'g5', templateName: '运动健身权威背书模板', productName: 'AI智能护膝 ProX', targetMarket: '北美', type: 'detailPage' as const, createdAt: '2026-05-14' },
    { id: 'g6', templateName: 'TikTok爆款美妆钙子模板', productName: '光泽防晒霜 SPF50+', targetMarket: '北美', type: 'videoScript' as const, createdAt: '2026-05-13' },
  ],
}

// 构建师仪表板数据
export const builderDashboard = {
  publishedTemplates: 12,
  totalSales: 8847,
  totalRevenue: 234560,
  monthlyRevenue: 28430,
  recentOrders: [
    { id: 'o1', templateName: 'TikTok爆款美妆钙子模板', buyer: '商家小王', price: 29.9, createdAt: '2026-05-17' },
    { id: 'o2', templateName: 'Amazon3C数码详情页逻辑', buyer: '商家老刘', price: 49.9, createdAt: '2026-05-16' },
    { id: 'o3', templateName: 'TikTok爆款美妆钙子模板', buyer: '商家小陈', price: 29.9, createdAt: '2026-05-16' },
    { id: 'o4', templateName: '母婴好物信任链构建模板', buyer: '商家林小姐', price: 44.9, createdAt: '2026-05-15' },
    { id: 'o5', templateName: '宠物用品情感共鸣文案', buyer: '商家老张', price: 34.9, createdAt: '2026-05-15' },
    { id: 'o6', templateName: 'Amazon3C数码详情页逻辑', buyer: '商家小李', price: 49.9, createdAt: '2026-05-14' },
  ],
}

// 默认商品参数（预填演示用）
export const defaultProduct: Product = {
  name: 'GlowUp VC亮肤精华液',
  category: '美妆个护',
  coreParams: '5%烟酰胺 + 2%熊果苷，北美皮肤科实验室研发',
  sellingPoints: '28天临床验证提亮37%，零添加配方，敏感肌可用，清爽不油腻',
  usageScene: '晚间护肤第一步，洁面后取少量轻拍吸收',
  painPoint: '暗沉肤色让你看起来比实际年龄老5岁，山根暗沉影响整体气质',
  brandStory: '源自北美皮肤科实验室，15年深耕研发，已服务超过120个国家和地区的美妆爱好者',
  price: '$29.9',
}

// 模拟生成结果
export const mockGeneratedResult = {
  copywriting: `🔥 Wait... Your skin looks 5 years older than your actual age?

That was ME before I discovered the GlowUp Vitamin C Serum.

Here's the truth: 87% of women over 25 experience dull, uneven skin tone. But nobody talks about why...

🎯 The Real Problem:
Environmental damage + dead cell buildup = skin that looks TIRED.

💡 The Solution: GlowUp VC Brightening Serum
✅ 5% Vitamin C + 2% Arbutin = Double brightening power
✅ 28-day clinical results: 37% brighter skin
✅ Lightweight, non-greasy, perfect for nighttime routine

"I've tried dozens of serums. This is the ONLY one that actually delivered results." - @skincarebymind (2.3M followers)

⏰ LIMITED TIME: 40% OFF + Buy 1 Get 1 FREE
🛒 Link in bio - Before it's gone! #GlowUp #SkincareRoutine`,

  detailPage: `═══════════════════════════════════
   ✨ GlowUp VC Brightening Serum
   Your 28-Day Skin Transformation
═══════════════════════════════════

📊 VS. COMPETITORS
┌─────────────┬──────────┬──────────┬──────────┐
│ Feature     │ GlowUp   │ Brand A  │ Brand B  │
├─────────────┼──────────┼──────────┼──────────┤
│ VC Content  │ 5%       │ 3%       │ 2%       │
│ Arbutin     │ 2%       │ ✗        │ ✗        │
│ Results     │ 28 days  │ 56 days  │ 90 days  │
│ Brightness  │ +37%     │ +15%     │ +10%     │
│ Price       │ $29.9    │ $45      │ $38      │
└─────────────┴──────────┴──────────┴──────────┘

🌙 HOW TO USE
Step 1: Cleanse face thoroughly
Step 2: Apply 2-3 drops to fingertips
Step 3: Gently press into skin
Step 4: Follow with moisturizer

⭐ CUSTOMER REVIEWS (4.8/5, 2,341 reviews)
"Best serum I've ever used!" - Sarah M. ⭐⭐⭐⭐⭐
"My dark spots are fading!" - Jessica L. ⭐⭐⭐⭐⭐

🛒 ORDER NOW - 40% OFF TODAY ONLY`,

  videoScript: `┌─────────────────────────────────────────────────┐
│   TIKTOK VIDEO SCRIPT - 45s Format              │
│   Product: GlowUp VC Brightening Serum           │
└─────────────────────────────────────────────────┘

⏱️ 0-3s  | 🪝 HOOK
Visual: Close-up of dull skin in bathroom mirror
Text overlay: "Your skin looks 5 years older..."
Audio: Dramatic sound effect + gasp

⏱️ 3-8s  | 😰 PAIN AMPLIFICATION  
Visual: Split screen - others' glowing skin vs yours
Text overlay: "87% of women over 25 have this problem"
Audio: Emotional background music starts

⏱️ 8-15s | ✨ PRODUCT REVEAL
Visual: Serum bottle hero shot + texture close-up
Text overlay: "5% VC + 2% Arbutin = Double brightening"
Audio: Upbeat transition sound

⏱️ 15-25s | 🎬 USAGE SCENE
Visual: Nighttime skincare routine, applying serum
Text overlay: "Just 2-3 drops every night"
Audio: ASMR sounds + satisfying application

⏱️ 25-35s | 👩‍💼 INFLUENCER ENDORSEMENT
Visual: Before/After + influencer clip
Text overlay: "@skincarebymind: 'The ONLY serum that works'"
Audio: Influencer voice clip

⏱️ 35-45s | 🛒 CALL TO ACTION
Visual: Product + price + limited time badge
Text overlay: "40% OFF + Buy 1 Get 1 FREE - Link in bio!"
Audio: Urgent music + CTA voiceover`,
}
