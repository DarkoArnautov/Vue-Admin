<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <v-form ref="vesselEditForm" v-model="valid" lazy-validation>
        <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
          <div v-for="(error, index) in alert.errors" v-bind:key="index">
            {{error[0]}}
          </div>
        </v-alert>
        <md-card>
          <md-card-header>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100">
                <h4 class="title">Vessel AIS Data</h4>
              </div>
            </div>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100 btn-area">
                <md-button class="primary md-sm" @click="action" text
                      :disabled="!$store.state.auth.permissions.vessels.includes('U')">
                  <md-icon :class="edit ? 'fas fa-save' : 'fas fa-edit'"></md-icon>
                </md-button>
              </div>
            </div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content :class="edit ? 'red lighten-5' : 'grey lighten-5'">
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.latitude"
                              type="number"
                              prepend-icon="fas fa-map-marked-alt"
                              label="Latitude" :readonly="!edit"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.longitude"
                              type="number"
                              prepend-icon="fas fa-map-marked-alt"
                              label="Longitude" :readonly="!edit"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete v-model="editedItem.fleets"
                                :items="itemsFleets"
                                item-text="name"
                                item-value="id"
                                label="Fleets"
                                prepend-icon="filter_9_plus"
                                hide-no-data
                                multiple
                                :clearable="edit"
                                :readonly="!edit"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select label="Zone" v-model="editedItem.zone_id" :items="itemsZones" disabled
                          item-text="name" item-value="id" hide-details></v-select>
              </v-flex>
            </v-layout>
          </md-card-content>
        </md-card>
        <small>*indicates required field</small>
      </v-form>
      <v-dialog v-model="standBy" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear
              indeterminate
              color="white"
              class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'index',
    data () {
      return {
        standBy: true,
        saving: false,
        valid: true,
        edit: false,
        alert: null,
        editedItem: {
          id: null,
          valid: true,
          name: null,
          latitude: null,
          longitude: null,
          fleets: [],
          active: true
        },
        itemsFleets: [],
        itemsZones: []
      }
    },
    methods: {
      close () {
        this.$refs.vesselAddForm.resetValidation()
        this.editedItem = Object.assign({}, this.defaultItem)
      },

      getFleets () {
        axios.get('fleets')
          .then(res => {
            this.itemsFleets = res.data.data
          })
      },

      getZones () {
        axios.get('zones/short')
          .then(res => {
            this.itemsZones = res.data.data
          })
      },

      getDataFromApi () {
        this.standBy = true
        axios.get('vessels/' + this.$route.params.id + '/ais')
          .then(res => {
            this.editedItem = res.data.data[0]
            this.standBy = false
          })
      },

      action () {
        if (this.edit) {
          if (this.$refs.vesselEditForm.validate()) {
            this.saving = true
            this.alert = null
            axios.post('vessels/' + this.$route.params.id + '/ais', this.editedItem)
              .then(res => {
                this.$refs.vesselEditForm.resetValidation()
                this.saving = false
                this.$store.dispatch('notification/message', { message: res.data.message })
                this.edit = !this.edit
                this.getDataFromApi()
              })
              .catch(error => {
                if (error.response && error.response.data) {
                  this.saving = false
                  this.alert = {
                    type: error.response.data.type,
                    message: error.response.data.message || error.response.status,
                    errors: error.response.data.errors
                  }
                }
              })
          }
        } else {
          this.edit = !this.edit
        }
      }
    },
    mounted () {
      this.getFleets()
      this.getDataFromApi()
      this.getZones()
    }
  }
</script>

<style scoped>

</style>
