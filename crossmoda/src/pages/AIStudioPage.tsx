import { useState } from 'react'
import { generateImage, generateVideoFromText, generateVideoFromImage, isDashScopeConfigured, type ImageGenerationResult, type VideoGenerationResult } from '../services/ai'
import { ImagePlus, Film, Video, Loader2, AlertCircle, Sparkles } from 'lucide-react'

type TabKey = 'text2img' | 'text2video' | 'img2video'

export default function AIStudioPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('text2img')
  const configured = isDashScopeConfigured()

  // ===== 文生图状态 =====
  const [imgPrompt, setImgPrompt] = useState('')
  const [imgSize, setImgSize] = useState('2K')
  const [imgCount, setImgCount] = useState(1)
  const [imgLoading, setImgLoading] = useState(false)
  const [imgResult, setImgResult] = useState<ImageGenerationResult | null>(null)
  const [imgError, setImgError] = useState<string | null>(null)

  // ===== 文生视频状态 =====
  const [t2vPrompt, setT2vPrompt] = useState('')
  const [t2vResolution, setT2vResolution] = useState('720P')
  const [t2vDuration, setT2vDuration] = useState(5)
  const [t2vRatio, setT2vRatio] = useState('16:9')
  const [t2vLoading, setT2vLoading] = useState(false)
  const [t2vStatus, setT2vStatus] = useState<string>('')
  const [t2vResult, setT2vResult] = useState<VideoGenerationResult | null>(null)
  const [t2vError, setT2vError] = useState<string | null>(null)

  // ===== 图生视频状态 =====
  const [i2vImageUrl, setI2vImageUrl] = useState('')
  const [i2vPrompt, setI2vPrompt] = useState('')
  const [i2vResolution, setI2vResolution] = useState('720P')
  const [i2vDuration, setI2vDuration] = useState(5)
  const [i2vLoading, setI2vLoading] = useState(false)
  const [i2vStatus, setI2vStatus] = useState<string>('')
  const [i2vResult, setI2vResult] = useState<VideoGenerationResult | null>(null)
  const [i2vError, setI2vError] = useState<string | null>(null)

  // ===== 文生图处理 =====
  const handleGenerateImage = async () => {
    if (!imgPrompt.trim()) return
    setImgLoading(true)
    setImgError(null)
    setImgResult(null)
    try {
      const result = await generateImage(imgPrompt, { size: imgSize, n: imgCount })
      setImgResult(result)
    } catch (err: any) {
      setImgError(err.message || '图片生成失败，请重试')
    } finally {
      setImgLoading(false)
    }
  }

  // ===== 文生视频处理 =====
  const handleGenerateT2V = async () => {
    if (!t2vPrompt.trim()) return
    setT2vLoading(true)
    setT2vError(null)
    setT2vResult(null)
    setT2vStatus('PENDING')
    try {
      const result = await generateVideoFromText(t2vPrompt, {
        resolution: t2vResolution,
        duration: t2vDuration,
        ratio: t2vRatio,
        onProgress: (r) => setT2vStatus(r.status),
      })
      if (result.status === 'SUCCEEDED') {
        setT2vResult(result)
        setT2vStatus('SUCCEEDED')
      } else {
        setT2vError(result.errorMessage || '视频生成失败')
        setT2vStatus('FAILED')
      }
    } catch (err: any) {
      setT2vError(err.message || '视频生成失败，请重试')
      setT2vStatus('')
    } finally {
      setT2vLoading(false)
    }
  }

  // ===== 图生视频处理 =====
  const handleGenerateI2V = async () => {
    if (!i2vImageUrl.trim()) return
    setI2vLoading(true)
    setI2vError(null)
    setI2vResult(null)
    setI2vStatus('PENDING')
    try {
      const result = await generateVideoFromImage(i2vImageUrl, i2vPrompt || undefined, {
        resolution: i2vResolution,
        duration: i2vDuration,
        onProgress: (r) => setI2vStatus(r.status),
      })
      if (result.status === 'SUCCEEDED') {
        setI2vResult(result)
        setI2vStatus('SUCCEEDED')
      } else {
        setI2vError(result.errorMessage || '视频生成失败')
        setI2vStatus('FAILED')
      }
    } catch (err: any) {
      setI2vError(err.message || '视频生成失败，请重试')
      setI2vStatus('')
    } finally {
      setI2vLoading(false)
    }
  }

  const tabs: { key: TabKey; icon: typeof ImagePlus; label: string }[] = [
    { key: 'text2img', icon: ImagePlus, label: '文生图' },
    { key: 'text2video', icon: Film, label: '文生视频' },
    { key: 'img2video', icon: Video, label: '图生视频' },
  ]

  const statusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '排队中...'
      case 'RUNNING': return '生成中...'
      case 'SUCCEEDED': return '生成完成'
      case 'FAILED': return '生成失败'
      default: return status
    }
  }

  return (
    <div style={{ padding: '44px 52px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 200, letterSpacing: '-0.02em', color: '#fafafa', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Sparkles size={24} style={{ color: '#00F0FF' }} />
          AI 创作工坊
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 8 }}>文生图 · 文生视频 · 图生视频 — 基于阿里云 DashScope 多模态生成</p>
      </div>

      {/* DashScope 未配置提示 */}
      {!configured && (
        <div style={{ padding: '12px 18px', marginBottom: 20, background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={16} style={{ color: '#FFB800', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>DashScope 未配置，AI创作功能不可用。请在项目根目录的 <code style={{ color: '#FFB800' }}>.env</code> 文件中设置 <code style={{ color: '#FFB800' }}>VITE_DASHSCOPE_API_KEY</code></span>
        </div>
      )}

      {/* 标签页切换 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s ease',
            color: activeTab === tab.key ? '#00F0FF' : 'rgba(255,255,255,0.38)',
            border: `1px solid ${activeTab === tab.key ? 'rgba(0,240,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
            background: 'transparent',
          }}>
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== 文生图 Tab ===== */}
      {activeTab === 'text2img' && (
        <div>
          <div className="rm-card" style={{ padding: '28px 24px', marginBottom: 20 }}>
            <label className="rm-mono-label" style={{ display: 'block', marginBottom: 12 }}>图片描述（提示词）</label>
            <textarea
              value={imgPrompt}
              onChange={e => setImgPrompt(e.target.value)}
              placeholder="例：一只穿着宇航服的猫咪，漂浮在星空中，赛博朋克风格，高细节"
              rows={4}
              className="rm-input"
              style={{ resize: 'none', width: '100%' }}
            />

            <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>分辨率</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['1K', '2K', '4K'].map(s => (
                    <button key={s} onClick={() => setImgSize(s)} style={{
                      padding: '7px 14px', fontSize: 12, cursor: 'pointer',
                      color: imgSize === s ? '#00F0FF' : 'rgba(255,255,255,0.40)',
                      border: `1px solid ${imgSize === s ? 'rgba(0,240,255,0.28)' : 'rgba(255,255,255,0.07)'}`,
                      background: 'transparent',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>生成数量</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4].map(n => (
                    <button key={n} onClick={() => setImgCount(n)} style={{
                      padding: '7px 14px', fontSize: 12, cursor: 'pointer',
                      color: imgCount === n ? '#FFB800' : 'rgba(255,255,255,0.40)',
                      border: `1px solid ${imgCount === n ? 'rgba(255,184,0,0.28)' : 'rgba(255,255,255,0.07)'}`,
                      background: 'transparent',
                    }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateImage}
            disabled={imgLoading || !imgPrompt.trim() || !configured}
            className="rm-btn-dawn"
            style={{ fontSize: 13, padding: '11px 28px', opacity: (imgLoading || !imgPrompt.trim() || !configured) ? 0.5 : 1, cursor: (imgLoading || !imgPrompt.trim() || !configured) ? 'not-allowed' : 'pointer' }}
          >
            {imgLoading ? <><Loader2 size={14} className="animate-spin" /> 生成中...</> : <><ImagePlus size={14} /> 生成图片</>}
          </button>

          {/* 错误提示 */}
          {imgError && (
            <div style={{ padding: '12px 18px', marginTop: 20, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{imgError}</span>
            </div>
          )}

          {/* Loading 动画 */}
          {imgLoading && (
            <div className="rm-card" style={{ marginTop: 24, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, margin: '0 auto 20px', border: '1px solid transparent', borderTopColor: '#00F0FF', borderRightColor: '#FFB800', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 14, fontWeight: 300, color: '#fafafa' }}>AI 正在生成图片...</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 6 }}>分辨率 {imgSize} · {imgCount} 张</p>
            </div>
          )}

          {/* 生成结果 */}
          {imgResult && (
            <div className="rm-card" style={{ marginTop: 24, padding: '24px' }}>
              <p style={{ fontSize: 10, color: '#00F0FF', marginBottom: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>生成结果</p>
              <img
                src={imgResult.imageUrl}
                alt="AI Generated"
                style={{ maxWidth: '100%', maxHeight: 512, border: '1px solid rgba(255,255,255,0.07)' }}
              />
              <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                Request ID: {imgResult.requestId} · 分辨率: {imgResult.size || imgSize}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 文生视频 Tab ===== */}
      {activeTab === 'text2video' && (
        <div>
          <div className="rm-card" style={{ padding: '28px 24px', marginBottom: 20 }}>
            <label className="rm-mono-label" style={{ display: 'block', marginBottom: 12 }}>视频描述</label>
            <textarea
              value={t2vPrompt}
              onChange={e => setT2vPrompt(e.target.value)}
              placeholder="例：一只金毛犬在海边奔跑，阳光洒在海面上，慢镜头效果"
              rows={4}
              className="rm-input"
              style={{ resize: 'none', width: '100%' }}
            />

            <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>分辨率</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['720P', '1080P'].map(r => (
                    <button key={r} onClick={() => setT2vResolution(r)} style={{
                      padding: '7px 14px', fontSize: 12, cursor: 'pointer',
                      color: t2vResolution === r ? '#00F0FF' : 'rgba(255,255,255,0.40)',
                      border: `1px solid ${t2vResolution === r ? 'rgba(0,240,255,0.28)' : 'rgba(255,255,255,0.07)'}`,
                      background: 'transparent',
                    }}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>时长（秒）</label>
                <input
                  type="number"
                  min={3}
                  max={15}
                  value={t2vDuration}
                  onChange={e => setT2vDuration(Math.min(15, Math.max(3, Number(e.target.value))))}
                  className="rm-input"
                  style={{ width: 80 }}
                />
              </div>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>画面比例</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['16:9', '9:16', '1:1'].map(r => (
                    <button key={r} onClick={() => setT2vRatio(r)} style={{
                      padding: '7px 14px', fontSize: 12, cursor: 'pointer',
                      color: t2vRatio === r ? '#FFB800' : 'rgba(255,255,255,0.40)',
                      border: `1px solid ${t2vRatio === r ? 'rgba(255,184,0,0.28)' : 'rgba(255,255,255,0.07)'}`,
                      background: 'transparent',
                    }}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateT2V}
            disabled={t2vLoading || !t2vPrompt.trim() || !configured}
            className="rm-btn-dawn"
            style={{ fontSize: 13, padding: '11px 28px', opacity: (t2vLoading || !t2vPrompt.trim() || !configured) ? 0.5 : 1, cursor: (t2vLoading || !t2vPrompt.trim() || !configured) ? 'not-allowed' : 'pointer' }}
          >
            {t2vLoading ? <><Loader2 size={14} className="animate-spin" /> 生成中...</> : <><Film size={14} /> 生成视频</>}
          </button>

          {/* 错误提示 */}
          {t2vError && (
            <div style={{ padding: '12px 18px', marginTop: 20, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t2vError}</span>
            </div>
          )}

          {/* 进度状态 */}
          {t2vLoading && (
            <div className="rm-card" style={{ marginTop: 24, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, margin: '0 auto 20px', border: '1px solid transparent', borderTopColor: '#00F0FF', borderRightColor: '#FFB800', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 14, fontWeight: 300, color: '#fafafa' }}>AI 正在生成视频...</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 6 }}>当前状态：{statusLabel(t2vStatus)}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18 }}>
                {['PENDING', 'RUNNING', 'SUCCEEDED'].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, background: t2vStatus === s ? '#00F0FF' : ((['PENDING', 'RUNNING', 'SUCCEEDED'].indexOf(t2vStatus) >= ['PENDING', 'RUNNING', 'SUCCEEDED'].indexOf(s)) ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.1)') }} />
                    <span style={{ fontSize: 11, color: t2vStatus === s ? '#00F0FF' : 'rgba(255,255,255,0.3)' }}>{statusLabel(s)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 视频结果 */}
          {t2vResult && t2vResult.videoUrl && (
            <div className="rm-card" style={{ marginTop: 24, padding: '24px' }}>
              <p style={{ fontSize: 10, color: '#00F0FF', marginBottom: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>生成结果</p>
              <video
                src={t2vResult.videoUrl}
                controls
                style={{ maxWidth: '100%', maxHeight: 420, border: '1px solid rgba(255,255,255,0.07)' }}
              />
              <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                Task ID: {t2vResult.taskId} · 时长: {t2vResult.duration || t2vDuration}s
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 图生视频 Tab ===== */}
      {activeTab === 'img2video' && (
        <div>
          <div className="rm-card" style={{ padding: '28px 24px', marginBottom: 20 }}>
            <label className="rm-mono-label" style={{ display: 'block', marginBottom: 12 }}>图片 URL（首帧图片）</label>
            <input
              value={i2vImageUrl}
              onChange={e => setI2vImageUrl(e.target.value)}
              placeholder="粘贴图片URL，例：https://example.com/image.jpg"
              className="rm-input"
              style={{ width: '100%' }}
            />

            <label className="rm-mono-label" style={{ display: 'block', marginBottom: 12, marginTop: 20 }}>运动描述（可选）</label>
            <textarea
              value={i2vPrompt}
              onChange={e => setI2vPrompt(e.target.value)}
              placeholder="例：镜头缓慢推进，画面中的人物转头微笑"
              rows={3}
              className="rm-input"
              style={{ resize: 'none', width: '100%' }}
            />

            <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>分辨率</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['720P', '1080P'].map(r => (
                    <button key={r} onClick={() => setI2vResolution(r)} style={{
                      padding: '7px 14px', fontSize: 12, cursor: 'pointer',
                      color: i2vResolution === r ? '#00F0FF' : 'rgba(255,255,255,0.40)',
                      border: `1px solid ${i2vResolution === r ? 'rgba(0,240,255,0.28)' : 'rgba(255,255,255,0.07)'}`,
                      background: 'transparent',
                    }}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>时长（秒）</label>
                <input
                  type="number"
                  min={3}
                  max={15}
                  value={i2vDuration}
                  onChange={e => setI2vDuration(Math.min(15, Math.max(3, Number(e.target.value))))}
                  className="rm-input"
                  style={{ width: 80 }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateI2V}
            disabled={i2vLoading || !i2vImageUrl.trim() || !configured}
            className="rm-btn-dawn"
            style={{ fontSize: 13, padding: '11px 28px', opacity: (i2vLoading || !i2vImageUrl.trim() || !configured) ? 0.5 : 1, cursor: (i2vLoading || !i2vImageUrl.trim() || !configured) ? 'not-allowed' : 'pointer' }}
          >
            {i2vLoading ? <><Loader2 size={14} className="animate-spin" /> 生成中...</> : <><Video size={14} /> 生成视频</>}
          </button>

          {/* 错误提示 */}
          {i2vError && (
            <div style={{ padding: '12px 18px', marginTop: 20, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{i2vError}</span>
            </div>
          )}

          {/* 进度状态 */}
          {i2vLoading && (
            <div className="rm-card" style={{ marginTop: 24, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, margin: '0 auto 20px', border: '1px solid transparent', borderTopColor: '#00F0FF', borderRightColor: '#FFB800', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 14, fontWeight: 300, color: '#fafafa' }}>AI 正在生成视频...</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 6 }}>当前状态：{statusLabel(i2vStatus)}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18 }}>
                {['PENDING', 'RUNNING', 'SUCCEEDED'].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, background: i2vStatus === s ? '#00F0FF' : ((['PENDING', 'RUNNING', 'SUCCEEDED'].indexOf(i2vStatus) >= ['PENDING', 'RUNNING', 'SUCCEEDED'].indexOf(s)) ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.1)') }} />
                    <span style={{ fontSize: 11, color: i2vStatus === s ? '#00F0FF' : 'rgba(255,255,255,0.3)' }}>{statusLabel(s)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 视频结果 */}
          {i2vResult && i2vResult.videoUrl && (
            <div className="rm-card" style={{ marginTop: 24, padding: '24px' }}>
              <p style={{ fontSize: 10, color: '#00F0FF', marginBottom: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>生成结果</p>
              <video
                src={i2vResult.videoUrl}
                controls
                style={{ maxWidth: '100%', maxHeight: 420, border: '1px solid rgba(255,255,255,0.07)' }}
              />
              <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                Task ID: {i2vResult.taskId} · 时长: {i2vResult.duration || i2vDuration}s
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
