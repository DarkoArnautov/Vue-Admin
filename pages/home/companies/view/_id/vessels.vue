<template>
  <div v-if="$store.state.auth.permissions.vessels.includes('R')">
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
        <md-card>
          <md-card-header>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100">
                <h4 class="title">Vessels</h4>
              </div>
            </div>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100 btn-area" style="padding: 0">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <md-button
                        class="success md-sm"
                        dark
                        v-on="on"
                        v-show="selected.length > 0" >
                      Bulk
                    </md-button>
                  </template>
                  <v-list dense>
                    <v-list-item @click="dialogTransfer = true" >
                      <v-list-item-title>Transfer</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <md-button class="primary" nuxt 
                    @click="$router.push({path: '/home/vessels/new', query: {company_id:$route.params.id}})" text
                    :disabled="!$store.state.auth.permissions.vessels.includes('C')">
                  Add Vessel
                  <md-tooltip>Add Vessel</md-tooltip>
                </md-button>
              </div>
            </div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <v-btn text block class="info" @click="showSearchFilters = !showSearchFilters">{{showSearchFilters ? 'Hide'
              : 'Show'}} Search Filters
              <v-icon right dark>search</v-icon>
            </v-btn>
            <v-slide-y-transition>
              <v-container grid-list-md fluid v-show="showSearchFilters">
                <v-layout row wrap>
                  <v-flex xs12 d-flex>
                    <v-text-field
                        v-model="search"
                        class="mx-3"
                        flat
                        label="Search by Name, IMO, MMSI"
                        prepend-inner-icon="search"
                        clearable
                    >
                    </v-text-field>
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
                  <v-flex xs12 sm3 d-flex>
                    <v-autocomplete v-model="staticSearch.types"
                                    :items="itemsVesselType"
                                    item-text="name"
                                    item-value="id"
                                    label="Type"
                                    prepend-icon="fas fa-arrows-alt-v"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex>
                    <v-autocomplete v-model="staticSearch.qi"
                                    :items="itemsQI"
                                    item-text="name"
                                    item-value="id"
                                    label="QI"
                                    prepend-icon="fas fa-anchor"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex>
                    <v-autocomplete v-model="staticSearch.pi"
                                    :items="itemsPI"
                                    item-text="name"
                                    item-value="id"
                                    label="PI"
                                    prepend-icon="fas fa-anchor"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex>
                    <v-autocomplete v-model="staticSearch.response"
                                    :items="itemsResponse"
                                    item-text="name"
                                    item-value="id"
                                    label="Response"
                                    prepend-icon="fas fa-anchor"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex>
                    <v-autocomplete v-model="staticSearch.societies"
                                    :items="itemsSocieties"
                                    item-text="name"
                                    item-value="id"
                                    label="Societies"
                                    prepend-icon="fas fa-anchor"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex>
                    <v-autocomplete v-model="staticSearch.insurers"
                                    :items="itemsInsurers"
                                    item-text="name"
                                    item-value="id"
                                    label="Insurers"
                                    prepend-icon="fas fa-anchor"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex>
                    <v-autocomplete v-model="staticSearch.providers"
                                    :items="itemsProviders"
                                    item-text="name"
                                    item-value="id"
                                    label="Providers"
                                    prepend-icon="fas fa-anchor"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex v-if="fleet === undefined">
                    <v-autocomplete v-model="staticSearch.fleets"
                                    :items="itemsFleets"
                                    item-text="name"
                                    item-value="id"
                                    label="Fleets"
                                    prepend-icon="fas fa-anchor"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex>
                    <v-select v-model="staticSearch.vrp_status"
                              :items="itemsVRPStatus"
                              item-text="option"
                              item-value="value"
                              label="VRP Express"
                              prepend-icon="fas fa-check"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm3 d-flex>
                    <v-autocomplete v-model="staticSearch.networks"
                                    :items="itemsNetworks"
                                    item-text="name"
                                    item-value="id"
                                    label="Networks"
                                    prepend-icon="fa-network-wired"
                                    hide-no-data
                                    multiple
                                    clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 d-flex>
                    <v-select v-model="staticSearch.operated"
                              :items="[{option: 'Directly Owned Vessels', value:0}, {option: 'Vessels form Operated Companies', value:1}]"
                              item-text="option"
                              item-value="value"
                              label="Operated Companies"
                              prepend-icon="fas fa-building"
                    ></v-select>
                  </v-flex>
                  <!--<v-flex xs12 sm3 d-flex>-->
                  <!--<v-select v-model="staticSearch.vrp_comparison"-->
                  <!--:items="itemsVRPComparison"-->
                  <!--item-text="option"-->
                  <!--item-value="value"-->
                  <!--label="VRP Express Comparison"-->
                  <!--prepend-icon="fas fa-check"-->
                  <!--&gt;</v-select>-->
                  <!--</v-flex>-->
                </v-layout>
              </v-container>
            </v-slide-y-transition>
            <v-data-table
                :headers="computedHeaders"
                :items="vesselsTotal"
                :server-items-length="total"
                :footer-props="pageFooter"
                :options.sync="pagination"
                :loading="loadingTable"
                class="elevation-1 mobile-responsive-table"
                v-model="selected"
                hide-default-header 
                style="margin-top: 10px;">
              <template v-slot:header="{ props, on }" v-if="$vuetify.breakpoint.mdAndUp">
                <tr>
                  <th>
                    <v-checkbox :input-value="allChecked"
                                :indeterminate="indetermined"
                                primary
                                hide-details
                                @click.native="toggleAll"
                                style="margin: auto"></v-checkbox>
                  </th>
                  <th
                      v-for="header in props.headers"
                      :key="header.value"
                      :class="header.class + ' ma-0 pa-1 text-xs-center'" >
                    <div style="width: 100%">
                      <v-tooltip bottom v-if="header.icon">
                        <template v-slot:activator="{ on }">
                          <span v-on="on"><v-icon>{{header.icon}}</v-icon></span>
                        </template>
                        <span>{{ header.text }}</span>
                      </v-tooltip>
                      <v-tooltip bottom v-else-if="header.img">
                        <template v-slot:activator="{ on }">
                          <img v-on="on" :src="header.img" height="24" width="24"
                              position="center center" />
                        </template>
                        <span>{{ header.text }}</span>
                      </v-tooltip>
                      <span v-else>{{ header.text }}</span>
                    </div>
                  </th>
                </tr>
              </template>
              <template v-slot:item="props">
                <tr :style="props.item.vrp_express ? 'opacity: 0.4': ''" v-if="$vuetify.breakpoint.mdAndUp">
                  <td>
                    <v-checkbox
                        v-model="props.isSelected"
                        primary
                        hide-details
                        @click.native="checkTableRows(props.item, props.isSelected)" />
                  </td>
                  <td>
                    <a :href="'/home/vessels/view/'+props.item.id" v-if="!props.item.vrp_express">{{ props.item.name }}</a>
                    <span v-else>{{ props.item.name }}</span>
                  </td>
                  <td>
                    {{ props.item.imo }}
                    <v-tooltip bottom v-if="props.item.vrp_comparison === 'match' && props.item.vrp_count > 1">
                      <template v-slot:activator="{ on }">
                        <v-icon small color="info" v-on="on">
                          check_circle
                        </v-icon>
                      </template>
                      <span>Multiple</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else-if="props.item.vrp_comparison === 'match'">
                      <template v-slot:activator="{ on }">
                        <v-icon small color="success" v-on="on">
                          check_circle
                        </v-icon>
                      </template>
                      <span>Match</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else-if="props.item.vrp_comparison === 'conflict'">
                      <template v-slot:activator="{ on }">
                        <v-icon small color="error" v-on="on">
                          error
                        </v-icon>
                      </template>
                      <span>Conflict</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else>
                      <template v-slot:activator="{ on }">
                        <v-icon small color="warning" v-on="on">
                          error
                        </v-icon>
                      </template>
                      <span>No VRP Link</span>
                    </v-tooltip>
                  </td>
                  <td>{{ props.item.official_number }}</td>
                  <td class="ma-0 pa-0">
                    <v-checkbox @click.prevent="toggleVesselStatus(props.index)" v-model="props.item.active"
                                :disabled="props.item.id === -1 || !$store.state.auth.permissions.vessels.includes('U')"
                                hide-details></v-checkbox>
                  </td>
                  <td class="ma-0 pa-0">
                    <v-checkbox v-model="props.item.resource_provider" :disabled="props.item.id === -1" readonly
                                hide-details></v-checkbox>
                  </td>
                  <td class="text-xs-center">
                    <v-container style="padding: 3px; white-space: nowrap">
                      <v-layout>
                        <v-flex xs4><b>
                          {{ props.item.company.plan_number }}
                        </b><br>Plan #
                        </v-flex>
                        <v-divider class="mx-1" inset vertical></v-divider>
                        <v-flex xs8><b>{{ props.item.type }}</b><br>Vessel Type</v-flex>
                      </v-layout>
                    </v-container>
                  </td>
                  <td class="ma-0 pa-0">
                    <v-checkbox v-model="props.item.tanker" @click.stop="toggleVesselTanker(props.index)"
                                :disabled="props.item.id === -1 || !$store.state.auth.permissions.vessels.includes('U')"></v-checkbox>
                  </td>
                  <td class="text-xs-center" v-if="$vuetify.breakpoint.xlOnly">
                    <v-container style="padding: 3px; white-space: nowrap">
                      <v-layout>
                        <v-flex xs4><b>{{ props.item.vrp_plan_number }}</b><br>Plan #</v-flex>
                        <v-divider class="mx-1" inset vertical></v-divider>
                        <v-flex xs8><b>{{ props.item.vrp_status }}</b><br>Status</v-flex>
                      </v-layout>
                    </v-container>
                  </td>
                  <td v-if="$vuetify.breakpoint.xlOnly" class="ma-0 pa-0">
                    <v-checkbox v-model="props.item.vrp_vessel_is_tank"
                                :disabled="props.item.id === -1 || !$store.state.auth.permissions.vessels.includes('U')"
                                readonly></v-checkbox>
                  </td>
                  <td>
                    <v-btn :color="props.item.fleets.length ? 'primary':''" block small depressed
                          @click="manageFleetsDialogOpen(props.item)"
                          :disabled="props.item.id === -1 || !$store.state.auth.permissions.vessels.includes('U')">
                      Manage Fleets
                    </v-btn>
                  </td>
                </tr>
                <tr v-else>
                  <td>
                    <ul class="responsive-table-content">
                      <li class="responsive-table-item p20" data-label="">
                        <v-checkbox
                            v-model="props.isSelected"
                            primary
                            hide-details
                            @click.native="checkTableRows(props.item, props.isSelected)" />
                      </li>
                      <li class="responsive-table-item p80" :data-label="headers[0].text">
                        <a :href="'/home/vessels/view/'+props.item.id" v-if="!props.item.vrp_express">{{ props.item.name }}</a>
                        <span v-else>{{ props.item.name }}</span>
                      </li>
                      <li class="responsive-table-item p50" :data-label="headers[1].text">
                        {{ props.item.imo }}
                        <v-tooltip bottom v-if="props.item.vrp_comparison === 'match' && props.item.vrp_count > 1">
                          <template v-slot:activator="{ on }">
                            <v-icon small color="info" v-on="on">
                              check_circle
                            </v-icon>
                          </template>
                          <span>Multiple</span>
                        </v-tooltip>
                        <v-tooltip bottom v-else-if="props.item.vrp_comparison === 'match'">
                          <template v-slot:activator="{ on }">
                            <v-icon small color="success" v-on="on">
                              check_circle
                            </v-icon>
                          </template>
                          <span>Match</span>
                        </v-tooltip>
                        <v-tooltip bottom v-else-if="props.item.vrp_comparison === 'conflict'">
                          <template v-slot:activator="{ on }">
                            <v-icon small color="error" v-on="on">
                              error
                            </v-icon>
                          </template>
                          <span>Conflict</span>
                        </v-tooltip>
                        <v-tooltip bottom v-else>
                          <template v-slot:activator="{ on }">
                            <v-icon small color="warning" v-on="on">
                              error
                            </v-icon>
                          </template>
                          <span>No VRP Link</span>
                        </v-tooltip>
                      </li>
                      <li class="responsive-table-item p50" :data-label="headers[2].text">
                        {{ props.item.official_number }}
                      </li>
                      <li class="responsive-table-item p50" :data-label="headers[3].text">
                        <v-checkbox @click.prevent="toggleVesselStatus(props.index)" v-model="props.item.active"
                                :disabled="props.item.id === -1 || !$store.state.auth.permissions.vessels.includes('U')"
                                hide-details></v-checkbox>
                      </li>
                      <li class="responsive-table-item p50" :data-label="headers[4].text">
                        <v-checkbox v-model="props.item.resource_provider" :disabled="props.item.id === -1" readonly
                                hide-details></v-checkbox>
                      </li>
                      <li class="responsive-table-item p100" :data-label="headers[5].text">
                        <v-container style="padding: 3px; white-space: nowrap">
                          <v-layout>
                            <v-flex xs4><b>
                              {{ props.item.company.plan_number }}
                            </b><br>Plan #
                            </v-flex>
                            <v-divider class="mx-1" inset vertical></v-divider>
                            <v-flex xs8><b>{{ props.item.type }}</b><br>Vessel Type</v-flex>
                          </v-layout>
                        </v-container>
                      </li>
                      <li class="responsive-table-item p40" :data-label="headers[6].text">
                        <v-checkbox v-model="props.item.tanker" @click.stop="toggleVesselTanker(props.index)"
                                :disabled="props.item.id === -1 || !$store.state.auth.permissions.vessels.includes('U')"></v-checkbox>
                      </li>
                      <li class="responsive-table-item p60" :data-label="headers[7].text">
                        <v-container style="padding: 3px; white-space: nowrap">
                          <v-layout>
                            <v-flex xs4><b>{{ props.item.vrp_plan_number }}</b><br>Plan #</v-flex>
                            <v-divider class="mx-1" inset vertical></v-divider>
                            <v-flex xs8><b>{{ props.item.vrp_status }}</b><br>Status</v-flex>
                          </v-layout>
                        </v-container>
                      </li>
                      <li class="responsive-table-item p40" :data-label="headers[8].text">
                        <v-checkbox v-model="props.item.vrp_vessel_is_tank"
                                :disabled="props.item.id === -1 || !$store.state.auth.permissions.vessels.includes('U')"
                                readonly></v-checkbox>
                      </li>
                      <li class="responsive-table-item p60" :data-label="headers[9].text">
                        <v-btn :color="props.item.fleets.length ? 'primary':''" block small depressed
                              @click="manageFleetsDialogOpen(props.item)"
                              :disabled="props.item.id === -1 || !$store.state.auth.permissions.vessels.includes('U')">
                          Manage Fleets
                        </v-btn>
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <v-dialog v-model="dialogFleets" scrollable max-width="350px">
      <v-card>
        <v-card-title>{{ manageFleets.vesselName }} Enabled Fleets</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-switch
              v-for="fleet in itemsFleets"
              v-model="manageFleets.enabledFleets"
              :label="fleet.name"
              :value="fleet.id"
              :key="fleet.id"
              @change="saveFleets"
          ></v-switch>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogFleets = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogTransfer" scrollable max-width="300px">
      <v-card>
        <v-card-title>Company Transfer</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          Please choose a company under which you want to transfer the vessels to.
          <v-autocomplete
              v-model="transferTo"
              :items="itemsCompanies"
              item-text="name"
              item-value="id"
              label="Company"
              prepend-icon="fas fa-building"
              hide-no-data
          ></v-autocomplete>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="error" text :loading="loadingTransfer" @click="initiateTransfer" :disabled="!transferTo">Apply
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialogTransfer = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'index',
    layout: 'home',
    props: ['fleet'],
    computed: {
      computedHeaders () {
        return this.headers.filter(h => !h.hide.includes(this.$vuetify.breakpoint.name))
      },
      loadingTable () {
        return this.loading || this.loadingVRP
      },
      vesselsTotal () {
        return this.vessels.concat(this.vesselsVRP)
      }
    },
    data () {
      return {
        allChecked: false,
        indetermined: false,
        showSearchFilters: false,
        dialog: false,
        dialogTransfer: false,
        dialogFleets: false,
        manageFleets: {
          vesselId: null,
          vesselName: null,
          enabledFleets: []
        },
        selected: [],
        transferTo: null,
        loadingTransfer: false,
        loading: true,
        loadingVRP: false,
        alert: null,
        vessels: [],
        vesselsVRP: [],
        search: '',
        staticSearch: {
          active: -1,
          resource_provider: -1,
          types: [],
          qi: [],
          pi: [],
          response: [],
          societies: [],
          insurers: [],
          providers: [],
          vendors: [],
          fleets: [],
          vrp_status: -1,
          vrp_comparison: -1,
          company: this.$route.params.id,
          operated: 0,
          networks: []
        },
        itemsNetworks: [],
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
        itemsVRPStatus: [
          { option: 'All', value: -1 },
          { option: 'Authorized', value: 1 },
          { option: 'Not Authorized', value: 0 }
        ],
        itemsVRPComparison: [
          { option: 'All', value: -1 },
          { option: 'Conflict', value: 2 },
          { option: 'Imported', value: 1 },
          { option: 'Match', value: 0 }
        ],
        total: 0,
        pagination: {
          itemsPerPage: 5,
          sortBy: ['name']
        },
        pageFooter: {
          "items-per-page-options": [5, 10, 20, 50, 100]
        },
        headers: [
          { text: 'Vessel Name', value: 'name', hide: [] },
          { text: 'IMO', value: 'imo', hide: [] },
          { text: 'Official Number', value: 'official_number', hide: [] },
          { text: 'DJS SMFF Coverage?', sortable: false, value: 'active', img: '/images/DJS-Square.png', hide: [] },
          {
            text: 'Resource Provider?',
            sortable: false,
            value: 'resource_provider',
            icon: 'fas fa-hard-hat', hide: []
          },
          { text: 'Donjon-SMIT Database Stats', sortable: false, value: 'djs_status', hide: [] },
          {
            text: 'Tank Vessel',
            sortable: false,
            value: 'djs_oil_tanker',
            img: '/images/oil_can_icon.png', hide: []
          },
          { text: 'USCG VRP Express Stats', sortable: false, value: 'vrp_status', hide: ['xs', 'sm,', 'md', 'lg'] },
          {
            text: 'Tank Vessel',
            sortable: false,
            value: 'vrp_oil_tanker',
            img: '/images/oil_can_icon.png',
            hide: ['xs', 'sm,', 'md', 'lg']
          },
          { text: 'Fleets', sortable: false, value: 'fleets', hide: [] }
        ],
        itemsVesselType: [],
        itemsQI: [],
        itemsPI: [],
        itemsResponse: [],
        itemsSocieties: [],
        itemsInsurers: [],
        itemsProviders: [],
        itemsFleets: [],
        itemsCompanies: [],
        search_timeout: null
      }
    },
    watch: {
      pagination: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
      search () {
        if (this.search_timeout) clearTimeout(this.search_timeout)
        console.log('call')
        let vm = this
        this.search_timeout = setTimeout(function () {
          vm.getDataFromApi()
        }, 500)
      },
      staticSearch: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
      dialogFleets (val) {
        val || this.manageFleetsDialogClosed()
      },
      // selected () {
      //   if (this.selected.length > 0) {
      //     console.log(this.selected)
      //   }
      // },
      dialogTransfer () {
        if (!this.dialogTransfer) {
          this.transferTo = null
        }
      }
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        // get by search keyword
        if (this.search) {
          axios.post(`vessels-filter-vrp?query=${this.search}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              // console.log(res)
              this.vessels = res.data.data
              this.total = res.data.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
        // get by sort option
        if (this.pagination.sortBy && !this.search) {
          const direction = this.pagination.descending ? 'desc' : 'asc'
          axios.post(`vessels-order?direction=${direction}&sortBy=${this.pagination.sortBy}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.loading = false
              this.vessels = res.data.data
              this.total = res.data.meta.total
            })
        }
        if (!this.search && !this.pagination.sortBy) {
          axios.post(`vessels?page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.vessels = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
        if (this.staticSearch.company) {
          // console.log('Search VRP')
          //pass the company id and get the vessels under that PlanHolder
          axios.get(`vessels/VRPexpress/underPlan/${this.staticSearch.company}`)
            .then(res => {
              this.vesselsVRP = res.data
              // this.total = this.total + res.data.length
            })
            .catch(err => console.log(err))
            .finally(() => (this.loadingVRP = false))
        }
      },

      deleteItem (item) {
        this.$root.$confirm('Warning', `You are about to delete the vessel <b>${item.name}</b>. Are you sure that you want to proceed with this action?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.delete('vessels/' + item.id + '/destroy')
              .then(res => {
                this.getDataFromApi()
                this.$store.dispatch('notification/message', {
                  message: res.data.message
                })
              })
          }
        })
      },

      toggleVesselStatus (id) {
        this.$root.$confirm('Warning', `<b>${this.vessels[id].name}</b> status will be changed to DJS <b>${this.vessels[id].active ? 'Inactive' : 'Active'}</b>. Are you sure that you want to change this setting?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.post('vessels/' + this.vessels[id].id + '/toggleStatus')
              .then(res => {
                this.$store.dispatch('notification/message', { message: res.data.message })
                this.vessels[id].active = !this.vessels[id].active
              })
          }
        })
      },

      toggleVesselTanker (id) {
        this.$root.$confirm('Warning', `<b>${this.vessels[id].name}</b> tanker status will be changed to <b>${this.vessels[id].tanker ? 'Non-Tanker' : 'Tanker'}</b>. Are you sure that you want to change this setting?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.post('vessels/' + this.vessels[id].id + '/toggleTanker')
              .then(res => {
                this.vessels[id].tanker = !this.vessels[id].tanker
                this.$store.dispatch('notification/message', {
                  message: res.data.message
                })
              })
          }
        })
      },

      getVesselType () {
        axios.get('vessels/types')
          .then(res => {
            this.itemsVesselType = res.data.data
          })
      },

      getVendorQI () {
        axios.get('vendors/qi')
          .then(res => {
            this.itemsQI = res.data.data
          })
      },

      getVendorPI () {
        axios.get('vendors/pi')
          .then(res => {
            this.itemsPI = res.data.data
          })
      },

      getVendorResponse () {
        axios.get('vendors/response')
          .then(res => {
            this.itemsResponse = res.data.data
          })
      },

      getVendorSocieties () {
        axios.get('vendors/societies')
          .then(res => {
            this.itemsSocieties = res.data.data
          })
      },

      getVendorInsurers () {
        axios.get('vendors/insurers')
          .then(res => {
            this.itemsInsurers = res.data.data
          })
      },

      getVendorProviders () {
        axios.get('vendors/providers')
          .then(res => {
            this.itemsProviders = res.data.data
          })
      },

      getFleets () {
        axios.get('fleets')
          .then(res => {
            this.itemsFleets = res.data.data
          })
      },

      getCompanies () {
        axios.get('companies/short')
          .then(res => {
            this.itemsCompanies = res.data.data
          })
      },

      getNetworks () {
        axios.get('networks/short')
          .then(res => {
            this.itemsNetworks = res.data.data
          })
      },

      manageFleetsDialogOpen (vessel) {
        this.manageFleets.vesselId = vessel.id
        this.manageFleets.vesselName = vessel.name
        this.manageFleets.enabledFleets = vessel.fleets
        this.dialogFleets = true
      },

      manageFleetsDialogClosed () {
        this.manageFleets.vesselId = null
        this.manageFleets.name = null
        this.manageFleets.enabledFleets = []
      },

      saveFleets () {
        axios.post('vessels/' + this.manageFleets.vesselId + '/saveFleets', { fleets: this.manageFleets.enabledFleets })
          .then(res => {
            this.getDataFromApi()
            this.$store.dispatch('notification/message', {
              message: res.data.message
            })
          })
      },

      getVRPColor (comparison) {
        switch (comparison) {
          case 'conflict':
            return 'warning'
          case 'imported':
            return 'error'
          case 'match':
            return 'success'
          default:
            return 'info'
        }
      },

      initiateTransfer () {
        this.loadingTransfer = true
        axios.post('vessels/company/transfer', {
          vessel_ids: this.selected.map(a => a.id),
          company_id: this.transferTo
        })
          .then(res => {
            this.$store.dispatch('notification/message', {
              message: res.data.message
            })
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.loadingTransfer = false
            this.dialogTransfer = false
          })
      },

      toggleAll () {
        if (this.selected.length > 0) {
          this.selected = []
        } else {
          this.selected = this.vessels.slice()
        }
        
        this.updateCheckState()
      },

      checkTableRows(item, state) {
        if(state) {
          this.selected.push(item)
        } else {
          var index = this.selected.indexOf(item)
          this.selected.splice(index, 1)
        }

        this.updateCheckState()
      },

      updateCheckState() {
        if ( this.selected.length === this.vessels.slice().length){
          this.allChecked = true
          this.indetermined = false
        } else if(this.selected.length === 0) {
          this.indetermined = false
          this.allChecked = false
        } else {
          this.indetermined = true
        }
      }
    },
    mounted () {
      this.getVesselType()
      this.getVendorQI()
      this.getVendorPI()
      this.getVendorResponse()
      this.getVendorSocieties()
      this.getVendorInsurers()
      this.getVendorProviders()
      this.getCompanies()
      this.getNetworks()
      this.getFleets()
      if (this.fleet !== undefined) {
        this.staticSearch.fleets.push(this.fleet)
      }
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

  .v-input--selection-controls {
    margin: unset;
    padding: unset;
    height: 25px;
    width: 20px;
  }
</style>
