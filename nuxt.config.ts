// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Memzy'
    }
  },
  css: [
    '~/assets/css/null.css',
    '~/assets/css/main.css',
  ],
   imports: {
    dirs: ['shared/schemas']
  },
  nitro: {
    imports: {
      dirs: ['shared/schemas']
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    'nuxt-auth-utils',
    'nuxt-toast',
  ],
  toast: {
    settings: {
      position: 'topRight',
      timeout: 3500,
      progressBar: true,
      pauseOnHover: true,
      transitionIn: 'fadeInLeft',
      transitionOut: 'fadeOutRight',
      titleSize: '16px',
      messageSize: '14px',
    },
  },
  runtimeConfig:{
    public: {
      cors: {
        origin: process.env.CORS_ORIGIN || '*', // Для разработки '*', при деплое укажите конкретные домены
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      },
      s3: {
        publicUrl: process.env.S3_PUBLIC_URL || '',
      },
    },
    s3: {
      endpoint: process.env.S3_ENDPOINT || '',
      region: process.env.S3_REGION || 'ru-central1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      bucket: process.env.S3_BUCKET || '',
    },
    session:{
      password:process.env.NUXT_SESSION_PASSWORD || '',
      name:'memzy-session',
      maxAge:60*24*3,
      cookie:{
        secure: process.env.SESSION_COOKIE_SECURE === 'true', // Для HTTP (dev) false, для HTTPS (прод) true
        sameSite: 'strict', // Или 'none' для кросс‑доменных запросов 
        path: '/',
        httpOnly: true
      }
    }
  },
    fonts: {
    provider: 'local',
    families: [
      {
        name: 'Trebuchet MS',
        src: '/fonts/trebuchetms.ttf',
        weight: 800,
        provider: 'local'
      },
    ],
  },
  postcss: {
      plugins: {
        'postcss-hover-media-feature': {},
      },
    },
})