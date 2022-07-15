<template>
	<view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in goodsInfo.pics" :key="index"><image :src="item.pics_big" @click="preview(index)"></image></swiper-item>
		</swiper>
		<!-- 价格 描述 -->
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{ goodsInfo.goods_price }}</view>
			<!-- 信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{ goodsInfo.goods_name }}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsInfo: {}
		};
	},
	//接收传来的id
	onLoad(options) {
		const goods_id = options.goods_id;
		// 调用请求商品详情数据的方法
		this.getGoodsDetail(goods_id);
	},
	methods: {
		async getGoodsDetail(goods_id) {
			const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id });
			console.log(res);
			if (res.meta.status === 200) {
				this.goodsInfo = res.message;
			} else {
				return uni.$showMsg();
			}
		},
		//图片预览效果
		preview(index) {
			console.log('------');
			uni.previewImage({
				// 预览时，默认显示图片的索引
				current: index,
				// 所有图片 url 地址的数组
				urls: this.goodsInfo.pics.map(index => index.pics_big)
			});
		}
	}
};
</script>

<style lang="scss">
swiper {
	height: 650rpx;

	image {
		width: 100%;
		height: 100%;
	}
}
.goods-info-box {
	padding: 10px;
	padding-right: 0;
	.price {
		color: #c00000;
		font-size: 18px;
		margin: 10px 0;
	}
	.goods-info-body {
		display: flex;
		justify-content: space-between;
		.goods-name {
			font-size: 13px;
			padding-right: 10px;
		}
		// 收藏区域
		.favi {
			width: 120px;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border-left: 1px solid #efefef;
			color: gray;
		}
	}

	// 运费
	.yf {
		margin: 10px 0;
		font-size: 12px;
		color: gray;
	}
}
</style>
