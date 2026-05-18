import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../App'
import { LayoutDashboard, Zap, Wand2, Store, LogOut, ArrowLeftRight, FileEdit, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: '仪表板' },
  { to: '/reverse-engine', icon: Zap, label: '爆款逆推' },
  { to: '/generator', icon: Wand2, label: '缝合生成' },
  { to: '/ai-studio', icon: Sparkles, label: 'AI创作' },
  { to: '/marketplace', icon: Store, label: '基模市场' },
]

export default function Layout() {
  const { userRole, setUserRole, userName, setIsLoggedIn } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <div className="flex h-screen" style={{ background: '#050814' }}>
      {/* 左侧导航栏 - 破晓风格 */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} flex flex-col transition-all duration-200`} style={{ background: '#090d18', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Logo 区域 */}
        <div className="flex items-center justify-between px-5 h-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 rm-animate-slide-left">
              <div className="w-6 h-6 flex items-center justify-center font-bold text-xs" style={{ background: 'linear-gradient(135deg, #00F0FF, #FFB800)', color: '#050814' }}>R</div>
              <span className="text-base font-semibold" style={{ background: 'linear-gradient(90deg, #00F0FF, #FFB800)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RayMatrix</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-text-tertiary hover:text-text-primary transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* 角色切换 */}
        {!collapsed && (
          <div className="mx-4 mt-5 px-4 py-4 rm-animate-slide-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="rm-mono-label">角色</span>
              <button
                onClick={() => setUserRole(userRole === 'merchant' ? 'builder' : 'merchant')}
                className="text-accent-brand hover:text-accent-brand-secondary transition-colors"
              >
                <ArrowLeftRight size={13} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base">{userRole === 'merchant' ? '🏪' : '🔧'}</span>
              <div>
                <p className="text-sm font-medium text-text-primary leading-snug">{userName}</p>
                <p className="text-xs text-text-muted mt-0.5">{userRole === 'merchant' ? '跨境商家' : '基模构建师'}</p>
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex flex-col items-center mt-3 gap-1">
            <span className="text-sm">{userRole === 'merchant' ? '🏪' : '🔧'}</span>
            <button
              onClick={() => setUserRole(userRole === 'merchant' ? 'builder' : 'merchant')}
              className="text-text-tertiary hover:text-accent-brand transition-colors mt-1"
            >
              <ArrowLeftRight size={12} />
            </button>
          </div>
        )}

        {/* 导航菜单 - 图标+文字模式 */}
        <nav className="flex-1 mt-6 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-3 text-sm transition-all ${
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
                style={isActive ? { background: 'rgba(0,240,255,0.07)', borderLeft: '2px solid #00F0FF' } : {}}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={17} style={{ color: isActive ? '#00F0FF' : undefined }} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
          {userRole === 'builder' && (
            <NavLink
              to="/editor/new"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 text-sm transition-all ${
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`
              }
              style={location.pathname.includes('/editor') ? { background: 'rgba(255,184,0,0.07)', borderLeft: '2px solid #FFB800' } : {}}
            >
              <FileEdit size={17} className={location.pathname.includes('/editor') ? 'text-accent-purple' : ''} />
              {!collapsed && <span>基模编辑器</span>}
            </NavLink>
          )}
        </nav>

        {/* 底部 - 退出 */}
        <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-3 text-sm text-text-muted hover:text-accent-red w-full transition-colors"
            title={collapsed ? '退出登录' : undefined}
          >
            <LogOut size={17} />
            {!collapsed && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto" style={{ background: '#050814' }}>
        <Outlet />
      </main>
    </div>
  )
}
