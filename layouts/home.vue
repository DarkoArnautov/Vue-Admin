<template>
    <v-app  v-if="!!$store.state.auth.has_permissions">
        <div class="home-layout" :class="[{'nav-open': sidebar ? $sidebar.showSidebar : false }]">
            <notifications></notifications>
            <side-bar
                :active-color="sidebarBackground"
                :background-image="sidebarBackgroundImage"
                :data-background-color="sidebarBackgroundColor" >

                <template slot="links">
                    
                    <sidebar-item :link="{ name: 'Dashboard', icon: 'fas fa-home fa-fw', path: '/home/dashboard' }"></sidebar-item>
                    <sidebar-item :link="{ name: 'Companies', icon: 'fas fa-building fa-fw', path: '/home/companies' }"></sidebar-item>
                    <sidebar-item :link="{ name: 'Individuals', icon: 'fas fa-users fa-fw', path: '/home/individuals' }"></sidebar-item>
                    <sidebar-item :link="{ name: 'Vessels', icon: 'fas fa-ship fa-fw', path: '/home/vessels' }"></sidebar-item>

                    <sidebar-item :link="{ name: 'Vendors', icon: 'fas fa-anchor fa-fw', path: '/home/vendors' }"></sidebar-item>
                    <sidebar-item :link="{ name: 'System Reports', icon: 'fas fa-file-alt fa-fw', path: '/home/reports' }"></sidebar-item>
                    <sidebar-item :link="{ name: 'Clients', icon: 'fas fa-user-check fa-fw', path: '#' }"></sidebar-item>
                    <sidebar-item :link="{ name: 'Cop Map', icon: 'fas fa-compass fa-fw' }" >
                        <sidebar-item :link="{ name: 'Asset Map', icon: 'fas fa-globe fa-fw', path: '/home/map', submenu: true }"></sidebar-item>
                        <sidebar-item :link="{ name: 'Fleets', icon: 'fas fa-anchor fa-fw', path: '/home/fleets', submenu: true }"></sidebar-item>
                    </sidebar-item>
                    <mobile-menu></mobile-menu>
                </template>
                
            </side-bar>
            <div class="main-panel">

                <top-navbar v-if="isMounted"/>

                <div :class="{ content: !$route.meta.hideContent }" @click="toggleSidebar" :style="$route.path === '/home/map' ? 'padding: 0' : 'padding: 15px'">
                    <zoom-center-transition :duration="200" mode="out-in">
                        <!-- your content here -->
                        <nuxt v-if="$route.path === '/home/map'"></nuxt>
                        <v-container fluid grid-list-md v-else :style="$vuetify.breakpoint.mdAndUp ? 'padding: 0' : 'padding: 12px'">
                            <nuxt></nuxt>
                        </v-container>
                    </zoom-center-transition>
                </div>
            </div>
            
            <confirm ref="confirm"></confirm>
        </div>
    </v-app>
</template>
<script>
    //:class="[{'nav-open': $sidebar.showSidebar }]"
    import Confirm from '~/components/Confirm'
    import PerfectScrollbar from "perfect-scrollbar";
    import "perfect-scrollbar/css/perfect-scrollbar.css";

    function hasElement(className) {
        return document.getElementsByClassName(className).length > 0;
    }

    function initScrollbar(className) {
        if (hasElement(className)) {
            new PerfectScrollbar(`.${className}`);
        } else {
            // try to init it later in case this component is loaded async
            setTimeout(() => {
                initScrollbar(className);
            }, 100);
        }
    }

    import TopNavbar from "../components/extra/TopNavbar.vue";
    import MobileMenu from "../components/extra/MobileMenu.vue";
    import { ZoomCenterTransition } from "vue2-transitions";

    export default {
        components: {
            TopNavbar,
            MobileMenu,
            ZoomCenterTransition,
            Confirm
        },
        data () {
            return {
                drawer: false,
                title: 'CDT - Compliance Decision Tool',
                sidebarBackgroundColor: "black",
                sidebarBackground: "green",
                sidebarBackgroundImage: "/images/sidebar-2.jpg",
                sidebarMini: true,
                sidebarImg: true,
                isMounted: false
                // now: new Date(),
                // interval: null
            }
        },
        methods: {
            toggleSidebar() {
                if (this.$sidebar.showSidebar) {
                    this.$sidebar.displaySidebar(false);
                }
            },
            minimizeSidebar() {
                if (this.$sidebar) {
                    this.$sidebar.toggleMinimize();
                }
            }
        },
        computed: {
            sidebar() {
                return this.isMounted ? this.$sidebar : false
            },
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
        mounted () {
            this.isMounted = true
            this.$root.$confirm = this.$refs.confirm.open

            let docClasses = document.body.classList;
            let isWindows = navigator.platform.startsWith("Win");
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                initScrollbar("sidebar");
                initScrollbar("sidebar-wrapper");
                initScrollbar("main-panel");

                docClasses.add("perfect-scrollbar-on");
            } else {
                docClasses.add("perfect-scrollbar-off");
            }
            docClasses.add("sidebar-mini");
        },
        created () {
            this.$vuetify.theme.primary = '#005588'
            this.$vuetify.theme.accent = '#01A3E5'
            // this.interval = setInterval(() => {
            //   this.now = new Date()
            // }, 1000 * 60)// update time every minute
        },
        beforeDestroy () {
            // clearInterval(this.interval)
        },
        watch: {
            sidebarMini() {
                this.minimizeSidebar();
            }
        }
    }
</script>

<style scoped>
    .no-underline:hover{
        text-decoration: none;
    }
    .home-layout{
        display: block !important;
        height: 100%;
    }
</style>
