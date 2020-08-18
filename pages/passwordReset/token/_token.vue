<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-form @submit.prevent="submit" v-model="valid">
        <v-card class="elevation-12">
          <v-toolbar dark color="grey lighten-2">
            <v-img src="/images/djs.png"></v-img>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
            <v-text-field prepend-icon="vpn_key" name="password" label="Password" type="password"
                          v-model="password" :rules="passwordRules" required></v-text-field>
            <v-text-field prepend-icon="vpn_key" name="password_confirmation" label="Repeat Password" type="password"
                          v-model="password_confirmation"
                          :rules="[v => !!v || 'Please repeat the password', v => v === password || 'The password does not match']"
                          required></v-text-field>
          </v-card-text>
          <v-divider light></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn to="/">
              Back To Log In
            </v-btn>
            <v-btn color="primary" type="submit" :loading="loading" :disabled="loading || !valid">
              Change
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'token',
    data: () => ({
      password: '',
      password_confirmation: '',
      valid: false,
      alert: null,
      loading: false,
      passwordRules: [
        v => !!v || 'New password is required',
        v => (v && v.length >= 6) || 'The password must be at least 6 characters'
      ]
    }),
    methods: {
      submit () {
        this.alert = null
        this.loading = true
        axios.post('password/reset/' + this.$route.params.token, {
          password: this.password,
          password_confirmation: this.password_confirmation
        }).then(result => {
          this.alert = { type: 'success', message: result.data.message }
          this.loading = false
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = { type: 'error', message: error.response.data.message || error.response.status }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
