<template>
  <div v-if="$store.state.auth.permissions.settings.includes('R')" style="width: 100%">
    <v-card>
      <v-container
          fluid
          grid-list-md
      >
        <v-layout row wrap>
          <v-flex xs12 lg3>
            <v-card>
              <v-list class="pt-0" dense>
                <v-list-item
                    v-for="item in itemsMenu"
                    :key="item.title"
                    :to="item.to" >
                  <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 lg9>
            <v-card flat>
              <v-card-text>
                <nuxt-child/>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  export default {
    layout: 'home',
    data () {
      return {
        itemsMenu: [
          {
            title: 'Settings',
            icon: 'fas fa-cogs fa-fw',
            to: '/home/settings'
          },
          {
            title: 'System Permissions',
            icon: 'fas fa-traffic-light fa-fw',
            to: '/home/settings/permissions'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
