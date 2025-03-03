// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    'nuxt-plotly',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  app: {
    head: {
      title: 'Rarible',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1 maximum-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Nuxt 3 + Tailwind CSS + Shadcn UI',
        },
      ],
    },
  },
  fonts: {
    assets: {
      // The baseURL where font files are served.
      prefix: '/assets/_fonts/'
    },    
    families: [
      // do not resolve this font with any provider from `@nuxt/fonts`
      { name: 'Supply', provider: 'none' },
    ]
  },  
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  }, 
  vite: {
    optimizeDeps: {
      include: ["plotly.js-dist-min"],
    },
  },   
  vue: {  
    propsDestructure: true  
  },      
})