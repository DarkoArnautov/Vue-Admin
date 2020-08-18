import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
import VImageInput from 'vuetify-image-input'
import VueClipboard from 'vue-clipboard2'
import VueMaterialThemePlugin from './vue-material-theme-plugin'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

Vue.component('apexchart', VueApexCharts)
Vue.component(VImageInput.name, VImageInput)

Vue.use(VueMaterialThemePlugin)

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
