<template>
	<view v-show="goodsInfo.goods_name">
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
		<!-- 商品详细信息 -->
		<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
		<!-- 商品导航组件 -->
		<view class="goods_nav">
			<!-- fill 控制右侧按钮的样式 -->
			<!-- options 左侧按钮的配置项 -->
			<!-- buttonGroup 右侧按钮的配置项 -->
			<!-- click 左侧按钮的点击事件处理函数 -->
			<!-- buttonClick 右侧按钮的点击事件处理函数 -->
			<!-- 	<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" /> -->
			<uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="onClick()" @buttonClick="buttonClick()" />
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'; //购物车的数据存储

export default {
	data() {
		return {
			goodsInfo: {},
			options: [
				{
					icon: 'shop',
					text: '店铺'
				},
				{
					icon: 'cart',
					text: '购物车',
					info: 0 //购物车上的数字图标
				}
			],
			// 右侧按钮组的配置对象
			buttonGroup: [
				{
					text: '加入购物车',
					backgroundColor: '#ff0000',
					color: '#fff'
				},
				{
					text: '立即购买',
					backgroundColor: '#ffa200',
					color: '#fff'
				}
			]
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
			if (res.meta.status === 200) {
				// 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题 和在webp格式ios上无法显示的问题
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg');
				this.goodsInfo = res.message;
			} else {
				return uni.$showMsg();
			}
		},
		//图片预览效果
		preview(index) {
			uni.previewImage({
				// 预览时，默认显示图片的索引
				current: index,
				// 所有图片 url 地址的数组
				urls: this.goodsInfo.pics.map(index => index.pics_big)
			});
		},
		//点击跳转到购物车
		onClick(e) {
			if (e.content.text === '购物车') {
				uni.switchTab({
					url: '../../pages/cart/cart'
				});
			}
		},
		//加入购物车
		buttonClick(e) {
			if (e.content.text === '加入购物车') {
				const goods = {
					goods_id: this.goodsInfo.goods_id, // 商品的Id
					goods_name: this.goodsInfo.goods_name, // 商品的名称
					goods_price: this.goodsInfo.goods_price, // 商品的价格
					goods_count: 1, // 商品的数量
					goods_small_logo: this.goodsInfo.goods_small_logo, // 商品的图片
					goods_state: true // 商品的勾选状态
				};
				this.$store.commit('addToCart', goods);
				this.$store.commit('saveToStorage');
			}
		}
	},
	computed: {
		...mapState(['carList']),
		...mapGetters(['total'])
	},
	//监听total值的变化，从而有动态的数字的变化
	watch: {
		total: {
			// handler 属性用来定义侦听器的 function 处理函数
			handler(newVal) {
				const findResult = this.options.find(x => x.text === '购物车');
				if (findResult) {
					findResult.info = newVal;
				}
			},
			// immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
			immediate: true
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
.goods_nav {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
