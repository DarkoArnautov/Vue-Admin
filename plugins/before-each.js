export default async ({ app: { store, router } }) => {
  router.beforeEach((to, from, next) => {
    console.log('PERMISSIONS CHECK')
    // if the user is logged in and has permissions
    if (store.state.auth.has_permissions) {
      if (to.path.startsWith('/home/settings') && !store.state.auth.permissions.settings.length) { // no permissions to access settings
        next(false)
      } else if (to.path.startsWith('/home/individuals') && !to.path.startsWith('/home/individuals/view') && !store.state.auth.permissions.users.length) {
        next(false)
      } else if (to.path.startsWith('/home/companies') && !store.state.auth.permissions.companies.length) {
        next(false)
      } else if (to.path.startsWith('/home/vessels') && !store.state.auth.permissions.vessels.length) {
        next(false)
      } else if (to.path.startsWith('/home/map') && !store.state.auth.permissions.map.length) {
        next(false)
      } else if (to.path.startsWith('/home/fleets') && !store.state.auth.permissions.fleets.length) {
        next(false)
      } else if (to.path.startsWith('/home/vendors') && !store.state.auth.permissions.vendors.length) {
        next(false)
      } else if (to.path.startsWith('/home/clients') && !store.state.auth.permissions.clients.length) {
        next(false)
      } else if (to.path.startsWith('/home/reports') && !store.state.auth.permissions.system_reports.length) {
        next(false)
      } else {
        next(true)
      }
    } else {
      next(true) // allow log out, the middleware is handling this
    }
  })
}
