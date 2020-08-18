<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">Contacts</h4>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 btn-area">
              <v-dialog
                  v-model="dialogAddContact"
                  width="500"
                  v-if="$store.state.auth.permissions.companies.includes('U')">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" class="primary md-sm" text>Add Contact</v-btn>
                  </template>
                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>New Contact</v-card-title>

                  <v-card-text>
                    <v-form ref="contactAddForm" v-model="contactAddFormValid" lazy-validation>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm6>
                            <v-text-field
                                v-model="newContact.prefix"
                                label="Prefix"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field
                                v-model="newContact.first_name"
                                label="First Name*"
                                :rules="[v => !!v || 'First Name is required']"
                                required
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field
                                v-model="newContact.last_name"
                                label="Last Name*"
                                :rules="[v => !!v || 'Last Name is required']"
                                required
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field
                                v-model="newContact.work_phone"
                                label="Phone"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field
                                v-model="newContact.mobile_phone"
                                label="Mobile"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field
                                v-model="newContact.aoh_phone"
                                label="AOH Phone"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field
                                v-model="newContact.fax"
                                label="Fax"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-text-field
                                v-model="newContact.email"
                                label="Email"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-autocomplete
                                v-model="newContact.types"
                                :items="itemsContactTypes"
                                item-text="name"
                                item-value="id"
                                label="Type"
                                multiple
                                clearable
                            ></v-autocomplete>
                          </v-flex>
                        </v-layout>
                      </v-container>
                      <small>*indicates required field</small>
                    </v-form>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialogAddContact = false" >
                      Cancel
                    </v-btn>
                    <v-btn color="primary" text @click="addContact" >
                      Add Contact
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-alert :value="true" color="info" icon="info" outlined v-show="!contacts.length" >
            No contacts found.
          </v-alert>
          <v-expansion-panels multiple v-model="panel">
            <v-expansion-panel v-for="(contact,i) in contacts" :key="i" >
              <v-expansion-panel-header>
                <v-btn small text icon
                    @click.stop="edit(contact)"
                    :disabled="!$store.state.auth.permissions.companies.includes('U')" >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn small text icon
                    @click.stop="deleteContact(contact)"
                    :disabled="!$store.state.auth.permissions.companies.includes('U')" >
                  <v-icon>delete</v-icon>
                </v-btn>
                {{contact.prefix}} {{contact.first_name}} {{contact.last_name}}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card>
                  <v-card-text>
                    <v-form ref="contactEditForm" v-model="contactAddFormValid" lazy-validation>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm6 md4>
                            <v-text-field
                                v-model="contact.prefix"
                                label="Prefix"
                                :disabled="!contact.edit" />
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field
                                v-model="contact.first_name"
                                label="First Name*"
                                :rules="[v => !!v || 'First Name is required']"
                                required
                                :disabled="!contact.edit" />
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field
                                v-model="contact.last_name"
                                label="Last Name*"
                                :rules="[v => !!v || 'Last Name is required']"
                                required
                                :disabled="!contact.edit" />
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field
                                v-model="contact.work_phone"
                                label="Phone"
                                :disabled="!contact.edit" />
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field
                                v-model="contact.mobile_phone"
                                label="Mobile"
                                :disabled="!contact.edit" />
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field
                                v-model="contact.aoh_phone"
                                label="AOH Phone"
                                :disabled="!contact.edit" />
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field
                                v-model="contact.fax"
                                label="Fax"
                                :disabled="!contact.edit" />
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field
                                v-model="contact.email"
                                label="Email"
                                :disabled="!contact.edit" />
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-autocomplete
                                v-model="contact.types"
                                :items="itemsContactTypes"
                                item-text="name"
                                item-value="id"
                                label="Type"
                                multiple
                                clearable
                                :disabled="!contact.edit" />
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-form>
                  </v-card-text>
                  <v-card-actions v-show="contact.edit">
                    <v-spacer></v-spacer>
                    <v-btn class="primary" text @click="saveContact(contact, i)">Save</v-btn>
                    <v-btn text @click="cancelEdit(contact)">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </md-card-content>
      </md-card>
      <v-dialog
          v-model="dialogDeleteConfirm"
          width="500" >
        <v-card>
          <v-card-title
              class="headline grey lighten-2"
              primary-title >
            ALERT! You are about to DELETE a Contact.
          </v-card-title>

          <v-card-text>
            Please confirm that you would like to DELETE this Contact, <b>{{deleteItem.name}}</b>.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogDeleteConfirm = false" >
              Cancel
            </v-btn>
            <v-btn color="primary" text @click="confirmDelete(deleteItem.id)" >
              Delete Contact
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'contacts',
    data () {
      return {
        loading: true,
        valid: true,
        dialogDeleteConfirm: false,
        dialogAddContact: false,
        contactAddFormValid: false,
        alert: null,
        newContact: {
          prefix: null,
          first_name: null,
          last_name: null,
          email: null,
          work_phone: null,
          mobile_phone: null,
          aoh_phone: null,
          fax: null,
          types: []
        },
        defaultContact: {
          prefix: null,
          first_name: null,
          last_name: null,
          email: null,
          work_phone: null,
          mobile_phone: null,
          aoh_phone: null,
          fax: null,
          types: []
        },
        contacts: [],
        panel: [],
        itemsContactTypes: [],
        editItem: null,
        deleteItem: {
          id: null,
          name: null
        }
      }
    },
    watch: {
      dialogAddContact (val) {
        val || this.close()
      }
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/contacts')
          .then(res => {
            this.contacts = res.data.data
            this.panel = []
            // this.panel = [...Array(this.contacts).keys()].map((k, i) => i)
            // console.log(this.contacts)
            // console.log(this.panel)
            for (let i = 0; i < this.contacts.length; i++) 
              this.panel.push(i)
            this.loading = false
          })
      },

      confirmDelete (id) {
        axios.delete('companies/contacts/' + id + '/destroy')
          .then(res => {
            this.getDataFromApi()
            this.$store.dispatch('notification/message', {
              message: res.data.message
            })
          })
        this.dialogDeleteConfirm = false
      },

      getContactTypes () {
        axios.get('companies/contacts/types')
          .then(res => {
            this.itemsContactTypes = res.data.data
          })
      },

      close () {
        this.dialogAddContact = false
        this.$refs.contactAddForm.resetValidation()
        this.newContact = Object.assign({}, this.defaultContact)
      },

      addContact () {
        this.alert = null
        if (this.$refs.contactAddForm.validate()) {
          axios.post('companies/' + this.$route.params.id + '/contacts/create', this.newContact)
            .then(res => {
              this.getDataFromApi()
              this.close()
              this.$store.dispatch('notification/message', {
                message: res.data.message
              })
            })
            .catch(error => {
              if (error.response && error.response.data) {
                this.alert = {
                  type: error.response.data.type,
                  message: error.response.data.message || error.response.status,
                  errors: error.response.data.errors
                }
              }
            })
        }
      },

      edit (contact) {
        if (!contact.edit) {
          this.editItem = Object.assign({}, contact)
        }
        contact.edit = true
      },

      cancelEdit (contact) {
        contact.prefix = this.editItem.prefix
        contact.first_name = this.editItem.first_name
        contact.last_name = this.editItem.last_name
        contact.email = this.editItem.email
        contact.work_phone = this.editItem.work_phone
        contact.mobile_phone = this.editItem.mobile_phone
        contact.aoh_phone = this.editItem.aoh_phone
        contact.fax = this.editItem.fax
        contact.types = this.editItem.types
        contact.edit = this.editItem.edit
      },

      saveContact (contact, i) {
        this.alert = null
        console.log(this.$refs)
        console.log(i)
        if (this.$refs.contactEditForm[i].validate()) {
          axios.post('companies/' + this.$route.params.id + '/contacts/save', contact)
            .then(res => {
              contact.edit = false
              this.$store.dispatch('notification/message', {
                message: res.data.message
              })
            })
            .catch(error => {
              if (error.response && error.response.data) {
                this.alert = {
                  type: error.response.data.type,
                  message: error.response.data.message || error.response.status,
                  errors: error.response.data.errors
                }
              }
            })
        }
      },

      deleteContact (contact) {
        this.deleteItem = contact
        this.dialogDeleteConfirm = true
      }
    },
    mounted () {
      this.getDataFromApi()
      this.getContactTypes()
    }
  }
</script>

<style scoped>

</style>
