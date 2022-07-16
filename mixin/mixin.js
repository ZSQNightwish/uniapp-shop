import {
	mapGetters
} from "vuex"
export default {
	computed: {
		...mapGetters(['total'])
	},
	onShow() {
		this.setBadge()
	},
	methods: {
		setBadge() {
			uni.setTabBarBadge({
				index: 2,
				text: this.total + ''
			})
		}
	},
}
