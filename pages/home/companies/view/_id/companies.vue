<template>
  <div v-if="$store.state.auth.permissions.companies.includes('R')">
    <div class="md-layout">
      <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
        <md-card>
          <md-card-header>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100">
                <h4 class="title">Companies</h4>
              </div>
            </div>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100 btn-area">
                <md-button class="primary md-sm" nuxt 
                      @click="$router.push({path: '/home/companies/new', query: {operating_company_id:$route.params.id}})"
                      :disabled="!$store.state.auth.permissions.companies.includes('C')">
                  Add Company
                  <md-tooltip>Add Company</md-tooltip>
                </md-button>
              </div>
            </div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <v-container grid-list-md fluid>
              <v-layout row wrap>
                <v-flex xs12 sm4>
                  <v-text-field
                      v-model="search"
                      label="Name / Plan Number"
                      prepend-inner-icon="search"
                      clearable
                  >
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                  <v-select v-model="staticSearch.active"
                            :items="itemsActiveStatus"
                            item-text="option"
                            item-value="value"
                            label="DJS SMFF Coverage"
                            prepend-icon="fas fa-check"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                  <v-select v-model="staticSearch.vrp_status"
                            :items="itemsVRPStatus"
                            item-text="option"
                            item-value="value"
                            label="VRP Express"
                            prepend-icon="fas fa-check"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                  <v-select v-model="staticSearch.resource_provider"
                            :items="itemsResourceProvider"
                            item-text="option"
                            item-value="value"
                            label="Resource Provider"
                            prepend-icon="fas fa-check"
                  ></v-select>
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
                                  clearable
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-container>
            <v-data-table
                :headers="headers"
                :items="companies"
                item-key="id+plan_number"
                :server-items-length="total"
                :footer-props="pageFooter"
                :options.sync="pagination"
                :loading="loading"
                class="elevation-1" >

              <template v-slot:item="{ props }">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.plan_number }}</td>
                <td>
                  <template v-if="props.item.id === -1 || props.item.vrp_status !== 'N/A'">
                    <v-btn :color="props.item.vrp_status === 'Authorized' ? 'primary':'error'" small depressed rounded>
                      {{props.item.vrp_status}}
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn block depressed disabled rounded small>NO VRP LINK</v-btn>
                  </template>
                </td>
                <td>
                  <v-btn :color="props.item.resource_provider ? 'primary':'error'" small depressed rounded
                        :disabled="props.item.id === -1">
                    {{props.item.resource_provider?
                    'Provider':'Non-provider'}}
                  </v-btn>
                </td>
                <td>
                  <v-btn :color="props.item.active ? 'primary':'error'" small depressed rounded
                        @click="toggleStatus(props.item)"
                        :disabled="props.item.id === -1 || !$store.state.auth.permissions.companies.includes('U')">
                    {{props.item.active?
                    'Active':'Inactive'}}
                  </v-btn>
                </td>
                <td>{{ props.item.location }}</td>
                <td class="text-xs-center">
                  <v-container style="padding: 3px; white-space: nowrap">
                    <v-layout>
                      <v-flex xs6>{{ props.item.vrp_stats.plan_type }}<br>Plan Type</v-flex>
                      <v-divider class="mx-1" inset vertical></v-divider>
                      <v-flex xs6>{{ props.item.vrp_stats.vessels }}<br>Vessels</v-flex>
                    </v-layout>
                  </v-container>
                </td>
                <td class="text-xs-center">
                  <v-container style="padding: 3px; white-space: nowrap">
                    <v-layout>
                      <v-flex xs4>{{ props.item.stats.users }}<br>Users</v-flex>
                      <v-divider class="mx-1" inset vertical></v-divider>
                      <v-flex xs4>{{ props.item.stats.individuals }}<br>Individuals</v-flex>
                      <v-divider class="mx-1" inset vertical></v-divider>
                      <v-flex xs4>{{ props.item.stats.vessels }}<br>Vessels</v-flex>
                      <v-divider class="mx-1" inset vertical></v-divider>
                      <v-flex xs4>{{ props.item.stats.contacts }}<br>Contacts</v-flex>
                    </v-layout>
                  </v-container>
                </td>
                <td class="justify-center layout px-0">
                  <v-btn text icon nuxt :to="'/home/companies/view/'+props.item.id" v-if="props.item.id !== -1"
                        :disabled="!$store.state.auth.permissions.companies.includes('R') && !$store.state.auth.permissions.companies.includes('U')">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn text icon nuxt :to="'/home/companies/view/'+props.item.plan_number+'/vrpexpress'" v-else
                        :disabled="!$store.state.auth.permissions.companies.includes('R') && !$store.state.auth.permissions.companies.includes('U')">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn text icon @click="deleteItem(props.item)"
                        :disabled="props.item.id === -1 || !$store.state.auth.permissions.companies.includes('D') || true">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'index',
    layout: 'home',
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
          networks: [],
          parent: this.$route.params.id
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
          itemsPerPage: 20
        },
        pageFooter: {
          "items-per-page-options": [5, 10, 20, 50, 100]
        },
        headers: [{ text: 'Company or Plan Holder Name', value: 'name' },
          { text: 'Plan Number', sortable: false, value: 'plan_number' },
          { text: 'VRP Express', sortable: false, value: 'vrp_status' },
          { text: 'Resource Provider', sortable: false, value: 'resource_provider' }, {
            text: 'DJS SMFF Coverage?',
            sortable: false,
            value: 'active'
          }, { text: 'Company Location', sortable: false, value: 'location' },
          { text: 'VRP Stats', sortable: false, value: 'vrp_stats' },
          { text: 'Company Stats', sortable: false, value: 'stats' },
          { text: 'Actions', sortable: false }],
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
        if (this.search) {
          let vm = this
          this.search_timeout = setTimeout(function () {
            vm.getDataFromApi()
          }, 500)
        }
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
            })
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

      toggleStatus (item) {
        var id = this.companies.indexOf(item)
        if(id < 0)  return 
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
      }
    },
    mounted () {
      this.getNetworks()
    }
  }
</script>

<style scoped>

</style>
