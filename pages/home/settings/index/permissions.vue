<template>
  <v-layout column wrap>
    <v-flex x12>
      <v-card>
        <v-card-title><span class="headline">Role</span>
          <v-spacer></v-spacer>
          <v-btn text class="primary" @click="updatePermissions"
                 :disabled="!$store.state.auth.permissions.settings.includes('U')">Update
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select :items="roles" item-text="name" item-value="id" v-model="active_role" :disabled="!$store.state.auth.permissions.settings.includes('U')"></v-select>
        </v-card-text>
        <v-card-text v-for="component in components" :key="component.id">
          <table>
            <thead>
            <tr>
              <th colspan="4"><b>{{ component.name }}</b></th>
            </tr>
            <tr>
              <th>
                <v-icon>fas fa-plus-circle fa-fw</v-icon>
              </th>
              <th>
                <v-icon>fas fa-eye fa-fw</v-icon>
              </th>
              <th>
                <v-icon>fas fa-edit fa-fw</v-icon>
              </th>
              <th>
                <v-icon>fas fa-trash-alt fa-fw</v-icon>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <v-checkbox v-model="component.permissions" value="C" :disabled="!$store.state.auth.permissions.settings.includes('U')"></v-checkbox>
              </td>
              <td>
                <v-checkbox v-model="component.permissions" value="R" :disabled="!$store.state.auth.permissions.settings.includes('U')"></v-checkbox>
              </td>
              <td>
                <v-checkbox v-model="component.permissions" value="U" :disabled="!$store.state.auth.permissions.settings.includes('U')"></v-checkbox>
              </td>
              <td>
                <v-checkbox v-model="component.permissions" value="D" :disabled="!$store.state.auth.permissions.settings.includes('U')"></v-checkbox>
              </td>
            </tr>
            </tbody>
          </table>
        </v-card-text>
      </v-card>
    </v-flex>
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
  </v-layout>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'permissions',
    layout: 'home',
    data () {
      return {
        standBy: true,
        roles: [],
        components: [],
        active_role: null
      }
    },
    watch: {
      'active_role' () {
        this.getComponents()
      }
    },
    methods: {
      getComponents () {
        console.log('GETTING PERMISSIONS')
        this.standBy = true
        axios.get('permissions/components/' + this.active_role)
          .then(res => {
            this.components = res.data
            this.standBy = false
          })
      },

      getRoles () {
        axios.get('permissions/roles')
          .then(res => {
            this.roles = res.data
            this.active_role = res.data[0].id
          })
      },

      updatePermissions () {
        axios.post('permissions/update', { roleId: this.active_role, components: this.components })
          .then(res => {
            this.$store.dispatch('notification/message', { message: res.data.message })
          })
      }
    },
    mounted () {
      this.getRoles()
      // this.getComponents()
    }
  }
</script>

<style scoped>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }

  .v-input--selection-controls {
    margin: unset;
    padding: unset;
    height: 25px;
    width: 20px;
  }
</style>
