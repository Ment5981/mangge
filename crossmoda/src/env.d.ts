/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 文本AI配置
  readonly VITE_AI_API_KEY: string
  readonly VITE_AI_BASE_URL: string
  readonly VITE_AI_MODEL: string
  // 阿里云百炼 DashScope配置
  readonly VITE_DASHSCOPE_API_KEY: string
  readonly VITE_DASHSCOPE_BASE_URL: string
  readonly VITE_DASHSCOPE_IMAGE_MODEL: string
  readonly VITE_DASHSCOPE_VIDEO_T2V_MODEL: string
  readonly VITE_DASHSCOPE_VIDEO_I2V_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
