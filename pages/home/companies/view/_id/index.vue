<template>
  <div>
    <v-form ref="companyEditForm" v-model="valid" lazy-validation>
      <md-card>
        <md-card-header style="display: flex">
          <md-button class="md-icon-button" :class="edit ? 'md-success' : 'md-primary'" style="margin-right: 10px;" :disabled="!$store.state.auth.permissions.companies.includes('U')" @click="action">
            <md-icon :class="edit ? 'fas fa-save' : 'fas fa-edit'"></md-icon>
            <md-tooltip md-direction="bottom">{{edit ? 'Save Edits' : 'Edit Mode'}}</md-tooltip>
          </md-button>
          <h6 class="title">Company Information</h6>
        </md-card-header>
        <md-divider></md-divider>

        <!-- <md-card-header>
          <div class="headline">Company Information</div>
          <v-spacer></v-spacer>
          <v-divider vertical></v-divider>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" :class="edit ? 'error' : 'info'" :loading="saving" @click="action" text :disabled="!$store.state.auth.permissions.companies.includes('U')">
                <v-icon>{{edit ? 'fas fa-save' : 'fas fa-edit'}}</v-icon>
              </v-btn>
            </template>
            <span>{{edit ? 'Save Edits' : 'Edit Mode'}}</span>
          </v-tooltip>
        </md-card-header> -->

        <md-card-content :class="edit ? 'red lighten-5' : 'grey lighten-5'">
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
                              label="Name*" required :readonly="!edit"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.plan_number"
                              prepend-icon="fas fa-project-diagram"
                              label="Plan Number" :readonly="!edit"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.phone"
                              prepend-icon="fas fa-phone"
                              label="Phone" :readonly="!edit"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.fax"
                              prepend-icon="fas fa-fax"
                              label="Fax" :readonly="!edit"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.email"
                              :rules="[ v => !!v || 'E-mail is required', v => /.+@.+/.test(v) || 'E-mail must be valid' ]"
                              prepend-icon="fas fa-envelope"
                              label="E-mail*" type="email" required :readonly="!edit"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete :items="itemsQI" label="QI"
                                prepend-icon="fas fa-anchor"
                                item-text="name"
                                item-value="id"
                                v-model="editedItem.qi_id" :readonly="!edit"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete :items="itemsCompanies" label="Operating Company"
                                prepend-icon="fas fa-building"
                                item-text="name"
                                item-value="id"
                                v-model="editedItem.operating_company_id" :readonly="!edit"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.website"
                              prepend-icon="fas fa-globe"
                              label="Website" type="email" :readonly="!edit"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete :items="itemsPOCs" label="Company POC"
                                prepend-icon="fas fa-phone-square"
                                item-text="name"
                                item-value="id"
                                v-model="editedItem.company_poc_id" :readonly="!edit"></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                <v-textarea :label="'About ' + editedItem.name" v-model="editedItem.description"
                            :disabled="!edit"></v-textarea>
              </v-flex>
              <v-flex xs12 sm6>
                <v-checkbox
                    label="DJS SMFF Coverage"
                    v-model="editedItem.active"
                    :readonly="!edit"
                ></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
        </md-card-content>
      </md-card>
    </v-form>
    <v-dialog v-model="standBy" persistent width="300" >
      <v-card color="primary" dark >
        <v-card-text>
          Please stand by
          <v-progress-linear
              indeterminate
              color="white"
              class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'index',
    data () {
      return {
        standBy: true,
        saving: false,
        valid: true,
        edit: false,
        alert: null,
        editedItem: {
          id: null,
          name: '',
          plan_number: null,
          email: null,
          fax: null,
          phone: null,
          notes: null,
          website: null,
          qi_id: null,
          operating_company_id: null,
          company_poc_id: null,
          active: true
        },
        itemsCompanies: [],
        itemsQI: [],
        itemsPOCs: []
      }
    },
    computed: {},
    methods: {
      getDataFromApi () {
        this.standBy = true
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.standBy = false
          })
      },

      getCompanies () {
        axios.get('companies/short')
          .then(res => {
            this.itemsCompanies = res.data.data
          })
      },

      getPOCs () {
        axios.get('companies/user/poc')
          .then(res => {
            this.itemsPOCs = res.data.data
          })
      },

      getQI () {
        axios.get('vendors/qi')
          .then(res => {
            this.itemsQI = res.data.data
          })
      },

      action () {
        if (this.edit) {
          if (this.$refs.companyEditForm.validate()) {
            this.saving = true
            this.alert = null
            axios.post('companies/' + this.$route.params.id, this.editedItem)
              .then(res => {
                this.$refs.companyEditForm.resetValidation()
                this.saving = false
                this.edit = !this.edit
                this.getDataFromApi()
                this.$root.$emit('company_updated')
                this.$store.dispatch('notification/message', {
                  message: res.data.message
                })
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
      this.getDataFromApi()
      this.getCompanies()
      this.getQI()
      this.getPOCs()
    }
  }
</script>

<style scoped>

</style>
