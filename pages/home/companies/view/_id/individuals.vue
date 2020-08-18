<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">Individuals</h4>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 btn-area">
              <v-dialog v-model="dialog" max-width="500px" v-if="$store.state.auth.permissions.users.includes('C')">
                <template v-slot:activator="{ on }">
                  <md-button class="mb-2 primary md-sm" text v-on="on">Add Individual</md-button>
                </template>
                <v-form ref="userAddForm" v-model="editedItem.valid" lazy-validation>
                  <v-card>
                    <v-card-title class="grey lighten-5">
                      <span class="headline">Add Individual</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
                        <div v-for="(error, index) in alert.errors" v-bind:key="index">
                          {{error[0]}}
                        </div>
                      </v-alert>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm6>
                            <v-text-field v-model="editedItem.first_name"
                                          :rules="[v => !!v || 'First Name is required']"
                                          required
                                          prepend-icon="fas fa-file-signature"
                                          label="First Name"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field v-model="editedItem.last_name"
                                          prepend-icon="fas fa-file-signature"
                                          label="Last Name"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-autocomplete
                                v-model="editedItem.roles"
                                :items="itemsRoles"
                                item-text="name"
                                item-value="id"
                                label="Roles"
                                prepend-icon="fas fa-user-lock"
                                hide-no-data
                                multiple
                                clearable
                            ></v-autocomplete>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field :value="this.company.name"
                                          label="Company"
                                          prepend-icon="fas fa-building"
                                          disabled
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-checkbox
                                label="DJS SMFF Coverage"
                                v-model="editedItem.active"
                            ></v-checkbox>
                          </v-flex>
                          <template v-if="editedItem.roles.length">
                            <v-flex xs12 sm6>
                              <v-text-field v-model="editedItem.username" :rules="[v => !!v || 'Username is required']"
                                            prepend-icon="fas fa-lock"
                                            label="Login*" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                              <v-text-field v-model="editedItem.email"
                                            :rules="[ v => !!v || 'E-mail is required', v => /.+@.+/.test(v) || 'E-mail must be valid' ]"
                                            prepend-icon="fas fa-envelope"
                                            label="E-mail*" type="email" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                              <v-text-field v-model="editedItem.password"
                                            :rules="[v => !!v || 'Password is required', v => (v && v.length >= 6) || 'The password must be at least 6 characters']"
                                            label="Password*" type="password"
                                            prepend-icon="fas fa-key"
                                            required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                              <v-text-field v-model="editedItem.password_confirmation"
                                            :rules="[v => !!v || 'Please repeat the password', v => v === editedItem.password || 'The password does not match']"
                                            label="Confirm Password*"
                                            type="password"
                                            prepend-icon="fas fa-key"
                                            required></v-text-field>
                            </v-flex>
                          </template>
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
              <v-flex xs12 sm3 d-flex>
                <v-text-field v-model="search"
                              class="mx-3"
                              flat
                              label="Search"
                              prepend-inner-icon="search"
                              clearable />
              </v-flex>
              <v-flex xs12 sm3 d-flex>
                <v-select v-model="staticSearch.active"
                          :items="itemsActiveStatus"
                          item-text="option"
                          item-value="value"
                          label="DJS SMFF Coverage"
                          prepend-icon="fas fa-check"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm3 d-flex>
                <v-select v-model="staticSearch.resource_provider"
                          :items="itemsResourceProvider"
                          item-text="option"
                          item-value="value"
                          label="Resource Provider"
                          prepend-icon="fas fa-check"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm3>
                <v-autocomplete v-model="staticSearch.roles"
                                :items="itemsRoles"
                                item-text="name"
                                item-value="id"
                                label="Roles"
                                prepend-icon="fas fa-user-lock"
                                hide-no-data
                                multiple
                                clearable
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <v-data-table
              :headers="headers"
              :items="users"
              :server-items-length="total"
              :footer-props="pageFooter"
              :options.sync="pagination"
              :loading="loading"
              class="elevation-1" >
            <template v-slot:item="props">
              
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.email }}</td>
              <td>
                <v-btn v-if="props.item.company" :color="props.item.company.active ? '' : 'error'"
                      outlined
                      block
                      small
                      :to="'/home/companies/view/'+props.item.company.id"
                      :disabled="!$store.state.auth.permissions.companies.includes('R') && !$store.state.auth.permissions.companies.includes('U')">
                  {{props.item.company.name}}
                </v-btn>
              </td>
              <td>
                <v-btn :color="props.item.resource_provider ? 'primary':'error'" small depressed rounded>
                  {{props.item.resource_provider?
                  'Provider':'Non-provider'}}
                </v-btn>
              </td>
              <td>
                <v-btn :color="props.item.active ? 'primary':'error'" small depressed rounded
                      @click="toggleStatus(props.item)"
                      :disabled="!$store.state.auth.permissions.companies.includes('U')">{{props.item.active?
                  'Active':'Inactive'}}
                </v-btn>
              </td>
              <td>
                <v-btn text icon :to="'/home/individuals/view/'+props.item.id"
                      :disabled="!$store.state.auth.permissions.users.includes('U') || !$store.state.auth.permissions.users.includes('R')">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn text icon @click="deleteItem(props.item)"
                      :disabled="!$store.state.auth.permissions.users.includes('U')">
                  <v-icon>delete</v-icon>
                </v-btn>
              </td>
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
    name: 'individuals',
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
        users: [],
        search: '',
        staticSearch: {
          active: -1,
          companies: [this.$route.params.id],
          roles: [],
          resource_provider: -1
        },
        itemsActiveStatus: [
          { option: 'All', value: -1 },
          { option: 'Active', value: 1 },
          { option: 'Inactive', value: 0 }
        ],
        itemsResourceProvider: [
          { option: 'All', value: -1 },
          { option: 'Provider', value: 1 },
          { option: 'Non-provider', value: 0 }
        ],
        itemsCompanies: [],
        itemsRoles: [],
        total: 0,
        pagination: {
          itemsPerPage: 5,
          sortBy: ['name']
        },
        pageFooter: {
          "items-per-page-options": [5, 10, 20, 50, 100]
        },
        headers: [
          // {
          //   text: 'Login',
          //   align: 'center',
          //   sortable: true,
          //   value: 'username'
          // },
          { text: 'Name', sortable: false, value: 'name' },
          { text: 'E-mail', value: 'email' },
          { text: 'Company', sortable: false, value: 'companies' },
          { text: 'Resource Provider', sortable: false, value: 'resource_provider' },
          { text: 'DJS SMFF Coverage', value: 'active' },
          { text: 'Actions', sortable: false, value: 'username' }
        ],
        editedIndex: -1,
        editedItem: {
          valid: true,
          first_name: '',
          last_name: '',
          username: null,
          email: null,
          company_id: this.$route.params.id,
          roles: [],
          password: null,
          password_confirmation: null,
          active: true
        },
        defaultItem: {
          valid: true,
          first_name: '',
          last_name: '',
          username: null,
          email: null,
          company_id: this.$route.params.id,
          roles: [],
          password: null,
          password_confirmation: null,
          active: true
        },
        company: {
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
      getCompanyDataApi () {
        this.standBy = true
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.company = res.data.data[0]
          })
      },

      getDataFromApi () {
        this.loading = true
        // get by search keyword
        if (this.search) {
          axios.post(`users-filter?query=${this.search}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.users = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
        // get by sort option
        if (this.pagination.sortBy && !this.search) {
          const direction = this.pagination.descending ? 'desc' : 'asc'
          axios.post(`users-order?direction=${direction}&sortBy=${this.pagination.sortBy}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.loading = false
              this.users = res.data.data
              this.total = res.data.meta.total
            })
        }
        if (!this.search && !this.pagination.sortBy) {
          axios.post(`users?page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.users = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
      },

      getCompanies () {
        axios.get('companies/short')
          .then(res => {
            this.itemsCompanies = res.data.data
          })
      },

      getRoles () {
        axios.get('roles')
          .then(res => {
            this.itemsRoles = res.data.data
          })
      },

      deleteItem (item) {
        if (confirm('Are you sure that you want to delete this user?')) {
          axios.delete('users/' + item.id + '/destroy')
            .then(res => {
              this.getDataFromApi()
              this.snackbar = { active: true, message: res.data.message }
            })
        }
      },

      close () {
        this.dialog = false
        this.$refs.userAddForm.resetValidation()
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },

      save () {
        this.alert = null
        if (this.$refs.userAddForm.validate()) {
          axios.post('users/create', this.editedItem)
            .then(res => {
              // this.getDataFromApi()
              this.close()
              this.snackbar = { active: true, message: res.data.message }
              this.$router.push('/home/individuals/view/' + res.data.id)
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

      toggleStatus (item) {
        var id = this.users.indexOf(item)
        if(id < 0)  return 
        axios.post('users/' + this.users[id].id + '/toggleStatus')
          .then(res => {
            this.users[id].active = !this.users[id].active
            this.snackbar = { active: true, message: res.data.message }
          })
      }
    },
    mounted () {
      this.getCompanyDataApi()
      this.getCompanies()
      this.getRoles()
    }
  }
</script>

<style scoped>

</style>
