<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @click="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	name: 'my-login',
	methods: {
		...mapMutations(['updateUserInfo', 'saveUserInfoToStorage']),
		getUserInfo(e) {
			uni.getUserProfile({
				desc: '登录后可以同步数据',
				lang: 'zh_CN',
				success: userinfo => {
					this.updateUserInfo(userinfo);
					//这里判断如果获取的userinfo和仓库里的userinfo不等，证明用户允许授权
					if (this.$store.state.userinfo !== this.userinfo) {
						this.saveUserInfoToStorage(e.detail.userinfo);
						this.getToken(userinfo);
					}
				}
			});
		},
		// 调用登录方法，获取code
		async getToken(info) {
			const [err, res] = await uni.login().catch(err => err);
			if (res.errMsg === 'login:ok') {
				// 准备参数对象
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				};
				// 获取 token
				const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query);
				console.log(loginResult);
				if (loginResult.meta.status === 200) {
					uni.$showMsg('登录成功');
					this.$store.commit('saveToken', loginResult.message.token);
				} else {
					return uni.$showMsg('登录失败快滚！');
				}
			} else {
				return uni.$showError('登录失败了亲！');
			}
		}
	}
};
</script>

<style lang="scss">
.login-container {
	// 登录盒子的样式
	height: 750rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	position: relative;
	overflow: hidden;

	// 绘制登录盒子底部的半椭圆造型
	&::after {
		content: ' ';
		display: block;
		position: absolute;
		width: 100%;
		height: 40px;
		left: 0;
		bottom: 0;
		background-color: white;
		border-radius: 100%;
		transform: translateY(50%);
	}

	// 登录按钮的样式
	.btn-login {
		width: 90%;
		border-radius: 100px;
		margin: 15px 0;
		background-color: #c00000;
	}

	// 按钮下方提示消息的样式
	.tips-text {
		font-size: 12px;
		color: gray;
	}
}
</style>
