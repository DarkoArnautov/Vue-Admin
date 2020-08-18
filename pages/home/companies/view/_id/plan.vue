<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <h4 class="title">Plan Holder Information (VRP Express)</h4>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content class="grey lighten-5">
          <v-container v-if="editedItem.plan_number && plan_holder">
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
                    :value="editedItem.plan_number"
                    label="Plan Number"
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
        </md-card-content>
      </md-card>

      <v-expansion-panels>
        <v-expansion-panel v-model="panel" expand>
          <v-expansion-panel-content>
            <div slot="header">Plan Holder Address</div>
            <v-card>
              <v-card-text class="grey lighten-5">
                <v-container v-if="editedItem.plan_number && plan_holder">
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
      <v-dialog v-model="standBy" persistent width="300">
        <v-card color="primary" dark >
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
        panel: [true],
        editedItem: {
          id: null,
          name: null,
          plan_number: null,
          active: true
        },
        plan_holder: null
      }
    },
    computed: {},
    methods: {
      getDataFromApi () {
        this.standBy = true
        axios.get('companies/' + this.$route.params.id + '/short')
          .then(res => {
            this.editedItem = res.data.data
            this.getVRPDataFromApi()
          })
      },

      getVRPDataFromApi () {
        if (this.editedItem.plan_number) {
          axios.get('companies/VRPexpress/' + this.editedItem.plan_number)
            .then(res => {
              this.plan_holder = res.data
              this.standBy = false
            })
        } else {
          this.standBy = false
        }
      }
    },
    mounted () {
      this.getDataFromApi()
    }
  }
</script>

<style scoped>

</style>
