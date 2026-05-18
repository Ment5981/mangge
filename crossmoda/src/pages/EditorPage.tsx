import { useState } from 'react'
import { mockTemplates, typeColors, type BaseTemplate, type StructureNode } from '../data/mockData'
import { Save, Eye, Upload, Plus, Trash2, GripVertical, ChevronRight, Tag, X } from 'lucide-react'

export default function EditorPage() {
  const [template, setTemplate] = useState<BaseTemplate>({ ...mockTemplates[0], id: 'tpl-new', name: '新基模', description: '' })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [newTagName, setNewTagName] = useState('')

  const selectedStructure = template.structure.find(n => n.id === selectedNode)
  const selectedSlot = template.slots.find(s => s.id === selectedNode)

  const addStructureNode = () => {
    const id = `s${Date.now()}`
    const newNode: StructureNode = { id, label: '新模块', type: 'feature', order: template.structure.length + 1 }
    setTemplate({ ...template, structure: [...template.structure, newNode] })
  }

  const removeStructureNode = (id: string) => {
    setTemplate({ ...template, structure: template.structure.filter(n => n.id !== id) })
    if (selectedNode === id) setSelectedNode(null)
  }

  const updateNodeLabel = (id: string, label: string) => {
    setTemplate({ ...template, structure: template.structure.map(n => n.id === id ? { ...n, label } : n) })
  }

  const updateNodeType = (id: string, type: StructureNode['type']) => {
    setTemplate({ ...template, structure: template.structure.map(n => n.id === id ? { ...n, type } : n) })
  }

  const addSlot = () => {
    const id = `slot${Date.now()}`
    setTemplate({ ...template, slots: [...template.slots, { id, name: '新槽位', type: 'text', description: '', placeholder: '', required: false }] })
  }

  const removeSlot = (id: string) => {
    setTemplate({ ...template, slots: template.slots.filter(s => s.id !== id) })
    if (selectedNode === id) setSelectedNode(null)
  }

  const addTag = () => {
    if (newTagName && !template.tags.includes(newTagName)) {
      setTemplate({ ...template, tags: [...template.tags, newTagName] })
      setNewTagName('')
    }
  }

  const removeTag = (tag: string) => {
    setTemplate({ ...template, tags: template.tags.filter(t => t !== tag) })
  }

  return (
    <div className="flex h-[calc(100vh)] flex-col" style={{ background: '#050814' }}>
      {/* 顶部工具栏 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 56,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.012)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input
            value={template.name}
            onChange={e => setTemplate({ ...template, name: e.target.value })}
            style={{
              fontSize: '1rem', fontWeight: 300, background: 'transparent',
              border: 'none', outline: 'none', color: '#fafafa', width: 200,
              letterSpacing: '-0.01em'
            }}
            placeholder="基模名称"
          />
          <span className="rm-mono-label" style={{
            padding: '3px 8px',
            border: '1px solid rgba(255,255,255,0.05)',
            letterSpacing: '0.08em'
          }}>编辑中</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.07)',
              cursor: 'pointer', transition: 'border-color 0.15s'
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
          >
            <Eye size={13} /> 预览
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.07)',
            cursor: 'pointer', transition: 'border-color 0.15s'
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
          >
            <Save size={13} /> 保存
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 20px', fontSize: '0.8rem', fontWeight: 500,
            color: '#050814', background: '#FFB800',
            border: 'none', cursor: 'pointer'
          }}>
            <Upload size={13} /> 发布上架
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左侧：骨架结构导航 */}
        <div style={{
          width: 220, borderRight: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.012)', overflowY: 'auto'
        }}>
          <div style={{ padding: '28px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="rm-mono-label">结构骨架</span>
              <button onClick={addStructureNode} style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>
                <Plus size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {template.structure.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', fontSize: '0.8rem', cursor: 'pointer',
                    background: selectedNode === node.id ? 'rgba(0,240,255,0.05)' : 'transparent',
                    borderLeft: selectedNode === node.id ? '2px solid rgba(0,240,255,0.4)' : '2px solid transparent',
                    color: selectedNode === node.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
                    transition: 'all 0.15s'
                  }}
                >
                  <GripVertical size={11} style={{ color: 'rgba(255,255,255,0.2)', cursor: 'grab' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: typeColors[node.type], flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</span>
                  <button onClick={e => { e.stopPropagation(); removeStructureNode(node.id) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', padding: 0 }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="rm-mono-label">变量槽位</span>
              <button onClick={addSlot} style={{ color: 'rgba(255,180,0,0.5)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>
                <Plus size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {template.slots.map(slot => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedNode(slot.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', fontSize: '0.8rem', cursor: 'pointer',
                    background: selectedNode === slot.id ? 'rgba(255,180,0,0.05)' : 'transparent',
                    borderLeft: selectedNode === slot.id ? '2px solid rgba(255,180,0,0.4)' : '2px solid transparent',
                    color: selectedNode === slot.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ color: 'rgba(255,180,0,0.6)', fontSize: '0.7rem' }}>[ ]</span>
                  <span style={{ flex: 1 }}>{slot.name}</span>
                  {slot.required && <span style={{ color: '#FFB800', fontSize: '0.6rem' }}>*</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="rm-mono-label" style={{ display: 'block', marginBottom: 14 }}>标签</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {template.tags.map(tag => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <Tag size={8} />{tag}
                  <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0 }}><X size={9} /></button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                placeholder="添加标签"
                className="rm-input"
                style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem' }}
              />
              <button onClick={addTag} style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', background: 'none', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
                <Plus size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* 中央：可视化编辑区 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '44px 52px' }}>
          {/* 基模信息 */}
          <div style={{ marginBottom: 44 }}>
            <label className="rm-mono-label" style={{ display: 'block', marginBottom: 12 }}>基模描述</label>
            <textarea
              value={template.description}
              onChange={e => setTemplate({ ...template, description: e.target.value })}
              placeholder="描述这个基模的卖货逻辑和适用场景..."
              rows={3}
              className="rm-input"
              style={{ width: '100%', padding: '16px 20px', fontSize: '0.875rem', resize: 'none', lineHeight: 1.7 }}
            />
          </div>

          {/* 结构骨架可视化 */}
          <div style={{ marginBottom: 44 }}>
            <p className="rm-mono-label" style={{ marginBottom: 20 }}>结构骨架流程</p>
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8,
              padding: '24px 28px',
              background: 'rgba(255,255,255,0.016)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {template.structure.map((node, i) => (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    onClick={() => setSelectedNode(node.id)}
                    style={{
                      padding: '8px 14px', fontSize: '0.8rem', fontWeight: 400,
                      border: `1px solid ${selectedNode === node.id ? typeColors[node.type] + '80' : typeColors[node.type] + '25'}`,
                      background: typeColors[node.type] + '0d',
                      color: typeColors[node.type],
                      cursor: 'pointer', transition: 'border-color 0.15s'
                    }}
                  >
                    {node.label}
                  </div>
                  {i < template.structure.length - 1 && (
                    <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 卖货逻辑路径 */}
          <div style={{ marginBottom: 44 }}>
            <p className="rm-mono-label" style={{ marginBottom: 20 }}>卖货逻辑路径</p>
            <div style={{
              padding: '24px 28px',
              background: 'rgba(255,255,255,0.016)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', flexDirection: 'column', gap: 14
            }}>
              {template.logicPath.map(step => {
                const fromNode = template.structure.find(n => n.id === step.from)
                const toNode = template.structure.find(n => n.id === step.to)
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: fromNode ? typeColors[fromNode.type] + '0d' : 'transparent',
                      color: fromNode ? typeColors[fromNode.type] : 'rgba(255,255,255,0.3)'
                    }}>
                      {fromNode?.label || step.from}
                    </span>
                    <span style={{
                      padding: '3px 8px', fontSize: '0.7rem',
                      color: step.type === 'cause' ? 'rgba(239,68,68,0.7)' : step.type === 'transition' ? 'rgba(96,165,250,0.7)' : 'rgba(74,222,128,0.7)',
                      background: step.type === 'cause' ? 'rgba(239,68,68,0.06)' : step.type === 'transition' ? 'rgba(96,165,250,0.06)' : 'rgba(74,222,128,0.06)'
                    }}>{step.label}</span>
                    <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <span style={{
                      padding: '4px 10px',
                      background: toNode ? typeColors[toNode.type] + '0d' : 'transparent',
                      color: toNode ? typeColors[toNode.type] : 'rgba(255,255,255,0.3)'
                    }}>
                      {toNode?.label || step.to}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 槽位列表 */}
          <div>
            <p className="rm-mono-label" style={{ marginBottom: 20 }}>模板变量槽位</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {template.slots.map(slot => (
                <div key={slot.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px',
                  background: 'rgba(255,255,255,0.016)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'border-color 0.15s'
                }}>
                  <span style={{
                    width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.625rem', flexShrink: 0,
                    color: slot.required ? '#FFB800' : 'rgba(255,255,255,0.25)'
                  }}>
                    {slot.required ? '*' : '○'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'rgba(255,180,0,0.75)', minWidth: 80 }}>[{slot.name}]</span>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', flex: 1 }}>{slot.description || slot.placeholder}</span>
                  <span style={{
                    fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)',
                    padding: '2px 8px', border: '1px solid rgba(255,255,255,0.05)'
                  }}>{slot.type}</span>
                  <button onClick={() => removeSlot(slot.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', padding: 0 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：属性面板 */}
        <div style={{
          width: 260, borderLeft: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.012)', overflowY: 'auto',
          padding: '32px 24px'
        }}>
          {selectedStructure ? (
            <div>
              <p className="rm-mono-label" style={{ marginBottom: 24 }}>模块属性</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>模块名称</label>
                  <input
                    value={selectedStructure.label}
                    onChange={e => updateNodeLabel(selectedStructure.id, e.target.value)}
                    className="rm-input"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>模块类型</label>
                  <select
                    value={selectedStructure.type}
                    onChange={e => updateNodeType(selectedStructure.id, e.target.value as StructureNode['type'])}
                    className="rm-input"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
                  >
                    <option value="hook">痛点钩子 (hook)</option>
                    <option value="pain">放大焦虑 (pain)</option>
                    <option value="feature">核心功能 (feature)</option>
                    <option value="scene">场景演示 (scene)</option>
                    <option value="proof">权威背书 (proof)</option>
                    <option value="cta">促单转化 (cta)</option>
                  </select>
                </div>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>排序</label>
                  <input type="number" value={selectedStructure.order} readOnly
                    className="rm-input"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }} />
                </div>
                <div style={{
                  padding: '16px', border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.016)'
                }}>
                  <span className="rm-mono-label" style={{ display: 'block', marginBottom: 12 }}>类型颜色预览</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 14, height: 14, background: typeColors[selectedStructure.type] }} />
                    <span style={{ fontSize: '0.78rem', color: typeColors[selectedStructure.type] }}>{selectedStructure.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedSlot ? (
            <div>
              <p className="rm-mono-label" style={{ marginBottom: 24 }}>槽位属性</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>槽位名称</label>
                  <input value={selectedSlot.name} readOnly className="rm-input"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>类型</label>
                  <select value={selectedSlot.type} disabled className="rm-input"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
                    <option value="text">文本</option>
                    <option value="number">数字</option>
                    <option value="select">选择</option>
                    <option value="image">图片</option>
                  </select>
                </div>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>描述</label>
                  <textarea value={selectedSlot.description} readOnly rows={3} className="rm-input"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem', resize: 'none', color: 'rgba(255,255,255,0.3)' }} />
                </div>
                <div>
                  <label className="rm-mono-label" style={{ display: 'block', marginBottom: 8 }}>占位提示</label>
                  <input value={selectedSlot.placeholder} readOnly className="rm-input"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={selectedSlot.required} readOnly style={{ accentColor: '#FFB800' }} />
                  <span className="rm-mono-label">必填槽位</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>点击左侧节点或槽位</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.15)' }}>查看和编辑属性</p>
            </div>
          )}
        </div>
      </div>

      {/* 预览弹窗 */}
      {showPreview && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setShowPreview(false)}
        >
          <div
            style={{
              width: 600, maxHeight: '80vh', overflowY: 'auto', padding: '52px',
              background: '#0a0e1f',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 200, marginBottom: 8, letterSpacing: '-0.02em', color: '#fafafa' }}>{template.name}</h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginBottom: 36, lineHeight: 1.6 }}>{template.description || '暂无描述'}</p>
            <p className="rm-mono-label" style={{ marginBottom: 16 }}>结构骨架</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 36 }}>
              {template.structure.map((node, i) => (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    padding: '6px 12px', fontSize: '0.75rem',
                    background: typeColors[node.type] + '0d', color: typeColors[node.type],
                    border: `1px solid ${typeColors[node.type]}25`
                  }}>{node.label}</span>
                  {i < template.structure.length - 1 && <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                </div>
              ))}
            </div>
            <p className="rm-mono-label" style={{ marginBottom: 16 }}>槽位列表</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {template.slots.map(slot => (
                <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                  <span style={{ color: 'rgba(255,180,0,0.75)' }}>[{slot.name}]</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>{slot.description || slot.placeholder}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
