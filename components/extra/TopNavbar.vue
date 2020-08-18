<template>
  <md-toolbar
    md-elevation="0"
    class="md-transparent"
    :class="[{'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute}, {'md-toolbar-absolute md-white md-fixed-top': ($route.name === 'home-map')}]" >
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ screenName[$route.name] }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-round md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar" >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          
          <div v-show="$route.path === '/home/map'" class="hidden-xs-only">
            <v-btn text v-html="$store.state.map.coordinates"></v-btn>
          </div>

          <v-toolbar-items class="hidden-xs-only">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on" style="padding: 10px 16px">
                  <v-icon>fas fa-user fa-fw</v-icon>
                </v-btn>
              </template>
              <v-list class="grey lighten-2" dense>
                <v-list-item v-if="user" nuxt :to="'/home/individuals/view/' + user.id">
                  <v-list-item-action>
                    <v-icon>fas fa-id-card fa-fw</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item>
                <v-list-item nuxt to="/home/settings" :disabled="!$store.state.auth.permissions.settings.includes('R')">
                  <v-list-item-action>
                    <v-icon>fas fa-cogs fa-fw</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Other Settings</v-list-item-title>
                </v-list-item>
                <v-list-item @click="logOut" nuxt :disabled="!$store.state.auth.permissions.settings.includes('R')">
                  <v-list-item-action>
                    <v-icon>fas fa-sign-out-alt fa-fw</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Log Out</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar-items>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
export default {
  data() {
    return {
      selectedEmployee: "",
      employees: [
        "Jim Halpert",
        "Dwight Schrute",
        "Michael Scott",
        "Pam Beesly",
        "Angela Martin",
        "Kelly Kapoor",
        "Ryan Howard",
        "Kevin Malone"
      ],
      screenName: {
        'home-dashboard': 'Dashboard',
        'home-companies': 'Companies',
        'home-companies-view-id': 'Company Detail',
        'home-companies-view-id-addresses': 'Company Detail',
        'home-companies-view-id-plan': 'Company Detail',
        'home-companies-view-id-smff': 'Company Detail',
        'home-companies-view-id-companies': 'Company Detail',
        'home-companies-view-id-contacts': 'Company Detail',
        'home-companies-view-id-documents': 'Company Detail',
        'home-companies-view-id-vessels': 'Company Detail',
        'home-companies-view-id-individuals': 'Company Detail',
        'home-companies-view-id-documents-generated-doc-type': 'Company Document/Group V Consent Letter',
        'home-individuals': 'Individuals',
        'home-individuals-view-id': 'Individual Detail',
        'home-individuals-view-id-addresses': 'Individual Detail',
        'home-individuals-view-id-smff': 'Individual Detail',
        'home-individuals-view-id-documents': 'Individual Detail',
        'home-individuals-view-id-notes': 'Individual Detail',
        'home-vessels': 'Vessels',
        'home-vessels-view-id': 'Vessel Detail',
        'home-vessels-view-id-constructionDetail': 'Vessel Detail',
        'home-vessels-view-id-fireplans': 'Vessel Detail',
        'home-vessels-view-id-drawings': 'Vessel Detail',
        'home-vessels-view-id-racs': 'Vessel Detail',
        'home-vessels-view-id-smff': 'Vessel Detail',
        'home-vessels-view-id-ais': 'Vessel Detail',
        'home-vessels-view-id-notes': 'Vessel Detail',
        'home-vessels-view-id-dsm': 'Vessel Detail',
        'home-vendors': 'Vendors',
        'home-reports': 'System Reports',
        'home-map': 'Asset Map',
        'home-fleets': 'Fleets',
        'home-settings-index': 'Other Settings',
        'home-settings-index-permissions': 'System Permissions'
      }
    };
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
    logOut () {
      this.$store.dispatch('auth/reset').then(() => {
        this.$router.push('/')
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.auth ? this.$store.state.auth.user : null
    }
  },
};
</script>
