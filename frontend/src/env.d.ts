/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_VALIDATE_ENDPOINT: string
  readonly VITE_API_HOLIDAYS_ENDPOINT: string
  readonly VITE_API_UPLOAD_HOLIDAYS_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}