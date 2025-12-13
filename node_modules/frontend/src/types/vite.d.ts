/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Define custom environment variables
    readonly VITE_API_URL: string
    readonly VITE_APP_NAME: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}