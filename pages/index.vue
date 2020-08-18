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
                <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}
                  <div v-if="alert.type === 'error'">
                    <nuxt-link to="/passwordReset">Forgot Password?</nuxt-link>
                  </div>
                </v-alert>
                <v-text-field prepend-icon="person" name="login" label="Login" type="text" v-model="username"
                              :rules="nameRules" required></v-text-field>
                <v-text-field id="password" prepend-icon="lock" name="password" label="Password"
                              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                              @click:append="showPassword = !showPassword"
                              :type="showPassword ? 'text' : 'password'" v-model="password" :rules="passwordRules"
                              required></v-text-field>
                <div style="padding-top: 10px">
                  <nuxt-link to="/passwordReset">Forgot username or password?</nuxt-link>
                </div>
              </md-content>
            </md-card-content>

            <md-card-actions style="flex-direction: row">
              <v-checkbox v-model="remember_me" label="Stay Logged In"></v-checkbox>
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit" :loading="loading" :disabled="loading || !valid">Log In</v-btn>
            </md-card-actions>
          </v-form>
        </md-card>
      </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      isMounted: false,
      username: '',
      password: '',
      valid: false,
      alert: null,
      loading: false,
      showPassword: false,
      remember_me: false,
      nameRules: [
        v => !!v || 'Username is required'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'The password must be at least 6 characters'
      ],
      cardHidden: true
    }),
    methods: {
      submit () {
        this.alert = null
        this.loading = true
        let vm = this
        this.$store.dispatch('auth/login', {
          username: this.username,
          password: this.password,
          remember_me: this.remember_me
        }).then(result => {
          if (vm.$store.state.auth.roles.length) {
            if (vm.$store.state.auth.has_permissions) {
              vm.alert = { type: 'success', message: result.data.message }
              vm.$router.push('/home/dashboard')
            } else {
              vm.$store.dispatch('auth/reset')
              vm.alert = {
                type: 'warning',
                message: 'Please contact the administrator to assign permissions for this user role: admin[at]donjon-smit.com'
              }
            }
          } else {
            vm.$store.dispatch('auth/reset')
            vm.alert = {
              type: 'warning',
              message: 'Please contact the administrator to assign a role for this user: admin[at]donjon-smit.com'
            }
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = {
              type: error.response.data.type,
              message: error.response.data.message || error.response.status
            }
          }
        })
      },
      showCard: function() {
        this.cardHidden = false;
      }
    },
    beforeMount() {
      setTimeout(this.showCard, 400);
    },
    mounted() {
      isMounted = true
    }
  }
</script>
