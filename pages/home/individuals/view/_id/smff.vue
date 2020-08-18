<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">SMFF Services - TABLE 155.4030(b)</h4>
            </div>
          </div>
          <div class="md-layout" v-if="capability">
            <div class="md-layout-item md-xsmall-size-100 btn-area">
              <md-button class="error md-sm" @click="dialogDeleteConfirm = true"
                     :disabled="!$store.state.auth.permissions.companies.includes('U')">Remove
                <md-tooltip>Remove SMFF Service</md-tooltip>
              </md-button>
              <md-button v-if="capability" class="primary md-sm" @click="saveChanges"
                :disabled="!dataChanged || !$store.state.auth.permissions.users.includes('U')">
                <md-icon class="fas fa-save"></md-icon>
                <md-tooltip>Save SMFF Service</md-tooltip>
              </md-button>
            </div>
          </div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
            <div v-for="(error, i) in alert.errors" :key="i">
              {{error[0]}}
            </div>
          </v-alert>
          <div class="md-layout" v-if="capability">
            <div class="md-layout-item md-xsmall-size-100 ma-0 pa-0">
              <nav-tabs-card>
                <template slot="content">
                  <md-tabs class="md-rose" md-alignment="left">
                    <md-tab md-label="Network">
                      <table>
                        <tr>
                          <td>OPA-90 Response Asset</td>
                          <td>
                            <v-checkbox v-model="network" value="opa_90"></v-checkbox>
                          </td>
                        </tr>
                        <tr v-if="network.includes('opa_90')" style="background-color: white">
                          <td colspan="2">
                            <table>
                              <tr>
                                <td>GSA Designator</td>
                                <td>
                                  <v-text-field v-model="capability.acd_gsa_designator"
                                                hide-details></v-text-field>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>Donjon Navy Asset</td>
                          <td>
                            <v-checkbox v-model="network" value="dnc"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>NASA Response Asset</td>
                          <td>
                            <v-checkbox v-model="network" value="ns"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>NASA Potential Response Asset</td>
                          <td>
                            <v-checkbox v-model="network" value="npnc"></v-checkbox>
                          </td>
                        </tr>
                      </table>
                    </md-tab>
                    <md-tab md-label="Primary Service">
                      <v-autocomplete
                          v-model="capability.primary_service"
                          :items="itemsServices"
                          item-text="name"
                          item-value="id"
                          label="Select Primary Service">

                        <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title v-text="item.name"
                                              :style="`color: ${item.id.charAt(0) === 'm' ? 'red':'black'}`"></v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </md-tab>
                    <md-tab md-label="Salvage">
                      <table>
                        <tr>
                          <th colspan="2">(i) Assessment &amp; Survey</th>
                        </tr>
                        <tr>
                          <td>Remote assessment and consultation</td>
                          <td>
                            <v-checkbox v-model="capability.s_remote_assessment_and_consultation"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Begin assessment of structural stability</td>
                          <td>
                            <v-checkbox v-model="capability.s_begin_assessment_of_structural_stability"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>On-site salvage assessment</td>
                          <td>
                            <v-checkbox v-model="capability.s_onsite_salvage_assessment"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Assessment of structural stability</td>
                          <td>
                            <v-checkbox v-model="capability.s_assessment_of_structural_stability"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Hull and bottom survey</td>
                          <td>
                            <v-checkbox v-model="capability.s_hull_and_bottom_survey"></v-checkbox>
                          </td>
                        </tr>
                      </table>
                      <table class="mt-2">
                        <tr>
                          <th colspan="2">(ii) Stabilization</th>
                        </tr>
                        <tr>
                          <td>Emergency towing</td>
                          <td>
                            <v-checkbox v-model="capability.s_emergency_towing"></v-checkbox>
                          </td>
                        </tr>
                        <tr v-if="capability.s_emergency_towing" style="background-color: white">
                          <td colspan="2">
                            <table>
                              <tr>
                                <td>Tug Type</td>
                                <td>
                                  <v-select v-model="capability.s_tug_type"
                                            :items="['Conventional', 'Azimuth stern drive', 'Tractor']"
                                            hide-details clearable></v-select>
                                </td>
                              </tr>
                              <tr>
                                <td>Horsepower</td>
                                <td>
                                  <v-text-field v-model="capability.s_horsepower" type="number" hide-details></v-text-field>
                                </td>
                              </tr>
                              <tr>
                                <td>Bollard Pull</td>
                                <td>
                                  <v-text-field v-model="capability.s_bollard_pull" type="number" hide-details></v-text-field>
                                </td>
                              </tr>
                              <tr>
                                <td>Subchapter M</td>
                                <td>
                                  <v-text-field v-model="capability.s_subchapter_m" hide-details></v-text-field>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>Salvage plan</td>
                          <td>
                            <v-checkbox v-model="capability.s_salvage_plan"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>External emergency transfer operations</td>
                          <td>
                            <v-checkbox v-model="capability.s_external_emergency_transfer_operations"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Emergency lightering</td>
                          <td>
                            <v-checkbox v-model="capability.s_emergency_lightering"></v-checkbox>
                          </td>
                        </tr>
                        <tr v-if="capability.s_emergency_lightering" style="background-color: white">
                          <td colspan="2">
                            <table>
                              <tr>
                                <td>Floating or land-based receptacle(s)</td>
                                <td>
                                  <v-checkbox v-model="capability.s_capacity_bbl"></v-checkbox>
                                </td>
                              </tr>
                              <tr v-if="capability.s_capacity_bbl" style="background-color: white">
                                <td colspan="2">
                                  <table>
                                    <tr>
                                      <td>Capacity in BBL</td>
                                      <td>
                                        <v-text-field v-model="capability.s_capacity_bbl_value" hide-details></v-text-field>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>Other refloating methods</td>
                          <td>
                            <v-checkbox v-model="capability.s_other_refloating_methods"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Making temporary repairs</td>
                          <td>
                            <v-checkbox v-model="capability.s_making_temporary_repairs"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Diving services support</td>
                          <td>
                            <v-checkbox v-model="capability.s_diving_services_support"></v-checkbox>
                          </td>
                        </tr>
                      </table>
                      <table class="mt-2">
                        <tr>
                          <th colspan="2">(iii) Specialized Salvage Operations</th>
                        </tr>
                        <tr>
                          <td>Special salvage operations plan</td>
                          <td>
                            <v-checkbox v-model="capability.s_special_salvage_operations_plan"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Subsurface product removal</td>
                          <td>
                            <v-checkbox v-model="capability.s_subsurface_product_removal"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Heavy lift</td>
                          <td>
                            <v-checkbox v-model="capability.s_heavy_lift"></v-checkbox>
                          </td>
                        </tr>
                        <tr v-if="capability.s_heavy_lift" style="background-color: white">
                          <td colspan="2">
                            <table>
                              <tr>
                                <td>Lifting Gear Minimum SWL</td>
                                <td>
                                  <v-text-field v-model="capability.s_lifting_gear_minimum_swl" type="number"
                                                hide-details></v-text-field>
                                </td>
                              </tr>
                              <tr>
                                <td>Largest Cargo Gear</td>
                                <td>
                                  <v-select v-model="capability.s_largest_cargo_gear"
                                            :items='["\"A\" Frame", "Cargo Lift", "Crane", "Derrick Gantry Crane", "Gearless", "Unknown"]'
                                            hide-details clearable></v-select>
                                </td>
                              </tr>
                              <tr>
                                <td>Lifting Gear Reach</td>
                                <td>
                                  <v-text-field v-model="capability.s_lifting_gear_reach" type="number"
                                                hide-details></v-text-field>
                                </td>
                              </tr>
                              <tr>
                                <td>Available Deck Space in Square Meters</td>
                                <td>
                                  <v-text-field v-model="capability.s_available_deck_space" type="number"
                                                hide-details></v-text-field>
                                </td>
                              </tr>
                              <tr>
                                <td>Available Deck Space Location</td>
                                <td>
                                  <v-text-field v-model="capability.s_available_deck_space_location"
                                                hide-details></v-text-field>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </md-tab>
                    <md-tab md-label="Firefighting">
                      <table>
                        <tr>
                          <th colspan="2">(i) Assessment &amp; Planning</th>
                        </tr>
                        <tr>
                          <td>Remote assessment and consultation</td>
                          <td>
                            <v-checkbox v-model="capability.mff_remote_assessment_and_consultation"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>On-site fire assessment</td>
                          <td>
                            <v-checkbox v-model="capability.mff_onsite_fire_assessment"></v-checkbox>
                          </td>
                        </tr>
                      </table>
                      <table class="mt-2">
                        <tr>
                          <th colspan="2">(ii) Fire Suppression</th>
                        </tr>
                        <tr>
                          <td>External firefighting teams</td>
                          <td>
                            <v-checkbox v-model="capability.mff_external_firefighting_teams"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>External vessel firefighting systems</td>
                          <td>
                            <v-checkbox v-model="capability.mff_external_vessel_firefighting_systems"></v-checkbox>
                          </td>
                        </tr>
                        <tr v-if="capability.mff_external_vessel_firefighting_systems" style="background-color: white">
                          <td colspan="2">
                            <table>
                              <tr>
                                <td>Class classification</td>
                                <td>
                                  <v-select v-model="capability.mff_class_classification"
                                            :items="['Not Applicable', 'FiFi 1', 'FiFi 2', 'FiFi 3']" hide-details
                                            clearable
                                            @change="updatePumpingCapacity"></v-select>
                                </td>
                              </tr>
                              <tr>
                                <td>Pumping capacity</td>
                                <td>
                                  <v-text-field v-model="capability.mff_pumping_capacity" suffix="(gpm)" type="number"
                                                hide-details></v-text-field>
                                </td>
                              </tr>
                              <tr>
                                <td>Foam quantity</td>
                                <td>
                                  <v-text-field v-model="capability.mff_foam_quantity" type="number"
                                                hide-details></v-text-field>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </md-tab>
                    <md-tab md-label="Additional">
                      <table>
                        <tr>
                          <td>Logistics Asset</td>
                          <td>
                            <v-checkbox v-model="capability.acd_logistics_asset"></v-checkbox>
                          </td>
                        </tr>
                        <tr>
                          <td>Passenger Capacity (Number input)</td>
                          <td>
                            <v-text-field v-model="capability.acd_passenger_capacity" type="number"
                                          hide-details></v-text-field>
                          </td>
                        </tr>
                        <tr>
                          <td>Helicopter Capability Landing Size/Capacity</td>
                          <td>
                            <v-text-field v-model="capability.acd_heli_landing_capacity" type="number"
                                          hide-details></v-text-field>
                          </td>
                        </tr>
                        <tr>
                          <td>Helicopter Capability Drop-zone Size</td>
                          <td>
                            <v-text-field v-model="capability.acd_heli_drop_zone_size" type="number"
                                          hide-details></v-text-field>
                          </td>
                        </tr>
                        <tr>
                          <td>Small Boat Capability Size</td>
                          <td>
                            <v-text-field v-model="capability.acd_small_boat_size" type="number"
                                          hide-details></v-text-field>
                          </td>
                        </tr>
                        <tr>
                          <td>Small Boat Capability Capacity</td>
                          <td>
                            <v-text-field v-model="capability.acd_small_boat_capacity" type="number"
                                          hide-details></v-text-field>
                          </td>
                        </tr>
                        <tr>
                          <td>Medical Personnel Onboard</td>
                          <td>
                            <v-select v-model="capability.acd_medical_personnel_onboard"
                                      :items="['Medical doctor / physician normally carried', 'Physician\'s assistant or paramedic normally carried', 'Nurse normally carried', 'No medically trained personnel normally carried']"
                                      hide-details clearable></v-select>
                          </td>
                        </tr>
                        <tr>
                          <td>Radio Watch Schedule</td>
                          <td>
                            <v-select v-model="capability.acd_radio_watch_schedule"
                                      :items="['H24-Continuous', 'H16-ITU SKED', 'H8-ITU SKED', 'HX Unspecified']"
                                      hide-details clearable></v-select>
                          </td>
                        </tr>
                      </table>
                    </md-tab>
                    <md-tab md-label="Notes">
                      <v-textarea auto-grow v-model="capability.notes"></v-textarea>
                    </md-tab>
                  </md-tabs>
                </template>
              </nav-tabs-card>
            </div>
          </div>
          <div v-else>
            <v-alert
                :value="true"
                color="info"
                icon="info"
                outlined >
              No SMFF Services for this individual.
            </v-alert>
            <v-btn block text class="primary" @click="createSMFF"
                  :disabled="!$store.state.auth.permissions.users.includes('U')">Create
            </v-btn>
          </div>
        </md-card-content>
      </md-card>
      <v-dialog v-model="standBy" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please stand by
            <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDeleteConfirm" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            You are about to DELETE the SMFF Services.
          </v-card-title>

          <v-card-text>
            Please confirm that you would like to <b>delete</b> the SMFF Services.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogDeleteConfirm = false">
              Cancel
            </v-btn>
            <v-btn color="primary" text @click="removeSMFF()">
              Delete SMFF Services
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogSaveChanges" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Unsaved changes.
          </v-card-title>

          <v-card-text>
            Do you want to save your changes. All changes will be lost.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="goToNextRoute">
              Exit anyway
            </v-btn>
            <v-btn text @click="dialogSaveChanges = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { getItemsServices } from '../../../../../utils/smff/itemsServices'
  import { NavTabsCard } from '@/components'

  export default {
    name: 'smff',
    components: {
      NavTabsCard
    },
    data () {
      return {
        standBy: true,
        saving: false,
        alert: null,
        dialogDeleteConfirm: false,
        dialogSaveChanges: false,
        exitRoute: null,
        forceRoute: false,
        capability: null,
        network: [],
        orgCapability: null,
        orgNetwork: [],
        itemsServices: getItemsServices()
      }
    },
    watch: {
      // capability: {
      //   handler: function (newValue, oldValue) {
      //     let vm = this
      //     if (oldValue && newValue) {
      //       vm.updateData('smff')
      //     }
      //   },
      //   deep: true
      // },
      //
      // network: {
      //   handler: function (newValue, oldValue) {
      //     let vm = this
      //     if (oldValue && newValue && vm.capability) {
      //       vm.updateData('network')
      //     }
      //   },
      //   deep: true
      // }
    },
    methods: {
      getDataFromApi () {
        this.standBy = true
        axios.get('users/' + this.$route.params.id + '/smff')
          .then(res => {
            if (res.data.networks.length) {
              this.network = res.data.networks
              this.orgNetwork = this.network.slice()
            }
            this.capability = res.data.smff
            this.orgCapability = Object.assign({}, this.capability)
            this.standBy = false
          })
      },

      createSMFF () {
        axios.post('users/' + this.$route.params.id + '/smff/create')
          .then(res => {
            this.getDataFromApi()
            this.$store.dispatch('notification/message', res.data.message)
          })
      },

      removeSMFF () {
        this.standBy = true
        axios.delete('users/' + this.$route.params.id + '/smff')
          .then(res => {
            this.network = []
            this.capability = null
            this.$store.dispatch('notification/message', res.data.message)
            this.standBy = false
          })
        this.dialogDeleteConfirm = false
      },

      updateData (type) {
        let data
        if (type === 'smff') {
          data = {
            capabilities: this.capability
          }
        } else {
          data = {
            networks: this.network
          }
        }
        axios.post('users/' + this.$route.params.id + '/' + type, data)
          .then(res => {
            this.getDataFromApi()
            this.$store.dispatch('notification/message', res.data.message)
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
      },

      updatePumpingCapacity () {
        if (!this.capability.mff_pumping_capacity) {
          switch (this.capability.mff_class_classification) {
            case 'FiFi 1':
              this.capability.mff_pumping_capacity = 10.569
              break
            case 'FiFi 2':
              this.capability.mff_pumping_capacity = 31.704
              break
            case 'FiFi 3':
              this.capability.mff_pumping_capacity = 42.272
              break
          }
        }
      },

      saveChanges () {
        if (JSON.stringify(this.orgCapability) !== JSON.stringify(this.capability)) {
          this.updateData('smff')
        }
        if (JSON.stringify(this.orgNetwork) !== JSON.stringify(this.network)) {
          this.updateData('network')
        }
      },

      goToNextRoute () {
        this.forceRoute = true
        this.$router.push(this.exitRoute)
      }
    },
    mounted () {
      this.getDataFromApi()
    },
    computed: {
      dataChanged () {
        return (JSON.stringify(this.orgCapability) !== JSON.stringify(this.capability) || JSON.stringify(this.orgNetwork) !== JSON.stringify(this.network))
      }
    },
    beforeRouteLeave: function (to, from, next) {
      if (this.capability && this.dataChanged && !this.forceRoute) {
        this.dialogSaveChanges = true
        this.exitRoute = to.path
        next(false)
      } else {
        next(true)
      }
    }
  }
</script>

<style scoped>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }

  #ff tr:nth-child(even) {
    background-color: #ef9a9a;
  }

  #network tr:nth-child(even) {
    background-color: #bbdefb;
  }

  .v-input--selection-controls {
    margin: unset;
    padding: unset;
    height: 25px;
    width: 20px;
  }

  .v-text-field {
    margin: unset;
    padding: unset;
  }
</style>
