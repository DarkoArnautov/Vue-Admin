<template>
  <div>
    <no-ssr>
      <div id="earth_div"></div>
    </no-ssr>
  </div>
</template>

<script>
  function initialize () {
    let options = { atmosphere: true, center: [0, 0], zoom: 0 }
    let earth = new WE.map('earth_div', options)
    WE.tileLayer('https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 5,
      attribution: 'NASA'
    }).addTo(earth)
  }

  if (process.client) {
    window.onNuxtReady((app) => {
      initialize()
    })
  }

  export default {
    head () {
      return {
        script: [
          { src: 'https://www.webglearth.com/v2/api.js' }
        ]
      }
    },
    name: 'earth',
    layout: 'home',
    data () {
      return {
        L: null
      }
    },
    methods: {}
  }
</script>

<style scoped>
  #earth_div {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
    position: absolute !important;
  }
</style>
