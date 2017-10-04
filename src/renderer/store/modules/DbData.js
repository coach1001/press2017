const state = {
  data: {}
}

const mutations = {
  clearDbData (state) {
    state.data = {}
  },
  setDbData (state, dbData) {
    state.data = dbData
  }
}

const actions = {
  initializeDbData ({ commit }, dbData) {
    commit('setDbData', dbData)
  }
}

export default {
  state,
  mutations,
  actions
}
