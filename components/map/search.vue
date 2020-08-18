<template>
  <v-autocomplete
      v-model="searchValue"
      :items="searchItems"
      :loading="isLoading"
      :search-input.sync="search"
      placeholder="Vessel, Company..."
      item-text="name"
      item-value="info"
      hide-no-data
      no-filter
      dense>
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          No Record Found
        </v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-avatar
          :size="35"
          color="primary"
          class="font-weight-light white--text"
      >
        <v-icon v-if="item.info.type === 'individual'" color="white">contact_phone</v-icon>
        <v-icon v-if="item.info.type === 'vessel'" color="white">directions_boat</v-icon>
        <v-icon v-if="item.info.type === 'company'" color="white">business</v-icon>
        <v-icon v-if="item.info.type === 'location'" color="white">location_on</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-sub-title v-text="item.description"></v-list-item-sub-title>
        </v-list-item-content>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'search',
    data () {
      return {
        searchValue: null,
        search: null,
        searchItems: [],
        isLoading: false,
        search_timeout: null
      }
    },
    watch: {
      search (val) {
        if (this.search_timeout) clearTimeout(this.search_timeout)
        if (this.search) {
          let vm = this
          this.search_timeout = setTimeout(function () {
            vm.getDataFromApi()
          }, 500)
        }
      },
      searchValue () {
        this.$root.$emit('search_value', this.searchValue)
      }
    },
    methods: {
      getDataFromApi () {
        this.isLoading = true
        axios.get('/map/search/' + this.search)
          .then(res => {
            this.searchItems = res.data
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      }
    }
  }
</script>

<style scoped>

</style>
