import api from '~/api'
import { setAuthToken, resetAuthToken } from '~/utils/auth'
import cookies from 'js-cookie'

export const state = () => ({
  user: null,
  roles: null,
  has_permissions: false,
  permissions: null,
  token: null
})

export const mutations = {
  set_token (store, data) {
    store.token = data
  },
  set_user (store, data) {
    store.user = data
  },
  set_roles (store, data) {
    store.roles = data
  },
  set_permissions (store, data) {
    store.has_permissions = data.has
    store.permissions = data.data
  },
  reset_user (store) {
    store.user = null
    store.roles = null
    store.has_permissions = false
    store.permissions = null
    store.token = null
  }
}

export const actions = {
  fetch ({ commit }, token) {
    return api.auth.me()
      .then(response => {
        commit('set_user', response.data.user)
        commit('set_roles', response.data.roles)
        commit('set_permissions', response.data.permissions)
        commit('set_token', token)
        return response
      })
      .catch(error => {
        commit('reset_user')
        return error
      })
  },
  login ({ commit }, data) {
    let tokenExpire = data.remember_me ? 365 : 1
    return api.auth.login(data)
      .then(response => {
        commit('set_user', response.data.user)
        commit('set_roles', response.data.roles)
        commit('set_permissions', response.data.permissions)
        commit('set_token', response.data.token)
        setAuthToken(response.data.token)
        cookies.set('x-access-token', response.data.token, { expires: tokenExpire })
        return response
      })
  },
  reset ({ commit }) {
    commit('reset_user')
    resetAuthToken()
    cookies.remove('x-access-token')
    return Promise.resolve()
  },
  passwordReset ({ commit }, data) {
    return api.auth.passwordReset(data)
      .then(response => {
        return response
      })
  }
}
