import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, UserRole } from '../App'
import { ArrowRight } from 'lucide-react'

// ===== 混沌碎片数据 =====
const CHAOS_WORDS = [
  { text: 'trending now', top: '12%', left: '58%', opacity: 0.12, size: '11px', rotate: -12 },
  { text: '🔥 viral 2.3M', top: '22%', left: '72%', opacity: 0.09, size: '12px', rotate: 6 },
  { text: '0:00 / 0:47 ▶', top: '38%', left: '64%', opacity: 0.08, size: '10px', rotate: -4 },
  { text: 'shipped worldwide', top: '16%', left: '82%', opacity: 0.10, size: '10px', rotate: -8 },
  { text: '★★★★★ 4.9', top: '52%', left: '68%', opacity: 0.08, size: '11px', rotate: 3 },
  { text: '#aesthetic #fyp', top: '30%', left: '88%', opacity: 0.08, size: '10px', rotate: 9 },
  { text: 'add to cart 🛒', top: '65%', left: '60%', opacity: 0.07, size: '12px', rotate: -6 },
  { text: 'LIMITED OFFER', top: '74%', left: '78%', opacity: 0.08, size: '10px', rotate: -9 },
  { text: '▶ 127.4K views', top: '80%', left: '87%', opacity: 0.09, size: '11px', rotate: 2 },
  { text: 'shop link in bio', top: '46%', left: '83%', opacity: 0.07, size: '10px', rotate: 5 },
]

// ===== 功能矩阵数据 =====
const FEATURES = [
  { title: '爆款逆推器', desc: '多模态AI解析爆款链接、截图、视频，自动切片逻辑结构生成骨架', color: '#00F0FF' },
  { title: '基模编辑器', desc: '可视化编辑骨架节点，精确定义变量槽位与逻辑路径关系', color: 'rgba(255,255,255,0.7)' },
  { title: '缝合生成器', desc: '选基模填参数，AI智能映射后一键输出多语言多市场推广内容', color: '#FFB800' },
  { title: '基模市场', desc: '高质量基模资产交易平台，构建师持续分润，形成生态飞轮', color: 'rgba(255,255,255,0.7)' },
  { title: '多市场本土化', desc: '覆盖北美、欧洲、东南亚、中东等主流市场，精准适配本土语境', color: '#00F0FF' },
  { title: '经验沉淀资产', desc: '将运营网感结构化为数字资产，让爆款逻辑可流通可复用', color: 'rgba(255,255,255,0.7)' },
]

// ===== 星辰闪烁点 =====
function StarDot({ color = '#00F0FF', size = 22, delay = 0 }: { color?: string; size?: number; delay?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}>
      {/* 脑冲外环 */}
      <circle cx="12" cy="12" r="10" fill="none"
        stroke={color} strokeWidth="0.7" strokeOpacity="0.22"
        style={{ animation: `star-pulse 2.8s ease-in-out infinite`, animationDelay: `${delay}s`, transformOrigin: '12px 12px' }}
      />
      {/* 4点星体 */}
      <path d="M12,3 L14.5,9.5 L21,12 L14.5,14.5 L12,21 L9.5,14.5 L3,12 L9.5,9.5 Z"
        fill={color} opacity={0.88}
        style={{ animation: `star-twinkle ${2.5 + delay * 0.2}s ease-in-out infinite`, animationDelay: `${delay * 0.4}s`, transformOrigin: '12px 12px' }}
      />
      {/* 尖刺小尾尖 */}
      <line x1="12" y1="0.5" x2="12" y2="2.5" stroke={color} strokeWidth="0.9" strokeOpacity="0.5" />
      <line x1="12" y1="21.5" x2="12" y2="23.5" stroke={color} strokeWidth="0.9" strokeOpacity="0.5" />
      <line x1="0.5" y1="12" x2="2.5" y2="12" stroke={color} strokeWidth="0.9" strokeOpacity="0.5" />
      <line x1="21.5" y1="12" x2="23.5" y2="12" stroke={color} strokeWidth="0.9" strokeOpacity="0.5" />
      {/* 中心白点 */}
      <circle cx="12" cy="12" r="1.6" fill="white" opacity={0.95} />
    </svg>
  )
}

