export const state = () => ({
  showMapMenu: true,
  coordinates: ''
})

export const mutations = {
  'SET_MAP_MENU_VISIBILITY' (state, status) {
    state.showMapMenu = status
  },
  'SET_MAP_MOUSE_COORDINATES' (state, status) {
    state.coordinates = status
  }
}

export const actions = {
  showMapMenu: ({ commit }, status) => {
    commit('SET_MAP_MENU_VISIBILITY', status)
  },
  coordinates: ({ commit }, status) => {
    commit('SET_MAP_MOUSE_COORDINATES', status)
  }
}

export const getters = {
  showMapMenu: state => {
    return state.showMapMenu
  },
  coordinates: state => {
    return state.coordinates
  }
}
