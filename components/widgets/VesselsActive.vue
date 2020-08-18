<template>
  <no-ssr>
    <!-- <v-card>
      <v-card-title>DJS Covered Vessels</v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <apexchart v-if="ready" type="pie" height=300 :options="chartOptions" :series="series"></apexchart>
        <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
      </v-card-text>
    </v-card> -->
    <md-card>
      <md-card-header class="md-card-header-text md-card-header-primary">
        <div class="card-text">
          <h4 class="title">DJS Covered Vessels</h4>
        </div>
      </md-card-header>
      <md-card-content>
        <apexchart v-if="ready" type="pie" height=300 :options="chartOptions" :series="series"></apexchart>
        <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
      </md-card-content>
    </md-card>
  </no-ssr>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'VesselsActive',
    data () {
      return {
        ready: false,
        series: [],
        chartOptions: {
          labels: [],
          responsive: [{
            breakpoint: 480,
            options: {}
          }]
        }
      }
    },
    methods: {
      getData () {
        let vm = this
        axios.get('widgets/vessels')
          .then(res => {
            vm.chartOptions.labels = res.data.labels
            vm.series = res.data.series
            vm.ready = true
          })
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style scoped>

</style>
