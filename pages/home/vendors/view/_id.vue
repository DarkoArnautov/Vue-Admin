<template>
  <div style="width: 100%">
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
        <md-card>
          <v-progress-linear :indeterminate="true" v-show="loading"></v-progress-linear>
          <md-card-header>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100">
                <h4 class="title">Vendor Data</h4>
              </div>
            </div>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100 btn-area">
                <md-button class="primary md-sm" @click="action"
                      :disabled="!$store.state.auth.permissions.vendors.includes('U')">
                  {{edit ? 'Save': 'Edit'}}
                </md-button>
                <md-button nuxt to="/home/vendors">Return to List</md-button>
              </div>
            </div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <v-form ref="vendorEditForm" v-model="valid" lazy-validation>
              <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
                <div v-for="(error, i) in alert.errors" :key="i">
                  {{error[0]}}
                </div>
              </v-alert>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="vendor.name" :rules="[v => !!v || 'Name is required']"
                                  prepend-icon="fas fa-id-badge"
                                  label="Name*" required
                                  :disabled="!edit"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="vendor.shortname"
                                  prepend-icon="fas fa-font"
                                  label="Short Name"
                                  :disabled="!edit"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-select
                        v-model="vendor.vendor_type_id"
                        :rules="[v => !!v || 'Vendor type is required']"
                        :items="itemsVendorType"
                        item-text="name"
                        item-value="id"
                        label="Vendor Type*"
                        prepend-icon="fas fa-arrows-alt-v"
                        required
                        :disabled="!edit"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="vendor.phone"
                                  prepend-icon="fas fa-phone"
                                  label="Phone"
                                  :disabled="!edit"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="vendor.fax"
                                  prepend-icon="fas fa-fax"
                                  label="Fax"
                                  :disabled="!edit"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="vendor.company_email"
                                  prepend-icon="fas fa-envelope"
                                  label="Company E-mail" type="email"
                                  :disabled="!edit"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="vendor.address"
                                  prepend-icon="fas fa-map-marked"
                                  label="Address"
                                  :disabled="!edit"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
            <small>*indicates required field</small>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
        <md-card>
          <md-card-header>
            <h4 class="title">Vessels associated with {{vendor.name}}</h4>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <v-layout row wrap>
              <v-flex xs12 sm4 d-flex>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                    clearable />
              </v-flex>
              <v-flex xs12 sm4 d-flex>
                <v-select v-model="staticSearch.active"
                          :items="itemsActiveStatus"
                          item-text="option"
                          item-value="value"
                          label="Active Status"
                          prepend-icon="fas fa-check"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete v-model="staticSearch.types"
                                :items="itemsVesselType"
                                item-text="name"
                                item-value="id"
                                label="Type"
                                prepend-icon="fas fa-ship"
                                hide-no-data
                                multiple
                ></v-autocomplete>
              </v-flex>
            </v-layout>
            <v-data-table
                :headers="vesselTableHeaders"
                :items="vessels"
                :server-items-length="total"
                :footer-props="pageFooter"
                :options.sync="pagination"
                :loading="loadingVessels"
                class="elevation-1 mobile-responsive-table"
                :hide-default-header="!$vuetify.breakpoint.mdAndUp">
              <template v-slot:item="props">
                <tr v-if="$vuetify.breakpoint.mdAndUp">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.imo }}</td>
                  <td>
                    <v-btn :color="props.item.company.active ? '' : 'error'"
                          outlined
                          block
                          small
                          nuxt
                          :to="'/home/companies/view/'+props.item.company.id"
                          :disabled="!$store.state.auth.permissions.companies.includes('U')">{{props.item.company.name}}
                    </v-btn>
                  </td>
                  <td>{{ props.item.type }}</td>
                  <td>
                    <v-btn :color="props.item.active ? 'primary':'error'" small depressed rounded>{{props.item.active?
                      'Active':'Inactive'}}
                    </v-btn>
                  </td>
                  <td>
                    <v-checkbox v-model="props.item.tanker" disabled></v-checkbox>
                  </td>
                </tr>
                <tr v-else>
                  <td>
                    <ul class="responsive-table-content">
                      <li class="responsive-table-item p100" :data-label="headers[0].text">
                        {{ props.item.name }}
                      </li>
                      <li class="responsive-table-item p100" :data-label="headers[1].text">
                        {{ props.item.imo }}
                      </li>
                      <li class="responsive-table-item p100" :data-label="headers[2].text">
                        <v-btn :color="props.item.company.active ? '' : 'error'"
                              outlined
                              block
                              small
                              nuxt
                              :to="'/home/companies/view/'+props.item.company.id"
                              :disabled="!$store.state.auth.permissions.companies.includes('U')">{{props.item.company.name}}
                        </v-btn>
                      </li>
                      <li class="responsive-table-item p100" :data-label="headers[3].text">
                        {{ props.item.type }}
                      </li>
                      <li class="responsive-table-item p100" :data-label="headers[4].text">
                        <v-btn :color="props.item.active ? 'primary':'error'" small depressed rounded>{{props.item.active?
                          'Active':'Inactive'}}
                        </v-btn>
                      </li>
                      <li class="responsive-table-item p100" :data-label="headers[5].text">
                        <v-checkbox v-model="props.item.tanker" disabled></v-checkbox>
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <v-snackbar v-model="snackbar.active" bottom right>{{snackbar.message}}
      <v-btn text @click="snackbar.active = false" color="error">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'id',
    layout: 'home',
    data () {
      return {
        loading: true,
        loadingVessels: true,
        saving: false,
        valid: true,
        edit: false,
        alert: null,
        snackbar: {
          active: false,
          message: ''
        },
        search: '',
        staticSearch: {
          active: -1,
          types: [],
          vendors: [this.$route.params.id]
        },
        itemsActiveStatus: [
          { option: 'All', value: -1 },
          { option: 'Active', value: 1 },
          { option: 'Inactive', value: 0 }
        ],
        itemsVesselType: [],
        vesselTableHeaders: [{ text: 'Vessel Name', value: 'name' },
          { text: 'IMO', value: 'imo' },
          { text: 'Owner', value: 'company' },
          { text: 'Vessel Type', value: 'type' },
          { text: 'Active', value: 'active' },
          { text: 'Tank Vessel', value: 'tanker' }],
        itemsVendorType: [],
        vessels: [],
        total: 0,
        pagination: {
          itemsPerPage: 20
        },
        pageFooter: {
          "items-per-page-options": [5, 10, 20, 50, 100]
        },
        vendor: {
          id: -1,
          name: '',
          shortname: '',
          vendor_type_id: null,
          phone: null,
          fax: null,
          company_email: null,
          address: null
        }
      }
    },
    watch: {
      pagination: {
        handler () {
          this.getVesselDataFromApi()
        },
        deep: true
      },
      search () {
        this.getVesselDataFromApi()
      },
      staticSearch: {
        handler () {
          this.getVesselDataFromApi()
        },
        deep: true
      }
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('vendors/' + this.$route.params.id)
          .then(res => {
            this.vendor = res.data.data[0]
            this.loading = false
          })
      },

      getVesselDataFromApi () {
        this.loadingVessels = true
        // get by search keyword
        if (this.search) {
          axios.post(`vessels-filter?query=${this.search}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.vessels = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loadingVessels = false))
        }
        // get by sort option
        if (this.pagination.sortBy && !this.search) {
          const direction = this.pagination.descending ? 'desc' : 'asc'
          axios.post(`vessels-order?direction=${direction}&sortBy=${this.pagination.sortBy}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.loadingVessels = false
              this.vessels = res.data.data
              this.total = res.data.meta.total
            })
        }
        if (!this.search && !this.pagination.sortBy) {
          axios.post(`vessels?page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.vessels = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loadingVessels = false))
        }
      },

      action () {
        if (this.edit) {
          if (this.$refs.vendorEditForm.validate()) {
            this.saving = true
            this.alert = null

            axios.post('vendors/' + this.$route.params.id, this.vendor)
              .then(res => {
                this.$refs.vendorEditForm.resetValidation()
                this.saving = false
                this.snackbar = { active: true, message: res.data.message }
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
      },

      getVendorType () {
        axios.get('vendors/types')
          .then(res => {
            this.itemsVendorType = res.data.data
          })
      },

      getVesselType () {
        axios.get('vessels/types')
          .then(res => {
            this.itemsVesselType = res.data.data
          })
      },

      toggleVesselStatus (id) {
        axios.post('vessels/' + this.vessels[id].id + '/toggleStatus')
          .then(res => {
            this.vessels[id].active = !this.vessels[id].active
            this.snackbar = { active: true, message: res.data.message }
          })
      },

      toggleVesselTanker (id) {
        axios.post('vessels/' + this.vessels[id].id + '/toggleTanker')
          .then(res => {
            this.snackbar = { active: true, message: res.data.message }
          })
      }
    },
    mounted () {
      this.getVendorType()
      this.getDataFromApi()
      this.getVesselType()
    }
  }
</script>

<style scoped>

</style>
