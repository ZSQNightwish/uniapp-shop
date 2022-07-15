<template>
	<view>
		<!-- 搜索区域 -->
		<view class="searchBox"><search @click.native="goSearch"></search></view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="2500" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id"><image :src="item.image_src"></image></navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navOnClick(item)"><image :src="item.image_src" class="nav-img"></image></view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
					</navigator>
					<!-- 右侧四个小图片 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" :url="item2.url">
							<image v-if="i2 != 0" :src="item2.image_src" :style="{ width: item2.image_width + 'rpx' }" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 导入自己封装的 mixin 模块
import search from '../../components/search/search.vue';
export default {
	// 将 badgeMix 混入到当前的页面中进行使用
	data() {
		return {
			// 轮播图数据列表
			swiperList: [],
			// 分类导航数据列表
			navList: [],
			//楼层的数据列表-item
			floorList: []
		};
	},
	components: {
		search
	},
	onLoad() {
		this.getSwiperList();
		this.getNavList();
		this.getFloorList();
	},
	methods: {
		// 调用方法 获取轮播图 网络请求
		async getSwiperList() {
			const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata');
			if (res.meta.status !== 200) {
				return uni.$showMsg(res.meta.msg);
			}
			this.swiperList = res.message;
		},

		// 调用方法 获取分类导航 网络请求
		async getNavList() {
			const { data: res } = await uni.$http.get('/api/public/v1/home/catitems');
			if (res.meta.status !== 200) {
				return uni.$showMsg(res.meta.msg);
			}
			this.navList = res.message;
		},
		// 分类导航跳转
		navOnClick(item) {
			// 判断点击的是哪个 nav
			if (item.name === '分类') {
				uni.switchTab({
					url: '/pages/category/category'
				});
			}
		},

		// 获取首页楼层数据的 网络请求
		async getFloorList() {
			const { data: res } = await uni.$http.get('/api/public/v1/home/floordata');

			if (res.meta.status !== 200) {
				return uni.$showMsg(res.meta.msg);
			}

			res.message.forEach(floor => {
				floor.product_list.forEach(prod => {
					//这里不需要../写文件名字即可
					prod.url = '/subpkg/goods_lsit/goods_lsit?' + prod.navigator_url.split('?')[1];
				});
			});
			this.floorList = res.message;
		},

		//搜索跳转
		goToSearchOnClick() {
			uni.navigateTo({
				url: '/subpkg/search/search'
			});
		},
		goSearch() {
			uni.navigateTo({
				url: '../../subpkg/searchPage/searchPage'
			});
		}
	}
};
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}

swiper {
	height: 350rpx;

	.swiper-item,
	image {
		width: 100%;
		height: 100%;
	}
}

.nav-list {
	display: flex;
	justify-content: space-around;
	margin: 15px 0;

	.nav-img {
		width: 128rpx;
		height: 140rpx;
	}
}

.floor-title {
	width: 100%;
	height: 60rpx;
}

.right-img-box {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.floor-img-box {
	display: flex;
	padding-left: 10rpx;
	padding-right: 10rpx;
}
.searchBox {
	position: sticky;
	top: 0;
	z-index: 9;
}
</style>
