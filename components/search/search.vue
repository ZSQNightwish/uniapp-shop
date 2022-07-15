<template>
	<view class=".my-search-container">
		<view class="my-search-box">
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>
<script>
export default {
	name: 'search',
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.my-search-container {
	background-color: #c00000;
	height: 50px;
	padding: 0 10px;
	display: flex;
	align-items: center;
	// position: sticky;
	// z-index: 9;
}

.my-search-box {
	height: 36px;
	background-color: #ffffff;
	border-radius: 15px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;

	.placeholder {
		font-size: 15px;
		margin-left: 5px;
	}
}
</style>
