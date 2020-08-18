<template>
  <no-ssr>
    <!-- <v-card>
      <v-card-title>System Heartbeat</v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <apexchart v-if="ready" height=300 type="line" :options="chartOptions" :series="series"/>
        <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
      </v-card-text>
    </v-card> -->
    <md-card>
      <md-card-header class="md-card-header-text md-card-header-danger">
        <div class="card-text">
          <h4 class="title">System Heartbeat</h4>
        </div>
      </md-card-header>
      <md-card-content>
        <apexchart v-if="ready" height=300 type="line" :options="chartOptions" :series="series"/>
        <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
      </md-card-content>
    </md-card>
  </no-ssr>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'SystemHeartBeat',
    data () {
      return {
        ready: false,
        series: [],
        chartOptions: {
          chart: {
            zoom: {
              enabled: false
            },
          },
          dataLabels: {
            enabled: true
          },
          stroke: {},
          markers: {
            size: 0,
            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            categories: [],
          },
          // tooltip: {
          //   y: [{
          //     title: {
          //       formatter: function (val) {
          //         return val + ' (mins)'
          //       }
          //     }
          //   }, {
          //     title: {
          //       formatter: function (val) {
          //         return val + ' per session'
          //       }
          //     }
          //   }, {
          //     title: {
          //       formatter: function (val) {
          //         return val
          //       }
          //     }
          //   }]
          // },
          grid: {
            borderColor: '#f1f1f1',
          }
        }
      }
    },
    methods: {
      getData () {
        let vm = this
        axios.get('widgets/heartbeat')
          .then(res => {
            vm.chartOptions.stroke = res.data.stroke
            vm.chartOptions.xaxis.categories = res.data.categories
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
