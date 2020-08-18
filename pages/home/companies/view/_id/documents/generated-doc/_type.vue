<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <h4 class="title">Company Documents/{{ directory.name }}</h4>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-container fluid>
            <div class="md-layout">
              <div class="md-layout-item md-xsmall-size-100" style="padding: 0; flex: none !important">
                <dropzone id="foo" ref="el" :options="dropzoneOptions" @vdropzone-success="fileUploaded"
                          :destroyDropzone="true" v-show="$store.state.auth.permissions.companies.includes('U')"></dropzone>
              </div>
              <div class="md-layout-item md-xsmall-size-100" style="padding: 0; flex: none !important">
                <md-button class="primary" @click="dialogGenerateDocument = true" style="width: 100%"
                      :disabled="!$store.state.auth.permissions.companies.includes('U')">
                  Generate new Document
                </md-button>
              </div>
            </div>
          </v-container>
          <v-data-table
              :headers="headers"
              :items="files"
              :loading="loadingTable">
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
              <v-alert :value="true" color="info" icon="info" outlined style="margin-top: 20px;">
                No {{ directory.name }} generated or uploaded yet.
              </v-alert>
            </template>
          </v-data-table>
        </md-card-content>
      </md-card>
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
      <v-dialog v-model="dialogGenerateDocument" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            New Document
          </v-card-title>
          <v-card-text>
            <v-form ref="documentAddForm" v-model="dataGenerate.valid">
              <template v-if="directory.code === 'damage-stability-coverage-certification'">
                <v-text-field
                    v-model="dataGenerate.certificateNumber"
                    :rules="[v => !!v || 'Certificate number is required']"
                    label="Certificate Number*"
                    prepend-icon="edit"
                    required />
                <v-text-field
                    v-model="dataGenerate.certificateRevision"
                    :rules="[v => !!v || 'Certificate revision is required']"
                    label="Certificate Revision*"
                    prepend-icon="edit"
                    required />
              </template>
              <v-menu
                  :close-on-content-click="false"
                  v-model="dataGenerate.menu"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px" >
                <template v-slot:activator="{ on }">
                  <v-text-field
                      v-model="dataGenerate.dateIssued"
                      :rules="[v => !!v || 'Issue Date is required']"
                      label="Issue Date*"
                      prepend-icon="event"
                      readonly
                      required />
                </template>
                <v-date-picker v-model="dataGenerate.dateIssued" @input="dataGenerate.menu = false"></v-date-picker>
              </v-menu>
              <template
                  v-if="directory.code === 'multiple-vessels-pre-fire-plan-certification' || directory.code === 'single-vessel-pre-fire-plan-certification'">
                <v-select
                    :items="editedItem.addresses"
                    :rules="[v => !!v || 'Address is required']"
                    v-model="dataGenerate.address"
                    item-text="address"
                    item-value="id"
                    prepend-icon="fas fa-map-marked"
                    label="Address*"
                    required />
              </template>
              <template
                  v-if="directory.code === 'single-vessel-pre-fire-plan-certification' || directory.code === 'aa-vessel-specific'">
                <v-autocomplete v-model="dataGenerate.vessel"
                                :items="itemsVessels"
                                :rules="[v => !!v || 'Vessel is required']"
                                item-text="name"
                                item-value="id"
                                label="Vessel*"
                                prepend-icon="fas fa-ship"
                                clearable
                                required />
              </template>
              <template v-if="directory.code === 'nt-smff-annex'">
                <v-autocomplete v-model="dataGenerate.qi"
                                :items="itemsQI"
                                :rules="[v => !!v || 'QI is required']"
                                item-text="name"
                                item-value="id"
                                label="QI*"
                                prepend-icon="fas fa-anchor"
                                clearable
                                required />
                <v-autocomplete v-model="dataGenerate.dpa"
                                :items="itemsDPA"
                                :rules="[v => !!v || 'DPA Contact is required']"
                                item-text="name"
                                item-value="id"
                                label="DPA Contacts*"
                                prepend-icon="email"
                                multiple
                                clearable
                                required />
                <v-autocomplete v-model="dataGenerate.contract"
                                :items="itemsContract"
                                :rules="[v => !!v || 'Contract is required']"
                                item-text="name"
                                item-value="name"
                                label="Contract*"
                                prepend-icon="fa fa-server"
                                clearable
                                required />
              </template>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogGenerateDocument = false" >
              Cancel
            </v-btn>
            <v-btn color="primary" text :disabled="!dataGenerate.valid" @click="generateDocument" >
              Generate
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.active" bottom right>{{snackbar.message}}
        <v-btn text @click="snackbar.active = false" color="error">Close</v-btn>
      </v-snackbar>
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
    name: 'type',
    components: {
      Dropzone
    },
    data () {
      return {
        loadingGenerateDocument: false,
        standBy: true,
        loadingTable: true,
        dialogDeleteConfirm: false,
        dialogGenerateDocument: false,
        deleting: false,
        alert: null,
        snackbar: {
          active: false,
          message: ''
        },
        editedItem: {
          id: null,
          name: '',
          addresses: [],
          active: true
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
            name: 'Group V Consent Letter',
            code: 'group-v-consent-letter',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/group-v-consent-letter',
            count: 0
          },
          {
            name: 'Letter of Intent - Non Tank Vessels below 250 bbls',
            code: 'letter-of-intent-non-tank-vessels-below-250-bbls',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/letter-of-intent-non-tank-vessels-below-250-bbls',
            count: 0
          },
          {
            name: 'Letter of Intent - Non Tank Vessels',
            code: 'letter-of-intent-non-tank-vessels',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/letter-of-intent-non-tank-vessels',
            count: 0
          },
          {
            name: 'SMFF Coverage Certification',
            code: 'smff-coverage-certification',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/smff-coverage-certification',
            count: 0
          },
          {
            name: 'Damage Stability Coverage Certification',
            code: 'damage-stability-coverage-certification',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/damage-stability-coverage-certification',
            count: 0
          },
          {
            name: 'Non-Tank SMFF Annex',
            code: 'nt-smff-annex',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/nt-smff-annex',
            count: 0
          },
          {
            name: 'Tank SMFF Annex',
            code: 'tank-smff-annex',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/tank-smff-annex',
            count: 0
          },
          {
            name: 'Combined SMFF Annex',
            code: 'combined-smff-annex',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/combined-smff-annex',
            count: 0
          },
          {
            name: 'SCHEDULE A Non-Tank',
            code: 'schedule-a-non-tank',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/schedule-a-non-tank',
            count: 0
          },
          {
            name: 'SCHEDULE A Tanker',
            code: 'schedule-a-tanker',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/schedule-a-tanker',
            count: 0
          },
          {
            name: 'SCHEDULE A Combined',
            code: 'schedule-a-combined',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/schedule-a-combined',
            count: 0
          },
          {
            name: 'Written Consent Form - Tank',
            code: 'written-consent-form-tank',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/written-consent-form-tank',
            count: 0
          },
          {
            name: 'Written Consent Form',
            code: 'written-consent-form',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/written-consent-form',
            count: 0
          },
          {
            name: 'Multiple Vessels Pre-fire Plan Certification',
            code: 'multiple-vessels-pre-fire-plan-certification',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/multiple-vessels-pre-fire-plan-certification',
            count: 0
          },
          {
            name: 'Single Vessel Pre-fire Plan Certification',
            code: 'single-vessel-pre-fire-plan-certification',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/single-vessel-pre-fire-plan-certification',
            count: 0
          },
          {
            name: 'AA-Vessel Specific Page',
            code: 'aa-vessel-specific',
            to: '/home/companies/view/' + this.$route.params.id + '/documents/generated-doc/aa-vessel-specific',
            count: 0
          }
        ],
        directory: {
          name: null,
          code: null
        },
        dataGenerate: {
          valid: true,
          menu: false,
          dateCreated: new Date().toISOString().substr(0, 10),
          dateIssued: new Date().toISOString().substr(0, 10),
          address: null,
          certificateNumber: null,
          certificateRevision: null,
          qi: null,
          dpa: [],
          contract: null,
          vessel: null
        },
        defaultDataGenerate: {
          valid: true,
          menu: false,
          dateCreated: new Date().toISOString().substr(0, 10),
          dateIssued: new Date().toISOString().substr(0, 10),
          address: null,
          certificateNumber: null,
          certificateRevision: null,
          qi: null,
          dpa: [],
          contract: null
        },
        itemsQI: [],
        itemsDPA: [],
        itemsContract: [],
        itemsVessels: []
      }
    },
    watch: {
      dialogGenerateDocument (val) {
        val || this.closeDialogGenerateDocument()
      }
    },
    methods: {
      getDataFromApi () {
        axios.get('companies/' + this.$route.params.id + '/shortWithAddress')
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
      },
      closeDialogGenerateDocument () {
        this.dialogGenerateDocument = false
        this.$refs.documentAddForm.resetValidation()
        this.dataGenerate = Object.assign({}, this.defaultDataGenerate)
      },
      generateDocument () {
        this.loadingGenerateDocument = true
        this.dataGenerate.name = this.directory.name
        axios.post('companies/' + this.$route.params.id + '/documents/' + this.directory.code + '/generateV2', this.dataGenerate)
          .then(res => {
            this.getFiles()
            this.snackbar = { active: true, message: res.data.message }
            this.loadingGenerateDocument = false
          })
        this.closeDialogGenerateDocument()
      },
      processAdditionalData () {
        switch (this.$route.params.type) {
          case 'nt-smff-annex':
            axios.get('companies/' + this.$route.params.id + '/qi')
              .then(res => {
                this.itemsQI = res.data.data
              })
            axios.get('companies/' + this.$route.params.id + '/contacts/dpa')
              .then(res => {
                this.itemsDPA = res.data.data
              })
            axios.get('companies/' + this.$route.params.id + '/documents/contracts')
              .then(res => {
                this.itemsContract = res.data
              })
            break
          case 'aa-vessel-specific':
          case 'single-vessel-pre-fire-plan-certification':
            axios.get('vessels/company/' + this.$route.params.id + '/index')
              .then(res => {
                this.itemsVessels = res.data.data
              })
            break
        }
      }
    },
    mounted () {
      this.setDirectory()
      this.getDataFromApi()
      this.getFiles()
      this.processAdditionalData()
      this.dropzone = this.$refs.el.dropzone
    }
  }
</script>

<style scoped>

</style>
