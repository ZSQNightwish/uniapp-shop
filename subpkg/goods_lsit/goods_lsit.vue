<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="goDetail(goods)">
				<view class="goods-item">
					<!-- 商品左侧图片区域 -->
					<view class="goods-item-left"><image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image></view>
					<!-- 商品右侧信息区域 -->
					<view class="goods-item-right">
						<!-- 商品标题 -->
						<view class="goods-name">{{ goods.goods_name }}</view>
						<view class="goods-info-box">
							<!-- 商品价格 -->
							<view class="goods-price">￥{{ goods.goods_price }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			queryObj: {
				// 查询关键词
				query: '',
				// 商品分类Id
				cid: '',
				// 页码值
				pagenum: 1,
				// 每页显示多少条数据
				pagesize: 10
			},
			// 商品列表的数据
			goodsList: [],
			// 总数量，用来实现分页
			total: 0,
			isLoading: false
		};
	},
	onLoad(options) {
		//将传递过来的数据进行存储
		this.queryObj.query = options.query || '';
		this.queryObj.cid = options.cid || '';
		this.getDetailList();
	},
	methods: {
		async getDetailList(cb) {
			this.isloading = true;
			const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
			this.isloading = false;
			cb && cb();
			if (res.meta.status === 200) {
				this.goodsList = [...this.goodsList, ...res.message.goods];
				this.total = res.message.total;
			} else {
				return uni.$showMsg();
			}
		},
		//下拉触底
		onReachBottom() {
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('亲，已经到底了');
			if (this.isloading) return;
			// 让页码值自增 +1
			this.queryObj.pagenum += 1;
			// 重新获取列表数据
			this.getDetailList();
		},
		//下拉刷新
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = 1;
			this.total = 0;
			this.isloading = false;
			this.goodsList = [];
			// 2. 重新发起请求
			this.getDetailList(() => {
				uni.stopPullDownRefresh();
			});
		},
		//点击商品跳转到详情页
		goDetail(goods) {
			uni.navigateTo({
				url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
			});
		}
	}
};
</script>

<style lang="scss">
.goods-item {
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;

	.goods-item-left {
		margin-right: 5px;

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
</style>
