<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100 md-small-size-100 md-medium-size-100 md-large-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <h4 class="title">Documents</h4>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <dropzone id="foo" ref="el" :options="dropzoneOptions" @vdropzone-success="fileUploaded"
                    :destroyDropzone="true" v-show="$store.state.auth.permissions.users.includes('U')"></dropzone>
          <v-data-table :headers="headers" :items="files" :loading="loadingTable">
            <template v-slot:item="props">
              <tr>
                <td>
                  <v-icon>{{ props.item.ext === 'pdf' ? 'fas fa-file-pdf' : 'fas fa-file' }}</v-icon>
                  {{ props.item.name }}
                </td>
                <td>{{ props.item.size }}</td>
                <td class="text-xs-center">
                  <v-btn text icon @click="downloadFile(props.item)">
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                  <v-btn text icon @click="confirmDelete(props.item.name)"
                        :disabled="!$store.state.auth.permissions.users.includes('U')">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template slot="no-data">
              <v-alert :value="true" color="info" icon="info" outlined style="margin: 10px 0;">
                No Documents uploaded yet.
              </v-alert>
            </template>
          </v-data-table>
        </md-card-content>
      </md-card>
      <v-dialog v-model="dialogDeleteConfirm" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            You are about to DELETE a file.
          </v-card-title>

          <v-card-text>
            Please confirm that you would like to DELETE this file, <b>{{deleteItem.name}}</b>.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogDeleteConfirm = false" >
              Cancel
            </v-btn>
            <v-btn color="primary" text @click="deleteFile()" >
              Delete File
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="standBy" persistent width="300">
        <v-card color="primary" dark >
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
    name: 'documents',
    components: {
      Dropzone
    },
    data () {
      return {
        standBy: true,
        loadingTable: true,
        dialogDeleteConfirm: false,
        alert: null,
        deleteItem: {
          name: null
        },
        headers: [
          { text: 'File Name', value: 'name' },
          { text: 'File Size', value: 'size' },
          { text: 'Actions', sortable: false, align: 'center', value: 'actions' }
        ],
        dropzoneOptions: {
          url: baseURL + 'users/' + this.$route.params.id + '/files/documents/upload',
          headers: { 'Authorization': 'Bearer ' + this.$store.state.auth.token },
          thumbnailWidth: 150,
          maxFilesize: 100,
          dictDefaultMessage: '<b>Drag and drop to upload content</b><br/> or click to select a file from your computer'
        },
        files: [],
        dropzone: null
      }
    },
    methods: {
      getFiles () {
        this.standBy = true
        this.loadingTable = true
        axios.get('users/' + this.$route.params.id + '/files/documents')
          .then(res => {
            this.files = res.data
            this.standBy = false
            this.loadingTable = false
          })
      },
      confirmDelete (name) {
        this.deleteItem.name = name
        this.dialogDeleteConfirm = true
      },
      deleteFile () {
        axios.delete('users/' + this.$route.params.id + '/files/documents/' + this.deleteItem.name + '/destroy')
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
      downloadFile (file) {
        axios.get('users/' + this.$route.params.id + '/files/documents/' + file.name + '/download')
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
      }
    },
    mounted () {
      this.getFiles()
      this.dropzone = this.$refs.el.dropzone
    }
  }
</script>

<style scoped>

</style>
