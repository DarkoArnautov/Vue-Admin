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
      <div style="padding: 30px 0 20px 0; width: 100%" v-else align="center">
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
      </div>
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
                  @click="$refs.inputUpload.click()"
                  style="cursor: pointer"
                  class="grey lighten-2"
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
          { title: 'Info', icon: 'fas fa-folder-open fa-fw', to: '/home/vessels/view/' + this.$route.params.id },
          {
            title: 'Construction Detail',
            icon: 'fas fa-ruler-combined fa-fw',
            to: '/home/vessels/view/' + this.$route.params.id + '/constructionDetail'
          },
          {
            title: 'Fire Plans',
            icon: 'fas fa-fire-extinguisher fa-fw',
            to: '/home/vessels/view/' + this.$route.params.id + '/fireplans'
          },
          {
            title: 'Drawings',
            icon: 'fas fa-drafting-compass fa-fw',
            to: '/home/vessels/view/' + this.$route.params.id + '/drawings'
          },
          {
            title: 'RACs',
            icon: 'fas fa-drafting-compass fa-fw',
            to: '/home/vessels/view/' + this.$route.params.id + '/racs'
          },
          {
            title: 'SMFF Capabilities',
            icon: 'fas fa-hard-hat fa-fw',
            to: '/home/vessels/view/' + this.$route.params.id + '/smff'
          },
          {
            title: 'AIS Data',
            icon: 'fas fa-location-arrow fa-fw',
            to: '/home/vessels/view/' + this.$route.params.id + '/ais'
          },
          {
            title: 'Notes',
            icon: 'fas fa-sticky-note fa-fw',
            to: '/home/vessels/view/' + this.$route.params.id + '/notes'
          },
          {
            title: 'Damage Stability Models',
            icon: 'fas fa-laptop fa-fw',
            to: '/home/vessels/view/' + this.$route.params.id + '/dsm'
          }
        ],
        activeMenu: null,
        loading: true,
        saving: false,
        valid: true,
        edit: false,
        alert: null,
        coverPhoto: '',
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
        axios.get('vessels/' + this.$route.params.id + '/getPhoto')
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
        axios.delete('vessels/' + this.$route.params.id + '/destroyPhoto')
          .then(res => {
            this.getCover()
            this.$store.dispatch('notification/message', res.data.message)
          })
      },
      submitFile ($event) {
        this.uploading = true
        let formData = new FormData()
        formData.append('file', $event.target.files[0])
        axios.post('vessels/' + this.$route.params.id + '/setPhoto',
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
        axios.get('vessels/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
          })
      },

      toggleStatus () {
        this.$root.$confirm('Warning', `<b>${this.editedItem.name}</b> status will be changed to DJS <b>${this.editedItem.active ? 'Inactive' : 'Active'}</b>. Are you sure that you want to change this setting?`, { color: 'warning' }).then((confirm) => {
          if (confirm) {
            axios.post('vessels/' + this.$route.params.id + '/toggleStatus')
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
          : this.$router.push('/home/vessels')
      }
    },
    mounted () {
      const activePanel = this.getActivePanelWithPath(this.$nuxt.$route.path)
      if(activePanel){
        this.activeMenu = activePanel
      }

      this.getDataFromApi()
      this.getCover()
    },
    created () {
      this.$root.$on('vessel_updated', () => {
        this.getDataFromApi()
        this.getCover()
      })
    }
  }
</script>

<style scoped>

</style>
