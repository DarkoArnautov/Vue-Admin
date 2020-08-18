<template>
  <div class="md-layout" v-if="$store.state.auth.permissions.companies.includes('C')">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">Add Company</h4>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 btn-area">
              <md-button class="grey lighten-2 md-sm" nuxt @click="$router.length ? $router.back() : $router.push('/home/companies')">
                Return Back
              </md-button>
              <md-button class="primary md-sm" dark text @click="save" :disabled="!editedItem.valid">
                <md-icon class="fas fa-save"></md-icon>
                <md-tooltip md-direction="bottom">Save</md-tooltip>
              </md-button>
            </div>
          </div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
            <div v-for="(error, index) in alert.errors" v-bind:key="index">
              {{error[0]}}
            </div>
          </v-alert>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.name" :rules="[v => !!v || 'Name is required']"
                              prepend-icon="fas fa-file-signature"
                              label="Name*" required />
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.plan_number"
                              prepend-icon="fas fa-project-diagram"
                              label="Plan Number" />
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.phone"
                              prepend-icon="fas fa-phone"
                              label="Phone" />
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.fax"
                              prepend-icon="fas fa-fax"
                              label="Fax" />
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.email"
                              :rules="[ v => !!v || 'E-mail is required', v => /.+@.+/.test(v) || 'E-mail must be valid' ]"
                              prepend-icon="fas fa-envelope"
                              label="E-mail*" type="email" required />
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete :items="itemsQI" label="QI"
                                prepend-icon="fas fa-anchor"
                                item-text="name"
                                item-value="id"
                                v-model="editedItem.qi_id" />
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete v-if="itemsCompanies.length > 0 && !$route.query.operating_company_id"
                                :items="itemsCompanies" label="Operating Company"
                                prepend-icon="fas fa-building"
                                item-text="name"
                                item-value="id"
                                v-model="editedItem.operating_company_id" />
              </v-flex>
              <v-flex xs12 sm6>
                <v-checkbox
                    label="DJS SMFF Coverage"
                    v-model="editedItem.active"
                    hide-details />
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'new',
    layout: 'home',
    data () {
      return {
        loading: true,
        alert: null,
        fab: false,
        editedItem: {
          valid: true,
          name: '',
          plan_number: null,
          email: null,
          fax: null,
          phone: null,
          notes: null,
          qi_id: null,
          operating_company_id: null,
          active: true
        },
        defaultItem: {
          valid: true,
          name: '',
          email: null,
          fax: null,
          phone: null,
          notes: null,
          qi_id: null,
          operating_company_id: null,
          active: true
        },
        itemsCompanies: [],
        itemsQI: []
      }
    },
    methods: {
      save () {
        this.alert = null
        if (this.$refs.companyAddForm.validate()) {
          axios.post('companies/create', this.editedItem)
            .then(res => {
              this.close()
              this.$store.dispatch('notification/message', {
                message: res.data.message
              })
              this.$router.push('/home/companies/view/' + res.data.id)
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

      close () {
        this.$refs.companyAddForm.resetValidation()
        this.editedItem = Object.assign({}, this.defaultItem)
      },

      getCompanies () {
        axios.get('companies/short')
          .then(res => {
            this.itemsCompanies = res.data.data
            if (this.$route.query.operating_company_id) {
              this.editedItem.operating_company_id = this.$route.query.operating_company_id
            }
          })
      },

      getQI () {
        axios.get('vendors/qi')
          .then(res => {
            this.itemsQI = res.data.data
          })
      }
    },
    mounted () {
      this.getCompanies()
      this.getQI()
    }
  }
</script>

<style scoped>

</style>
