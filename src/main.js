// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'
import 'element-ui/lib/theme-chalk/index.css';

import JsonView from 'jsonview-vue';
Vue.use(JsonView);

import 'jquery-jsonview/dist/jquery.jsonview.css'
// import 'jquery-jsonview'

Vue.config.productionTip = false

// Tell Vue to use the plugin
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

// 使用VueResource插件
import VueResource from 'vue-resource'
Vue.use(VueResource)

// 使用tool-tip 插件
import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

// 使用element ui
import Element from 'element-ui'
Vue.use(Element)

// use json tree view
import TreeView from 'vue-json-tree-view'
Vue.use(TreeView)

// import VueTreeView from 'vue-tree-view'
// Vue.use(VueTreeView)

// 路由跳转
router.beforeEach((to, from, next) => {
  if (to.meta.loginRequest) {
    // 如果路由meta中loginRequest为true,进行拦截
    if (localStorage.getItem('user')) {
      // 如果已经登录可直接进入页面
      // console.log('用户已经登录');
      next()
    } else {
      //否则跳入登录页，并记住要跳入的页面，以方便登录完成后直接进入该页面
      // console.log('用户未登录');
      next({
        name: 'Login',
      })
    }
  } else {
    next();
    // console.log('直接进入页面')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  render: h => h(App)
}).$mount("#app")

