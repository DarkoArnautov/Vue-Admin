<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>book</md-icon>
          </div>
          <h4 class="title">Company Files</h4>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-data-table
                :headers="headers"
                :items="directories"
                item-key="name"
                hide-default-footer
                :hide-default-header="!$vuetify.breakpoint.mdAndUp"
                disable-pagination
                class="elevation-1 mobile-responsive-table"
                style="margin: 0 -10px" >
            <template v-slot:item="props">
              <tr v-if="$vuetify.breakpoint.mdAndUp">
                <td nowrap>
                  <!-- <a :href="props.item.to">{{ props.item.name }}</a> -->
                  <md-button 
                    :to="props.item.to"
                    class="md-primary md-simple">{{ props.item.name }}</md-button>
                </td>
                <td nowrap></td>
                <td nowrap>{{ props.item.count }}</td>
              </tr>
              <tr v-else>
                <td>
                  <ul class="responsive-table-content">
                    <li class="responsive-table-item p100" :data-label="headers[0].text">
                      <md-button 
                        :to="props.item.to"
                        class="md-primary md-simple">{{ props.item.name }}</md-button>
                    </li>
                    <li class="responsive-table-item p50" :data-label="headers[1].text">
                      
                    </li>
                    <li class="responsive-table-item p50" :data-label="headers[2].text">{{ props.item.count }}</li>
                  </ul>
                </td>
              </tr>
            </template>
          </v-data-table>
        </md-card-content>
      </md-card>
      <v-dialog v-model="standBy" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please stand by
            <v-progress-linear indeterminate color="white" class="mb-0" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
  <!-- <v-card flat>
    <v-card-text>
      <v-btn color="blue-grey" class="white--text" block disabled small > 
        Company Files <v-icon right dark>code</v-icon>
      </v-btn>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm4 v-for="directory in directories" :key="directory.code">
            <v-btn block large outlined style="min-height: 90px" nuxt :to="directory.to">
              <v-badge overlap left :color="directory.count ? 'primary' : 'secondary'">
                <span slot="badge">{{ directory.count }}</span>
                <v-icon dark left>fa fa-server</v-icon>
              </v-badge>
              <span style="white-space: normal; min-width: 150px">
              {{ directory.name }}
              </span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-dialog
        v-model="standBy"
        persistent
        width="300"
    >
      <v-card
          color="primary"
          dark
      >
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
  </v-card> -->
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'documents',
    data () {
      return {
        loading: true,
        standBy: true,
        saving: false,
        alert: null,
        headers: [
          { text: 'Document Name', sortable: true, value: 'name' },
          { text: 'Feature', sortable: true, value: 'code' },
          { text: 'Count', sortable: true, value: 'count' },
        ],
        directories: [
          {
            name: 'Group V Consent Letter',
            code: 'group-v-consent-letter',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/group-v-consent-letter',
            count: 0
          },
          {
            name: 'Letter of Intent - Non Tank Vessels below 250 bbls',
            code: 'letter-of-intent-non-tank-vessels-below-250-bbls',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/letter-of-intent-non-tank-vessels-below-250-bbls',
            count: 0
          },
          {
            name: 'Letter of Intent - Non Tank Vessels',
            code: 'letter-of-intent-non-tank-vessels',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/letter-of-intent-non-tank-vessels',
            count: 0
          },
          {
            name: 'SMFF Coverage Certification',
            code: 'smff-coverage-certification',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/smff-coverage-certification',
            count: 0
          },
          {
            name: 'Damage Stability Coverage Certification',
            code: 'damage-stability-coverage-certification',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/damage-stability-coverage-certification',
            count: 0
          },
          {
            name: 'Non-Tank SMFF Annex',
            code: 'nt-smff-annex',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/nt-smff-annex',
            count: 0
          },
          {
            name: 'Tank SMFF Annex',
            code: 'tank-smff-annex',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/tank-smff-annex',
            count: 0
          },
          {
            name: 'Combined SMFF Annex',
            code: 'combined-smff-annex',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/combined-smff-annex',
            count: 0
          },
          {
            name: 'SCHEDULE A Non-Tank',
            code: 'schedule-a-non-tank',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/schedule-a-non-tank',
            count: 0
          },
          {
            name: 'SCHEDULE A Tanker',
            code: 'schedule-a-tanker',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/schedule-a-tanker',
            count: 0
          },
          {
            name: 'SCHEDULE A Combined',
            code: 'schedule-a-combined',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/schedule-a-combined',
            count: 0
          },
          {
            name: 'Written Consent Form - Tank',
            code: 'written-consent-form-tank',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/written-consent-form-tank',
            count: 0
          },
          {
            name: 'Written Consent Form',
            code: 'written-consent-form',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/written-consent-form',
            count: 0
          },
          {
            name: 'Multiple Vessels Pre-fire Plan Certification',
            code: 'multiple-vessels-pre-fire-plan-certification',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/multiple-vessels-pre-fire-plan-certification',
            count: 0
          },
          {
            name: 'Single Vessel Pre-fire Plan Certification',
            code: 'single-vessel-pre-fire-plan-certification',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/single-vessel-pre-fire-plan-certification',
            count: 0
          },
          {
            name: 'AA-Vessel Specific Page',
            code: 'aa-vessel-specific',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/aa-vessel-specific',
            count: 0
          },
          {
            name: 'OPA-90 Client Contract',
            code: 'contracts',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/contracts',
            count: 0
          },
          {
            name: 'OPA-90 Response Asset Agreement',
            code: 'opa-90-response-asset-agreement',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/opa-90-response-asset-agreement',
            count: 0
          },
          {
            name: 'NASA Response Asset Agreement',
            code: 'nasa-response-asset-agreement',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/nasa-response-asset-agreement',
            count: 0
          },
          {
            name: 'Damage Stability Certificates',
            code: 'damage-stability-certificates',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/damage-stability-certificates',
            count: 0
          },
          {
            name: 'Shipboard Spill Mitigation Procedures',
            code: 'shipboard-spill-mitigation-procedures',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/shipboard-spill-mitigation-procedures',
            count: 0
          }
        ]
      }
    },
    methods: {
      getFilesCount () {
        this.standBy = true
        let vm = this
        axios.get('companies/' + this.$route.params.id + '/documents/count')
          .then(res => {
            Object.keys(res.data).forEach(function (key, index) {
              vm.directories.find(directory => directory.code === key).count = res.data[key].count
            })
            this.standBy = false
          })
      }
    },
    mounted () {
      this.getFilesCount()
    }
  }
</script>

<style scoped>
</style>
