<template>
  <v-app class="full-page">
    <div class="wrapper wrapper-full-page">
      <div class="page-header header-filter login-page" filter-color="black" :style="bgImage" >

        <div class="container md-offset">
          <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
            <router-view></router-view>
          </zoom-center-transition>
        </div>
      </div>
    </div>
  </v-app>
</template>
<script>
import { ZoomCenterTransition } from "vue2-transitions";

export default {
  components: {
    ZoomCenterTransition
  },
  props: {
    backgroundColor: {
      type: String,
      default: "black"
    }
  },
  data() {
    return {
      responsive: false,
      pageTransitionDuration: 300,
      bgImage: "backgroundImage: url(./images/login.jpg)",
    };
  },
  
  methods: {
    onResponsiveInverted() {
      if (window.innerWidth < 991) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    }
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  beforeRouteUpdate(to, from, next) {
    next();
  }
};
</script>