import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'CDT - Compliance Decision Tool',
    meta: [
      { charset: 'utf-8' },
      { hid: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Compliance Decision Tool' },
      { hid: 'keywords', name: 'keywords', content: 'CDT,Compliance Decision Tool' },
      { hid: 'author', name: 'author', content: 'Darko Cebov' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', sizes: '32x32', type: 'image/png', href: '/favicon-32x32.png' },
      { rel: 'icon', sizes: '16x16', type: 'image/png', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/variables.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/api/init.js',
    { src: '~/plugins/leaflet.js', ssr: false },
    { src: '~/plugins/vue-apexchart.js', ssr: false },
    { src: '~/plugins/before-each.js', mode: 'client' }
  ],
  /*
  ** router
  */
  router: {
    middleware: ['auth']
  },
  /*
  ** Customize the progress bar color
  */
 loading: { color: '#ff920b' },
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: colors.blue.lighten2,
          accent: colors.blue.lighten2,
          secondary: colors.amber.lighten3,
          info: colors.blue.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
