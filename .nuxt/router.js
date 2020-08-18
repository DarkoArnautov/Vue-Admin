import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _95882ca0 = () => interopDefault(import('..\\pages\\passwordReset\\index.vue' /* webpackChunkName: "pages_passwordReset_index" */))
const _ce34b4f0 = () => interopDefault(import('..\\pages\\home\\companies\\index.vue' /* webpackChunkName: "pages_home_companies_index" */))
const _c8f9a41a = () => interopDefault(import('..\\pages\\home\\dashboard.vue' /* webpackChunkName: "pages_home_dashboard" */))
const _7500082c = () => interopDefault(import('..\\pages\\home\\fleets\\index.vue' /* webpackChunkName: "pages_home_fleets_index" */))
const _5cafea6e = () => interopDefault(import('..\\pages\\home\\individuals\\index.vue' /* webpackChunkName: "pages_home_individuals_index" */))
const _2fe5e3b2 = () => interopDefault(import('..\\pages\\home\\map\\index.vue' /* webpackChunkName: "pages_home_map_index" */))
const _a5bdbd38 = () => interopDefault(import('..\\pages\\home\\reports\\index.vue' /* webpackChunkName: "pages_home_reports_index" */))
const _231e1f24 = () => interopDefault(import('..\\pages\\home\\settings\\index.vue' /* webpackChunkName: "pages_home_settings_index" */))
const _9a96a758 = () => interopDefault(import('..\\pages\\home\\settings\\index\\index.vue' /* webpackChunkName: "pages_home_settings_index_index" */))
const _0a22b786 = () => interopDefault(import('..\\pages\\home\\settings\\index\\permissions.vue' /* webpackChunkName: "pages_home_settings_index_permissions" */))
const _c5901910 = () => interopDefault(import('..\\pages\\home\\vendors\\index.vue' /* webpackChunkName: "pages_home_vendors_index" */))
const _419f0934 = () => interopDefault(import('..\\pages\\home\\vessels\\index.vue' /* webpackChunkName: "pages_home_vessels_index" */))
const _ea358254 = () => interopDefault(import('..\\pages\\home\\companies\\new.vue' /* webpackChunkName: "pages_home_companies_new" */))
const _4dda819f = () => interopDefault(import('..\\pages\\home\\map\\earth.vue' /* webpackChunkName: "pages_home_map_earth" */))
const _98877996 = () => interopDefault(import('..\\pages\\home\\map\\new.vue' /* webpackChunkName: "pages_home_map_new" */))
const _4f07f434 = () => interopDefault(import('..\\pages\\home\\vessels\\new.vue' /* webpackChunkName: "pages_home_vessels_new" */))
const _111e6eeb = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id.vue' /* webpackChunkName: "pages_home_companies_view__id" */))
const _30705737 = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\index.vue' /* webpackChunkName: "pages_home_companies_view__id_index" */))
const _319e9387 = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\addresses.vue' /* webpackChunkName: "pages_home_companies_view__id_addresses" */))
const _4d483540 = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\companies.vue' /* webpackChunkName: "pages_home_companies_view__id_companies" */))
const _1da32d7e = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\contacts.vue' /* webpackChunkName: "pages_home_companies_view__id_contacts" */))
const _35fbeb76 = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\documents\\index.vue' /* webpackChunkName: "pages_home_companies_view__id_documents_index" */))
const _7841fd9f = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\individuals.vue' /* webpackChunkName: "pages_home_companies_view__id_individuals" */))
const _a7880258 = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\plan.vue' /* webpackChunkName: "pages_home_companies_view__id_plan" */))
const _20dd3fc5 = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\smff.vue' /* webpackChunkName: "pages_home_companies_view__id_smff" */))
const _ad0372bc = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\vessels.vue' /* webpackChunkName: "pages_home_companies_view__id_vessels" */))
const _1a81820a = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\vrpexpress\\index.vue' /* webpackChunkName: "pages_home_companies_view__id_vrpexpress_index" */))
const _0d549d3c = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\documents\\generated-doc\\_type.vue' /* webpackChunkName: "pages_home_companies_view__id_documents_generated-doc__type" */))
const _1b8da3e8 = () => interopDefault(import('..\\pages\\home\\companies\\view\\_id\\documents\\_type.vue' /* webpackChunkName: "pages_home_companies_view__id_documents__type" */))
const _838240e2 = () => interopDefault(import('..\\pages\\home\\fleets\\view\\_id.vue' /* webpackChunkName: "pages_home_fleets_view__id" */))
const _a88b68a8 = () => interopDefault(import('..\\pages\\home\\individuals\\view\\_id.vue' /* webpackChunkName: "pages_home_individuals_view__id" */))
const _54c7cf56 = () => interopDefault(import('..\\pages\\home\\individuals\\view\\_id\\index.vue' /* webpackChunkName: "pages_home_individuals_view__id_index" */))
const _21a237b4 = () => interopDefault(import('..\\pages\\home\\individuals\\view\\_id\\addresses.vue' /* webpackChunkName: "pages_home_individuals_view__id_addresses" */))
const _5c3e403c = () => interopDefault(import('..\\pages\\home\\individuals\\view\\_id\\documents.vue' /* webpackChunkName: "pages_home_individuals_view__id_documents" */))
const _1fc73476 = () => interopDefault(import('..\\pages\\home\\individuals\\view\\_id\\notes.vue' /* webpackChunkName: "pages_home_individuals_view__id_notes" */))
const _50927074 = () => interopDefault(import('..\\pages\\home\\individuals\\view\\_id\\smff.vue' /* webpackChunkName: "pages_home_individuals_view__id_smff" */))
const _328f764a = () => interopDefault(import('..\\pages\\home\\vendors\\view\\_id.vue' /* webpackChunkName: "pages_home_vendors_view__id" */))
const _2fa1b46e = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id.vue' /* webpackChunkName: "pages_home_vessels_view__id" */))
const _728bca99 = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\index.vue' /* webpackChunkName: "pages_home_vessels_view__id_index" */))
const _5a2d7652 = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\ais.vue' /* webpackChunkName: "pages_home_vessels_view__id_ais" */))
const _37f0724b = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\constructionDetail.vue' /* webpackChunkName: "pages_home_vessels_view__id_constructionDetail" */))
const _bf66b4c4 = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\drawings.vue' /* webpackChunkName: "pages_home_vessels_view__id_drawings" */))
const _099c1145 = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\dsm.vue' /* webpackChunkName: "pages_home_vessels_view__id_dsm" */))
const _9a20318a = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\fireplans.vue' /* webpackChunkName: "pages_home_vessels_view__id_fireplans" */))
const _0de06108 = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\notes.vue' /* webpackChunkName: "pages_home_vessels_view__id_notes" */))
const _12a18be8 = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\racs.vue' /* webpackChunkName: "pages_home_vessels_view__id_racs" */))
const _0c964fba = () => interopDefault(import('..\\pages\\home\\vessels\\view\\_id\\smff.vue' /* webpackChunkName: "pages_home_vessels_view__id_smff" */))
const _6661c85e = () => interopDefault(import('..\\pages\\passwordReset\\token\\_token.vue' /* webpackChunkName: "pages_passwordReset_token__token" */))
const _1a1216f0 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
      path: "/passwordReset",
      component: _95882ca0,
      name: "passwordReset"
    }, {
      path: "/home/companies",
      component: _ce34b4f0,
      name: "home-companies"
    }, {
      path: "/home/dashboard",
      component: _c8f9a41a,
      name: "home-dashboard"
    }, {
      path: "/home/fleets",
      component: _7500082c,
      name: "home-fleets"
    }, {
      path: "/home/individuals",
      component: _5cafea6e,
      name: "home-individuals"
    }, {
      path: "/home/map",
      component: _2fe5e3b2,
      name: "home-map"
    }, {
      path: "/home/reports",
      component: _a5bdbd38,
      name: "home-reports"
    }, {
      path: "/home/settings",
      component: _231e1f24,
      children: [{
        path: "",
        component: _9a96a758,
        name: "home-settings-index"
      }, {
        path: "permissions",
        component: _0a22b786,
        name: "home-settings-index-permissions"
      }]
    }, {
      path: "/home/vendors",
      component: _c5901910,
      name: "home-vendors"
    }, {
      path: "/home/vessels",
      component: _419f0934,
      name: "home-vessels"
    }, {
      path: "/home/companies/new",
      component: _ea358254,
      name: "home-companies-new"
    }, {
      path: "/home/map/earth",
      component: _4dda819f,
      name: "home-map-earth"
    }, {
      path: "/home/map/new",
      component: _98877996,
      name: "home-map-new"
    }, {
      path: "/home/vessels/new",
      component: _4f07f434,
      name: "home-vessels-new"
    }, {
      path: "/home/companies/view/:id?",
      component: _111e6eeb,
      children: [{
        path: "",
        component: _30705737,
        name: "home-companies-view-id"
      }, {
        path: "addresses",
        component: _319e9387,
        name: "home-companies-view-id-addresses"
      }, {
        path: "companies",
        component: _4d483540,
        name: "home-companies-view-id-companies"
      }, {
        path: "contacts",
        component: _1da32d7e,
        name: "home-companies-view-id-contacts"
      }, {
        path: "documents",
        component: _35fbeb76,
        name: "home-companies-view-id-documents"
      }, {
        path: "individuals",
        component: _7841fd9f,
        name: "home-companies-view-id-individuals"
      }, {
        path: "plan",
        component: _a7880258,
        name: "home-companies-view-id-plan"
      }, {
        path: "smff",
        component: _20dd3fc5,
        name: "home-companies-view-id-smff"
      }, {
        path: "vessels",
        component: _ad0372bc,
        name: "home-companies-view-id-vessels"
      }, {
        path: "vrpexpress",
        component: _1a81820a,
        name: "home-companies-view-id-vrpexpress"
      }, {
        path: "documents/generated-doc/:type?",
        component: _0d549d3c,
        name: "home-companies-view-id-documents-generated-doc-type"
      }, {
        path: "documents/:type",
        component: _1b8da3e8,
        name: "home-companies-view-id-documents-type"
      }]
    }, {
      path: "/home/fleets/view/:id?",
      component: _838240e2,
      name: "home-fleets-view-id"
    }, {
      path: "/home/individuals/view/:id?",
      component: _a88b68a8,
      children: [{
        path: "",
        component: _54c7cf56,
        name: "home-individuals-view-id"
      }, {
        path: "addresses",
        component: _21a237b4,
        name: "home-individuals-view-id-addresses"
      }, {
        path: "documents",
        component: _5c3e403c,
        name: "home-individuals-view-id-documents"
      }, {
        path: "notes",
        component: _1fc73476,
        name: "home-individuals-view-id-notes"
      }, {
        path: "smff",
        component: _50927074,
        name: "home-individuals-view-id-smff"
      }]
    }, {
      path: "/home/vendors/view/:id?",
      component: _328f764a,
      name: "home-vendors-view-id"
    }, {
      path: "/home/vessels/view/:id?",
      component: _2fa1b46e,
      children: [{
        path: "",
        component: _728bca99,
        name: "home-vessels-view-id"
      }, {
        path: "ais",
        component: _5a2d7652,
        name: "home-vessels-view-id-ais"
      }, {
        path: "constructionDetail",
        component: _37f0724b,
        name: "home-vessels-view-id-constructionDetail"
      }, {
        path: "drawings",
        component: _bf66b4c4,
        name: "home-vessels-view-id-drawings"
      }, {
        path: "dsm",
        component: _099c1145,
        name: "home-vessels-view-id-dsm"
      }, {
        path: "fireplans",
        component: _9a20318a,
        name: "home-vessels-view-id-fireplans"
      }, {
        path: "notes",
        component: _0de06108,
        name: "home-vessels-view-id-notes"
      }, {
        path: "racs",
        component: _12a18be8,
        name: "home-vessels-view-id-racs"
      }, {
        path: "smff",
        component: _0c964fba,
        name: "home-vessels-view-id-smff"
      }]
    }, {
      path: "/passwordReset/token/:token?",
      component: _6661c85e,
      name: "passwordReset-token-token"
    }, {
      path: "/",
      component: _1a1216f0,
      name: "index"
    }],

  fallback: false
}

export function createRouter() {
  return new Router(routerOptions)
}
