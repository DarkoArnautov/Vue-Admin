<template>
  <div class="md-layout text-center">
      <div class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100">
        <md-card class="md-card-profile">
          <v-form @submit.prevent="submit" v-model="valid">
            <md-card-header>
              <div class="md-card-avatar green" style="border-radius: 10px; max-width: 300px; padding: 10px 50px">
                <img src="/images/djs.png" />
              </div>
            </md-card-header>

            <md-card-content>
              <h4 class="title">Log in</h4>
              <md-content>
                <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
                <v-text-field prepend-icon="person" name="username" label="Username" type="text"
                              v-model="username" :rules="usernameRules" required></v-text-field>
                <v-text-field prepend-icon="email" name="email" label="E-mail" type="email" v-model="email"
                              :rules="emailRules" required></v-text-field>
              </md-content>
            </md-card-content>

            <md-card-actions style="flex-direction: row">
              <v-btn to="/">Back</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit" :loading="loading" :disabled="loading || !valid">
                Reset Password
              </v-btn>
            </md-card-actions>
          </v-form>
        </md-card>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'passwordReset',
    data: () => ({
      username: '',
      email: '',
      valid: false,
      alert: null,
      loading: false,
      usernameRules: [
        v => !!v || 'Username is required'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    }),
    methods: {
      submit () {
        this.alert = null
        this.loading = true
        this.$store.dispatch('auth/passwordReset', {
          username: this.username,
          email: this.email
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
