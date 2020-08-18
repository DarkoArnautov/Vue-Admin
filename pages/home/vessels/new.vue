<template>
  <v-layout row v-if="$store.state.auth.permissions.vessels.includes('C')">
    <v-flex xs12>
      <v-form ref="vesselAddForm" v-model="editedItem.valid" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="headline">Add Vessel</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
              <div v-for="error in alert.errors">
                {{error[0]}}
              </div>
            </v-alert>
            <v-card>
              <v-card-title>Vessel Data</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-text-field v-model="editedItem.name" :rules="[v => !!v || 'Vessel Name is required']"
                              prepend-icon="fas fa-file-signature"
                              label=" Vessel Name*" required></v-text-field>
                <v-divider></v-divider>
                <v-text-field v-model="editedItem.imo"
                              type="number"
                              prepend-icon="fas fa-fingerprint"
                              label="IMO Number"></v-text-field>
                <v-text-field v-model="editedItem.mmsi"
                              type="number"
                              prepend-icon="settings_input_antenna"
                              label="MMSI Number"></v-text-field>
                <v-divider></v-divider>
                <v-select v-model="editedItem.vessel_type_id"
                          :items="itemsVesselType"
                          item-text="name"
                          item-value="id"
                          label="Vessel Type"
                          prepend-icon="fas fa-arrows-alt-v"
                          clearable
                ></v-select>
                <v-text-field v-model="editedItem.dead_weight"
                              prepend-icon="fas fa-weight"
                              label="Deadweight"></v-text-field>
                <v-divider></v-divider>
                <v-checkbox label="Tank Ship"
                            v-model="editedItem.tanker"
                ></v-checkbox>
                <v-divider></v-divider>
                <v-checkbox label="Is Lead Ship"
                            v-model="editedItem.lead_ship"
                ></v-checkbox>
                <template v-if="editedItem.lead_ship">
                  <v-autocomplete v-model="editedItem.child_vessels"
                                  :items="itemsChildVessels"
                                  item-text="name"
                                  item-value="id"
                                  label="Child Vessels"
                                  prepend-icon="fas fa-ship"
                                  hide-no-data
                                  multiple
                                  clearable
                  ></v-autocomplete>
                  <v-autocomplete v-model="editedItem.sister_vessels"
                                  :items="itemsSisterVessels"
                                  item-text="name"
                                  item-value="id"
                                  label="Sister Vessels"
                                  prepend-icon="fas fa-ship"
                                  hide-no-data
                                  multiple
                                  clearable
                  ></v-autocomplete>
                </template>
                <template v-else="!editedItem.lead_ship">
                  <v-autocomplete v-model="editedItem.lead_ship_id"
                                  :items="itemsParentShips"
                                  item-text="name"
                                  item-value="id"
                                  label="Parent Ship"
                                  prepend-icon="fas fa-ship"
                                  clearable
                  ></v-autocomplete>
                  <v-autocomplete v-model="editedItem.lead_sister_ship_id"
                                  :items="itemsSisterShips"
                                  item-text="name"
                                  item-value="id"
                                  label="Lead Sister Ship"
                                  prepend-icon="fas fa-ship"
                                  clearable
                  ></v-autocomplete>
                </template>
                <v-divider></v-divider>
                <v-checkbox v-model="editedItem.active">
                  <template v-slot:label>
                    <div><strong class="green--text">Is Active</strong></div>
                  </template>
                </v-checkbox>
                <v-divider></v-divider>
                <v-text-field v-model="editedItem.deck_area"
                              type="number"
                              prepend-icon="fas fa-sort-numeric-up"
                              label="Deck Area"></v-text-field>
                <v-text-field v-model="editedItem.oil_tank_volume"
                              type="number"
                              prepend-icon="fas fa-sort-numeric-up"
                              label="Oil Tank Volume"></v-text-field>
                <v-text-field v-model="editedItem.oil_group"
                              prepend-icon="fas fa-oil-can"
                              label="Oil Group"></v-text-field>
                <v-autocomplete v-if="itemsCompanies.length > 0 && !$route.query.company_id"
                                v-model="editedItem.company_id"
                                :items="itemsCompanies"
                                item-text="name"
                                item-value="id"
                                label="Company*"
                                prepend-icon="fas fa-building"
                                hide-no-data
                                clearable
                                required
                                :rules="[v => !!v || 'Company is required']"
                ></v-autocomplete>
                <v-divider></v-divider>
                <v-text-field v-model="editedItem.latitude"
                              type="number"
                              prepend-icon="fas fa-map-marked-alt"
                              label="Latitude"></v-text-field>
                <v-text-field v-model="editedItem.longitude"
                              type="number"
                              prepend-icon="fas fa-map-marked-alt"
                              label="Longitude"></v-text-field>
                <v-autocomplete v-model="editedItem.fleets"
                                :items="itemsFleets"
                                item-text="name"
                                item-value="id"
                                label="Fleets"
                                prepend-icon="filter_9_plus"
                                hide-no-data
                                multiple
                                clearable
                ></v-autocomplete>
              </v-card-text>
            </v-card>
            <v-card class="mb-2 mt-2">
              <v-card-title>Vessel Contacts</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-autocomplete v-model="editedItem.primary_poc_id"
                                :items="itemsVesselContact"
                                item-text="name"
                                item-value="id"
                                label="Primary"
                                prepend-icon="far fa-building"
                                hide-no-data
                                clearable
                                :disabled="!editedItem.company_id"
                ></v-autocomplete>
                <v-divider></v-divider>
                <v-autocomplete v-model="editedItem.secondary_poc_id"
                                :items="itemsVesselContact"
                                item-text="name"
                                item-value="id"
                                label="Secondary"
                                prepend-icon="far fa-building"
                                hide-no-data
                                clearable
                                :disabled="!editedItem.company_id"
                ></v-autocomplete>
              </v-card-text>
            </v-card>
            <v-card class="mb-2">
              <v-card-title>3rd Party Vendors</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-autocomplete v-model="editedItem.qi"
                                :items="itemsQI"
                                item-text="name"
                                item-value="id"
                                label="Q/I Company"
                                prepend-icon="fas fa-anchor"
                                hide-no-data
                                multiple
                                clearable
                ></v-autocomplete>
                <v-autocomplete v-model="editedItem.pi"
                                :items="itemsPI"
                                item-text="name"
                                item-value="id"
                                label="P & I Club"
                                prepend-icon="fas fa-anchor"
                                hide-no-data
                                multiple
                                clearable
                ></v-autocomplete>
                <v-autocomplete v-model="editedItem.societies"
                                :items="itemsSocieties"
                                item-text="name"
                                item-value="id"
                                label="Class. Society"
                                prepend-icon="fas fa-anchor"
                                hide-no-data
                                multiple
                                clearable
                ></v-autocomplete>
                <v-autocomplete v-model="editedItem.insurers"
                                :items="itemsInsurers"
                                item-text="name"
                                item-value="id"
                                label="H&M Insurer"
                                prepend-icon="fas fa-anchor"
                                hide-no-data
                                multiple
                                clearable
                ></v-autocomplete>
                <v-autocomplete v-model="editedItem.providers"
                                :items="itemsProviders"
                                item-text="name"
                                item-value="id"
                                label="Damage Stability Provider"
                                prepend-icon="fas fa-anchor"
                                hide-no-data
                                multiple
                                clearable
                ></v-autocomplete>
              </v-card-text>
            </v-card>
            <small>*indicates required field</small>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text nuxt to="/home/vessels">Return to List</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="!editedItem.valid">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'new',
    layout: 'home',
    data () {
      return {
        dialog: false,
        loading: true,
        alert: null,
        editedItem: {
          valid: true,
          name: null,
          imo: null,
          mmsi: null,
          latitude: null,
          longitude: null,
          vessel_type_id: null,
          dead_weight: null,
          tanker: false,
          lead_ship: false,
          lead_ship_id: null,
          lead_sister_ship_id: null,
          sister_vessels: [],
          child_vessels: [],
          deck_area: null,
          oil_tank_volume: null,
          oil_group: null,
          company_id: null,
          primary_poc_id: null,
          secondary_poc_id: null,
          qi: [],
          pi: [],
          societies: [],
          insurers: [],
          providers: [],
          fleets: [],
          active: false
        },
        defaultItem: {
          valid: true,
          name: null,
          imo: null,
          mmsi: null,
          vessel_type_id: null,
          dead_weight: null,
          tanker: false,
          lead_ship: false,
          lead_ship_id: null,
          lead_sister_ship_id: null,
          sister_vessels: [],
          child_vessels: [],
          deck_area: null,
          oil_tank_volume: null,
          oil_group: null,
          company_id: null,
          primary_poc_id: null,
          secondary_poc_id: null,
          qi: [],
          pi: [],
          societies: [],
          insurers: [],
          providers: [],
          active: false
        },
        itemsVesselType: [],
        itemsQI: [],
        itemsPI: [],
        itemsSocieties: [],
        itemsInsurers: [],
        itemsProviders: [],
        itemsParentShips: [],
        itemsSisterShips: [],
        itemsChildVessels: [],
        itemsSisterVessels: [],
        itemsCompanies: [],
        itemsVesselContact: [],
        itemsFleets: []
      }
    },
    watch: {
      'editedItem.company_id' () {
        if (this.editedItem.company_id) {
          this.getVesselContacts()
        } else {
          this.itemsVesselContact = []
        }
      }
    },
    methods: {
      close () {
        this.$refs.vesselAddForm.resetValidation()
        this.editedItem = Object.assign({}, this.defaultItem)
      },

      save () {
        this.alert = null
        if (this.$refs.vesselAddForm.validate()) {
          axios.post('vessels/create', this.editedItem)
            .then(res => {
              this.close()
              this.$store.dispatch('notification/message', {
                message: res.data.message
              })
              this.$router.push('/home/vessels/view/' + res.data.id)
            })
            .catch(error => {
              if (error.response && error.response.data) {
                this.alert = {
                  type: error.response.data.type,
                  message: error.response.data.message || error.response.status,
                  errors: error.response.data.errors
                }
              }
            })
        }
      },

      getVesselType () {
        axios.get('vessels/types')
          .then(res => {
            this.itemsVesselType = res.data.data
          })
      },

      getVendorQI () {
        axios.get('vendors/qi')
          .then(res => {
            this.itemsQI = res.data.data
          })
      },

      getVendorPI () {
        axios.get('vendors/pi')
          .then(res => {
            this.itemsPI = res.data.data
          })
      },

      getVendorSocieties () {
        axios.get('vendors/societies')
          .then(res => {
            this.itemsSocieties = res.data.data
          })
      },

      getVendorInsurers () {
        axios.get('vendors/insurers')
          .then(res => {
            this.itemsInsurers = res.data.data
          })
      },

      getVendorProviders () {
        axios.get('vendors/providers')
          .then(res => {
            this.itemsProviders = res.data.data
          })
      },

      getParentVesselList () {
        axios.get('vessels/parent/list')
          .then(res => {
            this.itemsParentShips = res.data.data
          })
      },

      getLeadSisterVesselList () {
        axios.get('vessels/lead/sister/list')
          .then(res => {
            this.itemsSisterShips = res.data.data
          })
      },

      getSisterVesselList () {
        axios.get('vessels/sister/list')
          .then(res => {
            this.itemsSisterVessels = res.data.data
          })
      },

      getChildVesselList () {
        axios.get('vessels/child/list')
          .then(res => {
            this.itemsChildVessels = res.data.data
          })
      },

      getCompanies () {
        axios.get('companies/short')
          .then(res => {
            this.itemsCompanies = res.data.data
            if (this.$route.query.company_id) {
              this.editedItem.company_id = this.$route.query.company_id
            }
          })
      },

      getFleets () {
        axios.get('fleets')
          .then(res => {
            this.itemsFleets = res.data.data
          })
      },

      getVesselContacts () {
        axios.get('companies/' + this.editedItem.company_id + '/contacts')
          .then(res => {
            this.itemsVesselContact = res.data.data
          })
      }
    },
    mounted () {
      this.getVesselType()
      this.getVendorQI()
      this.getVendorPI()
      this.getVendorSocieties()
      this.getVendorInsurers()
      this.getVendorProviders()
      this.getParentVesselList()
      this.getLeadSisterVesselList()
      this.getSisterVesselList()
      this.getChildVesselList()
      this.getFleets()
      this.getCompanies()
    }
  }
</script>

<style scoped>

</style>
