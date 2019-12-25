import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Login',
		//路由级代码拆分
		//这会为此路由生成一个单独的块（约。[hash] .js）
		//在访问路线时被延迟加载。 
		component: () => import('@/views/Login.vue'),
	},
	{
		path: '/Home',
		name: 'Home',
		component: Home
	},
	{
		path: '/search',
		name: 'search',
		component: () => import('@/components/search.vue'),
		meta: {
			loginRequest: true
		}
	},
	{
		path: '/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: '/404',
		component: () => import('@/views/404.vue'),
		hidden: true
	},
	// 404 page must be placed at the end !!!
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
