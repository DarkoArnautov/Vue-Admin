export default function ({ store, redirect, route }) {
  const userHasPermissions = store.state.auth.has_permissions
  const urlRequiresAuth = /^\/home(\/|$)/.test(route.fullPath)
  const urlRequiresNonAuth = /^\/(\/|$)/.test(route.fullPath)
  if (!userHasPermissions && urlRequiresAuth) {
    return redirect('/')
  }
  if (userHasPermissions && urlRequiresNonAuth) {
    return redirect('/home/dashboard')
  }
  return Promise.resolve()
}
