import { useApp } from '../App'
import { merchantDashboard, builderDashboard } from '../data/mockData'
import { Zap, Wand2, Store, FileText, TrendingUp, DollarSign, Package, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { userRole } = useApp()
  const navigate = useNavigate()
  if (userRole === 'builder') return <BuilderDashboard navigate={navigate} />
  return <MerchantDashboard navigate={navigate} />
}

const PAGE_STYLE = { padding: '44px 52px' } as const

function MerchantDashboard({ navigate }: { navigate: (path: string) => void }) {
  const data = merchantDashboard
  return (
    <div style={PAGE_STYLE}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 52 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 200, letterSpacing: '-0.02em', color: '#fafafa' }}>商家工作台</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 8 }}>欢迎回来，开始创建你的爆款内容</p>
      </div>

      {/* 数据卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
        {[
          { label: '我的基模', value: data.myTemplates, accent: true },
          { label: '已生成内容', value: data.generatedContents, accent: false },
          { label: '草稿存档', value: data.savedDrafts, accent: false },
          { label: '浏览市场', value: '→', accent: false, link: true },
        ].map((card, i) => (
          <div
            key={i}
            className="rm-card"
            onClick={() => card.link && navigate('/marketplace')}
            style={{ padding: '28px 24px', cursor: card.link ? 'pointer' : 'default' }}
          >
            <p className="rm-mono-label" style={{ marginBottom: 22 }}>{card.label}</p>
            <p className="rm-stat-number" style={{ color: card.accent ? '#00F0FF' : '#fafafa' }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      <p className="rm-mono-label" style={{ marginBottom: 16 }}>快捷入口</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 56 }}>
        {[
          { to: '/reverse-engine', icon: Zap, label: '爆款逆推器', desc: '导入爆款内容，AI提取逻辑骨架', aurora: true },
          { to: '/generator', icon: Wand2, label: '缝合生成器', desc: '选基模+填参数，一键生成本土内容', aurora: false },
          { to: '/marketplace', icon: Store, label: '基模市场', desc: '发现优质基模，购买即用', aurora: true },
        ].map(item => (
          <button
            key={item.to}
            onClick={() => navigate(item.to)}
            className="rm-card"
            style={{ padding: '22px 20px', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 16, width: '100%' }}
          >
            <div style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <item.icon size={15} style={{ color: item.aurora ? '#00F0FF' : 'rgba(255,255,255,0.45)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 400, marginBottom: 6, color: '#fafafa' }}>{item.label}</h3>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', lineHeight: 1.55 }}>{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 最近生成 */}
      <p className="rm-mono-label" style={{ marginBottom: 16 }}>最近生成内容</p>
      <div className="rm-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {['基模', '商品', '市场', '类型', '日期'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.recentGenerated.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#fafafa' }}>{item.templateName}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>{item.productName}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>{item.targetMarket}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    fontSize: 10, padding: '3px 8px',
                    color: item.type === 'copywriting' ? '#00F0FF' : item.type === 'detailPage' ? 'rgba(255,255,255,0.50)' : '#FFB800',
                    border: `1px solid ${item.type === 'copywriting' ? 'rgba(0,240,255,0.18)' : item.type === 'detailPage' ? 'rgba(255,255,255,0.07)' : 'rgba(255,184,0,0.18)'}`,
                  }}>
                    {item.type === 'copywriting' ? '文案' : item.type === 'detailPage' ? '详情页' : '脚本'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{item.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BuilderDashboard({ navigate }: { navigate: (path: string) => void }) {
  const data = builderDashboard
  return (
    <div style={PAGE_STYLE}>
      <div style={{ marginBottom: 52 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 200, letterSpacing: '-0.02em', color: '#fafafa' }}>构建师工作台</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 8 }}>管理你的基模资产，持续获取分润</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
        {[
          { label: '上架基模', value: data.publishedTemplates, gold: false },
          { label: '总销量', value: data.totalSales.toLocaleString(), gold: false },
          { label: '总收益', value: `¥${data.totalRevenue.toLocaleString()}`, gold: true },
          { label: '本月收益', value: `¥${data.monthlyRevenue.toLocaleString()}`, gold: false },
        ].map((card, i) => (
          <div key={i} className="rm-card" style={{ padding: '28px 24px' }}>
            <p className="rm-mono-label" style={{ marginBottom: 22 }}>{card.label}</p>
            <p className="rm-stat-number" style={{ color: card.gold ? '#FFB800' : '#fafafa' }}>{card.value}</p>
          </div>
        ))}
      </div>

      <p className="rm-mono-label" style={{ marginBottom: 16 }}>快捷入口</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 56 }}>
        {[
          { to: '/reverse-engine', icon: Zap, label: '爆款逆推器', desc: '发现爆款，AI逆向提取', aurora: true },
          { to: '/editor/new', icon: Wand2, label: '基模编辑器', desc: '编辑和上架基模', aurora: false },
          { to: '/marketplace', icon: Store, label: '基模市场', desc: '查看行情与竞品', aurora: true },
        ].map(item => (
          <button
            key={item.to}
            onClick={() => navigate(item.to)}
            className="rm-card"
            style={{ padding: '22px 20px', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 16, width: '100%' }}
          >
            <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.07)' }}>
              <item.icon size={15} style={{ color: item.aurora ? '#00F0FF' : 'rgba(255,255,255,0.45)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 400, marginBottom: 6, color: '#fafafa' }}>{item.label}</h3>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', lineHeight: 1.55 }}>{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="rm-mono-label" style={{ marginBottom: 16 }}>最近订单</p>
      <div className="rm-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {['基模', '购买者', '金额', '日期'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#fafafa' }}>{order.templateName}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>{order.buyer}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#00F0FF' }}>¥{order.price}</td>
                <td style={{ padding: '14px 20px', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