// ===== SVG 基模节点图（星座风格）=====
function NodeGraph({ visible }: { visible: boolean }) {
  // 坐标放大 1.45 倍，节点间距更宽松
  const nodes = [
    { label: '痛点钩子', step: '01', x: 180, y: 52,  color: '#00F0FF', delay: 0.42 },
    { label: '放大焦虑', step: '02', x: 82,  y: 166, color: '#00F0FF', delay: 0.54 },
    { label: '产品亮相', step: '03', x: 278, y: 166, color: '#FFB800', delay: 0.66 },
    { label: '场景演示', step: '04', x: 180, y: 272, color: 'rgba(255,255,255,0.85)', delay: 0.78 },
    { label: '达人背书', step: '05', x: 82,  y: 386, color: '#FFB800', delay: 0.90 },
    { label: '促单转化', step: '06', x: 278, y: 386, color: '#00F0FF', delay: 1.02 },
  ]
  const edges = [
    { x1: 180, y1: 52,  x2: 82,  y2: 166, delay: 0.5,  color: '#00F0FF', dur: 2.8 },
    { x1: 180, y1: 52,  x2: 278, y2: 166, delay: 0.65, color: '#FFB800', dur: 3.1 },
    { x1: 82,  y1: 166, x2: 180, y2: 272, delay: 0.82, color: '#00F0FF', dur: 2.6 },
    { x1: 278, y1: 166, x2: 180, y2: 272, delay: 0.97, color: '#FFB800', dur: 3.3 },
    { x1: 180, y1: 272, x2: 82,  y2: 386, delay: 1.15, color: '#FFB800', dur: 2.9 },
    { x1: 180, y1: 272, x2: 278, y2: 386, delay: 1.3,  color: '#00F0FF', dur: 3.0 },
  ]

  return (
    <div style={{ width: 360, height: 440, opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
      <svg width="360" height="440" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="ng-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ng-glow-sm">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ng-glow-text">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* 星座连线 */}
        {edges.map((e, i) => (
          <g key={i} style={visible ? {
            opacity: 0,
            animation: 'edge-fade-in 0.5s ease forwards',
            animationDelay: `${e.delay}s`,
          } : { opacity: 0 }}>
            {/* 静态暗线（加粗） */}
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke={e.color} strokeWidth="1" strokeOpacity="0.15" />
            {/* 流光轨迹（加粗） */}
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke={e.color} strokeWidth="2.4"
              strokeDasharray="22 88"
              strokeLinecap="round"
              filter="url(#ng-glow)"
              style={visible ? {
                strokeOpacity: 0.9,
                animation: `constellation-flow ${e.dur}s linear infinite`,
                animationDelay: `${e.delay + 0.4}s`,
              } : { display: 'none' }}
            />
          </g>
        ))}

        {/* 星辰节点 */}
        {nodes.map((n, i) => (
          <g key={i} style={visible ? {
            animation: 'star-node-appear 0.4s ease forwards',
            animationDelay: `${n.delay}s`,
            opacity: 0, transformOrigin: `${n.x}px ${n.y}px`,
          } : { opacity: 0 }}>
            {/* 外扩光晕圆 */}
            <circle cx={n.x} cy={n.y} r={30} fill="none"
              stroke={n.color} strokeWidth="0.5" strokeOpacity="0.10"
            />
            {/* 脑冲外环（放大） */}
            <circle cx={n.x} cy={n.y} r={22} fill="none"
              stroke={n.color} strokeWidth="0.8" strokeOpacity="0.22"
              style={{ animation: `star-pulse ${2.6 + i * 0.22}s ease-in-out infinite`, animationDelay: `${i * 0.38}s`, transformOrigin: `${n.x}px ${n.y}px` }}
            />
            {/* 4点星主体（放大） */}
            <path
              transform={`translate(${n.x}, ${n.y})`}
              d="M0,-12 L3.3,-3.3 L12,0 L3.3,3.3 L0,12 L-3.3,3.3 L-12,0 L-3.3,-3.3 Z"
              fill={n.color}
              filter="url(#ng-glow-sm)"
              style={{
                animation: `star-twinkle ${2.3 + i * 0.22}s ease-in-out infinite`,
                animationDelay: `${i * 0.35}s`,
                transformOrigin: '0px 0px',
              }}
            />
            {/* 尖刺（放大） */}
            <line x1={n.x} y1={n.y - 17} x2={n.x} y2={n.y - 13} stroke={n.color} strokeWidth="1" strokeOpacity="0.55" />
            <line x1={n.x} y1={n.y + 13} x2={n.x} y2={n.y + 17} stroke={n.color} strokeWidth="1" strokeOpacity="0.55" />
            <line x1={n.x - 17} y1={n.y} x2={n.x - 13} y2={n.y} stroke={n.color} strokeWidth="1" strokeOpacity="0.55" />
            <line x1={n.x + 13} y1={n.y} x2={n.x + 17} y2={n.y} stroke={n.color} strokeWidth="1" strokeOpacity="0.55" />
            {/* 中心白点（放大） */}
            <circle cx={n.x} cy={n.y} r={2.2} fill="white" opacity={0.98} />
            {/* 步骤编号（小） */}
            <text x={n.x} y={n.y + 28} textAnchor="middle" dominantBaseline="hanging"
              fontSize="9" fill={n.color} fontFamily="'JetBrains Mono', monospace" opacity={0.45} letterSpacing="0.06em">
              {n.step}
            </text>
            {/* 主标签（放大+加粗+发光） */}
            <text x={n.x} y={n.y + 40} textAnchor="middle" dominantBaseline="hanging"
              fontSize="12.5" fontWeight="500" fill={n.color}
              fontFamily="Inter, system-ui, sans-serif"
              filter="url(#ng-glow-text)"
              opacity={0.95} letterSpacing="0.03em">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ===== 四步流程 =====
const STEPS = [
  { num: '01', title: '导入爆款', desc: '链接/截图/视频', color: '#00F0FF' },
  { num: '02', title: '逆推基模', desc: 'AI解构逻辑骨架', color: 'rgba(255,255,255,0.6)' },
  { num: '03', title: '缝合商品', desc: '填参数·智能映射', color: 'rgba(255,255,255,0.6)' },
  { num: '04', title: '本土生成', desc: '多语言·多市场', color: '#FFB800' },
]

function FlowSteps({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch' }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div
            className="rm-feature-card"
            onClick={i === STEPS.length - 1 ? onStart : undefined}
            style={{
              flex: 1, padding: '36px 28px', minHeight: 172,
              border: `1px solid ${i === STEPS.length - 1 ? 'rgba(255,184,0,0.18)' : 'rgba(255,255,255,0.05)'}`,
              cursor: i === STEPS.length - 1 ? 'pointer' : 'default',
              background: i === STEPS.length - 1 ? 'rgba(255,184,0,0.025)' : undefined,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <StarDot color={s.color} size={24} delay={i * 0.4} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: s.color, marginBottom: 10, letterSpacing: '0.06em' }}>
              {s.num} · {s.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', lineHeight: 1.7 }}>{s.desc}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 28, flexShrink: 0 }}>
              <div className="rm-flow-line" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ===== 功能卡片 =====
function FeatureCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <div className="rm-feature-card" style={{ padding: '36px 30px', minHeight: 178 }}>
      <div style={{ marginBottom: 18 }}>
        <StarDot color={color} size={24} delay={Math.random() * 1.5} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 400, color, marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.85, color: 'rgba(255,255,255,0.42)' }}>{desc}</div>
    </div>
  )
}

// ===== 双角色壁垒区 =====
function RoleBarrier({ onMerchant, onBuilder }: { onMerchant: () => void; onBuilder: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch' }}>
      {/* 商家 */}
      <div style={{
        flex: 1, padding: '52px 44px',
        background: 'rgba(0,240,255,0.025)',
        border: '1px solid rgba(0,240,255,0.10)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 20 }}>
          <StarDot color="#00F0FF" size={36} delay={0.2} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 300, color: '#00F0FF', marginBottom: 16 }}>跨境商家</div>
        <p style={{ fontSize: 13, lineHeight: 1.85, color: 'rgba(255,255,255,0.38)', marginBottom: 28 }}>
          无需懂算法，找到爆款基模，填入商品参数，一键生成符合当地语境的推广内容。
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 36 }}>
          {['浏览并购买基模', '填参数一键生成', '多市场本土化'].map((item, i) => (
            <li key={i} style={{ fontSize: 12, padding: '5px 0', color: i === 0 ? 'rgba(0,240,255,0.75)' : 'rgba(255,255,255,0.38)' }}>
              → {item}
            </li>
          ))}
        </ul>
        <button onClick={onMerchant} className="rm-btn-dawn-ghost" style={{ padding: '9px 22px', fontSize: 12 }}>
          商家体验 <ArrowRight size={12} />
        </button>
      </div>

      {/* 壁垒+光束 */}
      <div style={{ width: 72, position: 'relative', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1,
          background: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 6px, transparent 6px, transparent 12px)',
        }} />
        <div style={{
          position: 'absolute', left: -10, right: -10, height: 1,
          background: 'linear-gradient(90deg, rgba(0,240,255,0.25), #00F0FF, #FFB800, rgba(255,184,0,0.25))',
          animation: 'beam-pulse 3s ease-in-out infinite',
        }} />
        <div style={{
          position: 'relative', background: '#050814',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '8px 10px', fontSize: 9, color: 'rgba(255,255,255,0.38)',
          textAlign: 'center', letterSpacing: '0.06em', marginTop: 80,
        }}>
          基模<br />平台
        </div>
      </div>

      {/* 构建师 */}
      <div style={{
        flex: 1, padding: '52px 44px',
        background: 'rgba(255,184,0,0.025)',
        border: '1px solid rgba(255,184,0,0.10)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 20 }}>
          <StarDot color="#FFB800" size={36} delay={0.6} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 300, color: '#FFB800', marginBottom: 16 }}>基模构建师</div>
        <p style={{ fontSize: 13, lineHeight: 1.85, color: 'rgba(255,255,255,0.38)', marginBottom: 28 }}>
          将你的跨境运营经验结构化为基模，上架市场，每次被商家使用都能持续获得分润。
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 36 }}>
          {['逆推并构建基模', '上架基模市场', '持续分润收益'].map((item, i) => (
            <li key={i} style={{ fontSize: 12, padding: '5px 0', color: i === 0 ? 'rgba(255,184,0,0.78)' : 'rgba(255,255,255,0.38)' }}>
              → {item}
            </li>
          ))}
        </ul>
        <button onClick={onBuilder} className="rm-btn-dawn-ghost" style={{ padding: '9px 22px', fontSize: 12 }}>
          构建师入驻 <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}

// ===== 主组件 =====
export default function HomePage() {
  const { setIsLoggedIn, setUserRole } = useApp()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [loginRole, setLoginRole] = useState<UserRole>('merchant')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [animPhase, setAnimPhase] = useState(0)
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimPhase(1), 400),
      setTimeout(() => setAnimPhase(2), 1300),
      setTimeout(() => setAnimPhase(3), 2000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // 探照灯鼠标跟踪
  useEffect(() => {
    const el = spotlightRef.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) * 100).toFixed(2) + '%'
      const y = ((e.clientY / window.innerHeight) * 100).toFixed(2) + '%'
      el.style.setProperty('--mx', x)
      el.style.setProperty('--my', y)
      el.classList.add('active')
    }
    const handleLeave = () => el.classList.remove('active')
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseleave', handleLeave)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  const quickLogin = (role: UserRole) => {
    setUserRole(role)
    setIsLoggedIn(true)
    navigate('/dashboard')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setUserRole(loginRole)
    setIsLoggedIn(true)
    navigate('/dashboard')
  }

  return (
    <div className="homepage-cursor" style={{
      background: '#050814', minHeight: '100vh', color: '#fafafa',
      overflowX: 'hidden', fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>
      {/* 晨光探照灯背景层 */}
      <div ref={spotlightRef} className="dawn-spotlight" />

      {/* 网格背景 */}
      <div className="rm-grid-bg" />

      {/* ===== 顶部导航 ===== */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 52px', height: 58,
        background: 'rgba(5,8,20,0.90)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #00F0FF, #FFB800)',
            color: '#050814', fontWeight: 800, fontSize: 10,
          }}>R</div>
          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.01em' }}>RayMatrix</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.20)', marginLeft: 2 }}>芒阵</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setShowLogin(true)} className="rm-btn-ghost" style={{ fontSize: 12, padding: '7px 18px' }}>登录</button>
          <button onClick={() => setShowLogin(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '7px 18px', fontSize: 12, fontWeight: 400, cursor: 'pointer',
            background: 'transparent', color: '#FFB800',
            border: '1px solid rgba(255,184,0,0.28)',
            transition: 'all 0.15s ease',
          }}>免费体验</button>
        </div>
      </header>

      {/* ===== HERO 区域 ===== */}
      <section style={{
        minHeight: 'calc(100vh - 58px)', position: 'relative',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* 混沌碎片层 */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          opacity: animPhase >= 2 ? 0 : 1, transition: 'opacity 0.9s ease',
        }}>
          {CHAOS_WORDS.map((w, i) => (
            <span key={i} style={{
              position: 'absolute', top: w.top, left: w.left,
              color: `rgba(255,255,255,${w.opacity})`,
              fontFamily: 'monospace', fontSize: w.size,
              transform: `rotate(${w.rotate}deg)`, userSelect: 'none',
            }}>{w.text}</span>
          ))}
        </div>

        {/* 光刃 */}
        {animPhase >= 1 && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
            <div className="rm-blade" />
          </div>
        )}

        {/* 斜切光晕 */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'linear-gradient(135deg, transparent 20%, rgba(0,240,255,0.025) 55%, rgba(255,184,0,0.04) 100%)',
          opacity: animPhase >= 2 ? 1 : 0, transition: 'opacity 1.4s ease',
        }} />

        {/* Hero 内容 */}
        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: 1200, margin: '0 auto', padding: '0 64px',
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 64,
        }}>
          {/* 左侧文案 */}
          <div style={{ maxWidth: 580 }}>
            <div className="rm-aurora-label" style={{
              marginBottom: 36, display: 'inline-flex',
              opacity: animPhase >= 3 ? 1 : 0,
              transition: 'opacity 0.7s ease 0.1s',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#00F0FF', boxShadow: '0 0 5px #00F0FF',
                display: 'inline-block', flexShrink: 0,
              }} />
              AI-Powered Breakout Logic Engine
            </div>

            <h1 style={{
              fontSize: 68, fontWeight: 200, lineHeight: 1.04, marginBottom: 26,
              letterSpacing: '-0.025em',
              opacity: animPhase >= 3 ? 1 : 0,
              transition: 'opacity 0.9s ease 0.28s',
            }}>
              划破混沌
              <br />
              <span className="rm-dawn-gradient" style={{ fontWeight: 300 }}>洞察爆款基因</span>
            </h1>

            <p style={{
              fontSize: 14, lineHeight: 1.88, color: 'rgba(255,255,255,0.38)',
              marginBottom: 46, maxWidth: 440,
              opacity: animPhase >= 3 ? 1 : 0,
              transition: 'opacity 0.9s ease 0.48s',
            }}>
              AI逆推基模，一键缝合商品，让每一次出海都豁然开朗。
              <br />从混沌爆款中提取卖货"灵魂骨架"，照亮你的跨境之路。
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 20,
              opacity: animPhase >= 3 ? 1 : 0,
              transform: animPhase >= 3 ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.9s ease 0.7s, transform 0.9s ease 0.7s',
            }}>
              <button onClick={() => quickLogin('merchant')} className="rm-btn-dawn">
                立即破局 <ArrowRight size={14} />
              </button>
              <button onClick={() => quickLogin('builder')} className="rm-btn-dawn-ghost">
                构建师入驻 <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 右侧 SVG 节点图 */}
          <div style={{ flexShrink: 0, paddingRight: 12 }}>
            <NodeGraph visible={animPhase >= 2} />
          </div>
        </div>
      </section>

      {/* ===== 四步破局流程 ===== */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '120px 64px' }}>
        <div className="rm-blade-divider" style={{ marginBottom: 80 }} />
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="rm-section-heading">四步<span className="rm-dawn-gradient">破局闭环</span></h2>
          <p className="rm-section-sub">从混沌素材到本土内容，AI光速完成</p>
        </div>
        <FlowSteps onStart={() => quickLogin('merchant')} />
      </section>

      {/* ===== 功能矩阵 ===== */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 64px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="rm-section-heading">核心能力矩阵</h2>
          <p className="rm-section-sub">每一个功能，都是划破传统跨境困局的一把刀刃</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* ===== 双角色壁垒区 ===== */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 64px 120px' }}>
        <div className="rm-blade-divider" style={{ marginBottom: 80 }} />
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="rm-section-heading">一道光束，<span className="rm-dawn-gradient">打通两端</span></h2>
          <p className="rm-section-sub">基模平台打破商家与经验之间的信息壁垒</p>
        </div>
        <RoleBarrier onMerchant={() => quickLogin('merchant')} onBuilder={() => quickLogin('builder')} />
      </section>

      {/* ===== 底部 CTA ===== */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 860, margin: '0 auto', padding: '0 64px 140px', textAlign: 'center' }}>
        <div style={{
          padding: '84px 68px', position: 'relative', overflow: 'hidden',
          background: 'rgba(255,255,255,0.016)', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(255,184,0,0.028) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontSize: 44, fontWeight: 200, marginBottom: 18, letterSpacing: '-0.025em', position: 'relative' }}>
            让每一次出海<br />
            <span className="rm-dawn-gradient" style={{ fontWeight: 300 }}>豁然开朗</span>
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.30)', marginBottom: 46, position: 'relative' }}>
            看不见的运营经验，变为可流通的数字资产
          </p>
          <button onClick={() => setShowLogin(true)} className="rm-btn-dawn" style={{ position: 'relative' }}>
            开始使用 RayMatrix 芒阵 <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ===== 页脚 ===== */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '36px', textAlign: 'center',
        fontSize: 11, color: 'rgba(255,255,255,0.16)',
      }}>
        &copy; 2026 RayMatrix 芒阵 · AI爆款逻辑引擎与基模生态平台
      </footer>

      {/* ===== 登录弹窗 ===== */}
      {showLogin && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,8,20,0.92)', backdropFilter: 'blur(16px)',
        }} onClick={() => setShowLogin(false)}>
          <div className="rm-animate-slide-right" style={{
            width: 400, padding: '44px 38px',
            background: '#090d18', border: '1px solid rgba(255,255,255,0.07)',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 16, fontWeight: 300, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.01em' }}>
              登录 RayMatrix 芒阵
            </h2>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', textAlign: 'center', marginBottom: 30 }}>
              选择角色开始体验
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
              {([
                { role: 'merchant' as UserRole, emoji: '🏪', label: '跨境商家', sub: '找基模·生成内容', activeColor: '#00F0FF' },
                { role: 'builder' as UserRole, emoji: '🔧', label: '基模构建师', sub: '造基模·持续分润', activeColor: '#FFB800' },
              ]).map(r => (
                <button key={r.role} onClick={() => setLoginRole(r.role)} style={{
                  padding: '18px 12px', cursor: 'pointer', textAlign: 'center',
                  transition: 'border-color 0.15s ease', background: 'transparent',
                  border: `1px solid ${loginRole === r.role ? r.activeColor : 'rgba(255,255,255,0.08)'}`,
                }}>
                  <span style={{ fontSize: 22 }}>{r.emoji}</span>
                  <p style={{ fontSize: 12, fontWeight: 400, marginTop: 8, color: '#fafafa' }}>{r.label}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', marginTop: 4 }}>{r.sub}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>邮箱</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="请输入邮箱" className="rm-input" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>密码</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码" className="rm-input" style={{ fontSize: 13 }} />
              </div>
              <button type="submit" className="rm-btn-dawn" style={{ justifyContent: 'center', fontSize: 14, padding: '13px 16px', marginTop: 4 }}>
                登录
              </button>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.20)', textAlign: 'center' }}>
                演示模式：任意输入即可登录
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
