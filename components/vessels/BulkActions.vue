<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-treeview hoverable :items="selected" style="max-height: 150px; overflow: auto;">
        <template v-slot:prepend="{ item }">
          <v-btn text icon outlined small color="grey" @click="selected.splice(selected.indexOf(item), 1)">
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </v-treeview>
    </v-flex>
    <v-flex xs12 sm6>
      <v-autocomplete
          v-model="action.company"
          :items="itemsCompanies"
          item-text="name"
          item-value="id"
          label="Company"
          prepend-icon="fas fa-building"
          hide-no-data
          :disabled="loadingTransfer"
      ></v-autocomplete>
      <v-autocomplete v-model="action.insurers"
                      :items="itemsInsurers"
                      item-text="name"
                      item-value="id"
                      label="H & M Insurer"
                      prepend-icon="fas fa-anchor"
                      hide-no-data
                      multiple
                      :disabled="loadingTransfer"
      ></v-autocomplete>
    </v-flex>
    <v-progress-linear :indeterminate="true" v-show="loadingTransfer"></v-progress-linear>
  </v-layout>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'BulkActions',
    props: ['selected'],
    data () {
      return {
        action: {
          company: null,
          insurers: []
        },
        itemsInsurers: [],
        itemsCompanies: [],
        loadingTransfer: false
      }
    },
    methods: {
      getVendorInsurers () {
        axios.get('vendors/insurers')
          .then(res => {
            this.itemsInsurers = res.data.data
          })
      },
      getCompanies () {
        axios.get('companies/short')
          .then(res => {
            this.itemsCompanies = res.data.data
          })
      },
      applyChanges () {
        this.loadingTransfer = true
        axios.post('vessels/bulk/actionInitiate', {
          vessel_ids: this.selected.map(a => a.id),
          action: this.action
        })
          .then(res => {
            this.$store.dispatch('notification/message', {
              message: res.data.message
            })
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.loadingTransfer = false
          })
      }
    },
    mounted () {
      this.getVendorInsurers()
      this.getCompanies()
    },
    created () {
      this.$root.$on('bulk_actions_update', () => {
        this.applyChanges()
      })
    }
  }
</script>

<style scoped>
</style>
