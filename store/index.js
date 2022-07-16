import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
const store = new Vuex.Store({
	state: () => ({
		carList: JSON.parse(uni.getStorageSync('carList') || '[]')
	}),
	mutations: {
		addToCart(state, goods) {
			const findResult = state.carList.find(item => item.goods_id === goods.goods_id)
			if (!findResult) {
				state.carList.push(goods)
			} else {
				findResult.goods_count++
			}
		},
		//持续化存储购物车的记录
		saveToStorage(state) {
			uni.setStorageSync('carList', JSON.stringify(state.carList))
		},
		// 修改按钮的状态
		changeRadio(state, goods) {
			const findResult = state.carList.find(item => item.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_state = goods.goods_state
				this.saveToStorage()
			}
		}
	},
	getters: {
		//计算商品的数量
		total(state) {
			let c = 0
			state.carList.forEach(item => c += item.goods_count)
			return c
		}
	}
})

export default store
