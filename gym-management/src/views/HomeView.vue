<script setup>
import ListGoiTap from "../components/Home/ListGoiTap.vue";
</script>

<template>
	<div class="main-banner" id="top">
		<video autoplay muted loop id="bg-video">
			<source
				src="@/assets/images/gym-video.mp4"
				type="video/mp4"
			/>
		</video>

		<div class="video-overlay header-text">
			<div class="caption">
				<h6>Cùng chăm chỉ và cải thiện vóc dáng!</h6>
				<h2>gym Tran<em> Huy</em></h2>
				<div class="main-button scroll-to-section">
					<router-link to="/auth/sign-up">
						Trở Thành Hội Viên!
					</router-link>
				</div>
			</div>
		</div>
	</div>
	<ListGoiTap></ListGoiTap>
</template>
