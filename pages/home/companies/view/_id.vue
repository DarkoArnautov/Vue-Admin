<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <tabs-of-sub-categories
        :categories="itemsMenu"
        class="page-subcategories"
        nav-pills-icons
        plain
        color-button="warning"
        v-if="$vuetify.breakpoint.mdAndUp">
      </tabs-of-sub-categories>
      <div v-else class="fixed-plugin">
        <md-button class="md-simple md-just-icon md-twitter md-sm"><i class="fa fa-home"></i></md-button>
      </div>
      <!-- <div style="padding: 30px 0 20px 0; width: 100%" v-else align="center">
        <md-menu md-align-trigger md-size="medium">
          <md-button md-menu-trigger v-if="activeMenu" class="md-warning">
            <md-icon :class="activeMenu.icon"></md-icon>{{activeMenu.title}}
          </md-button>
          <md-menu-content>
            <md-menu-item
              v-for="(item, index) in itemsMenu"
              :to="item.to"
              :key="index"
              class="subcategory"
              @click="changeActive(item)"
              :class="{active: activeMenu === item.title}">
              <md-icon :class="item.icon"></md-icon>{{item.title}}
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div> -->
      <div class="md-layout">
        <div class="md-layout-item md-xsmall-size-100 md-small-size-100 md-medium-size-100 md-size-60">
          <nuxt-child />
        </div>
        <div class="md-layout-item md-xsmall-size-100 md-small-size-100 md-medium-size-100 md-size-40">
          <md-card class="md-card-profile">
            <div class="md-card-avatar">
              <v-img
                  :src="coverPhoto"
                  lazy-src="/images/no-image.png"
                  aspect-ratio="1"
                  class="grey lighten-2"
                  style="cursor: pointer"
                  @click="$refs.inputUpload.click()"
                  max-height="150" />
            </div>

            <v-alert v-if="alert" type="error" value="true" dismissible>{{alert.message}}
              <div v-for="(error, i) in alert.errors" :key="i">
                {{error[0]}}
              </div>
            </v-alert>
            <input v-show="false" ref="inputUpload" type="file" @change="submitFile">

            <md-card-content v-if="editedItem">
              <h6 class="category text-gray">{{ editedItem.website }}</h6>
              <h4 class="card-title">{{editedItem.name}}</h4>
              <p class="card-description">{{ editedItem.description }}</p>
              <v-btn :color="editedItem.active ? 'primary':'error'" small depressed rounded
                    @click="toggleStatus()" :disabled="!$store.state.auth.permissions.companies.includes('U')">
                {{editedItem.active? 'Active':'Inactive'}}
              </v-btn>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { TabsOfSubCategories } from '@/components'
  
  export default {
    layout: 'home',
    components: {
      TabsOfSubCategories
    },
    data () {
      return {
        itemsMenu: [
          { 
            title: 'Info', 
            icon: 'fas fa-folder-open fa-fw', 
            to: '/home/companies/view/' + this.$route.params.id
          },
          {
            title: 'Addresses',
            icon: 'fas fa-map-marked-alt fa-fw',
            to: '/home/companies/view/' + this.$route.params.id + '/addresses'
          },
          {
            title: 'Plan Holder',
            icon: 'fas fa-project-diagram fa-fw',
            to: '/home/companies/view/' + this.$route.params.id + '/plan'
          },
          {
            title: 'SMFF Capabilities',
            icon: 'fas fa-hard-hat fa-fw',
            to: '/home/companies/view/' + this.$route.params.id + '/smff'
          },
          {
            title: 'Operated Companies',
            icon: 'fas fa-building fa-fw',
            to: '/home/companies/view/' + this.$route.params.id + '/companies'
          },
          {
            title: 'Contacts',
            icon: 'fas fa-users fa-fw',
            to: '/home/companies/view/' + this.$route.params.id + '/contacts'
          },
          {
            title: 'Documents',
            icon: 'fas fa-file fa-fw',
            to: '/home/companies/view/' + this.$route.params.id + '/documents'
          },
          {
            title: 'Vessels',
            icon: 'fas fa-ship fa-fw',
            to: '/home/companies/view/' + this.$route.params.id + '/vessels'
          },
          {
            title: 'Individuals',
            icon: 'fas fa-user-tie fa-fw',
            to: '/home/companies/view/' + this.$route.params.id + '/individuals'
          }
        ],
        activeMenu: null,
        loading: true,
        saving: false,
        valid: true,
        edit: false,
        alert: null,
        coverPhoto: '/images/no-image.png',
        uploading: false,
        loadingPhoto: true,
        noImagePhoto: '/images/no-image.png',
        editedItem: null
      }
    },
    methods: {
      getActivePanelWithPath(path) {
        for(var i = 0; i < this.itemsMenu.length; i++){
          if(this.itemsMenu[i].to === path) 
            return this.itemsMenu[i]
        }
      },
      changeActive(menu) {
        this.activeMenu = menu
      },
      getCover () {
        this.loadingPhoto = true
        axios.get('companies/' + this.$route.params.id + '/getPhoto')
          .then(res => {
            if (res.data) {
              this.coverPhoto = res.data + '?' + Math.random().toString(36).substring(7)
            } else {
              this.coverPhoto = this.noImagePhoto
            }
            this.loadingPhoto = false
          })
      },
      deleteCover () {
        this.coverPhoto = this.noImagePhoto
        axios.delete('companies/' + this.$route.params.id + '/destroyPhoto')
          .then(res => {
            this.getCover()
            this.$store.dispatch('notification/message', res.data.message)
          })
      },
      submitFile ($event) {
        this.uploading = true
        let formData = new FormData()
        formData.append('file', $event.target.files[0])
        axios.post('companies/' + this.$route.params.id + '/setPhoto',
          formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then(res => {
          this.alert = null
          this.getCover()
          this.$store.dispatch('notification/message', res.data.message)
          this.uploading = false
        }).catch(error => {
          if (error.response && error.response.data) {
            this.saving = false
            this.alert = {
              type: error.response.data.type,
              message: error.response.data.message || error.response.status,
              errors: error.response.data.errors
            }
            this.uploading = false
          }
        })
      },
      getDataFromApi () {
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            if(res.data.data)
              this.editedItem = res.data.data[0]
          })
      },

      toggleStatus () {
        this.$root.$confirm('Warning', `<b>${this.editedItem.name}</b> status will be changed to DJS <b>${this.editedItem.active ? 'Inactive' : 'Active'}</b>. Are you sure that you want to change this setting?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.post('companies/' + this.$route.params.id + '/toggleStatus')
              .then(res => {
                this.$store.dispatch('notification/message', {
                  message: res.data.message
                })
                this.editedItem.active = !this.editedItem.active
              })
          }
        })
      },

      goBack () {
        window.history.length > 1
          ? this.$router.back()
          : this.$router.push('/home/companies')
      }
    },
    mounted () {
      
      const activePanel = this.getActivePanelWithPath(this.$nuxt.$route.path)
      if(activePanel){
        this.activeMenu = activePanel
      }
      
      if (this.$nuxt.$route.name !== 'home-companies-view-id-vrpexpress') {
        this.getDataFromApi()
        this.getCover()
      }
    },
    created () {
      this.$root.$on('company_updated', () => {
        this.getDataFromApi()
        this.getCover()
      })
    }
  }
</script>

<style scoped>
  .fixed-plugin {
    position: fixed; 
    right: 0; 
    top: 100px; 
    z-index: 100;
    text-align: left; 
    width: 60px;
    background: rgba(0, 0, 0, 0.4);
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    padding-left: 8px;
  }
</style>
