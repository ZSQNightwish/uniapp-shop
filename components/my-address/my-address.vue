<template>
	<view class=""></view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	name: 'my-address',
	data() {
		return {};
	},
	methods: {
		...mapMutations(['updateAddress']),
		async chooseAddress() {
			// 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
			//    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
			const [err, succ] = await uni.chooseAddress().catch(err => err);

			// 2. 用户成功的选择了收货地址
			if (err === null && succ.errMsg === 'chooseAddress:ok') {
				// 为 data 里面的收货地址对象赋值
				this.updateAddress(succ);
			}
		}
	},
	computed: {
		...mapState(['address']),
		addstr() {
			if (!this.address.provinceName) return '';
			return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo;
		}
	}
};
</script>

<style lang="scss">
// 底部边框线的样式
.address-border {
	display: block;
	width: 100%;
	height: 5px;
}

// 选择收货地址的盒子
.address-choose-box {
	height: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
}

// 渲染收货信息的盒子
.address-info-box {
	font-size: 12px;
	height: 90px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 5px;

	// 第一行
	.row1 {
		display: flex;
		justify-content: space-between;

		.row1-right {
			display: flex;
			align-items: center;

			.phone {
				margin-right: 5px;
			}
		}
	}

	// 第二行
	.row2 {
		display: flex;
		align-items: center;
		margin-top: 10px;

		.row2-left {
			white-space: nowrap;
		}
	}
}
</style>
