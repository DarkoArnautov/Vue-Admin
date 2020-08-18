<template>
  <div class="md-layout" v-if="$store.state.auth.permissions.system_reports.includes('R')">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <h4 class="title">System Reports</h4>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-data-table
            :headers="headers"
            :items="documents"
            class="elevation-1 mobile-responsive-table"
            :hide-default-header="!$vuetify.breakpoint.mdAndUp">
          <template v-slot:item="props">
            <tr v-if="$vuetify.breakpoint.mdAndUp">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.document_type.toUpperCase() }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon @click="downloadFile(props.item)" v-on="on">
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                  </template>
                  <span>Download File</span>
                </v-tooltip>
              </td>
            </tr>
            <tr v-else>
              <td>
                <ul class="responsive-table-content">
                  <li class="responsive-table-item p100" :data-label="headers[0].text">
                    {{ props.item.name }}
                  </li>
                  <li class="responsive-table-item p50" :data-label="headers[1].text">
                    {{ props.item.document_type.toUpperCase() }}
                  </li>
                  <li class="responsive-table-item p50" :data-label="headers[2].text">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon @click="downloadFile(props.item)" v-on="on" style="height: 25px">
                          <v-icon>cloud_download</v-icon>
                        </v-btn>
                      </template>
                      <span>Download File</span>
                    </v-tooltip>
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
</template>

<script>
  import axios from 'axios'
  import download from 'downloadjs'

  export default {
    name: 'index',
    layout: 'home',
    data () {
      return {
        headers: [
          {
            text: 'Report',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Document Type', value: 'document_type', sortable: false, },
          { text: 'Actions', value: 'actions', sortable: false, }
        ],
        documents: [
          {
            name: 'Companies in the NASA Potential Network',
            document_type: 'csv',
            download_link: 'reports/nasa/potential'
          },
          {
            name: 'DJS vessels and their DPA',
            document_type: 'csv',
            download_link: 'reports/donjon/vessels'
          }
        ]
      }
    },
    methods: {
      downloadFile (item) {
        axios.get(item.download_link, {
          responseType: 'arraybuffer'
        })
          .then(downloadRes => {
            download(downloadRes.data, item.name + ' - ' + Date().toLocaleString() + '.' + item.document_type)
            this.$store.dispatch('notification/message', { message: 'Download started' })
          })
          .catch(error => {
            this.$store.dispatch('notification/message', { message: 'Can not download' })
          })
      }
    }
  }
</script>

<style scoped>

</style>
