# RayMatrix 芒阵 - AI爆款逻辑引擎与基模生态平台

![RayMatrix](https://img.shields.io/badge/version-1.0.0-00F0FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0.13-646CFF?style=for-the-badge&logo=vite)

## 📖 项目简介

**RayMatrix 芒阵** 是一个AI驱动的跨境电商业爆款内容生成平台，致力于将看不见的运营经验转化为可流通的数字资产。

### 核心理念

> **划破混沌，洞察爆款基因** - 从混沌爆款中提取卖货"灵魂骨架"，照亮你的跨境之路。

### 目标用户

- **🏪 跨境商家**：无需懂算法，找到爆款基模，填入商品参数，一键生成符合当地语境的推广内容
- **🔧 基模构建师**：将跨境运营经验结构化为基模，上架市场，每次被使用都能持续获得分润

---

## ✨ 核心功能

### 1. 爆款逆推器
多模态AI解析爆款链接、截图、视频，自动切片逻辑结构生成骨架

### 2. 基模编辑器
可视化编辑骨架节点，精确定义变量槽位与逻辑路径关系

### 3. 缝合生成器
选基模填参数，AI智能映射后一键输出多语言多市场推广内容

### 4. 基模市场
高质量基模资产交易平台，构建师持续分润，形成生态飞轮

### 5. 多市场本土化
覆盖北美、欧洲、东南亚、中东等主流市场，精准适配本土语境

### 6. 经验沉淀资产
将运营网感结构化为数字资产，让爆款逻辑可流通可复用

---

## 🚀 四步破局流程

1. **导入爆款** → 链接/截图/视频
2. **逆推基模** → AI解构逻辑骨架
3. **缝合商品** → 填参数·智能映射
4. **本土生成** → 多语言·多市场

---

## 🛠️ 技术栈

### 前端框架
- **React 19.2.6** - 用户界面库
- **TypeScript 6.0.3** - 类型安全的JavaScript
- **React Router 7.15.1** - 路由管理

### 构建工具
- **Vite 8.0.13** - 快速的前端构建工具
- **TailwindCSS 4.3.0** - 原子化CSS框架

### UI与动画
- **Framer Motion 12.38.0** - 强大的动画库
- **Lucide React 1.16.0** - 精美的图标库

---

## 📦 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

**1. 克隆项目**
```bash
git clone https://github.com/Ment5981/mangge.git
cd mangge/crossmoda
```

**2. 安装依赖**
```bash
npm install
```

**3. 配置环境变量**

复制环境变量模板文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的API密钥：
```env
# 阿里云百炼 DashScope API 配置
VITE_DASHSCOPE_API_KEY=your_api_key_here
```

> 💡 **如何获取API密钥？**
> 1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
> 2. 注册并登录
> 3. 在控制台获取API密钥

**4. 启动开发服务器**
```bash
npm run dev
```

**5. 访问应用**

在浏览器中打开：http://localhost:5173

---

## 📁 项目结构

```
crossmoda/
├── public/              # 静态资源
├── src/
│   ├── components/      # 可复用组件
│   │   └── Layout.tsx   # 布局组件
│   ├── pages/           # 页面组件
│   │   ├── HomePage.tsx           # 首页
│   │   ├── DashboardPage.tsx      # 仪表盘
│   │   ├── ReverseEnginePage.tsx  # 爆款逆推
│   │   ├── EditorPage.tsx         # 基模编辑
│   │   ├── GeneratorPage.tsx      # 内容生成
│   │   ├── AIStudioPage.tsx       # AI工作室
│   │   └── MarketplacePage.tsx    # 基模市场
│   ├── services/        # 服务层
│   │   └── ai.ts        # AI API服务
│   ├── data/            # 数据层
│   │   └── mockData.ts  # 模拟数据
│   ├── App.tsx          # 应用入口
│   ├── main.tsx         # 挂载入口
│   └── index.css        # 全局样式
├── .env.example         # 环境变量模板
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript配置
└── vite.config.ts       # Vite配置
```

---

## 🎨 设计特色

### 破晓设计系统
- **深色科技风格**：以 `#050814` 为底色的深邃宇宙感
- **晨光双色调**：`#00F0FF`（青蓝）与 `#FFB800`（琥珀）交织
- **星辰闪烁效果**：动态星体、脑冲外环、尖刺尾芒
- **探照灯交互**：鼠标移动时的光晕跟随效果
- **星座连线动画**：流光轨迹节点图

### 视觉元素
- 网格背景
- 极光标签
- 光刃分割线
- 渐变文字
- 悬浮卡片

---

## 🔐 安全提示

⚠️ **重要：永远不要将 `.env` 文件提交到Git仓库！**

`.env` 文件包含敏感的API密钥，已在 `.gitignore` 中被排除。

请妥善保管你的API密钥，定期更换。

---

## 📝 开发指南

### 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 添加新页面

1. 在 `src/pages/` 目录下创建新的 `.tsx` 文件
2. 在 `src/App.tsx` 中添加路由
3. 在侧边栏菜单中添加导航项（如需要）

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

---

## 📄 许可证

ISC License

---

## 📧 联系方式

- 项目地址：https://github.com/Ment5981/mangge
- 问题反馈：[提交Issue](https://github.com/Ment5981/mangge/issues)

---

## 🌟 致谢

感谢所有为RayMatrix芒阵项目做出贡献的开发者！

---

<div align="center">

**让每一次出海 豁然开朗** ⚡

Made with 💙 by RayMatrix Team

</div>
