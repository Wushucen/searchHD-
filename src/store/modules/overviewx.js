import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

import axios from 'axios'
const overviewx = {
  state: {
    panelWidget: [
      { fontAwesome: 'fa fa-line-chart fa-3x', value: '0', name: 'Total Shards', colors: 'panel-pink' },
      { fontAwesome: 'fa fa-check-circle fa-3x', value: '0', name: 'Successful Shards', colors: 'panel-blue' },
      { fontAwesome: 'fa fa-database fa-3x', value: '0', name: 'indices', colors: 'panel-yellow' },
      { fontAwesome: 'fa fa-list-ul fa-3x', value: '0', name: 'Templates', colors: 'panel-teal' },
      { fontAwesome: 'fa fa-file-text fa-3x', value: '0', name: 'Documents', colors: 'panel-orange' },
      { fontAwesome: 'fa fa-save fa-3x', value: '0', name: 'Total Size', colors: 'panel-red' }
    ],
    statsInfo: [
      { name: 'clusterName', value: '未知' },
      { name: 'timestamp', value: '0' },
      { name: 'es versions', value: '未知' },
      { name: 'os', value: '未知' },
      { name: 'jvm max uptime', value: '0h' },
      { name: 'jvm versions', value: '未知' },
      { name: 'jvm threads', value: '0' }
    ],
    clusterInfo: [
      { name: 'Status', value: '未连接' },
      { name: 'Timed Out?', value: 'false' },
      { name: 'Nodes', value: '0' },
      { name: 'Data Nodes', value: '0' },
      { name: 'Active Primary Shards', value: '0' },
      { name: 'Initializing Shards', value: '0' },
      { name: 'Unassigned Shards', value: '0' }
    ],
    charts: {
      jvm_mem_max_use: 0,
      vm_mem_used: 0,
      memtotal: 0,
      memfree: 0,
      memused: 0,
      fstotal: 0,
      fsfree: 0,
      fielddata_mem_used: 0,
      query_cache_memory_size: 0,
      cpufree: 100,
      cpuused: 0
    },
    templateInfo: {
      count: 0,
      templateName: [],
      typeCount: []
    },
    tShard: 0,
    sShard: 0,
    indices: 0,
    templates: 0,
    documents: 0,
    size: 0,
    IndexTemplateList: [
      // {
      //   'name': 'skylaraudit',
      //   'type': '【_default_】【skylaraudit-audit_device】【skylaraudit-audit_account】【skylaraudit-audit_software】【skylaraudit-audit_print】【skylaraudit-audit_power】【skylaraudit-audit_safe_udiskx】【skylaraudit-audit_network】【skylaraudit-audit_operation】【skylaraudit-audit_mail】',
      //   'visible': false
      // },
      // {
      //   'name': 'skylartrackfile',
      //   'type': '【skylartrackfile-tools_download】【skylartrackfile-client_imfile】【skylartrackfile-mail】【skylartrackfile-client_udisk】【skylartrackfile-operation】【skylartrackfile-browser_file】【_default_】【skylartrackfile-print】',
      //   'visible': false
      // }
    ]
  },
  mutations: {
    SET_PANEL_TSHARD: (state, data) => {
      state.tShard = data
    },
    SET_PANEL_SSHARD: (state, data) => {
      state.sShard = data
    },
    SET_PANEL_INDICES: (state, data) => {
      state.indices = data
    },
    SET_PANEL_TEMPLATES: (state, data) => {
      state.templates = data
    },
    SET_PANEL_DOCUMENTS: (state, data) => {
      state.documents = data
    },
    SET_PANEL_SIZE: (state, data) => {
      state.size = data
    },
    SET_TEMPLATE_INFO: (state, data) => {
      state.templateInfo = data
    },
    SET_CHARTS: (state, data) => {
      state.charts = data
    },
    SET_INDEX_TEMPLATE_LIST: (state, data) => {
      state.IndexTemplateList = data
    },
    SET_PANEL_WIDGET: (state) => {
      state.panelWidget = [
        { fontAwesome: 'fa fa-line-chart fa-3x', value: state.tShard, name: 'Total Shards', colors: 'panel-pink' },
        { fontAwesome: 'fa fa-check-circle fa-3x', value: state.sShard, name: 'Successful Shards', colors: 'panel-blue' },
        { fontAwesome: 'fa fa-database fa-3x', value: state.indices, name: 'indices', colors: 'panel-yellow' },
        { fontAwesome: 'fa fa-list-ul fa-3x', value: state.templates, name: 'Templates', colors: 'panel-teal' },
        { fontAwesome: 'fa fa-file-text fa-3x', value: state.documents, name: 'Documents', colors: 'panel-orange' },
        { fontAwesome: 'fa fa-save fa-3x', value: state.size, name: 'Total Size', colors: 'panel-red' }
      ]
    },
    SET_STATS_INFO: (state, data) => {
      state.statsInfo = [
        { name: 'clusterName', value: data.clusterName },
        { name: 'timestamp', value: data.timestamp },
        { name: 'es versions', value: data.versions },
        { name: 'os', value: data.systems },
        { name: 'jvm max uptime', value: data.uptime },
        { name: 'jvm versions', value: data.jvm_versions },
        { name: 'jvm threads', value: data.threads }
      ]
    },
    SET_CLUSTER_INFO: (state, data) => {
      state.clusterInfo = [
        { name: 'Status', value: data.status },
        { name: 'Timed Out?', value: data.timed_out },
        { name: 'Nodes', value: data.number_of_nodes },
        { name: 'Data Nodes', value: data.number_of_data_nodes },
        { name: 'Active Primary Shards', value: data.active_primary_shards },
        { name: 'Initializing Shards', value: data.initializing_shards },
        { name: 'Unassigned Shards', value: data.unassigned_shards }
      ]
    }
  },
  actions: {
    SetClusterInfo({ commit }, data) {
      data.timed_out = data.timed_out ? 'true' : 'false'
      commit('SET_CLUSTER_INFO', data)
      commit('SET_PANEL_TSHARD', data.active_primary_shards + data.unassigned_shards)
      commit('SET_PANEL_SSHARD', data.active_primary_shards)
    },
    SetStats({ commit }, body) {
      axios.post("api" + body.url, { 'host': body.host })
        .then(
          response => {
            if (response.data.result === 0) {
              commit('SET_PANEL_INDICES', response.data.data.indices)
              commit('SET_PANEL_DOCUMENTS', response.data.data.docs)
              commit('SET_PANEL_SIZE', response.data.data.size)
              commit('SET_PANEL_WIDGET')
              var statsInfo = { clusterName: response.data.data.cluster_name, timestamp: response.data.data.timestamp, versions: response.data.data.versions.join(','), jvm_versions: response.data.data.jvm_versions, uptime: response.data.data.jvm_max_uptime, systems: response.data.data.systems, threads: response.data.data.jvm_threads }
              commit('SET_STATS_INFO', statsInfo)
              var chart = {
                jvm_mem_max_use: response.data.data.jvm_mem_max_use,
                vm_mem_used: response.data.data.jvm_mem_used,
                memtotal: response.data.data.memtotal,
                memfree: response.data.data.memfree,
                memused: response.data.data.memused,
                fstotal: response.data.data.fstotal,
                fsfree: response.data.data.fsfree,
                fielddata_mem_used: response.data.data.fielddata_mem_used,
                query_cache_memory_size: response.data.data.query_cache.memory_size_in_bytes,
                cpuused: response.data.data.cpuused,
                cpufree: response.data.data.cpufree
              }
              commit('SET_CHARTS', chart)
            }
          },
          error => {
            console.log(error)
          }
        )
    },
    GetTemplateInfo({ commit }, body) {
      axios.post("api" + body.url, { 'host': body.host })
        .then(
          response => {
            if (response.data.result === 0) {
              commit('SET_TEMPLATE_INFO', response.data.data)
              commit('SET_PANEL_TEMPLATES', response.data.data.count)
              commit('SET_PANEL_WIDGET')
              commit('SET_INDEX_TEMPLATE_LIST', response.data.data.tmpreflect)
            }
          },
          error => {
            console.log(error)
          }
        )
    }
  }
}
export default overviewx
