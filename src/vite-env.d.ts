/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_DEBUG_MODE: string;
  readonly VITE_CONTACT_PHONE: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_BUSINESS_HOURS: string;
  readonly VITE_BUSINESS_LOCATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
