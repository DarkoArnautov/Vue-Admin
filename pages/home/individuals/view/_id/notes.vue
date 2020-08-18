<template>
  <div class="md-layout">
    <div class="md-layout-item md-xsmall-size-100 md-small-size-100 md-medium-size-100 md-large-size-100" style="padding: 0">
      <md-card>
        <md-card-header>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <h4 class="title">Notes</h4>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 btn-area">

              <v-dialog v-model="dialogAddNote" width="500"
                  v-if="$store.state.auth.permissions.users.includes('U')">
                <template v-slot:activator="{ on }">
                  <md-button class="primary md-sm" v-on="on">Add Note</md-button>
                </template>
                <v-card>
                  <v-card-title
                      class="headline grey lighten-2"
                      primary-title>
                    New Note
                  </v-card-title>

                  <v-card-text>
                    <v-form ref="noteAddForm" v-model="valid" lazy-validation>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12>
                            <v-select
                                :items="[{id:0, name: 'User'}, {id:1, name: 'System'}]"
                                item-text="name"
                                item-value="id"
                                label="Type*"
                                v-model="newNote.note_type"
                            ></v-select>
                          </v-flex>
                          <v-flex xs12>
                            <v-textarea label="Note*" v-model="newNote.note" :rules="[v => !!v || 'Note is required']" required>
                            </v-textarea>
                          </v-flex>
                        </v-layout>
                      </v-container>
                      <small>*indicates required field</small>
                    </v-form>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        @click="dialogAddNote = false">
                      Cancel
                    </v-btn>
                    <v-btn
                        color="primary"
                        text
                        @click="save">
                      Add Note
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
            <div v-for="(error, index) in alert.errors" v-bind:key="index">
              {{error[0]}}
            </div>
          </v-alert>
          <v-alert
              :value="true"
              color="info"
              icon="info"
              outlined
              v-show="!notes.length">
            No notes for {{ editedItem.name }}.
          </v-alert>
          <v-card v-for="note in notes" :key="note.id" class="mb-2">
            <v-card-title>{{note.user}} @ {{ note.created_at }}
              <v-spacer></v-spacer>
              <v-btn icon @click="deleteNote(note.id)" :disabled="!$store.state.auth.permissions.users.includes('U')">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              {{ note.note }}
            </v-card-text>
          </v-card>
        </md-card-content>
      </md-card>
      <v-dialog
          v-model="standBy"
          persistent
          width="300">
        <v-card
            color="primary"
            dark>
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

  export default {
    name: 'notes',
    data () {
      return {
        standBy: true,
        saving: false,
        valid: true,
        dialogAddNote: false,
        alert: null,
        notes: [],
        editedItem: {
          id: null,
          name: null,
          active: false
        },
        newNote: {
          note_type: 0,
          note: ''
        },
        defaultNote: {
          note_type: 0,
          note: ''
        }
      }
    },
    watch: {
      dialogAddNote (val) {
        val || this.close()
      }
    },
    methods: {
      getDataFromApi () {
        this.standBy = true
        this.loading = true
        axios.get('users/' + this.$route.params.id + '/short')
          .then(res => {
            this.editedItem = res.data.data
            this.loading = false
          })
        axios.get('users/' + this.$route.params.id + '/notes')
          .then(res => {
            this.notes = res.data.data
            this.standBy = false
            this.loading = false
          })
      },

      close () {
        this.dialogAddNote = false
        this.$refs.noteAddForm.resetValidation()
        this.newNote = Object.assign({}, this.defaultNote)
      },

      save () {
        this.alert = null
        if (this.$refs.noteAddForm.validate()) {
          axios.post('users/' + this.$route.params.id + '/addNote', this.newNote)
            .then(res => {
              this.close()
              this.getDataFromApi()
              this.$store.dispatch('notification/message', res.data.message)
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

      deleteNote (id) {
        axios.delete('users/' + this.$route.params.id + '/notes/' + id + '/destroy')
          .then(res => {
            this.getDataFromApi()
            this.$store.dispatch('notification/message', res.data.message)
          })
      }
    },
    mounted () {
      this.getDataFromApi()
    }
  }
</script>

<style scoped>

</style>
