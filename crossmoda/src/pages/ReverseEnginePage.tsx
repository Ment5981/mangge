import { useState, useEffect } from 'react'
import { mockTemplates, typeColors } from '../data/mockData'
import { useApp } from '../App'
import { aiReverseAnalysis, isAIConfigured, type ReverseAnalysisResult } from '../services/ai'
import { ArrowRightLeft, Upload, Video, Link, Loader2, CheckCircle2, Save, Store, Tag, X, Zap, AlertCircle } from 'lucide-react'

type InputTab = 'link' | 'screenshot' | 'video'

const aiStages = [
  { label: '多模态识别', desc: '识别内容类型与语言...' },
  { label: '结构切片', desc: '拆解内容模块与段落结构...' },
  { label: '逻辑提取', desc: '提取卖货逻辑与说服路径...' },
]

export default function ReverseEnginePage() {
  const { userRole } = useApp()
  const [inputTab, setInputTab] = useState<InputTab>('link')
  const [linkValue, setLinkValue] = useState('https://www.tiktok.com/@glowupskincare/video/7234567890123456789')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [editingSlot, setEditingSlot] = useState<string | null>(null)
  const [slotValues, setSlotValues] = useState<Record<string, string>>({})
  const [customTag, setCustomTag] = useState('')
  const [styleTags, setStyleTags] = useState<string[]>([])
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<ReverseAnalysisResult | null>(null)
  const [aiConfigOk] = useState(isAIConfigured())

  const resultTemplate = mockTemplates[0]

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setShowResult(false)
    setCurrentStage(0)
    setAiError(null)
    setAiResult(null)

    if (!isAIConfigured()) {
      // 未配置AI时使用模拟动画
      const timer1 = setTimeout(() => setCurrentStage(1), 900)
      const timer2 = setTimeout(() => setCurrentStage(2), 1800)
      const timer3 = setTimeout(() => {
        setIsAnalyzing(false)
        setShowResult(true)
        setStyleTags([...resultTemplate.styleTags])
      }, 2700)
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3) }
    }

    try {
      // 阶段动画：多模态识别
      const timer1 = setTimeout(() => setCurrentStage(1), 900)
      const timer2 = setTimeout(() => setCurrentStage(2), 1800)

      // 调用AI逆推分析
      const result = await aiReverseAnalysis({
        inputType: inputTab,
        inputContent: inputTab === 'link' ? linkValue : '',
      })

      clearTimeout(timer1)
      clearTimeout(timer2)
      setCurrentStage(3)
      setAiResult(result)
      setStyleTags(result.styleTags)

      // 填充槽位值
      const newSlotValues: Record<string, string> = {}
      result.slots.forEach(slot => {
        if (slot.extractedValue) {
          newSlotValues[slot.id] = slot.extractedValue
        }
      })
      setSlotValues(newSlotValues)

      setTimeout(() => {
        setIsAnalyzing(false)
        setShowResult(true)
      }, 500)
    } catch (err: any) {
      setIsAnalyzing(false)
      setAiError(err.message || 'AI分析失败，请重试')
    }
  }

  const addStyleTag = () => {
    if (customTag && !styleTags.includes(customTag)) {
      setStyleTags([...styleTags, customTag])
      setCustomTag('')
    }
  }

  const removeStyleTag = (tag: string) => {
    setStyleTags(styleTags.filter(t => t !== tag))
  }

  const tabs = [
    { key: 'link' as InputTab, icon: Link, label: '爆款链接' },
    { key: 'screenshot' as InputTab, icon: Upload, label: '上传截图' },
    { key: 'video' as InputTab, icon: Video, label: '视频链接' },
  ]

  return (
    <div style={{ padding: '44px 52px', minHeight: '100vh', background: '#050814' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 52 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 200, letterSpacing: '-0.03em', color: '#fafafa', marginBottom: 10 }}>
          爆款逆推器
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.01em' }}>
          导入爆款内容，AI逆向提取逻辑骨架，生成可复用基模
        </p>
      </div>

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

      {/* 输入区 */}
      <div style={{
        background: 'rgba(255,255,255,0.016)',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '36px 40px',
        marginBottom: 24
      }}>
        {/* Tab 栏 — 纯文字下划线风格 */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 0 }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setInputTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0 0 14px',
                fontSize: '0.8rem', letterSpacing: '0.04em',
                color: inputTab === tab.key ? '#fafafa' : 'rgba(255,255,255,0.3)',
                background: 'none', border: 'none', borderBottom: inputTab === tab.key ? '1px solid rgba(255,255,255,0.6)' : '1px solid transparent',
                cursor: 'pointer', transition: 'color 0.15s',
                marginBottom: -1
              }}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {inputTab === 'link' && (
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              value={linkValue}
              onChange={e => setLinkValue(e.target.value)}
              placeholder="粘贴爆款商品链接，如 Amazon / TikTok / Instagram 帖子链接"
              className="rm-input"
              style={{ flex: 1, padding: '14px 18px', fontSize: '0.875rem' }}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              style={{
                padding: '14px 28px', fontSize: '0.85rem', fontWeight: 500,
                color: '#050814', background: isAnalyzing ? 'rgba(0,240,255,0.4)' : '#00F0FF',
                border: 'none', cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'opacity 0.15s', opacity: isAnalyzing ? 0.6 : 1
              }}
            >
              {isAnalyzing ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
              {isAnalyzing ? '分析中...' : '开始逆推'}
            </button>
          </div>
        )}

        {inputTab === 'screenshot' && (
          <div
            onClick={handleAnalyze}
            style={{
              border: '1px dashed rgba(255,255,255,0.1)',
              padding: '60px 40px', textAlign: 'center', cursor: 'pointer',
              transition: 'border-color 0.15s'
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          >
            <Upload size={28} style={{ margin: '0 auto 16px', color: 'rgba(255,255,255,0.2)', display: 'block' }} />
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>点击上传或拖拽爆款截图至此</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>支持 PNG, JPG, WebP 格式</p>
          </div>
        )}

        {inputTab === 'video' && (
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              placeholder="粘贴 TikTok / Instagram / YouTube 视频链接"
              className="rm-input"
              style={{ flex: 1, padding: '14px 18px', fontSize: '0.875rem' }}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              style={{
                padding: '14px 28px', fontSize: '0.85rem', fontWeight: 500,
                color: '#050814', background: isAnalyzing ? 'rgba(0,240,255,0.4)' : '#00F0FF',
                border: 'none', cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'opacity 0.15s', opacity: isAnalyzing ? 0.6 : 1
              }}
            >
              {isAnalyzing ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
              {isAnalyzing ? '分析中...' : '开始逆推'}
            </button>
          </div>
        )}
      </div>

      {/* AI 解析动画 */}
      {isAnalyzing && (
        <div style={{
          background: 'rgba(255,255,255,0.016)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '36px 40px', marginBottom: 24
        }}>
          <p className="rm-mono-label" style={{ marginBottom: 28 }}>AI 逆向解析中</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {aiStages.map((stage, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{
                  width: 32, height: 32, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: i < currentStage ? 'rgba(74,222,128,0.8)' : i === currentStage ? '#00F0FF' : 'rgba(255,255,255,0.2)',
                  border: `1px solid ${i < currentStage ? 'rgba(74,222,128,0.2)' : i === currentStage ? 'rgba(0,240,255,0.25)' : 'rgba(255,255,255,0.06)'}`
                }}>
                  {i < currentStage ? <CheckCircle2 size={14} /> : i === currentStage ? <Loader2 size={14} className="animate-spin" /> : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.85rem', color: i <= currentStage ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}>{stage.label}</span>
                    {i <= currentStage && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{stage.desc}</span>}
                  </div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: i < currentStage ? 'rgba(74,222,128,0.5)' : i === currentStage ? '#00F0FF' : 'transparent',
                      width: i < currentStage ? '100%' : i === currentStage ? '60%' : '0%',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 基模输出预览 */}
      {showResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={16} style={{ color: 'rgba(74,222,128,0.7)' }} />
              <span style={{ fontSize: '1rem', fontWeight: 300, color: '#fafafa', letterSpacing: '-0.01em' }}>基模提取完成</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 20px', fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.5)', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer',
                transition: 'border-color 0.15s'
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
              >
                <Save size={13} /> 保存私有基模
              </button>
              {userRole === 'builder' && (
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 20px', fontSize: '0.8rem', fontWeight: 500,
                  color: '#050814', background: '#FFB800',
                  border: 'none', cursor: 'pointer'
                }}>
                  <Store size={13} /> 上架至市场
                </button>
              )}
            </div>
          </div>

          {/* AI识别摘要 */}
          {aiResult?.recognition && (
            <div style={{
              background: 'rgba(0,240,255,0.03)',
              border: '1px solid rgba(0,240,255,0.1)',
              padding: '16px 20px', marginBottom: 24
            }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>类型: <span style={{ color: '#00F0FF' }}>{aiResult.recognition.contentType}</span></span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>语言: <span style={{ color: '#00F0FF' }}>{aiResult.recognition.language}</span></span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>平台: <span style={{ color: '#00F0FF' }}>{aiResult.recognition.platform}</span></span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(0,240,255,0.65)', marginTop: 8 }}>{aiResult.recognition.summary}</p>
            </div>
          )}

          {/* 四维度展示 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* 结构骨架 */}
            <div style={{
              background: 'rgba(255,255,255,0.016)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '32px 36px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, background: '#00F0FF', flexShrink: 0 }} />
                <p className="rm-mono-label">结构骨架</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                {(aiResult?.structure || resultTemplate.structure).map((node, i) => {
                  const structureNodes = aiResult?.structure || resultTemplate.structure
                  return (
                    <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        padding: '7px 12px', fontSize: '0.75rem',
                        border: `1px solid ${typeColors[node.type]}30`,
                        background: typeColors[node.type] + '0d',
                        color: typeColors[node.type]
                      }}>{node.label}</div>
                      {i < structureNodes.length - 1 && (
                        <ArrowRightLeft size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 卖货逻辑 */}
            <div style={{
              background: 'rgba(255,255,255,0.016)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '32px 36px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, background: 'rgba(192,132,252,0.7)', flexShrink: 0 }} />
                <p className="rm-mono-label">卖货逻辑路径</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(aiResult?.logicPath || resultTemplate.logicPath).map(step => (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem' }}>
                    <span style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }}>{step.from}</span>
                    <span style={{
                      padding: '2px 7px',
                      color: step.type === 'cause' ? 'rgba(239,68,68,0.65)' : step.type === 'transition' ? 'rgba(96,165,250,0.65)' : 'rgba(74,222,128,0.65)',
                      background: step.type === 'cause' ? 'rgba(239,68,68,0.06)' : step.type === 'transition' ? 'rgba(96,165,250,0.06)' : 'rgba(74,222,128,0.06)'
                    }}>{step.label}</span>
                    <span style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }}>{step.to}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 风格标签云 */}
            <div style={{
              background: 'rgba(255,255,255,0.016)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '32px 36px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, background: 'rgba(74,222,128,0.6)', flexShrink: 0 }} />
                <p className="rm-mono-label">风格与文化偏好</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {styleTags.map(tag => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', fontSize: '0.72rem',
                    color: 'rgba(74,222,128,0.7)',
                    border: '1px solid rgba(74,222,128,0.15)'
                  }}>
                    <Tag size={9} />{tag}
                    <button onClick={() => removeStyleTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', padding: 0 }}><X size={9} /></button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={customTag}
                  onChange={e => setCustomTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addStyleTag()}
                  placeholder="添加风格标签"
                  className="rm-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}
                />
                <button onClick={addStyleTag} style={{
                  padding: '8px 14px', fontSize: '0.75rem',
                  color: 'rgba(74,222,128,0.6)', background: 'rgba(74,222,128,0.05)',
                  border: '1px solid rgba(74,222,128,0.12)', cursor: 'pointer'
                }}>添加</button>
              </div>
            </div>

            {/* 模板变量槽位 */}
            <div style={{
              background: 'rgba(255,255,255,0.016)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '32px 36px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, background: 'rgba(255,180,0,0.6)', flexShrink: 0 }} />
                <p className="rm-mono-label">模板变量槽位</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(aiResult?.slots || resultTemplate.slots).map(slot => (
                  <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.625rem', flexShrink: 0,
                      color: slot.required ? '#FFB800' : 'rgba(255,255,255,0.2)'
                    }}>{slot.required ? '*' : '○'}</span>
                    {editingSlot === slot.id ? (
                      <input
                        autoFocus
                        value={slotValues[slot.id] || ''}
                        onChange={e => setSlotValues({ ...slotValues, [slot.id]: e.target.value })}
                        onBlur={() => setEditingSlot(null)}
                        onKeyDown={e => e.key === 'Enter' && setEditingSlot(null)}
                        className="rm-input"
                        style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem' }}
                        placeholder={slot.placeholder}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingSlot(slot.id)}
                        style={{
                          flex: 1, padding: '6px 10px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          fontSize: '0.78rem', textAlign: 'left', cursor: 'pointer',
                          transition: 'border-color 0.15s', color: 'inherit'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,180,0,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}
                      >
                        <span style={{ color: 'rgba(255,180,0,0.7)' }}>[{slot.name}]</span>
                        {slotValues[slot.id]
                          ? <span style={{ color: 'rgba(255,255,255,0.7)', marginLeft: 6 }}>= {slotValues[slot.id]}</span>
                          : <span style={{ color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>{slot.placeholder}</span>
                        }
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 无结果占位 */}
      {!isAnalyzing && !showResult && (
        <div style={{
          background: 'rgba(255,255,255,0.016)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '80px 40px', textAlign: 'center'
        }}>
          <Zap size={36} style={{ margin: '0 auto 24px', color: 'rgba(255,255,255,0.1)', display: 'block' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)', marginBottom: 10, letterSpacing: '-0.01em' }}>
            准备好开始了吗？
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
            在上方输入爆款链接或上传截图<br />AI 将自动提取逻辑骨架
          </p>
        </div>
      )}
    </div>
  )
}
