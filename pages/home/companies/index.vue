<template>
  <div v-if="$store.state.auth.permissions.companies.includes('R')" style="width: 100%">
    <v-layout row>
      <v-flex xs12>
        <md-card>
          <md-card-header class="md-card-header-text md-card-header-blue">
            <div class="card-text md-size-50" style="width: 100%">
              <div class="md-layout">
                <div class="md-layout-item md-xsmall-size-100 md-small-size-50">
                  <h4 class="title">Companies</h4>
                </div>
                <div class="md-layout-item md-xsmall-size-100 md-small-size-50 btn-area">
                  <md-button class="md-primary md-sm" href="/home/companies/new" nuxt :disabled="!$store.state.auth.permissions.companies.includes('C')">Add Company</md-button>
                  <!-- <v-btn class="primary" to="/home/companies/new" text :disabled="!$store.state.auth.permissions.companies.includes('C')">Add Company</v-btn> -->
                </div>
              </div>
            </div>
          </md-card-header>
          <md-card-content>
            <v-container grid-list-md fluid>
              <v-layout row wrap>
                <v-flex xs12 sm4>
                  <v-text-field
                      v-model="search"
                      label="Name / Plan Number"
                      prepend-inner-icon="search"
                      clearable />
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                  <v-select v-model="staticSearch.active"
                            :items="itemsActiveStatus"
                            item-text="option"
                            item-value="value"
                            label="DJS SMFF Coverage"
                            prepend-icon="fas fa-check" />
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                  <v-select v-model="staticSearch.vrp_status"
                            :items="itemsVRPStatus"
                            item-text="option"
                            item-value="value"
                            label="VRP Express"
                            prepend-icon="fas fa-check" />
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                  <v-select v-model="staticSearch.resource_provider"
                            :items="itemsResourceProvider"
                            item-text="option"
                            item-value="value"
                            label="Resource Provider"
                            prepend-icon="fas fa-hard-hat" />
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                  <v-autocomplete v-model="staticSearch.networks"
                                  :items="itemsNetworks"
                                  item-text="name"
                                  item-value="id"
                                  label="Networks"
                                  prepend-icon="fa-network-wired"
                                  hide-no-data
                                  multiple
                                  clearable />
                </v-flex>
              </v-layout>
            </v-container>
            
            <v-data-table
                :headers="computedHeaders"
                :items="companies"
                item-key="id+plan_number"
                :server-items-length="total"
                :footer-props="pageFooter"
                :options.sync="pagination"
                :loading="loading"
                hide-default-header
                class="elevation-1 mobile-responsive-table"
                style="margin: 0 -10px">
              <template v-slot:header="{ props: { headers } }" v-if="$vuetify.breakpoint.mdAndUp">
                <tr>
                  <th
                      v-for="header in headers"
                      :key="header.text"
                      :class="header.class + ' ma-0 pa-1 text-xs-center'">
                    <div style="width: 100%; text-align: center">
                      <v-tooltip bottom v-if="header.icon">
                        <template v-slot:activator="{ on }">
                          <span v-on="on"><v-icon :color="header.color">{{header.icon}}</v-icon></span>
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
                      <span v-else :style="'color: ' + header.color">{{ header.text }}</span>
                    </div>
                  </th>
                </tr>
              </template>
              <template v-slot:item="props">
                <tr :style="props.item.id === -1 ? 'opacity: 0.4': ''" v-if="$vuetify.breakpoint.mdAndUp">
                  <td>
                    <a :href="'/home/companies/view/' + props.item.id" v-if="props.item.id !== -1">
                      <span>{{ props.item.name }}</span>
                    </a>
                    <a :href="'/home/companies/view/' + props.item.plan_number+'/vrpexpress'" v-else>
                      {{ props.item.name }}
                    </a>
                  </td>
                  <td class="ma-0 pa-0" style="width: 80px">
                    <v-checkbox @click.prevent="toggleStatus(props.item)" v-model="props.item.active"
                                :disabled="props.item.id === -1 || !$store.state.auth.permissions.companies.includes('U')"
                                hide-details style="margin: 0 auto; width: 32px" />
                  </td>
                  <td class="ma-0 pa-0" style="width: 80px">
                    <v-checkbox v-model="props.item.resource_provider" :disabled="props.item.id === -1" readonly
                                hide-details style="margin: 0 auto; width: 32px" />
                  </td>
                  <td class="text-xs-center"><b>{{ props.item.stats.users }}</b></td>
                  <td class="text-xs-center"><b>{{ props.item.stats.individuals }}</b></td>
                  <td class="text-xs-center"><b>{{ props.item.stats.contacts }}</b></td>
                  <td class="text-xs-center"><b>{{ props.item.stats.vessels }}</b></td>

                  <td class="text-xs-center"><b>{{ props.item.vrp_plan_number }}</b></td>
                  <td class="text-xs-center"><b>{{ props.item.vrp_stats.vessels }}</b></td>
                  <td class="text-xs-center"><b :style="'color: ' + getVRPStatusColor(props.item)">{{getVRPStatus(props.item)}}</b></td>
                  <td class="text-xs-center"><b>{{ props.item.vrp_stats.plan_type }}</b></td>
                  <td class="text-xs-center"><b>{{ props.item.location }}</b></td>
                </tr>
                <tr v-else :style="props.item.id === -1 ? 'opacity: 0.4': ''">
                  <td>
                    <ul class="responsive-table-content">
                      <li class="responsive-table-item p100" :data-label="headers[0].text">
                        <a :href="'/home/companies/view/' + props.item.id" v-if="props.item.id !== -1">
                          <span class="ellipsis">{{ props.item.name }}</span>
                        </a>
                        <a :href="'/home/companies/view/' + props.item.plan_number+'/vrpexpress'" v-else>
                          <span class="ellipsis">{{ props.item.name }}</span>
                        </a>
                      </li>
                      <li class="responsive-table-item p50" :data-label="headers[1].text">
                        <v-checkbox @click.prevent="toggleStatus(props.item)" v-model="props.item.active"
                                :disabled="props.item.id === -1 || !$store.state.auth.permissions.companies.includes('U')"
                                hide-details style="margin: 0 auto; width: 32px" />
                      </li>
                      <li class="responsive-table-item p50" :data-label="headers[2].text">
                        <v-checkbox v-model="props.item.resource_provider" :disabled="props.item.id === -1" readonly
                                hide-details style="margin: 0 auto; width: 32px" />
                      </li>

                      <li class="responsive-table-item p25" :data-label="headers[3].text"><b>{{ props.item.stats.users }}</b></li>
                      <li class="responsive-table-item p25" :data-label="headers[4].text"><b>{{ props.item.stats.individuals }}</b></li>
                      <li class="responsive-table-item p25" :data-label="headers[5].text"><b>{{ props.item.stats.contacts }}</b></li>
                      <li class="responsive-table-item p25" :data-label="headers[6].text"><b>{{ props.item.stats.vessels }}</b></li>

                      <li class="responsive-table-item p50" :data-label="headers[7].text"><b>{{ props.item.vrp_plan_number }}</b></li>
                      <li class="responsive-table-item p50" :data-label="headers[8].text"><b>{{ props.item.vrp_stats.vessels }}</b></li>
                      <li class="responsive-table-item p50" :data-label="headers[9].text"><b :style="'color: ' + getVRPStatusColor(props.item)">{{getVRPStatus(props.item)}}</b></li>
                      <li class="responsive-table-item p50" :data-label="headers[10].text"><b>{{ props.item.vrp_stats.plan_type }}</b></li>
                      <li class="responsive-table-item p100" :data-label="headers[11].text"><b>{{ props.item.location }}</b></li>
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
    name: 'indexCompanies',
    layout: 'home',
    computed: {
      computedHeaders () {
        return this.headers.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide])
      }
    },
    data () {
      return {
        loading: true,
        alert: null,
        companies: [],
        search: '',
        staticSearch: {
          active: -1,
          resource_provider: -1,
          vrp_status: -1,
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
        total: 0,
        pagination: {
          itemsPerPage: 5,
          sortBy: ['name']
        },
        pageFooter: {
          "items-per-page-options": [5, 10, 20, 50, 100]
        },
        headers: [
          { text: 'Company or Plan Holder Name', value: 'name' },

          { text: 'DJS SMFF Coverage?', sortable: false, value: 'active', img: '/images/DJS-Square.png' },
          { text: 'Resource Provider?', sortable: false, value: 'resource_provider', icon: 'fas fa-handshake', color: 'black' },
          { text: 'Users', sortable: false, value: 'stats.users', icon: 'fas fa-user-edit', color: 'black' },
          { text: 'Individuals', sortable: false, value: 'stats.individuals', icon: 'fas fa-hard-hat', color: 'gray' },
          { text: 'Contacts', sortable: false, value: 'stats.contacts', icon: 'fas fa-address-book', color: 'black' },
          { text: 'Vessels', sortable: false, value: 'stats.vessels', icon: 'fas fa-ship', color: 'black' },

          { text: 'Plan Number', sortable: false, value: 'vrp_plan_number', color: '#2196F3' },
          { text: 'Vessels for VRP', sortable: false, value: 'vrp_stats.vessels', icon: 'fas fa-ship', color: '#2196F3' },
          { text: 'Status', sortable: false, value: '', color: '#2196F3' },
          { text: 'Type', sortable: false, value: 'vrp_stats.plan_type', color: '#2196F3' },

          { text: 'Company Location', sortable: false, value: 'location' }
        ],
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
        // if (this.search) {
        let vm = this
        this.search_timeout = setTimeout(function () {
          vm.getDataFromApi()
        }, 500)
        // }
      },
      staticSearch: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      }
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        // get by search keyword
        if (this.search) {
          axios.post(`companies-filter-vrp?query=${this.search}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.companies = res.data.data
              this.total = res.data.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
        // get by sort option
        if (this.pagination.sortBy && !this.search) {
          const direction = this.pagination.descending ? 'desc' : 'asc'
          axios.post(`companies-order?direction=${direction}&sortBy=${this.pagination.sortBy}&page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.loading = false
              this.companies = res.data.data
              this.total = res.data.meta.total
            }).catch(error => console.log(error))
        }
        if (!this.search && !this.pagination.sortBy) {
          axios.post(`companies?page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`, { staticSearch: this.staticSearch })
            .then(res => {
              this.companies = res.data.data
              this.total = res.data.meta.total
            })
            .catch(err => console.log(err))
            .finally(() => (this.loading = false))
        }
      },

      deleteItem (item) {
        this.$root.$confirm('Warning', `You are about to delete the company <b>${item.name}</b>. The files for the vessels under it will be lost. Are you sure that you want to proceed?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.delete('companies/' + item.id + '/destroy')
              .then(res => {
                this.getDataFromApi()
                this.$store.dispatch('notification/message', {
                  message: res.data.message
                })
              })
          }
        })
      },

      toggleStatus (company) {
        var id = this.companies.indexOf(company)
        if(id < 0) return ;
        this.$root.$confirm('Warning', `<b>${this.companies[id].name}</b> status will be changed to DJS <b>${this.companies[id].active ? 'Inactive' : 'Active'}</b>. Are you sure that you want to change this setting?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.post('companies/' + this.companies[id].id + '/toggleStatus')
              .then(res => {
                this.$store.dispatch('notification/message', {
                  message: res.data.message
                })
                this.companies[id].active = !this.companies[id].active
              })
          }
        })
      },

      getNetworks () {
        axios.get('networks/short')
          .then(res => {
            this.itemsNetworks = res.data.data
          })
      },
      getVRPStatus(item) {
        return (item.id === -1 || item.vrp_status !== 'N/A') ? item.vrp_status : 'NO VRP LINK'
      },
      getVRPStatusColor(item) {
        const status = this.getVRPStatus(item)
        if(status === 'Authorized'){
          return 'green'
        } else if(status === 'Not Authorized'){
          return 'red'
        } else {
          return 'yellow'
        }
      }
    },
    mounted () {
      this.getNetworks()
    }
  }
</script>

<style scoped>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  th.rotate {
    /* Something you can count on */
    height: 140px;
    white-space: nowrap;
  }

  th.rotate > div {
    transform: translate(5px, 55px) rotate(270deg);
    width: 10px;
  }

  th.rotate > div > span {
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
