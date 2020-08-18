<template>
  <no-ssr>
    <div id="windy"></div>
  </no-ssr>
</template>

<script>
  if (process.client) {
    window.onNuxtReady((app) => {
      const options = {
        // Required: API key
        key: 'w7BRabUOWTKeaGVSPD2YcM0cPzEty1rp',

        // Put additional console output
        verbose: true,

        // Optional: Initial state of the map
        lat: 50.4,
        lon: 14.3,
        zoom: 5
      }
      console.log(L.version)
      // Initialize Windy API
      windyInit(options, windyAPI => {
        // windyAPI is ready, and contain 'map', 'store',
        // 'picker' and other usefull stuff

        const { map } = windyAPI
        // .map is instance of Leaflet map

        L.popup()
          .setLatLng([50.4, 14.3])
          .setContent('Hello World')
          .openOn(map)
      })
    })
  }
  export default {
    head () {
      return {
        script: [
          { src: 'https://unpkg.com/leaflet@0.7.7/dist/leaflet.js' },
          { src: 'https://api4.windy.com/assets/libBoot.js' }
        ]
      }
    },
    name: 'new',
    layout: 'home'
  }
</script>

<style scoped>
  #windy {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>
