<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-alert type="success" v-if="user" :value="true" icon="fas fa-info">
        Welcome, {{user.username}}. This is the new CDT system and it is being updated daily.
        If you are coming from the old DJS application you can find everything functional.
      </v-alert>
    </v-flex>
    <v-flex xs12>
      <system-heart-beat></system-heart-beat>
    </v-flex>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <vessels-active></vessels-active>
        </v-flex>
        <v-flex xs12 sm4>
          <companies-active></companies-active>
        </v-flex>
        <v-flex xs12 sm4>
          <individuals-active></individuals-active>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import VesselsActive from '../../components/widgets/VesselsActive'
  import CompaniesActive from '../../components/widgets/CompaniesActive'
  import IndividualsActive from '../../components/widgets/IndividualsActive'
  import SystemHeartBeat from '../../components/widgets/SystemHeartBeat'

  export default {
    components: { SystemHeartBeat, VesselsActive, CompaniesActive, IndividualsActive },
    name: 'homeDashboard',
    layout: 'home',
    computed: {
      user () {
        return this.$store.state.auth.user
      }
    }
  }
</script>

<style scoped>

</style>