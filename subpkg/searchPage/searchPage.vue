<template>
	<view>
		<view class="big"><uni-search-bar focus="true" @confirm="search" @input="input" :radius="20"></uni-search-bar></view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list">
			<view class="sugg-item" v-for="(item, i) in searchList" :key="i" @click="gotoDetail(keywords)">
				<view class="goods-name">{{ item.goods_name }}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<!-- 搜索历史 -->
		<view class="history-box" v-show="this.searchList.length !== 0">
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list"><uni-tag :text="item" v-for="(item, i) in history" :key="i"></uni-tag></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			timer: null,
			keywords: '',
			searchList: [],
			history: []
		};
	},
	methods: {
		input(e) {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.keywords = e;
				this.getSearchList();
			}, 500);
		},
		async getSearchList() {
			// 判断关键词是否为空
			if (this.keywords === '') {
				this.searchList = [];
				return;
			}
			// 发起请求，获取搜索建议列表
			const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.keywords });
			if (res.meta.status !== 200) return uni.$showMsg();
			this.searchList = res.message;
			this.saveHistory();
		},
		gotoDetail(keywords) {
			uni.navigateTo({
				url: '/subpkg/goods_lsit/goods_lsit?query=' + keywords
			});
		},
		// 清除历史记录 和本地记录
		clearHistory() {
			this.history = [];
			uni.setStorageSync('keywords', '[]');
		},
		// 保存历史记录
		saveHistory() {
			this.history.push(this.keywords);
			// 判断历史记录是否相同，去重
			const set = new Set(this.history);
			set.delete(this.keywords);
			set.add(this.keywords);
			this.history = Array.from(set);
			//持续化存储历史记录
			uni.setStorageSync('keywords', JSON.stringify(this.history));
		}
	},
	onLoad() {
		this.history = JSON.parse(uni.getStorageSync('keywords') || '[]');
	}
};
</script>

<style lang="scss">
.big {
	background-color: #c00000;
	position: sticky;
	z-index: 9;
	top: 0;
}
.sugg-list {
	padding: 0 5px;

	.sugg-item {
		font-size: 12px;
		padding: 17px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.goods-name {
			// 文字不允许换行（单行文本）
			white-space: nowrap;
			// 溢出部分隐藏
			overflow: hidden;
			// 文本溢出后，使用 ... 代替
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}
.history-box {
	padding: 0 5px;

	.history-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}

	.history-list {
		display: flex;
		flex-wrap: wrap;

		.uni-tag {
			margin-top: 5px;
			margin-right: 5px;
		}
	}
}
</style>
