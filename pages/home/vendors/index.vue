<template>
  <div class="md-layout" v-if="$store.state.auth.permissions.vendors.includes('R')">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">Vendors</h4>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 btn-area">
              <v-dialog v-model="dialog" max-width="500px" v-if="$store.state.auth.permissions.vendors.includes('C')">
                <template v-slot:activator="{ on }">
                  <md-button v-on="on" class="mb-2 primary md-sm">Add Vendor</md-button>
                </template>
                <v-form ref="vendorAddForm" v-model="editedItem.valid" lazy-validation>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Add Vendor</span>
                    </v-card-title>

                    <v-card-text>
                      <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
                        <div v-for="(error, index) in alert.errors" v-bind:key="index">
                          {{error[0]}}
                        </div>
                      </v-alert>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm6>
                            <v-text-field v-model="editedItem.name" :rules="[v => !!v || 'Name is required']"
                                          prepend-icon="fas fa-id-badge"
                                          label="Name*" required></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field v-model="editedItem.shortname"
                                          prepend-icon="fas fa-font"
                                          label="Short Name"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-select
                                v-model="editedItem.vendor_type_id"
                                :rules="[v => !!v || 'Vendor type is required']"
                                :items="itemsVendorType"
                                item-text="name"
                                item-value="id"
                                label="Vendor Type*"
                                prepend-icon="fas fa-arrows-alt-v"
                                required
                            ></v-select>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field v-model="editedItem.phone"
                                          prepend-icon="fas fa-phone"
                                          label="Phone"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field v-model="editedItem.fax"
                                          prepend-icon="fas fa-fax"
                                          label="Fax"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field v-model="editedItem.company_email"
                                          prepend-icon="fas fa-envelope"
                                          label="Company E-mail" type="email"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field v-model="editedItem.address"
                                          prepend-icon="fas fa-map-marked"
                                          label="Address"></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-container>
                      <small>*indicates required field</small>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save" :disabled="!editedItem.valid">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
            </div>
          </div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-container grid-list-md fluid>
            <v-layout row wrap>
              <v-flex xs12 sm6 d-flex>
                <v-text-field
                  v-model="search"
                  class="mx-3"
                  flat
                  label="Search"
                  prepend-inner-icon="search"
                  clearable/>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-select v-model="staticSearch.type"
                          :items="itemsVendorTypeSearch"
                          item-text="name"
                          item-value="id"
                          label="Type"
                          prepend-icon="fas fa-arrows-alt-v"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <v-data-table
              :headers="headers"
              :items="vendors"
              :server-items-length="total"
              :footer-props="pageFooter"
              :options.sync="pagination"
              :loading="loading"
              :hide-default-header="!$vuetify.breakpoint.mdAndUp"
              class="elevation-1 mobile-responsive-table" >
            <template v-slot:item="props">
              <tr v-if="$vuetify.breakpoint.mdAndUp">
                <td>{{ props.item.shortname }}</td>
                <td class="text-xs-center">{{ props.item.name }}</td>
                <td class="text-xs-center">{{ props.item.type }}</td>
                <td class="text-xs-center">{{ props.item.vessels_count }}</td>
                <td class="justify-center layout px-0">
                  <v-btn text icon nuxt :to="'/home/vendors/view/'+props.item.id"
                        :disabled="!$store.state.auth.permissions.vendors.includes('U')">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn text icon @click="deleteItem(props.item)"
                        :disabled="!$store.state.auth.permissions.vendors.includes('D') || true">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr v-else>
                <td>
                  <ul class="responsive-table-content">
                    <li class="responsive-table-item p100" :data-label="headers[0].text">
                      {{ props.item.shortname }}
                    </li>
                    <li class="responsive-table-item p100" :data-label="headers[1].text">
                      {{ props.item.name }}
                    </li>
                    <li class="responsive-table-item p100" :data-label="headers[2].text">
                      {{ props.item.type }}
                    </li>
                    <li class="responsive-table-item p30" :data-label="headers[3].text">
                      {{ props.item.vessels_count }}
                    </li>
                    <li class="responsive-table-item p70" :data-label="headers[4].text">
                      <v-btn text icon nuxt :to="'/home/vendors/view/'+props.item.id"
                            :disabled="!$store.state.auth.permissions.vendors.includes('U')">
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <v-btn text icon @click="deleteItem(props.item)"
                            :disabled="!$store.state.auth.permissions.vendors.includes('D') || true">
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </li>
                  </ul>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-snackbar v-model="snackbar.active" bottom right>{{snackbar.message}}
            <v-btn text @click="snackbar.active = false" color="error">Close</v-btn>
          </v-snackbar>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'index',
    layout: 'home',
    data () {
      return {
        dialog: false,
        loading: true,
        alert: null,
        snackbar: {
          active: false,
          message: ''
        },
        vendors: [],
        search: '',
        staticSearch: {
          type: -1
        },
        itemsVendorType: [],
        itemsVendorTypeSearch: [],
        total: 0,
        pagination: {
          itemsPerPage: 5,
          sortBy: ['name']
        },
        pageFooter: {
          "items-per-page-options": [5, 10, 20, 50, 100]
        },
        headers: [
          {
            text: 'Short Name/Abbreviation',
            align: 'center',
            sortable: true,
            value: 'shortname'
          },
          { text: 'Full Name', sortable: true, value: 'name' },
          { text: 'Vendor Type', sortable: false, value: 'type' },
          { text: 'Vessels', sortable: false, value: 'vessels_count' },
          { text: 'Actions', sortable: false }
        ],
        editedIndex: -1,
        editedItem: {
          valid: true,
          name: '',
          shortname: '',
          vendor_type_id: null,
          phone: null,
          fax: null,
          company_email: null,
          address: null
        },
        defaultItem: {
          valid: true,
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
      dialog (val) {
        val || this.close()
      },
      pagination: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
      search () {
        this.getDataFromApi()
      },
      staticSearch: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      }
    },
    computed: {},
    methods: {
      getDataFromApi () {
        this.loading = true
        // get by search keyword
        if (this.search) {
          axios.post(`vendors-filter?query=${this.search}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.vendors = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
        // get by sort option
        if (this.pagination.sortBy && this.pagination.sortBy.length && !this.search) {
          const direction = this.pagination.descending ? 'desc' : 'asc'
          axios.post(`vendors-order?direction=${direction}&sortBy=${this.pagination.sortBy}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.loading = false
              this.vendors = res.data.data
              this.total = res.data.meta.total
            })
        }
        if (!this.search && (!this.pagination.sortBy || this.pagination.sortBy.length === 0)) {
          axios.post(`vendors?page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.vendors = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
      },

      getVendorType () {
        axios.get('vendors/types')
          .then(res => {
            this.itemsVendorType = res.data.data
            this.itemsVendorTypeSearch = res.data.data.slice()
            this.itemsVendorTypeSearch.unshift({ id: -1, name: 'All' })
          })
      },

      deleteItem (item) {
        if (confirm('Are you sure that you want to delete this vendor?')) {
          axios.delete('vendors/' + item.id + '/destroy')
            .then(res => {
              this.getDataFromApi()
              this.snackbar = { active: true, message: res.data.message }
            })
        }
      },

      close () {
        this.dialog = false
        this.$refs.vendorAddForm.resetValidation()
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },

      save () {
        this.alert = null
        if (this.$refs.vendorAddForm.validate()) {
          axios.post('vendors/create', this.editedItem)
            .then(res => {
              this.getDataFromApi()
              this.close()
              this.snackbar = { active: true, message: res.data.message }
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
      }
    },
    mounted () {
      this.getVendorType()
    }
  }
</script>

<style scoped>

</style>
