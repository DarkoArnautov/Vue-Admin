<template>
  <ul class="nav nav-mobile-menu" style="margin-top: 9px">
    <div style="width: 100%; padding: 0 15px">
      <div style="width: 100%; height: 1px; background: #5b5b5d" />
    </div>
    <li>
      <a :href='"/home/individuals/view/" + user.id' slot="title">
        <i class="fas fa-id-card fa-fw"></i>
        <p>Profile</p></a>
    </li>
    <li>
      <a href="/home/settings/" slot="title">
        <i class="fas fa-cogs fa-fw"></i>
        <p>Other Settings</p></a>
    </li>
    <li>
      <a href="#" @click="logOut"  slot="title">
        <i class="fas fa-sign-out-alt fa-fw"></i>
        <p>Log Out</p></a>
    </li>
  </ul>
</template>
<script>
export default {
  methods: {
    logOut () {
      this.$store.dispatch('auth/reset').then(() => {
        this.$router.push('/')
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.auth ? this.$store.state.auth.user : null
    },
    notify: {
      get () {
        return this.$store.state.notification.shown
      },
      set (value) {
        this.$store.dispatch('notification/setState', value)
      }
    }
  },
};
</script>
