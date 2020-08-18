<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">Construction Detail</h4>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 btn-area">
              <md-button class="primary md-sm" @click="action" :disabled="!$store.state.auth.permissions.vessels.includes('U')">
                <md-icon :class="edit ? 'fas fa-save' : 'fas fa-edit'"></md-icon>
                <md-tooltip>{{edit ? 'Save Edits' : 'Edit Mode'}}</md-tooltip>
              </md-button>
            </div>
          </div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-form ref="vesselEditForm" v-model="editedItem.valid" lazy-validation>
            <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
              <div v-for="(error, index) in alert.errors" v-bind:key="index">
                {{error[0]}}
              </div>
            </v-alert>
            <nav-tabs-card>
              <template slot="content">
                <md-tabs class="md-rose" md-alignment="left">
                  <md-tab md-label="Vessel Relationships">
                    <v-card-text :class="edit ? 'red lighten-5' : 'grey lighten-5'">
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-checkbox :label="`Is ${!editedItem.lead_ship ? 'Not':''} Lead Ship`"
                                      v-model="editedItem.lead_ship"
                                      :readonly="!edit"
                          ></v-checkbox>
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
                        <template v-if="editedItem.lead_ship">
                          <v-flex xs12>
                            <v-autocomplete v-model="editedItem.sister_vessels"
                                            :items="itemsSisterVessels"
                                            item-text="name"
                                            item-value="id"
                                            label="Sister Ships"
                                            prepend-icon="fas fa-ship"
                                            hide-no-data
                                            multiple
                                            :clearable="edit"
                                            :readonly="!edit"
                            ></v-autocomplete>
                          </v-flex>
                          <v-flex xs12>
                            <v-autocomplete v-model="editedItem.child_vessels"
                                            :items="itemsChildVessels"
                                            item-text="name"
                                            item-value="id"
                                            label="Child Ships"
                                            prepend-icon="fas fa-ship"
                                            hide-no-data
                                            multiple
                                            :clearable="edit"
                                            :readonly="!edit"
                            ></v-autocomplete>
                          </v-flex>
                        </template>
                        <template v-else>
                          <v-flex xs12>
                            <v-autocomplete v-model="editedItem.lead_ship_id"
                                            :items="itemsParentShips"
                                            item-text="name"
                                            item-value="id"
                                            label="Parent Ship"
                                            prepend-icon="fas fa-ship"
                                            :clearable="edit"
                                            :readonly="!edit"
                            ></v-autocomplete>
                          </v-flex>
                          <v-flex xs12>
                            <v-autocomplete v-model="editedItem.lead_sister_ship_id"
                                            :items="itemsSisterShips"
                                            item-text="name"
                                            item-value="id"
                                            label="Lead Sister Ship"
                                            prepend-icon="fas fa-ship"
                                            :clearable="edit"
                                            :readonly="!edit"
                            ></v-autocomplete>
                          </v-flex>
                        </template>
                      </v-layout>
                    </v-card-text>
                  </md-tab>
                  <md-tab md-label="Dimensions">
                    <v-card-text :class="edit ? 'red lighten-5' : 'grey lighten-5'">
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Length Overall" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Length (BP)" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Length (Reg)" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Bulbous Bow" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Breadth Extreme" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Breadth Moulded" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Draught" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Depth" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Height" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="T/CM" readonly hide-details></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field prepend-icon="fas fa-ruler"
                                        label="Displacement" readonly hide-details></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
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
                <v-progress-linear indeterminate color="white" class="mb-0" />
              </v-card-text>
            </v-card>
          </v-dialog>
        </md-card-content>
      </md-card>
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
          lead_ship: false,
          lead_ship_id: null,
          lead_sister_ship_id: null,
          sister_vessels: [],
          child_vessels: [],
          providers: [],
          active: true
        },
        itemsProviders: [],
        itemsParentShips: [],
        itemsSisterShips: [],
        itemsChildVessels: [],
        itemsSisterVessels: []
      }
    },
    methods: {
      close () {
        this.$refs.vesselAddForm.resetValidation()
        this.editedItem = Object.assign({}, this.defaultItem)
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

      getDataFromApi () {
        this.standBy = true
        this.loading = true
        axios.get('vessels/' + this.$route.params.id + '/constructionDetail')
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
            axios.post('vessels/' + this.$route.params.id + '/constructionDetail', this.editedItem)
              .then(res => {
                this.$store.dispatch('notification/message', res.data.message)
                this.$refs.vesselEditForm.resetValidation()
                this.saving = false
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
      this.getVendorProviders()
      this.getParentVesselList()
      this.getLeadSisterVesselList()
      this.getSisterVesselList()
      this.getChildVesselList()
      this.getDataFromApi()
    }
  }
</script>

<style scoped>

</style>
