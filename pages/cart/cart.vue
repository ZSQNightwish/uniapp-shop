<template>
	<view>
		<view class="cart-title">
			<!-- 购物车的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 商品列表 -->
		<view class="goods" v-for="(goods, index) in carList" :key="index">
			<view class="goods-item">
				<!-- 商品左侧图片区域 -->
				<view class="goods-item-left">
					<radio :checked="goods.goods_state" color="#c00000" @click="radioChange(goods)" />
					<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
				</view>
				<!-- 商品右侧信息区域 -->
				<view class="goods-item-right">
					<!-- 商品标题 -->
					<view class="goods-name">{{ goods.goods_name }}</view>
					<view class="goods-info-box">
						<!-- 商品数量 -->
						<view class="count"><uni-number-box @change="" :min="1" :value="goods.goods_count"></uni-number-box></view>
						<!-- 商品价格 -->
						<view class="goods-price">￥{{ goods.goods_price }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 购物车底部nav bar -->
		<view class="nav-bar"><uni-nav-bar leftIcon="plus" left-text="全选" right-text="合计" title="结算" /></view>
	</view>
</template>

<script>
import mixin from '@/mixin/mixin.js';
import { mapState } from 'vuex';
export default {
	mixins: [mixin],
	data() {
		return {};
	},
	computed: {
		...mapState(['carList']),
		totalPrice() {}
	},
	methods: {
		radioChange(goods) {
			console.log(goods);
			this.$store.commit('changeRadio', this.goods);
		}
	}
};
</script>

<style lang="scss">
.cart-title {
	height: 40px;
	display: flex;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;
	border-bottom: 1px solid #efefef;
	.cart-title-text {
		margin-left: 10px;
	}
}

.goods-item {
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;

	.goods-item-left {
		margin-right: 5px;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.goods-pic {
			width: 100px;
			height: 100px;
			display: block;
		}
	}

	.goods-item-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.goods-name {
			font-size: 13px;
		}

		.goods-price {
			font-size: 16px;
			color: #c00000;
		}
	}
}
.nav-bar {
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;
	z-index: 9;
}
.count {
	position: absolute;
	right: 0;
}
</style>
