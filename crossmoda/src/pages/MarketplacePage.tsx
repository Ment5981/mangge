import { useState } from 'react'
import { mockTemplates, typeColors, type BaseTemplate } from '../data/mockData'
import { Search, Filter, Star, ShoppingCart, Eye, X, Tag, ChevronRight } from 'lucide-react'

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('全部')
  const [marketFilter, setMarketFilter] = useState('全部')
  const [sortBy, setSortBy] = useState('rating')
  const [detailTemplate, setDetailTemplate] = useState<BaseTemplate | null>(null)
  const [showPurchase, setShowPurchase] = useState(false)
  const [purchased, setPurchased] = useState<string[]>([])

  const categories = ['全部', '美妆个护', '3C数码', '家居生活', '宠物用品', '运动户外', '母婴用品']
  const markets = ['全部', '北美', '欧洲', '东南亚', '日韩', '全球', '欧美']

  const filteredTemplates = mockTemplates.filter(tpl => {
    if (categoryFilter !== '全部' && tpl.category !== categoryFilter) return false
    if (marketFilter !== '全部' && tpl.targetMarket !== marketFilter) return false
    if (searchQuery && !tpl.name.includes(searchQuery) && !tpl.description.includes(searchQuery) && !tpl.tags.some(t => t.includes(searchQuery))) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'sales') return b.sales - a.sales
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  const handlePurchase = (id: string) => {
    setShowPurchase(true)
    setTimeout(() => {
      setPurchased([...purchased, id])
      setShowPurchase(false)
    }, 1500)
  }

  const formatViews = (sales: number) => {
    const v = Math.round(sales * 14.5)
    return v >= 1000 ? (v / 1000).toFixed(1) + 'K' : String(v)
  }

  return (
    <div style={{ padding: '44px 52px' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 44 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 200, letterSpacing: '-0.02em', color: '#fafafa' }}>基模市场</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 8 }}>发现优质基模，购买即用，快速生成本土化内容</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 8 }}>
          <ShoppingCart size={14} />
          已购基模: {purchased.length}
        </div>
      </div>

      {/* 搜索与筛选 */}
      <div className="rm-card" style={{ padding: '24px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,240,255,0.40)' }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索基模名称、标签、描述..."
              className="rm-input"
              style={{ paddingLeft: 40, fontSize: 12 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={11} style={{ color: 'rgba(255,255,255,0.28)' }} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rm-input" style={{ width: 'auto', fontSize: 12, padding: '10px 14px' }}>
              <option value="rating">评分最高</option>
              <option value="sales">销量最高</option>
              <option value="price-low">价格最低</option>
              <option value="price-high">价格最高</option>
            </select>
          </div>
        </div>
        <div className="rm-blade-divider" style={{ marginBottom: 18 }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="rm-mono-label">品类</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)} style={{
                  padding: '4px 11px', fontSize: 11, cursor: 'pointer', transition: 'all 0.15s ease',
                  color: categoryFilter === c ? '#00F0FF' : 'rgba(255,255,255,0.38)',
                  border: `1px solid ${categoryFilter === c ? 'rgba(0,240,255,0.28)' : 'transparent'}`,
                  background: 'transparent',
                }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="rm-mono-label">市场</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {markets.map(m => (
                <button key={m} onClick={() => setMarketFilter(m)} style={{
                  padding: '4px 11px', fontSize: 11, cursor: 'pointer', transition: 'all 0.15s ease',
                  color: marketFilter === m ? '#FFB800' : 'rgba(255,255,255,0.38)',
                  border: `1px solid ${marketFilter === m ? 'rgba(255,184,0,0.28)' : 'transparent'}`,
                  background: 'transparent',
                }}>{m}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 基模卡片网格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filteredTemplates.map(tpl => (
          <div key={tpl.id} className="rm-card" style={{ padding: '24px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{tpl.builderAvatar}</span>
                <div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{tpl.builderName}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{tpl.createdAt}</p>
                </div>
              </div>
              <span style={{ color: '#00F0FF', fontWeight: 500, fontSize: 13 }}>¥{tpl.price}</span>
            </div>
            <h3 style={{ fontSize: 13, fontWeight: 400, marginBottom: 8, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tpl.name}</h3>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 16, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tpl.description}</p>

            {/* 骨架缩略 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginBottom: 14 }}>
              {tpl.structure.slice(0, 5).map((node, i) => (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ padding: '2px 7px', fontSize: 10, color: typeColors[node.type], background: typeColors[node.type] + '10' }}>
                    {node.label}
                  </span>
                  {i < Math.min(tpl.structure.length, 5) - 1 && <ChevronRight size={8} style={{ color: 'rgba(255,255,255,0.20)' }} />}
                </div>
              ))}
              {tpl.structure.length > 5 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>+{tpl.structure.length - 5}</span>}
            </div>

            {/* 标签 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
              {tpl.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', fontSize: 10, color: 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <Tag size={8} />{tag}
                </span>
              ))}
            </div>

            {/* 底部 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'rgba(255,255,255,0.32)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={10} style={{ color: '#FFB800' }} />{tpl.rating}
                </span>
                <span>销量 {tpl.sales}</span>
                <span style={{ color: 'rgba(0,240,255,0.5)' }}>浏览 {formatViews(tpl.sales)}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setDetailTemplate(tpl)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', fontSize: 11,
                  cursor: 'pointer', color: 'rgba(255,255,255,0.48)', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.09)', transition: 'all 0.15s ease',
                }}>
                  <Eye size={11} /> 详情
                </button>
                <button onClick={() => handlePurchase(tpl.id)} disabled={purchased.includes(tpl.id)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', fontSize: 11,
                  cursor: purchased.includes(tpl.id) ? 'default' : 'pointer', transition: 'opacity 0.15s',
                  ...(purchased.includes(tpl.id)
                    ? { background: 'transparent', color: '#00F0FF', border: '1px solid rgba(0,240,255,0.22)' }
                    : { background: 'linear-gradient(90deg, #00F0FF, #FFB800)', color: '#050814', border: 'none', fontWeight: 600 }),
                }}>
                  <ShoppingCart size={11} />
                  {purchased.includes(tpl.id) ? '已购' : '购买'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Search size={36} style={{ margin: '0 auto 20px', color: 'rgba(255,255,255,0.18)', display: 'block' }} />
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>没有找到匹配的基模</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>尝试调整筛选条件或搜索关键词</p>
        </div>
      )}

      {/* 详情弹窗 */}
      {detailTemplate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,8,20,0.88)', backdropFilter: 'blur(12px)' }} onClick={() => setDetailTemplate(null)}>
          <div className="rm-card" style={{ width: 680, maxHeight: '84vh', overflowY: 'auto', padding: '40px 36px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 30 }}>{detailTemplate.builderAvatar}</span>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 300, color: '#fafafa', marginBottom: 4 }}>{detailTemplate.name}</h2>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>by {detailTemplate.builderName}</p>
                </div>
              </div>
              <button onClick={() => setDetailTemplate(null)} style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
            </div>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', marginBottom: 32, lineHeight: 1.7 }}>{detailTemplate.description}</p>

            <p className="rm-mono-label" style={{ marginBottom: 14 }}>结构骨架</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 28, padding: '16px', background: 'rgba(255,255,255,0.025)' }}>
              {detailTemplate.structure.map((node, i) => (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ padding: '4px 10px', fontSize: 11, background: typeColors[node.type] + '10', color: typeColors[node.type] }}>{node.label}</span>
                  {i < detailTemplate.structure.length - 1 && <ChevronRight size={11} style={{ color: 'rgba(255,255,255,0.20)' }} />}
                </div>
              ))}
            </div>

            <p className="rm-mono-label" style={{ marginBottom: 14 }}>卖货逻辑路径</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28, padding: '16px', background: 'rgba(255,255,255,0.025)' }}>
              {detailTemplate.logicPath.map(step => {
                const fromNode = detailTemplate.structure.find(n => n.id === step.from)
                const toNode = detailTemplate.structure.find(n => n.id === step.to)
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ padding: '3px 8px', background: fromNode ? typeColors[fromNode.type] + '10' : '', color: fromNode ? typeColors[fromNode.type] : 'rgba(255,255,255,0.4)' }}>{fromNode?.label}</span>
                    <span style={{ padding: '2px 7px', fontSize: 10, color: step.type === 'cause' ? 'rgba(255,80,80,0.8)' : step.type === 'transition' ? 'rgba(0,240,255,0.7)' : 'rgba(0,200,80,0.7)', border: `1px solid ${step.type === 'cause' ? 'rgba(255,80,80,0.18)' : step.type === 'transition' ? 'rgba(0,240,255,0.18)' : 'rgba(0,200,80,0.18)'}` }}>{step.label}</span>
                    <ChevronRight size={11} style={{ color: 'rgba(255,255,255,0.20)' }} />
                    <span style={{ padding: '3px 8px', background: toNode ? typeColors[toNode.type] + '10' : '', color: toNode ? typeColors[toNode.type] : 'rgba(255,255,255,0.4)' }}>{toNode?.label}</span>
                  </div>
                )
              })}
            </div>

            <p className="rm-mono-label" style={{ marginBottom: 14 }}>模板变量槽位</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
              {detailTemplate.slots.map(slot => (
                <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.025)', fontSize: 12 }}>
                  <span style={{ color: '#FFB800' }}>[{slot.name}]</span>
                  <span style={{ color: 'rgba(255,255,255,0.38)', flex: 1 }}>{slot.description || slot.placeholder}</span>
                  {slot.required && <span style={{ fontSize: 10, color: '#FFB800' }}>必填</span>}
                </div>
              ))}
            </div>

            <p className="rm-mono-label" style={{ marginBottom: 14 }}>风格标签</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {detailTemplate.styleTags.map(tag => (
                <span key={tag} style={{ padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.09)' }}>{tag}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Star size={13} style={{ color: '#FFB800' }} />{detailTemplate.rating}</span>
                <span>销量 {detailTemplate.sales}</span>
                <span style={{ color: 'rgba(0,240,255,0.5)' }}>月均浏览 {formatViews(detailTemplate.sales)}</span>
                <span>{detailTemplate.targetMarket} · {detailTemplate.language}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 200, color: '#fafafa' }}>¥{detailTemplate.price}</span>
                <button
                  onClick={() => { handlePurchase(detailTemplate.id); setDetailTemplate(null) }}
                  disabled={purchased.includes(detailTemplate.id)}
                  className={purchased.includes(detailTemplate.id) ? 'rm-btn-dawn-ghost' : 'rm-btn-dawn'}
                  style={{ fontSize: 13, padding: '11px 24px' }}
                >
                  {purchased.includes(detailTemplate.id) ? '已购买' : '立即购买'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 购买确认 */}
      {showPurchase && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,8,20,0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="rm-card" style={{ padding: '44px 48px', textAlign: 'center' }}>
            <ShoppingCart size={28} style={{ margin: '0 auto 16px', color: '#00F0FF', display: 'block' }} />
            <p style={{ fontSize: 14, fontWeight: 300, marginBottom: 8 }}>正在处理购买...</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>模拟支付中，请稍候</p>
          </div>
        </div>
      )}
    </div>
  )
}
