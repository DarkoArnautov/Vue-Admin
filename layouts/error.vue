<template>
  <v-layout align-center justify-center>
    <div class="text-md-center">
      <h1>{{error.statusCode}}</h1>
      <h2 class="my-3 headline" v-if="error.statusCode === 404">Page not found.</h2>
      <h2 class="my-3 headline" v-else>An error occurred.</h2>
      <div>
        <v-btn color="primary" to="/">Go Home</v-btn>
      </div>
    </div>
  </v-layout>
</template>

<script>
  export default {
    props: ['error']
  }
</script>

<style scoped lang="css">
  h1 {
    font-size: 150px;
    line-height: 150px;
    font-weight: 700;
    color: #252932;
    text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px, rgba(61, 61, 61, 0.3) 3px 3px;
  }
</style>
