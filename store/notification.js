export const state = () => ({
  color: null,
  message: '',
  shown: false
})

export const mutations = {
  'SET_CURRENT_NOTIFICATION' (state, message) {
    if (typeof message === 'object') {
      state.message = message.message
      state.color = message.color
    } else {
      state.message = message
    }
    state.shown = true
  },
  'CLOSE_CURRENT_NOTIFICATION' (state) {
    state.shown = false
  },
  'SET_NOTIFICATION_STATE' (state, value) {
    state.shown = value
  }
}

export const actions = {
  message: ({ commit }, message) => {
    commit('SET_CURRENT_NOTIFICATION', message)
  },
  close: ({ commit }) => {
    commit('CLOSE_CURRENT_NOTIFICATION')
  },
  setState: ({ commit }, value) => {
    commit('SET_NOTIFICATION_STATE', value)
  }
}

export const getters = {
  shown: state => {
    return state.shown
  },
  message: state => {
    return state.message
  },
  color: state => {
    return state.color
  }
}
