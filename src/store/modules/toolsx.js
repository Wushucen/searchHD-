import Vue from 'vue'
import VueResource from 'vue-resource'
import Axios from 'axios'
Vue.use(VueResource)
const toolsbarx = {
  state: {
    'sqlBody': '',
    'dslBody': '',
    'currentError': ''
  },
  mutations: {
    SET_DSL_BODY: (state, dsl) => {
      state.dslBody = dsl
    },
    SET_SQL_BODY: (state, sql) => {
      state.sqlBody = sql
    },
    SET_CURRENT_ERROR: (state, errorMessage) => {
      state.currentError = errorMessage
    }
  },
  actions: {
    ConvertSQLToDSL({ commit }, body) {
      commit('SET_SQL_BODY', body.sql)
      Axios.post("api" + body.url, body)
        .then(
          response => {
            if (response.data.result === 0) {
              commit('SET_DSL_BODY', response.data.data)
              commit('SET_CURRENT_ERROR', '')
            } else {
              console.log(response.data)
              commit('SET_CURRENT_ERROR', '{"result":1,"data":{"error":"syntax error at position 2"}}')
            }
          },
          error => {
            commit('SET_CURRENT_ERROR', error)
            console.log(error)
          }
        )
    }
  }
}
export default toolsbarx
