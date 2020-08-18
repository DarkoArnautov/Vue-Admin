<template>
  <div v-if="$store.state.auth.permissions.users.includes('R')" style="width: 100%">
    <v-layout row>
      <v-flex xs12>
        <md-card>
          <md-card-header class="md-card-header-text md-card-header-green">
            <div class="card-text md-size-50" style="width: 100%">
              <div class="md-layout">
                <div class="md-layout-item md-xsmall-size-100 md-small-size-50">
                  <h4 class="title">Individuals</h4>
                </div>
                <div class="md-layout-item md-xsmall-size-100 md-small-size-50 btn-area">
                  <v-dialog v-model="dialog" max-width="500px" v-if="$store.state.auth.permissions.users.includes('C')">
                    <template v-slot:activator="{ on }">
                      <md-button v-on="on" class="md-primary md-sm" text>Add Individual</md-button>
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
                                <v-autocomplete v-model="editedItem.company_id"
                                                :items="itemsCompanies"
                                                item-text="name"
                                                item-value="id"
                                                label="Company"
                                                prepend-icon="fas fa-building"
                                ></v-autocomplete>
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
            </div>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100">
                <v-text-field
                    v-model="search"
                    class="mx-3"
                    flat
                    label="Search"
                    prepend-inner-icon="search"
                    clearable style="padding-top: 25px;" />
                <v-container grid-list-md fluid>
                  <v-layout row wrap>
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
                      <v-autocomplete v-model="staticSearch.companies"
                                      :items="itemsCompanies"
                                      item-text="name"
                                      item-value="id"
                                      label="Companies"
                                      prepend-icon="fas fa-building"
                                      hide-no-data
                                      multiple
                                      clearable
                      ></v-autocomplete>
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
              </div>
            </div>
            <v-data-table
                :headers="headers"
                :items="users"
                :server-items-length="total"
                :footer-props="pageFooter"
                :options.sync="pagination"
                :loading="loading"
                hide-default-header
                class="elevation-1 mobile-responsive-table" >
              <template v-slot:header="{ props: { headers } }" v-if="$vuetify.breakpoint.mdAndUp">
                <tr>
                  <th
                      v-for="header in headers"
                      :key="header.text"
                      :class="header.class + ' ma-0 pa-1 text-xs-center'">
                    <div style="width: 100%; text-align: center">
                      <v-tooltip bottom v-if="header.icon">
                        <template v-slot:activator="{ on }">
                          <span v-on="on"><v-icon>{{header.icon}}</v-icon></span>
                        </template>
                        <span>{{ header.text }}</span>
                      </v-tooltip>
                      <v-tooltip bottom v-else-if="header.img">
                        <template v-slot:activator="{ on }">
                          <img v-on="on" :src="header.img" height="24" width="24"
                              position="center center"/>
                        </template>
                        <span>{{ header.text }}</span>
                      </v-tooltip>
                      <span v-else>{{ header.text }}</span>
                    </div>
                  </th>
                </tr>
              </template>
              <template v-slot:item="props">
                  <tr v-if="$vuetify.breakpoint.mdAndUp">
                    <td>
                      <a :href="'/home/individuals/view/' + props.item.id"
                        v-if="$store.state.auth.permissions.users.includes('U') && $store.state.auth.permissions.users.includes('R')">{{ props.item.name }}</a>
                      <span v-else>{{ props.item.name }}</span>
                    </td>
                    <td class="ma-0 pa-0" style="width: 80px">
                      <v-checkbox @click="toggleStatus(props.item)" v-model="props.item.active"
                                  :disabled="props.item.id === -1 || !$store.state.auth.permissions.users.includes('U')"
                                  hide-details style="margin: 0 auto; width: 32px" />
                    </td>
                    <td class="ma-0 pa-0" style="width: 80px">
                      <v-checkbox v-model="props.item.resource_provider" readonly
                                  hide-details style="margin: 0 auto; width: 32px"/>
                    </td>
                    <td>
                      <v-btn v-if="props.item.company" :color="props.item.company.active ? '' : 'error'"
                            outlined block small
                            :to="'/home/companies/view/' + props.item.company.id">{{ props.item.company.name }}
                      </v-btn>
                    </td>
                    <td><b>{{ props.item.roles.length ? props.item.roles.join(',') : 'None' }}</b></td>
                    <td><b>{{ props.item.email && props.item.email.trim() ? props.item.email : ' / '}}</b></td>
                    <td><b>{{ props.item.mobile_number && props.item.mobile_number.trim() ? props.item.mobile_number : ' / '}}</b></td>
                  </tr>
                  <tr v-else>
                    <td>
                      <ul class="responsive-table-content">
                        <li class="responsive-table-item p100" :data-label="headers[0].text">
                          <a :href="'/home/individuals/view/' + props.item.id"
                            v-if="$store.state.auth.permissions.users.includes('U') && $store.state.auth.permissions.users.includes('R')">{{ props.item.name }}</a>
                          <span v-else>{{ props.item.name }}</span>
                        </li>
                        <li class="responsive-table-item p50" :data-label="headers[1].ellipse">
                          <v-checkbox @click="toggleStatus(props.item)" v-model="props.item.active"
                                  :disabled="props.item.id === -1 || !$store.state.auth.permissions.users.includes('U')"
                                  hide-details style="margin: 0 auto; width: 32px" />
                        </li>
                        <li class="responsive-table-item p50" :data-label="headers[2].text">
                          <v-checkbox v-model="props.item.resource_provider" readonly
                                  hide-details style="margin: 0 auto; width: 32px"/>
                        </li>
                        <li class="responsive-table-item p50" :data-label="headers[3].text">
                          <v-btn v-if="props.item.company" :color="props.item.company.active ? '' : 'error'"
                                outlined block small
                                :to="'/home/companies/view/' + props.item.company.id">{{ props.item.company.name }}
                          </v-btn>
                        </li>
                        <li class="responsive-table-item p50" :data-label="headers[4].text">
                          {{ props.item.roles.length ? props.item.roles.join(',') : 'None' }}
                        </li>
                        <li class="responsive-table-item p100" :data-label="headers[5].text">
                          {{ props.item.email && props.item.email.trim() ? props.item.email : ' / '}}
                        </li>
                        <li class="responsive-table-item p100" :data-label="headers[6].text">
                          {{ props.item.mobile_number && props.item.mobile_number.trim() ? props.item.mobile_number : ' / '}}
                        </li>
                      </ul>
                    </td>
                  </tr>
              </template>
            </v-data-table>
          </md-card-content>
        </md-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'IndividualsIndex',
    layout: 'home',
    data () {
      return {
        dialog: false,
        loading: true,
        alert: null,
        users: [],
        search: '',
        staticSearch: {
          active: -1,
          companies: [],
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
          itemsPerPage: 5
        },
        pageFooter: {
          "items-per-page-options": [5, 10, 20, 50, 100]
        },
        headers: [
          { text: 'Name', sortable: false, value: 'name' },
          { text: 'This user is associated with a plan holder DJS provides SMFF coverage for.', ellipse: "SMFF coverage?", sortable: false, value: 'active', img: '/images/DJS-Square.png' },
          { text: 'Resource Provider?', sortable: false, value: 'resource_provider', icon: 'fas fa-hard-hat' },
          { text: 'Company', sortable: false, value: 'companies' },
          { text: 'Role', sortable: false, value: 'role' },
          { text: 'Email', sortable: false, value: 'email' },
          { text: 'Mobile Number', sortable: false, value: 'mobile_number' },
        ],
        editedIndex: -1,
        editedItem: {
          valid: true,
          first_name: '',
          last_name: '',
          username: null,
          email: null,
          company_id: null,
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
          company_id: null,
          roles: [],
          password: null,
          password_confirmation: null,
          active: true
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
          axios.post(`users-filter?query=${this.search}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.users = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }

        // get by sort option
        if (this.pagination.sortBy && this.pagination.sortBy.length > 0 && !this.search) {
          const direction = this.pagination.descending ? 'desc' : 'asc'
          axios.post(`users-order?direction=${direction}&sortBy=${this.pagination.sortBy}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.loading = false
              this.users = res.data.data
              this.total = res.data.meta.total
            })
        }
        if (!this.search && (!this.pagination.sortBy || this.pagination.sortBy.length === 0)) {
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
        this.$root.$confirm('Warning', `You are about to delete the individual <b>${item.name}</b>. Are you sure that you want to proceed with this action?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.delete('users/' + item.id + '/destroy')
              .then(res => {
                this.getDataFromApi()
                this.$store.dispatch('notification/message', { message: res.data.message })
              })
          }
        })
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
              this.$store.dispatch('notification/message', { message: res.data.message })
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

      toggleStatus (user) {
        var id = this.users.indexOf(user)
        if(id < 0)  return 
        this.$root.$confirm('Warning', `<b>${this.users[id].name}</b> status will be changed to DJS <b>${this.users[id].active ? 'Inactive' : 'Active'}</b>. Are you sure that you want to change this setting?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.post('users/' + this.users[id].id + '/toggleStatus')
              .then(res => {
                this.users[id].active = !this.users[id].active
                this.$store.dispatch('notification/message', { message: res.data.message })
              })
          }
        })
      }
    },
    mounted () {
      this.getCompanies()
      this.getRoles()
    }
  }
</script>

<style scoped>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  #mobile-table td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  #mobile-table tr:nth-child(even) {
    background-color: #dddddd;
  }
</style>
