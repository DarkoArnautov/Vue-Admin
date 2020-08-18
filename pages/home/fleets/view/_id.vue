<template>
  <div style="width: 100%">
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
        <md-card>
          <v-progress-linear :indeterminate="true" v-show="loading"></v-progress-linear>
          <md-card-header>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100">
                <h4 class="title">Fleet Data</h4>
              </div>
            </div>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100 btn-area">
                <md-button class="primary md-sm" @click="action"
                      :disabled="!$store.state.auth.permissions.vendors.includes('U')">
                  {{edit ? 'Save': 'Edit'}}
                </md-button>
                <md-button nuxt to="/home/fleets">Return to List</md-button>
              </div>
            </div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <v-form ref="fleetEditForm" v-model="valid" lazy-validation>
              <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
                <div v-for="(error, i) in alert.errors" :key="i">
                  {{error[0]}}
                </div>
              </v-alert>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12>
                    <v-text-field v-model="fleet.name" :rules="[v => !!v || 'Fleet Name is required']"
                                  prepend-icon="fas fa-edit"
                                  label="Fleet Name*" required
                                  :disabled="!edit || !$store.state.auth.permissions.fleets.includes('U')"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
        <vessels :fleet="$route.params.id"></vessels>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import vessels from '../../vessels/index'

  export default {
    name: 'id',
    layout: 'home',
    data () {
      return {
        loading: true,
        saving: false,
        valid: true,
        edit: false,
        alert: null,
        snackbar: {
          active: false,
          message: ''
        },
        fleet: {
          id: -1,
          name: ''
        }
      }
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('fleets/' + this.$route.params.id)
          .then(res => {
            this.fleet = res.data.data[0]
            this.loading = false
          })
      },
      action () {
        if (this.edit) {
          if (this.$refs.fleetEditForm.validate()) {
            this.saving = true
            this.alert = null

            axios.post('fleets/' + this.$route.params.id, this.fleet)
              .then(res => {
                this.$refs.fleetEditForm.resetValidation()
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
      }
    },
    mounted () {
      this.getDataFromApi()
    },
    components: {
      vessels
    }
  }
</script>

<style scoped>

</style>
