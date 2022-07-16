// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/index.js' // 引入vuex
//网络请求和loading效果的引入和使用
import {
	$http
} from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = 'http://api-ugo-web.itheima.net'

//请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '亲正在加载'
	})
}
//响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}
// 封装的展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none',
	})
}

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
