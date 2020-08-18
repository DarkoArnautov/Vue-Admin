<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100 md-small-size-100 md-medium-size-100 md-large-size-100" style="padding: 0">
        <md-card>
          <md-card-header>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100">
                <h4 class="title">Individual Information</h4>
              </div>
            </div>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100 btn-area">
                <md-button class="md-primary md-sm" @click="action" :disabled="!$store.state.auth.permissions.users.includes('U')">
                  <v-icon>{{edit ? 'fas fa-save' : 'fas fa-edit'}}</v-icon>
                  <md-tooltip>{{edit ? 'Save Edits' : 'Edit Mode'}}</md-tooltip>
                </md-button>

                <md-button class="md-danger" @click="deleteItem()" :disabled="!$store.state.auth.permissions.users.includes('D')">
                  <v-icon>delete</v-icon>
                  <md-tooltip>Delete User</md-tooltip>
                </md-button>
              </div>
            </div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content :class="edit ? 'red lighten-5' : 'grey lighten-5'">
            <v-form ref="userEditForm" v-model="valid" lazy-validation>
              <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
                <div v-for="(error, i) in alert.errors" :key="i">{{error[0]}}</div>
              </v-alert>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user.title" :readonly="!edit"
                                prepend-icon="fas fa-file-signature"
                                label="Title"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user.first_name" :readonly="!edit"
                                prepend-icon="fas fa-file-signature"
                                label="First Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user.last_name" :readonly="!edit"
                                prepend-icon="fas fa-file-signature"
                                label="Last Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user.suffix" :readonly="!edit"
                                prepend-icon="fas fa-file-signature"
                                label="Suffix"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user.home_number" :readonly="!edit"
                                prepend-icon="fas fa-file-signature"
                                label="Home Number"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user.mobile_number" :readonly="!edit"
                                prepend-icon="fas fa-file-signature"
                                label="Mobile Number"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user.occupation" :readonly="!edit"
                                prepend-icon="fas fa-file-signature"
                                label="Occupation"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-autocomplete
                      :readonly="!edit"
                      v-model="user.role_ids"
                      :items="itemsRoles"
                      item-text="name"
                      item-value="id"
                      label="User Roles"
                      prepend-icon="fas fa-user-lock"
                      hide-no-data
                      multiple
                      :clearable="edit"
                      hide-details
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-autocomplete
                      :readonly="!edit"
                      v-model="user.company"
                      :items="itemsCompanies"
                      item-text="name"
                      item-value="id"
                      label="Company"
                      prepend-icon="fas fa-building"
                      hide-no-data
                      hide-selected
                      :clearable="edit"
                      hide-details
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user.resume_link" :readonly="!edit"
                                prepend-icon="fas fa-file-signature"
                                label="Resume Link"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea :label="'About ' + user.first_name + ' ' + user.last_name" v-model="user.description"
                              :disabled="!edit"></v-textarea>
                </v-flex>
                <template v-if="user.role_ids.length">
                  <v-flex xs12 sm6>
                    <v-text-field v-model="user.username" :rules="[v => !!v || 'Username is required']"
                                  :readonly="!edit"
                                  prepend-icon="fas fa-lock"
                                  label="Login*" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="user.email" :readonly="!edit"
                                  :rules="[ v => !!v || 'E-mail is required', v => /.+@.+/.test(v) || 'E-mail must be valid' ]"
                                  prepend-icon="fas fa-envelope"
                                  label="E-mail*" type="email" required></v-text-field>
                  </v-flex>
                </template>
                <v-flex xs12>
                  <v-checkbox :readonly="!edit"
                              label="DJS SMFF Coverage"
                              v-model="user.active"
                              hide-details
                  ></v-checkbox>
                </v-flex>
                <v-flex xs12 sm6 v-if="user.role_ids.length">
                  <v-btn block depressed @click="user_password.change = !user_password.change" :disabled="!edit">
                    <v-icon>{{user_password.change ? 'lock_open' : 'lock'}}</v-icon>
                    Change Password
                  </v-btn>
                </v-flex>
                <v-flex xs12 sm6 v-if="user.role_ids.length">
                  <v-btn block depressed @click="passwordReset" :disabled="!edit"
                         v-if="$store.state.auth.roles.includes('ADMIN')">
                    <v-icon>email</v-icon>
                    Send Reset E-mail
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
            <v-form ref="userEditPasswordForm" v-model="user_password.valid" lazy-validation
                    v-show="user_password.change">
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user_password.password" :disabled="!edit"
                                :rules="[v => !!v || 'Password is required', v => (v && v.length >= 6) || 'The password must be at least 6 characters']"
                                label="New Password*" type="password"
                                prepend-icon="fas fa-key"
                                required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="user_password.password_confirmation" :disabled="!edit"
                                :rules="[v => !!v || 'Please repeat the password', v => v === user_password.password || 'The password does not match']"
                                label="Confirm Password*"
                                type="password"
                                prepend-icon="fas fa-key"
                                required></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
            <small>*indicates required field</small>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100 md-small-size-100 md-medium-size-100 md-large-size-100" style="padding: 0; margin-bottom: 30px">
        <v-card>
          <v-card-title>
            <div class="title">Companies this user has direct access to</div>
            <v-spacer></v-spacer>
            <v-btn icon class="primary" :disabled="!$store.state.auth.permissions.users.includes('U')">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-alert :value="true" type="info" v-if="user.roles.some(e => e.code === 'ADMIN')">
              User has access to all companies.
            </v-alert>
            <v-data-table v-else :headers="companyTableHeaders" :items="user.companies" class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td>
                  <v-btn :color="props.item.active ? 'primary':'error'" small depressed rounded
                         @click="toggleCompanyStatus(props.item.id)"
                         :disabled="!$store.state.auth.permissions.users.includes('U')">{{props.item.active?
                    'Active':'Inactive'}}
                  </v-btn>
                </td>
                <td>{{ props.item.location }}</td>
              </template>
              <template slot="no-data">
                <v-alert :value="true" color="error" icon="warning">
                  User has access to no companies.
                </v-alert>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100 md-small-size-100 md-medium-size-100 md-large-size-100" style="padding: 0;margin-bottom: 30px">
        <v-card>
          <v-card-title>
            <div class="title">Effective Companies this user has access to (including operated companies)</div>
          </v-card-title>
          <v-card-text>
            <v-data-table
                :headers="effectiveCompanyTableHeaders"
                :items="effectiveCompaniesTable"
                class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.parent }}</td>
                <td>{{ props.item.name }}</td>
                <td>
                  <v-btn :color="props.item.active ? 'primary':'error'" small depressed rounded
                         @click="toggleCompanyStatus(props.item.id)"
                         :disabled="!$store.state.auth.permissions.users.includes('U')">{{props.item.active?
                    'Active':'Inactive'}}
                  </v-btn>
                </td>
                <td>{{ props.item.location }}</td>
              </template>
              <template slot="no-data">
                <v-alert :value="true" color="warning" icon="warning">
                  User has no effective access to companies.
                </v-alert>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <v-dialog
        v-model="standBy"
        persistent
        width="300" >
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
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'index',
    layout: 'home',
    data () {
      return {
        standBy: true,
        saving: false,
        valid: true,
        edit: false,
        alert: null,
        effectiveCompanyTableHeaders: [{ text: 'Parent Company', value: 'name' }, {
          text: 'Company Name',
          value: 'name'
        }, {
          text: 'Active?',
          value: 'active'
        }, { text: 'Company Location', value: 'location' }],
        effectiveCompaniesTable: [],
        companyTableHeaders: [{ text: 'Company Name', value: 'name' }, {
          text: 'Active?',
          value: 'active'
        }, { text: 'Company Location', value: 'location' }],
        itemsRoles: [],
        itemsCompanies: [],
        original_company: null,
        user: {
          title: null,
          first_name: '',
          last_name: '',
          suffix: '',
          username: null,
          email: null,
          home_number: null,
          mobile_number: null,
          occupation: null,
          resume_link: null,
          description: null,
          roles: [],
          role_ids: [],
          company: null,
          companies: [],
          effectiveCompanies: [],
          active: true
        },
        user_password: {
          valid: true,
          change: false,
          password: null,
          password_confirmation: null
        }
      }
    },
    methods: {
      getDataFromApi () {
        this.standBy = true
        axios.get('users/' + this.$route.params.id)
          .then(res => {
            this.user = res.data.data[0]
            let vm = this
            this.effectiveCompaniesTable = []
            this.user.effectiveCompanies.forEach(function (item) {
              item.companies.forEach(function (item) {
                vm.effectiveCompaniesTable.push(item)
              })
            })
            this.original_company = this.user.company
            this.standBy = false
          })
      },

      action () {
        if (this.edit) {
          if (this.formIsValid()) {
            this.saving = true
            this.alert = null

            axios.post('users/' + this.$route.params.id, {
              user: this.user,
              password: this.user_password
            })
              .then(res => {
                this.user_password.change = false
                this.$refs.userEditPasswordForm.reset()
                this.$refs.userEditForm.resetValidation()
                this.saving = false
                this.$store.dispatch('notification/message', res.data.message)
                this.edit = !this.edit
                this.getDataFromApi()
                this.$root.$emit('user_updated')
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

      getRoles () {
        axios.get('roles')
          .then(res => {
            this.itemsRoles = res.data.data
          })
      },

      getCompanies () {
        axios.get('companies/short')
          .then(res => {
            this.itemsCompanies = res.data.data
          })
      },

      formIsValid () {
        if (this.$refs.userEditForm.validate()) {
          return !(this.user_password.change && !this.$refs.userEditPasswordForm.validate())
        }
        return false
      },

      toggleCompanyStatus (id) {
        axios.post('companies/' + id + '/toggleStatus')
          .then(res => {
            this.getDataFromApi()
            this.$store.dispatch('notification/message', res.data.message)
          })
      },

      deleteItem (item) {
        this.$root.$confirm('Warning', `You are about to delete the individual <b>${this.user.first_name} ${this.user.last_name}</b>. Are you sure that you want to proceed with this action?`, { color: 'warning' }).then((confirm) => {
          if (confirm && this.$route.params.id) {
            axios.delete('users/' + this.$route.params.id + '/destroy')
              .then(res => {
                this.$router.push('/home/individuals')
                this.$store.dispatch('notification/message', { message: res.data.message })
              })
          }
        })
      },

      passwordReset () {
        axios.post('users/' + this.$route.params.id + '/passwordResetEmail')
          .then(res => {
            this.$store.dispatch('notification/message', res.data.message)
          })
      }
    },
    mounted () {
      this.getRoles()
      this.getCompanies()
      this.getDataFromApi()
    }
  }
</script>

<style scoped>

</style>
