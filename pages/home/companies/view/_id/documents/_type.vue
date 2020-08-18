<template>
  <v-card flat>
    <v-card-title>
      <div class="headline">Company {{ directory.name }}</div>
    </v-card-title>
    <v-card-text>
      <dropzone id="foo" ref="el" :options="dropzoneOptions" @vdropzone-success="fileUploaded"
                :destroyDropzone="true" v-show="$store.state.auth.permissions.companies.includes('U')"></dropzone>
      <v-data-table
          :headers="headers"
          :items="files"
          :loading="loadingTable"
      >
        <template slot="items" slot-scope="props">
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
                   :disabled="deleting || !$store.state.auth.permissions.companies.includes('U')">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="no-data">
          <v-alert
              :value="true"
              color="info"
              icon="info"
              outlined
          >
            No {{ directory.name }} uploaded yet.
          </v-alert>
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog
        v-model="dialogDeleteConfirm"
        width="500"
    >
      <v-card>
        <v-card-title
            class="headline grey lighten-2"
            primary-title
        >
          You are about to DELETE a File.
        </v-card-title>

        <v-card-text>
          Please confirm that you would like to DELETE this File, <b>{{deleteItem.name}}</b>.
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
    <v-snackbar v-model="snackbar.active" bottom right>{{snackbar.message}}
      <v-btn text @click="snackbar.active = false" color="error">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
  import axios from 'axios'
  import Dropzone from 'nuxt-dropzone'
  import 'nuxt-dropzone/dropzone.css'
  import download from 'downloadjs'
  import { baseURL } from '~/config'

  export default {
    name: 'type',
    components: {
      Dropzone
    },
    data () {
      return {
        standBy: true,
        loadingTable: true,
        dialogDeleteConfirm: false,
        deleting: false,
        alert: null,
        snackbar: {
          active: false,
          message: ''
        },
        editedItem: {
          id: null,
          name: null,
          active: null
        },
        deleteItem: {
          name: null
        },
        headers: [
          { text: 'File Name', value: 'name' },
          { text: 'File Size', value: 'size' },
          { text: 'Actions', sortable: false, align: 'center', value: 'actions' }
        ],
        dropzoneOptions: {
          url: baseURL + 'companies/' + this.$route.params.id + '/documents/' + this.$route.params.type + '/upload',
          headers: { 'Authorization': 'Bearer ' + this.$store.state.auth.token },
          thumbnailWidth: 150,
          maxFilesize: 100,
          dictDefaultMessage: '<b>Drag and drop to upload content</b><br/> or click to select a file from your computer'
        },
        files: [],
        dropzone: null,
        directories: [
          {
            name: 'OPA-90 Client Contract',
            code: 'contracts',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/contracts',
            count: 0
          },
          {
            name: 'OPA-90 Response Asset Agreement',
            code: 'opa-90-response-asset-agreement',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/opa-90-response-asset-agreement',
            count: 0
          },
          {
            name: 'NASA Response Asset Agreement',
            code: 'nasa-response-asset-agreement',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/nasa-response-asset-agreement',
            count: 0
          },
          {
            name: 'Damage Stability Certificates',
            code: 'damage-stability-certificates',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/damage-stability-certificates',
            count: 0
          },
          {
            name: 'Shipboard Spill Mitigation Procedures',
            code: 'shipboard-spill-mitigation-procedures',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/shipboard-spill-mitigation-procedures',
            count: 0
          }
        ],
        directory: {
          name: null,
          code: null
        }
      }
    },
    methods: {
      getDataFromApi () {
        axios.get('companies/' + this.$route.params.id + '/short')
          .then(res => {
            this.editedItem = res.data.data
          })
      },
      getFiles () {
        this.standBy = true
        this.loadingTable = true
        axios.get('companies/' + this.$route.params.id + '/documents/' + this.directory.code)
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
        this.deleting = true
        axios.delete('companies/' + this.$route.params.id + '/documents/' + this.directory.code + '/' + this.deleteItem.name + '/destroy')
          .then(res => {
            this.getFiles()
            this.deleting = false
            this.snackbar = { active: true, message: res.data.message }
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
        axios.get('companies/' + this.$route.params.id + '/documents/' + this.directory.code + '/' + file.name + '/download')
          .then(res => {
            this.saveFile(res.data.url, file.name)
            this.snackbar = { active: true, message: res.data.message }
          })
        this.dialogDeleteConfirm = false
      },
      toggleStatus () {
        axios.post('companies/' + this.$route.params.id + '/toggleStatus')
          .then(res => {
            this.editedItem.active = !this.editedItem.active
            this.snackbar = { active: true, message: res.data.message }
          })
      },
      fileUploaded (file, res) {
        this.dropzone.removeAllFiles()
        this.getFiles()
        this.snackbar = { active: true, message: res.message }
      },
      setDirectory () {
        this.directory = this.directories.find(directory => directory.code === this.$route.params.type)
      }
    },
    mounted () {
      this.setDirectory()
      this.getDataFromApi()
      this.getFiles()
      this.dropzone = this.$refs.el.dropzone
    }
  }
</script>

<style scoped>

</style>
