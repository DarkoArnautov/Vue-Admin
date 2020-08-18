<template>
  <div v-if="$store.state.auth.permissions.fleets.includes('R')" style="width: 100%">
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
        <md-card>
          <md-card-header>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100">
                <h4 class="title">Fleets</h4>
              </div>
            </div>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100 btn-area">
                <v-dialog v-model="dialog" max-width="500px" v-if="$store.state.auth.permissions.fleets.includes('C')">
                  <template v-slot:activator="{ on }">
                    <md-button v-on="on" class="mb-2 primary md-sm">Add Fleet</md-button>
                  </template>
                  <v-form ref="fleetAddForm" v-model="editedItem.valid" lazy-validation>
                    <v-card>
                      <v-card-title class="headline grey lighten-2" primary-title>
                        <span class="headline">Add Fleet</span>
                      </v-card-title>

                      <v-card-text>
                        <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
                          <div v-for="(error, index) in alert.errors" v-bind:key="index">
                            {{error[0]}}
                          </div>
                        </v-alert>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12 sm12>
                              <v-text-field v-model="editedItem.name" :rules="[v => !!v || 'Fleet Name is required']"
                                            prepend-icon="fas fa-edit"
                                            label="Name*" required></v-text-field>
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
            <v-text-field
                v-model="search"
                class="mx-3"
                flat
                label="Search"
                prepend-inner-icon="search"
                clearable style="padding-top: 25px;" />
            <v-data-table
                :headers="headers"
                :items="fleets"
                :server-items-length="total"
                :footer-props="pageFooter"
                :options.sync="pagination"
                :loading="loading"
                :hide-default-header="!$vuetify.breakpoint.mdAndUp"
                class="elevation-1 mobile-responsive-table">
              <template v-slot:item="props">
                <tr v-if="$vuetify.breakpoint.mdAndUp">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-center">{{ props.item.vessels_count }}</td>
                  <td class="justify-center layout px-0">
                    <v-btn text icon nuxt :to="'/home/fleets/view/'+props.item.id"
                          :disabled="!$store.state.auth.permissions.fleets.includes('U')">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn text icon @click="confirmDelete(props.item)"
                          :disabled="props.item.internal || !$store.state.auth.permissions.fleets.includes('D')">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr v-else>
                  <td>
                    <ul class="responsive-table-content">
                      <li class="responsive-table-item p100" :data-label="headers[0].text">
                        {{ props.item.name }}
                      </li>
                      <li class="responsive-table-item p100" :data-label="headers[1].text">
                        {{ props.item.vessels_count }}
                      </li>
                      <li class="responsive-table-item p100" :data-label="headers[2].text">
                        <v-btn text icon nuxt :to="'/home/fleets/view/'+props.item.id"
                              :disabled="!$store.state.auth.permissions.fleets.includes('U')">
                          <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn text icon @click="confirmDelete(props.item)"
                              :disabled="props.item.internal || !$store.state.auth.permissions.fleets.includes('D')">
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
            <v-dialog v-model="dialogDeleteConfirm" width="500" >
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title >
                  You are about to DELETE a Fleet.
                </v-card-title>
                <v-card-text>
                  Please confirm that you would like to DELETE this Fleet, <b>{{deleteItem.name}}</b>.
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogDeleteConfirm = false" >
                    Cancel
                  </v-btn>
                  <v-btn color="primary" text @click="deleteFleet()" >
                    Delete Fleet
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </md-card-content>
        </md-card>
      </div>
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
        dialogDeleteConfirm: false,
        loading: true,
        alert: null,
        snackbar: {
          active: false,
          message: ''
        },
        fleets: [],
        search: '',
        staticSearch: {
          internal: -1
        },
        total: 0,
        pagination: {
          itemsPerPage: 20
        },
        pageFooter: {
          "items-per-page-options": [5, 10, 20, 50, 100]
        },
        headers: [
          { text: 'Name', sortable: true, value: 'name' },
          { text: 'Vessels', sortable: false, align: 'center', value: 'vessels_count' },
          { text: 'Actions', sortable: false, align: 'center' }
        ],
        editedIndex: -1,
        editedItem: {
          valid: true,
          name: ''
        },
        defaultItem: {
          valid: true,
          name: ''
        },
        deleteItem: {
          id: null,
          name: null
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
          axios.post(`fleets-filter?query=${this.search}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.fleets = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
        // get by sort option
        if (this.pagination.sortBy && !this.search) {
          const direction = this.pagination.descending ? 'desc' : 'asc'
          axios.post(`fleets-order?direction=${direction}&sortBy=${this.pagination.sortBy}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.loading = false
              this.fleets = res.data.data
              this.total = res.data.meta.total
            })
        }
        if (!this.search && !this.pagination.sortBy) {
          axios.post(`fleets?page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.fleets = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
      },

      deleteFleet () {
        axios.delete('fleets/' + this.deleteItem.id + '/destroy')
          .then(res => {
            this.getDataFromApi()
            this.snackbar = { active: true, message: res.data.message }
          })
        this.dialogDeleteConfirm = false
      },

      close () {
        this.dialog = false
        this.$refs.fleetAddForm.resetValidation()
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },

      save () {
        this.alert = null
        if (this.$refs.fleetAddForm.validate()) {
          axios.post('fleets/create', this.editedItem)
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
      },

      confirmDelete (item) {
        this.deleteItem = item
        this.dialogDeleteConfirm = true
      }
    }
  }
</script>
