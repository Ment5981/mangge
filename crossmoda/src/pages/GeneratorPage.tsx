import { useState, useEffect } from 'react'
import { mockTemplates, typeColors, type BaseTemplate, type Product, defaultProduct, mockGeneratedResult } from '../data/mockData'
import { aiSmartMapping, aiGenerateContent, isAIConfigured, getConfigInfo, type MappingResult, type GeneratedContentResult } from '../services/ai'
import { Wand2, CheckCircle2, ArrowRight, Loader2, ChevronRight, FileText, Layout, Film, AlertCircle } from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5

export default function GeneratorPage() {
  const [step, setStep] = useState<Step>(1)
  const [selectedTemplate, setSelectedTemplate] = useState<BaseTemplate | null>(mockTemplates[0])
  const [product, setProduct] = useState<Product>({ ...defaultProduct })
  const [targetMarket, setTargetMarket] = useState('北美')
  const [targetLanguage, setTargetLanguage] = useState('英语')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultTab, setResultTab] = useState<'copywriting' | 'detailPage' | 'videoScript'>('copywriting')
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiMapping, setAiMapping] = useState<MappingResult | null>(null)
  const [isMappingLoading, setIsMappingLoading] = useState(false)
  const [aiGeneratedContent, setAiGeneratedContent] = useState<GeneratedContentResult | null>(null)
  const [aiConfigOk, setAiConfigOk] = useState(isAIConfigured())

  const markets = ['北美', '欧洲', '东南亚', '日韩', '中东', '拉美']
  const languages = ['英语', '西班牙语', '日语', '韩语', '泰语', '阿拉伯语']

  // 进入第3步时自动调用AI智能映射
  useEffect(() => {
    if (step !== 3 || !selectedTemplate) return
    
    const doMapping = async () => {
      setIsMappingLoading(true)
      setAiError(null)
      try {
        if (!isAIConfigured()) {
          // 如果未配置AI，使用本地简单映射逻辑（保留原有行为）
          setIsMappingLoading(false)
          return
        }
        const result = await aiSmartMapping({
          templateName: selectedTemplate.name,
          templateDescription: selectedTemplate.description,
          slots: selectedTemplate.slots.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            placeholder: s.placeholder,
          })),
          product: {
            name: product.name,
            category: product.category,
            coreParams: product.coreParams,
            sellingPoints: product.sellingPoints,
            usageScene: product.usageScene,
            painPoint: product.painPoint,
            brandStory: product.brandStory,
            price: product.price,
          },
        })
        setAiMapping(result)
      } catch (err: any) {
        setAiError(err.message || 'AI映射失败，请重试')
      } finally {
        setIsMappingLoading(false)
      }
    }
    doMapping()
  }, [step, selectedTemplate])

  const mappingLines = selectedTemplate ? selectedTemplate.slots.map(slot => {
    // 优先使用AI映射结果
    if (aiMapping) {
      const aiSlot = aiMapping.mappings.find(m => m.slotId === slot.id)
      if (aiSlot) {
        return {
          slotId: slot.id,
          slotName: slot.name,
          productField: aiSlot.productField,
          matched: aiSlot.matched,
          confidence: aiSlot.confidence,
          suggestion: aiSlot.suggestion,
        }
      }
    }
    // 回退到本地简单匹配逻辑
    const productField = slot.name.includes('痛点') ? product.painPoint :
      slot.name.includes('参数') || slot.name.includes('科技') || slot.name.includes('材质') ? product.coreParams :
      slot.name.includes('场景') || slot.name.includes('方法') ? product.usageScene :
      slot.name.includes('卖点') || slot.name.includes('功能') ? product.sellingPoints :
      slot.name.includes('名称') || slot.name.includes('产品') ? product.name :
      product.sellingPoints || product.coreParams
    return { slotId: slot.id, slotName: slot.name, productField, matched: !!productField, confidence: productField ? 0.5 : 0 }
  }) : []

  const handleGenerate = async () => {
    setIsGenerating(true)
    setShowResult(false)
    setAiError(null)
    setAiGeneratedContent(null)

    if (!isAIConfigured()) {
      // 未配置AI时使用模拟数据
      setTimeout(() => {
        setIsGenerating(false)
        setShowResult(true)
        setStep(5)
      }, 3000)
      return
    }

    try {
      // 调用AI生成内容
      const result = await aiGenerateContent({
        templateName: selectedTemplate?.name || '',
        templateDescription: selectedTemplate?.description || '',
        structure: selectedTemplate?.structure.map(s => ({ label: s.label, type: s.type })) || [],
        logicPath: selectedTemplate?.logicPath.map(l => ({ from: l.from, to: l.to, label: l.label, type: l.type })) || [],
        styleTags: selectedTemplate?.styleTags || [],
        mappings: mappingLines.map(m => ({ slotName: m.slotName, productField: m.productField })),
        targetMarket,
        targetLanguage,
      })
      setAiGeneratedContent(result)
      setIsGenerating(false)
      setShowResult(true)
      setStep(5)
    } catch (err: any) {
      setIsGenerating(false)
      setAiError(err.message || 'AI生成失败，请重试')
    }
  }

  const stepLabels = ['选择基模', '填入参数', '智能映射', '生成内容', '查看结果']

  return (
    <div style={{ padding: '44px 52px' }}>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 200, letterSpacing: '-0.02em', color: '#fafafa' }}>缝合生成器</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 8 }}>选择基模 → 填入商品参数 → AI智能映射 → 一键生成本土化内容</p>
      </div>

      {/* 步骤条 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 52 }}>
        {stepLabels.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', fontSize: 11,
              ...(step > i + 1
                ? { color: '#00F0FF', border: '1px solid rgba(0,240,255,0.18)' }
                : step === i + 1
                  ? { color: '#FFB800', border: '1px solid rgba(255,184,0,0.25)' }
                  : { color: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.05)' }),
            }}>
              {step > i + 1
                ? <CheckCircle2 size={11} style={{ color: '#00F0FF' }} />
                : <span style={{ fontSize: 9, opacity: 0.7 }}>{i + 1}</span>
              }
              {label}
            </div>
            {i < stepLabels.length - 1 && (
              <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: 选择基模 */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 300, marginBottom: 28, color: '#fafafa' }}>选择基模模板</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {mockTemplates.map(tpl => (
              <div key={tpl.id} onClick={() => setSelectedTemplate(tpl)} className="rm-card" style={{
                padding: '24px 22px', cursor: 'pointer',
                borderColor: selectedTemplate?.id === tpl.id ? 'rgba(0,240,255,0.35)' : undefined,
                background: selectedTemplate?.id === tpl.id ? 'rgba(0,240,255,0.025)' : undefined,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 20 }}>{tpl.builderAvatar}</span>
                  <span style={{ fontSize: 11, color: '#00F0FF' }}>¥{tpl.price}</span>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 400, marginBottom: 8, color: '#fafafa' }}>{tpl.name}</h3>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 16, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tpl.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                  {tpl.structure.slice(0, 4).map(node => (
                    <span key={node.id} style={{ padding: '2px 8px', fontSize: 10, color: typeColors[node.type], border: `1px solid ${typeColors[node.type]}22` }}>
                      {node.label}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
                  <span>{tpl.targetMarket} · {tpl.language}</span>
                  <span>⭐ {tpl.rating}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
            <button onClick={() => selectedTemplate && setStep(2)} disabled={!selectedTemplate} className="rm-btn-dawn"
              style={{ opacity: selectedTemplate ? 1 : 0.4, cursor: selectedTemplate ? 'pointer' : 'not-allowed', fontSize: 13, padding: '11px 28px' }}>
              下一步 <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 填入商品参数 */}
      {step === 2 && selectedTemplate && (
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 300, marginBottom: 28, color: '#fafafa' }}>填入商品参数</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="rm-card" style={{ padding: '28px 24px' }}>
              <p style={{ fontSize: 10, color: '#00F0FF', marginBottom: 24, letterSpacing: '0.08em', textTransform: 'uppercase' }}>商品信息</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { label: '产品名称 *', field: 'name' as keyof Product, placeholder: '例：GlowUp VC亮肤精华液' },
                  { label: '品类', field: 'category' as keyof Product, placeholder: '例：美妆个护' },
                  { label: '核心参数 *', field: 'coreParams' as keyof Product, placeholder: '例：5%烟酰胺+2%熊果苷' },
                ].map(f => (
                  <div key={f.field}>
                    <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>{f.label}</label>
                    <input value={product[f.field] as string} onChange={e => setProduct({ ...product, [f.field]: e.target.value })} placeholder={f.placeholder} className="rm-input" />
                  </div>
                ))}
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>核心卖点 *</label>
                  <textarea value={product.sellingPoints} onChange={e => setProduct({ ...product, sellingPoints: e.target.value })} placeholder="例：28天提亮37%/零添加/敏感肌可用" rows={2} className="rm-input" style={{ resize: 'none' }} />
                </div>
              </div>
            </div>
            <div className="rm-card" style={{ padding: '28px 24px' }}>
              <p style={{ fontSize: 10, color: '#FFB800', marginBottom: 24, letterSpacing: '0.08em', textTransform: 'uppercase' }}>场景与痛点</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>使用场景 *</label>
                  <input value={product.usageScene} onChange={e => setProduct({ ...product, usageScene: e.target.value })} placeholder="例：晚间护肤第一步" className="rm-input" />
                </div>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>痛点描述 *</label>
                  <textarea value={product.painPoint} onChange={e => setProduct({ ...product, painPoint: e.target.value })} placeholder="例：暗沉肤色让你看起来比实际年龄老5岁" rows={2} className="rm-input" style={{ resize: 'none' }} />
                </div>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>品牌故事</label>
                  <textarea value={product.brandStory} onChange={e => setProduct({ ...product, brandStory: e.target.value })} placeholder="例：源自法国实验室的配方..." rows={2} className="rm-input" style={{ resize: 'none' }} />
                </div>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>价格</label>
                  <input value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} placeholder="例：$29.9" className="rm-input" />
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button onClick={() => setStep(1)} className="rm-btn-dawn-ghost" style={{ fontSize: 13, padding: '11px 28px' }}>上一步</button>
            <button onClick={() => setStep(3)} className="rm-btn-dawn" style={{ fontSize: 13, padding: '11px 28px' }}>下一步 <ArrowRight size={14} /></button>
          </div>
        </div>
      )}

          {/* AI配置提示 */}
          {!aiConfigOk && (
            <div style={{ padding: '12px 18px', marginBottom: 20, background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={16} style={{ color: '#FFB800', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>AI功能未配置，当前使用模拟数据。请在项目根目录的 <code style={{ color: '#FFB800' }}>.env</code> 文件中设置 <code style={{ color: '#FFB800' }}>VITE_AI_API_KEY</code></span>
            </div>
          )}

          {/* 错误提示 */}
          {aiError && (
            <div style={{ padding: '12px 18px', marginBottom: 20, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{aiError}</span>
              <button onClick={() => setAiError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12 }}>关闭</button>
            </div>
          )}

      {/* Step 3: 智能映射 */}
      {step === 3 && selectedTemplate && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 300, color: '#fafafa' }}>AI 智能映射</h2>
            {isMappingLoading && <Loader2 size={16} className="animate-spin" style={{ color: '#00F0FF' }} />}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginBottom: 32 }}>
            {isMappingLoading ? 'AI正在分析商品参数与基模槽位的最佳匹配...' : aiMapping ? 'AI已完成映射分析，请确认映射关系' : 'AI已自动将商品参数匹配至基模槽位，请确认映射关系'}
          </p>
          {aiMapping?.overallAnalysis && (
            <div style={{ padding: '14px 18px', marginBottom: 20, background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.1)', fontSize: 12, color: 'rgba(0,240,255,0.75)', lineHeight: 1.7 }}>
              AI分析：{aiMapping.overallAnalysis}
            </div>
          )}
          <div className="rm-card" style={{ padding: '28px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mappingLines.map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 200, textAlign: 'right' }}>
                    <span style={{ padding: '5px 10px', fontSize: 11, color: '#00F0FF', border: '1px solid rgba(0,240,255,0.18)' }}>
                      商品: {line.productField || '(未填写)'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 6, height: 6, background: line.matched ? '#00F0FF' : 'rgba(255,184,0,0.6)' }} />
                    <div style={{ width: 44, height: 1, background: line.matched ? 'rgba(0,240,255,0.28)' : 'rgba(255,184,0,0.2)' }} />
                    <ArrowRight size={12} style={{ color: line.matched ? '#00F0FF' : '#FFB800' }} />
                  </div>
                  <div>
                    <span style={{ padding: '5px 10px', fontSize: 11, color: '#FFB800', border: '1px solid rgba(255,184,0,0.18)' }}>
                      [{line.slotName}]
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: line.matched ? 'rgba(0,240,255,0.65)' : 'rgba(255,184,0,0.65)' }}>
                    {line.matched ? `已匹配${line.confidence >= 0.8 ? '' : ' (低置信度)'}` : '待补充'}
                  </span>
                  {'suggestion' in line && line.suggestion && (
                    <span style={{ fontSize: 10, color: 'rgba(255,184,0,0.5)', marginLeft: 4 }}>
                      💡{line.suggestion}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button onClick={() => { setStep(2); setAiMapping(null) }} className="rm-btn-dawn-ghost" style={{ fontSize: 13, padding: '11px 28px' }}>上一步</button>
            <button 
              onClick={() => setStep(4)} 
              disabled={isMappingLoading} 
              className="rm-btn-dawn" 
              style={{ fontSize: 13, padding: '11px 28px', opacity: isMappingLoading ? 0.6 : 1, cursor: isMappingLoading ? 'not-allowed' : 'pointer' }}
            >
              {isMappingLoading ? <><Loader2 size={14} className="animate-spin" /> AI映射中...</> : <>确认映射 <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 本地化生成 */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 300, marginBottom: 28, color: '#fafafa' }}>本地化生成</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="rm-card" style={{ padding: '24px' }}>
              <label className="rm-mono-label" style={{ display: 'block', marginBottom: 16 }}>目标市场</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {markets.map(m => (
                  <button key={m} onClick={() => setTargetMarket(m)} style={{
                    padding: '7px 14px', fontSize: 12, cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
                    color: targetMarket === m ? '#00F0FF' : 'rgba(255,255,255,0.40)',
                    border: `1px solid ${targetMarket === m ? 'rgba(0,240,255,0.28)' : 'rgba(255,255,255,0.07)'}`,
                    background: 'transparent',
                  }}>{m}</button>
                ))}
              </div>
            </div>
            <div className="rm-card" style={{ padding: '24px' }}>
              <label className="rm-mono-label" style={{ display: 'block', marginBottom: 16 }}>目标语言</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {languages.map(l => (
                  <button key={l} onClick={() => setTargetLanguage(l)} style={{
                    padding: '7px 14px', fontSize: 12, cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
                    color: targetLanguage === l ? '#FFB800' : 'rgba(255,255,255,0.40)',
                    border: `1px solid ${targetLanguage === l ? 'rgba(255,184,0,0.28)' : 'rgba(255,255,255,0.07)'}`,
                    background: 'transparent',
                  }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="rm-card" style={{ padding: '20px 24px', marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: '基模', value: (selectedTemplate?.name?.slice(0, 10) ?? '') + '...' },
                { label: '市场', value: `${targetMarket} · ${targetLanguage}` },
                { label: '输出', value: '文案+详情页+脚本' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.025)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: '#fafafa' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(3)} className="rm-btn-dawn-ghost" style={{ fontSize: 13, padding: '11px 28px' }}>上一步</button>
            <button onClick={handleGenerate} disabled={isGenerating} className="rm-btn-dawn"
              style={{ opacity: isGenerating ? 0.6 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer', fontSize: 13, padding: '11px 32px' }}>
              {isGenerating ? <><Loader2 size={14} className="animate-spin" /> AI 生成中...</> : <><Wand2 size={14} /> 一键生成</>}
            </button>
          </div>
          {isGenerating && (
            <div className="rm-card" style={{ marginTop: 32, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, margin: '0 auto 20px', border: '1px solid transparent', borderTopColor: '#00F0FF', borderRightColor: '#FFB800', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 14, fontWeight: 300, marginBottom: 8 }}>AI 正在生成本土化内容...</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>基于基模逻辑 + {targetMarket}市场 {targetLanguage}语境</p>
              <div className="rm-flow-line" style={{ marginTop: 24 }} />
            </div>
          )}
        </div>
      )}

      {/* Step 5: 生成结果 */}
      {step === 5 && showResult && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 300, display: 'flex', alignItems: 'center', gap: 10, color: '#fafafa' }}>
              <CheckCircle2 size={18} style={{ color: '#00F0FF' }} />
              内容生成完成
            </h2>
            <button onClick={() => { setStep(1); setShowResult(false); setAiMapping(null); setAiGeneratedContent(null); setAiError(null) }} className="rm-btn-dawn-ghost" style={{ fontSize: 12, padding: '9px 20px' }}>重新生成</button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[
              { key: 'copywriting' as const, icon: FileText, label: '推广文案' },
              { key: 'detailPage' as const, icon: Layout, label: '详情页排版' },
              { key: 'videoScript' as const, icon: Film, label: '视频分镜脚本' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setResultTab(tab.key)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s ease',
                color: resultTab === tab.key ? '#00F0FF' : 'rgba(255,255,255,0.38)',
                border: `1px solid ${resultTab === tab.key ? 'rgba(0,240,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
                background: 'transparent',
              }}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rm-card" style={{ padding: '28px 24px' }}>
            <pre style={{ fontSize: 13, color: '#fafafa', whiteSpace: 'pre-wrap', fontFamily: 'Inter, system-ui, sans-serif', lineHeight: 1.78 }}>
              {resultTab === 'copywriting' ? (aiGeneratedContent?.copywriting || mockGeneratedResult.copywriting) :
               resultTab === 'detailPage' ? (aiGeneratedContent?.detailPage || mockGeneratedResult.detailPage) :
               (aiGeneratedContent?.videoScript || mockGeneratedResult.videoScript)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
