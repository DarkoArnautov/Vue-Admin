<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">Vessel RAC Information</h4>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 btn-area">
              <v-select :items="years" v-model="year" label="Year" />
            </div>
          </div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <dropzone id="foo" ref="el" :options="dropzoneOptions" @vdropzone-success="fileUploaded"
                @vdropzone-sending="fileSending" :destroyDropzone="true"
                v-show="$store.state.auth.permissions.vessels.includes('U')">
          </dropzone>
          <v-expansion-panels>
            <v-expansion-panel class="mt-2" v-model="panel" expand>
              <v-expansion-panel-content class="grey lighten-5" v-for="(fileDir, year) in files" :key="year">
                <div slot="header">{{year}}</div>
                <v-divider></v-divider>
                <v-card>
                  <v-card-text>
                    <v-data-table :headers="headers" :items="fileDir" :loading="loadingTable">
                      <template slot="items" slot-scope="props">
                        <td>
                          <v-icon>{{ props.item.ext === 'pdf' ? 'fas fa-file-pdf' : 'fas fa-file' }}</v-icon>
                          {{ props.item.name }}
                        </td>
                        <td>{{ props.item.size }}</td>
                        <td class="text-xs-center">
                          <v-btn text icon @click="downloadFile(props.item, year)">
                            <v-icon>cloud_download</v-icon>
                          </v-btn>
                          <v-btn text icon @click="confirmDelete(props.item, year)"
                                :disabled="!$store.state.auth.permissions.vessels.includes('U')">
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </td>
                      </template>
                      <template slot="no-data">
                        <v-alert :value="true" color="info" icon="info" outlined style="margin-top: 20px">
                          No RAC Information files uploaded yet.
                        </v-alert>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-alert
              :value="true"
              v-show="!Object.keys(files).length"
              color="info"
              icon="info"
              outlined>
            No RAC Information files uploaded yet.
          </v-alert>
        </md-card-content>
        <v-dialog v-model="dialogDeleteConfirm" width="500">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
              You are about to DELETE a File.
            </v-card-title>

            <v-card-text>
              Please confirm that you would like to DELETE this File, <b>{{deleteItem.name}}</b>.
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialogDeleteConfirm = false">
                Cancel
              </v-btn>
              <v-btn color="primary" text @click="deleteFile()">
                Delete File
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="standBy" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Please stand by
              <v-progress-linear
                  indeterminate
                  color="white"
                  class="mb-0" />
            </v-card-text>
          </v-card>
        </v-dialog>
      </md-card>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Dropzone from 'nuxt-dropzone'
  import 'nuxt-dropzone/dropzone.css'
  import download from 'downloadjs'
  import { baseURL } from '~/config'

  export default {
    name: 'dsm',
    components: {
      Dropzone
    },
    data () {
      return {
        loadingTable: true,
        standBy: true,
        dialogDeleteConfirm: false,
        alert: null,
        deleteItem: {
          name: null,
          year: null
        },
        headers: [
          { text: 'File Name', value: 'name' },
          { text: 'File Size', value: 'size' },
          { text: 'Actions', sortable: false, align: 'center', value: 'actions' }
        ],
        dropzoneOptions: {
          url: baseURL + 'vessels/' + this.$route.params.id + '/files/racs/upload',
          headers: { 'Authorization': 'Bearer ' + this.$store.state.auth.token },
          thumbnailWidth: 150,
          maxFilesize: 100,
          dictDefaultMessage: '<b>Drag and drop to upload content</b><br/> or click to select a file from your computer'
        },
        files: [],
        dropzone: null,
        years: [],
        year: new Date().getFullYear(),
        panel: []
      }
    },
    methods: {
      getFiles () {
        this.standBy = true
        this.loadingTable = true
        axios.get('vessels/' + this.$route.params.id + '/files/racs')
          .then(res => {
            this.files = res.data
            this.panel = []
            for (let i = 0; i < Object.keys(res.data).length; i++) this.panel.push(true)
            this.standBy = false
            this.loadingTable = false
          })
      },
      confirmDelete (item, year) {
        this.deleteItem.name = item.name
        this.deleteItem.year = year
        this.dialogDeleteConfirm = true
      },
      deleteFile () {
        axios.delete('vessels/' + this.$route.params.id + '/files/racs/' + this.deleteItem.year + '/' + this.deleteItem.name + '/destroy')
          .then(res => {
            this.getFiles()
            this.$store.dispatch('notification/message', res.data.message)
          })
        this.dialogDeleteConfirm = false
      },
      saveFile (s3link, name) {
        axios({
          url: s3link,
          method: 'GET',
          responseType: 'blob',
          timeout: 30000,
          transformRequest: [(data, headers) => {
            delete headers.common.Authorization
            return data
          }]
        })
          .then(downloadRes => {
            download(downloadRes.data, name)
          })
      },
      downloadFile (file, year) {
        axios.get('vessels/' + this.$route.params.id + '/files/racs/' + year + '/' + file.name + '/download')
          .then(res => {
            this.saveFile(res.data.url, file.name)
            this.$store.dispatch('notification/message', res.data.message)
          })
        this.dialogDeleteConfirm = false
      },
      fileUploaded (file, res) {
        this.dropzone.removeAllFiles()
        this.getFiles()
        this.$store.dispatch('notification/message', res.message)
      },
      populateYears (startYear) {
        let currentYear = new Date().getFullYear()
        let years = []
        startYear = startYear || 1980

        while (startYear <= currentYear) {
          years.push(startYear++)
        }

        return years
      },
      fileSending (file, xhr, formData) {
        formData.append('year', this.year)
      }
    },
    mounted () {
      this.getFiles()
      this.dropzone = this.$refs.el.dropzone
      this.years = this.populateYears(2016)
    }
  }
</script>

<style scoped>

</style>
