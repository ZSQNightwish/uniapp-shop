<template>
	<view>
		<!-- 搜索区域 -->
		<search></search>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{ height: wh + 'px' }">
				<view v-for="(item, index) in categoryList" :key="index">
					<view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="isRed(index)">{{ item.cat_name }}</view>
				</view>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" :scroll-top="screenTop" scroll-y :style="{ height: wh + 'px' }">
				<view class="lv2" v-for="(item2, index) in list2" :key="index">
					<!-- 二级标题 -->
					<view class="lv2-title">{{ item2.cat_name }}</view>
					<!-- 三级分类 -->
					<view class="lv3">
						<view class="lv3-item" @click="goGoodsList(item3)" v-for="(item3, i3) in item2.children" :key="i3">
							<image :src="item3.cat_icon.replace('dev', 'web')"></image>
							<text>{{ item3.cat_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import search from '../../components/search/search.vue';
export default {
	data() {
		return {
			wh: 0,
			categoryList: [],
			active: 0,
			list2: [],
			screenTop: 0
		};
	},
	components: { search },
	onLoad() {
		const sysInfo = uni.getSystemInfoSync();
		this.wh = sysInfo.windowHeight;
		// 分类的请求
		this.getCategory();
	},
	methods: {
		async getCategory() {
			const { data: res } = await uni.$http.get('/api/public/v1/categories');
			if (res.meta.status === 200) {
				this.categoryList = res.message;
				this.list2 = res.message[0].children;
			} else return uni.$showMsg();
		},
		isRed(index) {
			this.active = index;
			this.list2 = this.categoryList[index].children;
			this.scrollTop = this.scrollTop ? 0 : 1;
		},
		goGoodsList(item3) {
			//非tabbar页面用
			uni.navigateTo({
				url: '/subpkg/goods_lsit/goods_lsit?cid=' + item3.cat_id
			});
		}
	}
};
</script>

<style lang="scss">
.scroll-view-container {
	display: flex;

	.left-scroll-view {
		width: 120px;

		.left-scroll-view-item {
			line-height: 60px;
			background-color: #f7f7f7;
			text-align: center;
			font-size: 12px;

			// 激活项的样式
			&.active {
				background-color: #ffffff;
				position: relative;

				// 渲染激活项左侧的红色指示边线
				&::before {
					content: ' ';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #c00000;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
	}
}

.lv2-title {
	font-size: 12px;
	font-weight: bold;
	text-align: center;
	padding: 15px 0;
}
.lv3 {
	display: flex;
	flex-wrap: wrap;

	.lv3-item {
		width: 33.33%;
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;

		image {
			width: 60px;
			height: 60px;
		}

		text {
			font-size: 12px;
		}
	}
}
</style>
