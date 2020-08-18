<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100 md-small-size-100 md-medium-size-100 md-large-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">Primary Address</h4>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 btn-area">

              <md-button class="md-primary md-sm" @click.stop="addAddress()" :disabled="!!itemsAddresses.length || !$store.state.auth.permissions.users.includes('U')">
                Add Address
              </md-button>
            </div>
          </div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-data-table
              :items="itemsAddresses"
              hide-default-footer
              hide-default-header >
            <template v-slot:item="props">
              <td>
                <v-layout row wrap>
                  <v-flex xs12 v-if="props.item.latitude && props.item.longitude">
                    <div style="height: 100%; width: 100%; position:sticky; margin: 0; padding: 0">
                      <l-map style="height: 200px; width: 100%" :zoom="13"
                            :center="[props.item.latitude, props.item.longitude]"
                            :options="{ zoomControl: false, dragging: false, scrollWheelZoom: false}">
                        <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                        <l-marker :lat-lng="[props.item.latitude, props.item.longitude]"></l-marker>
                      </l-map>
                    </div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex>
                    <v-text-field label="Street" v-model="props.item.street" hide-details></v-text-field>
                    <v-text-field label="Unit" v-model="props.item.unit" hide-details></v-text-field>
                    <v-text-field label="City" v-model="props.item.city" hide-details></v-text-field>
                    <v-text-field label="State" v-model="props.item.state" hide-details></v-text-field>
                    <v-text-field label="Country" v-model="props.item.country" hide-details></v-text-field>
                  </v-flex>
                  <v-flex>
                    <v-text-field label="Zip" v-model="props.item.zip" hide-details></v-text-field>
                    <v-text-field label="Province" v-model="props.item.province" hide-details></v-text-field>
                    <v-text-field label="Phone" v-model="props.item.phone" hide-details></v-text-field>
                    <v-select label="Zone" v-model="props.item.zone_id" :items="itemsZones" disabled
                              item-text="name" item-value="id" hide-details></v-select>
                    <v-layout row wrap>
                      <v-flex xs12 sm6>
                        <v-text-field label="Latitude" v-model="props.item.latitude" type="number"
                                      hide-details></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field xs6 label="Longitude" v-model="props.item.longitude" type="number"
                                      hide-details></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-btn class="success" text small block @click="saveAddress(props.item)"
                          :disabled="!$store.state.auth.permissions.companies.includes('U')">
                      Save
                    </v-btn>
                    <v-btn class="error" text small block @click="deleteAddressConfirm(props.item)"
                          :disabled="!$store.state.auth.permissions.companies.includes('U')">
                      Delete
                    </v-btn>
                  </v-flex>
                </v-layout>
              </td>
            </template>
            <template v-slot:no-data>
              <v-alert :value="true" type="warning" outlined>
                No Addresses Defined
              </v-alert>
            </template>
          </v-data-table>
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
        <v-card v-if="addressToDelete">
          <v-card-title class="headline grey lighten-2" primary-title>
            ALERT! You are about to delete an address.
          </v-card-title>

          <v-card-text>
            Please confirm that you would like to delete the following address:
            <b>{{addressToDelete.street}} {{addressToDelete.city}} {{addressToDelete.country}}</b>.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogDeleteConfirm = false" >
              Cancel
            </v-btn>
            <v-btn color="primary" text @click="deleteAddress(addressToDelete.id)" >
              Delete Address
            </v-btn>
          </v-card-actions>
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
        dialogDeleteConfirm: false,
        alert: null,
        itemsAddresses: [],
        itemsZones: [],
        addressToDelete: null
      }
    },
    computed: {},
    methods: {
      getZones () {
        axios.get('zones/short')
          .then(res => {
            this.itemsZones = res.data.data
          })
      },

      getAddresses () {
        this.standBy = true
        axios.get('users/' + this.$route.params.id + '/addresses')
          .then(res => {
            this.itemsAddresses = []
            if (!(Object.keys(res.data).length === 0 && res.data.constructor === Object)) {
              this.itemsAddresses.push(res.data)
            } // only one address per individual
            this.standBy = false
          })
      },

      saveAddress (address) {
        axios.post('users/addresses/' + address.id, { address: address })
          .then(res => {
            this.getAddresses()
            this.$store.dispatch('notification/message', res.data.message)
          })
      },

      deleteAddressConfirm (address) {
        this.addressToDelete = address
        this.dialogDeleteConfirm = true
      },

      deleteAddress (id) {
        axios.delete('users/addresses/' + id)
          .then(res => {
            this.dialogDeleteConfirm = false
            this.getAddresses()
            this.$store.dispatch('notification/message', res.data.message)
          })
      },

      addAddress () {
        axios.post('users/' + this.$route.params.id + '/addresses/store')
          .then(res => {
            this.getAddresses()
            this.$store.dispatch('notification/message', res.data.message)
          })
      }
    },
    mounted () {
      this.getAddresses()
      this.getZones()
    }
  }
</script>

<style scoped>

</style>
