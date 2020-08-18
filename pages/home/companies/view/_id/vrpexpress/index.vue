<template>
  <v-card flat>
    <v-progress-linear :indeterminate="true" v-show="loading"></v-progress-linear>
    <v-card-text>
      <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
        <div v-for="error in alert.errors">
          {{error[0]}}
        </div>
      </v-alert>
      <v-card class="mb-2">
        <v-card-title>
          <div class="headline">Plan Holder Information (VRP Express)</div>
          <v-spacer></v-spacer>
          <v-btn class="primary" @click="action" text :disabled="!plan_holder">
            Add plan as company
          </v-btn>
          <v-btn nuxt to="/home/companies" text>Return to List</v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="grey lighten-5">
          <v-container v-if="$route.params.id && plan_holder">
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.plan_holder"
                    label="Plan Holder Name"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.plan_preparer"
                    label="Plan Preparer"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.plan_type"
                    label="Plan Type"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.approval_date"
                    label="Plan Approved"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.status"
                    label="Status"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.plan_exp_date"
                    label="Plan Expiration"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.wcd_barrels"
                    label="WCD"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.tank_expiration_date"
                    label="Tank Expiration"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.primary_smff"
                    label="SMFF Provider"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.nt_expiration_date"
                    label="Non-Tank Expiration"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    :value="plan_holder.osro"
                    label="OSRO"
                    readonly
                    hide-details
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-alert :value="true" type="info" outlined v-else>No VRP Link.</v-alert>
        </v-card-text>
      </v-card>
      <v-expansion-panels>
        <v-expansion-panel v-model="panel" expand >
          <v-expansion-panel-content>
            <div slot="header">Plan Holder Address</div>
            <v-card>
              <v-card-text class="grey lighten-5">
                <v-container v-if="$route.params.id && plan_holder">
                  <v-layout row wrap>
                    <v-flex xs12 sm6>
                      <v-text-field
                          :value="plan_holder.holder_address_1"
                          label="Address 1"
                          readonly
                          hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field
                          :value="plan_holder.holder_address_2"
                          label="Address 2"
                          readonly
                          hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field
                          :value="plan_holder.holder_city"
                          label="City"
                          readonly
                          hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field
                          :value="plan_holder.holder_state"
                          label="State"
                          readonly
                          hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field
                          :value="plan_holder.holder_country"
                          label="Country"
                          readonly
                          hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field
                          :value="plan_holder.holder_zip"
                          label="Zip"
                          readonly
                          hide-details
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-alert :value="true" type="info" outlined v-else>No VRP Link.</v-alert>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'index',
    data () {
      return {
        loading: true,
        alert: null,
        panel: [true],
        plan_holder: null,
        editedItem: null
      }
    },
    computed: {},
    methods: {
      getVRPDataFromApi () {
        this.loading = true
        if (this.$route.params.id) {
          axios.get('companies/VRPexpress/' + this.$route.params.id)
            .then(res => {
              this.plan_holder = res.data
              this.loading = false
            })
        }
      },

      action () {
        this.editedItem = {
          valid: true,
          name: this.plan_holder.plan_holder,
          plan_number: this.plan_holder.plan_number,
          email: null,
          fax: null,
          phone: null,
          notes: null,
          qi_id: null,
          operating_company_id: null,
          addresses: [{
            deleted: false,
            address_type_id: 0,
            co: null,
            street: this.plan_holder.holder_address_1,
            unit: null,
            city: this.plan_holder.holder_city,
            state: this.plan_holder.holder_state,
            country: this.plan_holder.holder_country,
            zip: this.plan_holder.holder_zip,
            phone: null,
            latitude: null,
            longitude: null
          }],
          active: false
        }
        if (this.plan_holder.holder_address_2) {
          this.editedItem.addresses.push({
            deleted: false,
            address_type_id: 0,
            co: null,
            street: this.plan_holder.holder_address_2,
            unit: null,
            city: this.plan_holder.holder_city,
            state: this.plan_holder.holder_state,
            country: this.plan_holder.holder_country,
            zip: this.plan_holder.holder_zip,
            phone: null,
            latitude: null,
            longitude: null
          })
        }
        axios.post('companies/create', this.editedItem)
          .then(res => {
            this.$store.dispatch('notification/message', res.data.message)
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
    mounted () {
      this.getVRPDataFromApi()
    }
  }
</script>

<style scoped>

</style>
