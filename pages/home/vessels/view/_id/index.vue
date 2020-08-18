<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <v-form ref="vesselEditForm" v-model="editedItem.valid" lazy-validation>
        <div class="md-layout">
          <div class="md-layout-item md-xsmall-size-100" align="left">
            <md-button :to="`/home/companies/view/${editedItem.company_id}`" v-if="itemsCompanies.length && editedItem.company_id" class="green"
                  :disabled="!$store.state.auth.permissions.companies.includes('U') && !$store.state.auth.permissions.companies.includes('R')">
              {{ itemsCompanies.filter(function(c) { return c.id === editedItem.company_id })[0].name }}
            </md-button>

            <md-button class="primary" @click="action" :disabled="!$store.state.auth.permissions.vessels.includes('U')">
              <md-icon :class="edit ? 'fas fa-save' : 'fas fa-edit'"></md-icon>
              <md-tooltip>{{edit ? 'Save Edits' : 'Edit Mode'}}</md-tooltip>
            </md-button>

            <md-button class="error" @click="deleteVessel(editedItem.id)" :disabled="!$store.state.auth.permissions.vessels.includes('D')">
              <md-icon>delete</md-icon>
              <md-tooltip>Delete Vessel</md-tooltip>
            </md-button>
          </div>
        </div>
        <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
          <div v-for="(error, index) in alert.errors" v-bind:key="index">
            {{error[0]}}
          </div>
        </v-alert>
        <nav-tabs-card>
          <template slot="content">
            <md-tabs class="md-rose" md-alignment="left">
              <md-tab md-label="Vessel Data">
                <v-card>
                  <v-card-text :class="edit ? 'red lighten-5' : 'grey lighten-5'">
                    <v-layout row wrap>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.name" :rules="[v => !!v || 'Vessel Name is required']"
                                      prepend-icon="fas fa-file-signature"
                                      label=" Vessel Name*" required :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-select v-model="editedItem.vessel_type_id"
                                  :items="itemsVesselType"
                                  item-text="name"
                                  item-value="id"
                                  label="Vessel Type"
                                  prepend-icon="fas fa-arrows-alt-v"
                                  :clearable="edit"
                                  :readonly="!edit"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.imo"
                                      type="number"
                                      prepend-icon="fas fa-fingerprint"
                                      label="IMO Number" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.dead_weight"
                                      prepend-icon="fas fa-weight"
                                      label="Deadweight" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.mmsi"
                                      type="number"
                                      prepend-icon="settings_input_antenna"
                                      label="MMSI Number" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.deck_area"
                                      type="number"
                                      prepend-icon="fas fa-sort-numeric-up"
                                      label="Deck Area (sq meters)" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.oil_tank_volume"
                                      type="number"
                                      prepend-icon="fas fa-sort-numeric-up"
                                      label="Oil Tank Volume (cubic meters)" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.oil_group"
                                      prepend-icon="fas fa-oil-can"
                                      label="Oil Group" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-checkbox :label="`Is ${!editedItem.tanker ? 'Not':''} Tank Vessel`"
                                    v-model="editedItem.tanker"
                                    :readonly="!edit"
                        ></v-checkbox>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </md-tab>
              <md-tab md-label="Plan Data">
                <v-card>
                  <v-card-text :class="edit ? 'red lighten-5' : 'grey lighten-5'">
                    <v-layout row wrap>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.plan_number"
                                      prepend-icon="fas fa-project-diagram"
                                      label="Plan Number" readonly></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-autocomplete v-model="editedItem.qi"
                                        :items="itemsQI"
                                        item-text="name"
                                        item-value="id"
                                        label="QI Company"
                                        prepend-icon="fas fa-anchor"
                                        hide-no-data
                                        multiple
                                        :clearable="edit"
                                        :readonly="!edit"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-autocomplete v-model="editedItem.company_id"
                                        :items="itemsCompanies"
                                        item-text="name"
                                        item-value="id"
                                        label="Company* (Plan Holder)"
                                        prepend-icon="fas fa-building"
                                        hide-no-data
                                        :clearable="edit"
                                        required
                                        :rules="[v => !!v || 'Company is required']"
                                        :readonly="!edit"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-autocomplete v-model="editedItem.operating_company_id"
                                        :items="itemsCompanies"
                                        item-text="name"
                                        item-value="id"
                                        label="Operating Company"
                                        prepend-icon="fas fa-building"
                                        hide-no-data
                                        :clearable="edit"
                                        readonly
                        ></v-autocomplete>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </md-tab>
              <md-tab md-label="Class and Insurance">
                <v-card>
                  <v-card-text :class="edit ? 'red lighten-5' : 'grey lighten-5'">
                    <v-layout row wrap>
                      <v-flex xs12 sm6>
                        <v-autocomplete v-model="editedItem.societies"
                                        :items="itemsSocieties"
                                        item-text="name"
                                        item-value="id"
                                        label="Classification Society"
                                        prepend-icon="fas fa-anchor"
                                        hide-no-data
                                        multiple
                                        :clearable="edit"
                                        :readonly="!edit"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-autocomplete v-model="editedItem.insurers"
                                        :items="itemsInsurers"
                                        item-text="name"
                                        item-value="id"
                                        label="H & M Insurer"
                                        prepend-icon="fas fa-anchor"
                                        hide-no-data
                                        multiple
                                        :clearable="edit"
                                        :readonly="!edit"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-autocomplete v-model="editedItem.providers"
                                        :items="itemsProviders"
                                        item-text="name"
                                        item-value="id"
                                        label="Damage Stability Provider"
                                        prepend-icon="fas fa-anchor"
                                        hide-no-data
                                        multiple
                                        :clearable="edit"
                                        :readonly="!edit"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-autocomplete v-model="editedItem.pi"
                                        :items="itemsPI"
                                        item-text="name"
                                        item-value="id"
                                        label="P & I Club"
                                        prepend-icon="fas fa-anchor"
                                        hide-no-data
                                        multiple
                                        :clearable="edit"
                                        :readonly="!edit"
                        ></v-autocomplete>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </md-tab>
              <md-tab md-label="Communications">
                <v-card>
                  <v-card-title>Vessel "Company" Contacts (aka DPA)</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text :class="edit ? 'red lighten-5' : 'grey lighten-5'">
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-autocomplete v-model="editedItem.primary_poc_id"
                                        :items="itemsVesselContact"
                                        item-text="name"
                                        item-value="id"
                                        label="Primary"
                                        prepend-icon="far fa-building"
                                        hide-no-data
                                        :clearable="edit"
                                        :readonly="!editedItem.company_id || !edit"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12>
                        <v-autocomplete v-model="editedItem.secondary_poc_id"
                                        :items="itemsVesselContact"
                                        item-text="name"
                                        item-value="id"
                                        label="Secondary"
                                        prepend-icon="far fa-building"
                                        hide-no-data
                                        :clearable="edit"
                                        :readonly="!editedItem.company_id || !edit"
                        ></v-autocomplete>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
                <v-card class="mt-2">
                  <v-card-title>Vessel Contact Information</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text :class="edit ? 'red lighten-5' : 'grey lighten-5'">
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field v-model="editedItem.sat_phone_primary"
                                      prepend-icon="fas fa-phone"
                                      label="SAT Telephone Primary" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field v-model="editedItem.sat_phone_secondary"
                                      prepend-icon="fas fa-phone"
                                      label="SAT Telephone Secondary" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field v-model="editedItem.email_primary"
                                      prepend-icon="fas fa-envelope"
                                      label="Email Primary" :readonly="!edit"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field v-model="editedItem.email_secondary"
                                      prepend-icon="fas fa-envelope"
                                      label="Email Secondary" :readonly="!edit"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </md-tab>
            </md-tabs>
          </template>
        </nav-tabs-card>

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
  import { NavTabsCard } from '@/components'

  export default {
    name: 'index',
    components: {
      NavTabsCard
    },
    data () {
      return {
        loading: true,
        standBy: true,
        saving: false,
        valid: true,
        edit: false,
        alert: null,
        editedItem: {
          id: null,
          valid: true,
          name: null,
          imo: null,
          mmsi: null,
          plan_number: null,
          vessel_type_id: null,
          dead_weight: null,
          tanker: false,
          deck_area: null,
          oil_tank_volume: null,
          oil_group: null,
          company_id: null,
          operating_company_id: null,
          primary_poc_id: null,
          secondary_poc_id: null,
          qi: [],
          pi: [],
          societies: [],
          insurers: [],
          providers: [],
          sat_phone_primary: null,
          sat_phone_secondary: null,
          email_primary: null,
          email_secondary: null,
          active: true
        },
        itemsVesselType: [],
        itemsQI: [],
        itemsPI: [],
        itemsSocieties: [],
        itemsInsurers: [],
        itemsProviders: [],
        itemsCompanies: [],
        itemsVesselContact: []
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

      deleteVessel (id) {
        this.$root.$confirm('Warning', `You are about to delete this vessel. Are you sure that you want to proceed?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.delete('vessels/' + id + '/destroy')
              .then(res => {
                this.$router.push('/home/vessels')
                this.$store.dispatch('notification/message', res.data.message)
              })
          }
        })
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

      getCompanies () {
        axios.get('companies/short')
          .then(res => {
            this.itemsCompanies = res.data.data
          })
      },

      getVesselContacts () {
        axios.get('companies/' + this.editedItem.company_id + '/contacts')
          .then(res => {
            this.itemsVesselContact = res.data.data
          })
      },

      getDataFromApi () {
        this.standBy = true
        this.loading = true
        axios.get('vessels/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.standBy = false
            this.loading = false
          })
      },

      action () {
        if (this.edit) {
          if (this.$refs.vesselEditForm.validate()) {
            this.saving = true
            this.alert = null
            axios.post('vessels/' + this.$route.params.id, this.editedItem)
              .then(res => {
                this.$refs.vesselEditForm.resetValidation()
                this.saving = false
                this.$store.dispatch('notification/message', res.data.message)
                this.edit = !this.edit
                this.getDataFromApi()
                this.$root.$emit('vessel_updated')
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
      },

      toggleStatus () {
        axios.post('vessels/' + this.$route.params.id + '/toggleStatus')
          .then(res => {
            this.editedItem.active = !this.editedItem.active
            this.$store.dispatch('notification/message', res.data.message)
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
      this.getCompanies()
      this.getDataFromApi()
    }
  }
</script>

<style scoped>

</style>
