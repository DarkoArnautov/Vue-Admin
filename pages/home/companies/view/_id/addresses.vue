<template>
  <div>
    <nav-tabs-card>
      <template slot="content">
        <span class="md-nav-tabs-title" style="margin-left: 7px;">Address:</span>
        <md-tabs class="md-rose" md-alignment="left" md-active-tab="tab-0">
          <md-tab v-for="(addressType, index) in itemsAddresses" :md-label="addressType.name" :id="'tab-' + index" v-bind:key="addressType.id">
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100 btn-area" align="center" style="padding: 0 0 15px 0;">
                <v-btn class="primary md-sm" small depressed @click.stop="addAddress(addressType.id)"
                       :disabled="!$store.state.auth.permissions.companies.includes('U')">Add Address
                </v-btn>
              </div>
            </div>

            <v-data-table :items="addressType.addresses" hide-default-footer hide-default-header>
              <template v-slot:item="props">
                <tr style="padding: 10px 0">
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
                        <v-text-field label="Zip" v-model="props.item.zip" hide-details></v-text-field>
                      </v-flex>
                      <v-flex>
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
                        <v-btn class="info" text small block @click="showAddressFormat(props.item)"
                              :disabled="!$store.state.auth.permissions.companies.includes('R')">
                          Document Format
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </td>
                </tr>
              </template>
              <template v-slot:no-data>
                <div class="alert alert-warning">
                  <span>No Addresses Defined</span>
                </div>
              </template>
            </v-data-table>
          </md-tab>
        </md-tabs>
      </template>
    </nav-tabs-card>
    <v-dialog v-model="standBy" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
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
          <v-btn color="primary" text @click="deleteAddress(addressToDelete.id)">Delete Address</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogFormAddress" max-width="400">
      <v-card>
        <v-card-title class="headline">Document Address</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-textarea label="Document address format" v-model="dialogFormAddressItem.document_format" />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogFormAddress = false" >Close</v-btn>

          <v-btn color="green darken-1" text @click="saveAddressFormat" >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        standBy: true,
        dialogDeleteConfirm: false,
        dialogFormAddress: false,
        dialogFormAddressItem: {
          id: null,
          document_format: null
        },
        alert: null,
        itemsAddressTypes: [],
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

      getAddressTypes () {
        axios.get('address/types')
          .then(res => {
            this.itemsAddressTypes = res.data.data
          })
      },

      getAddresses () {
        axios.get('companies/' + this.$route.params.id + '/addresses')
          .then(res => {
            this.itemsAddresses = res.data
            this.standBy = false
          })
      },

      saveAddress (address) {
        axios.post('companies/addresses/' + address.id, { address: address })
          .then(res => {
            this.getAddresses()
            this.$store.dispatch('notification/message', {
              message: res.data.message
            })
          })
      },

      deleteAddressConfirm (address) {
        this.addressToDelete = address
        this.dialogDeleteConfirm = true
      },

      deleteAddress (id) {
        axios.delete('companies/addresses/' + id)
          .then(res => {
            this.dialogDeleteConfirm = false
            this.getAddresses()
            this.$store.dispatch('notification/message', {
              message: res.data.message
            })
          })
      },

      addAddress (typeId) {
        axios.post('companies/' + this.$route.params.id + '/addresses/store', { type_id: typeId })
          .then(res => {
            this.getAddresses()
            this.$store.dispatch('notification/message', {
              message: res.data.message
            })
          })
      },

      showAddressFormat (address) {
        if (!address.document_format) {
          if (address.street) {
            address.document_format = address.street
          }
          if (address.unit) {
            address.document_format += ', ' + address.unit
          }
          address.document_format += '\n'
          if (address.city) {
            address.document_format += address.city
          }
          if (address.province) {
            address.document_format += ', '+ address.province
          }
          if (address.zip) {
            address.document_format += ', '+ address.zip
          }
          address.document_format += '\n'
          if (address.country) {
            address.document_format += address.country
          }
        }
        this.dialogFormAddressItem = address
        this.dialogFormAddress = true
      },

      saveAddressFormat () {
        this.saveAddress(this.dialogFormAddressItem)
        this.dialogFormAddress = false
      }
    },
    mounted () {
      this.getAddresses()
      this.getAddressTypes()
      this.getZones()
    }
  }
</script>

<style scoped>

</style>
