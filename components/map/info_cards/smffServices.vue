<template>
  <div>
    <ul v-if="smff">
      <li v-for="service in itemsServices" v-if="smff[service.id]">{{service.name}}</li>
    </ul>
    <v-alert v-else :value="true" type="info">No SMFF Capabilities Listed.</v-alert>
    <v-btn block small text class="error" nuxt :to="`/home/${type}/view/${type_id}/smff`" target="_blank">Edit SMFF
      Capabilities
    </v-btn>
  </div>
</template>

<script>
  import axios from 'axios'
  import { getItemsServices } from '../../../utils/smff/itemsServices'

  export default {
    name: 'smffServices',
    props: ['id', 'type', 'type_id'],
    data () {
      return {
        smff: null,
        itemsServices: getItemsServices()
      }
    },
    methods: {
      getData () {
        axios.get('/map/smff/' + this.id)
          .then(res => {
            this.smff = res.data
          })
      }
    },
    watch: {
      id () {
        this.getData()
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style scoped>

</style>
