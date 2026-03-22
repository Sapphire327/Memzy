// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    'nuxt-nodemailer',
  ],
  nodemailer: {
      from: 'MemzyApp',
      host: '',
      port: 465,
      secure: true,
      auth: {
        user: '',
        pass: '',
      },
    },
  runtimeConfig:{
    public: {
      cors: {
        origin: '*', // Для разработки; в продакшене укажите конкретные домены
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      }
    },
    session:{
      password:process.env.NUXT_SESSION_PASSWORD || '',
      name:'memzy-session',
      maxAge:60*24*7,
      cookie:{
        secure: false, // Для HTTP; в продакшене установите true (HTTPS)
        sameSite: 'lax', // Или 'none' для кросс‑доменных запросов
        path: '/',
        httpOnly: true
      }

    }
  }
})