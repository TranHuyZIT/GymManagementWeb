<script setup></script>
<template>
	<div class="container">
		<div class="row">
			<div class="col col-12">
				<h2 class="mt-2 mb-2">Gói tập</h2>
			</div>
		</div>

		<div class="row" v-if="loaded">
			<div
				class="col col-12 col-md-4 col-lg-3"
				v-for="goitapItem in goitap"
				:key="goitapItem._id"
			>
				<goi-tap-item :goitap="goitapItem"></goi-tap-item>
			</div>
		</div>
		<div class="row" v-else>
			<div
				class="col col-12 col-md-4 col-lg-3"
				v-for="e in 12"
				:key="e"
			>
				<card-skeleton></card-skeleton>
			</div>
		</div>
	</div>
</template>

<script>
import GoiTapItem from "@/components/GoiTap/GoiTapItem.vue";
import CardSkeleton from "@/components/Skeleton/CardSkeleton.vue";
import GoiTapService from "@/services/goitap.service";

export default {
	components: { CardSkeleton, GoiTapItem },
	data() {
		return { loaded: false, goitap: [] };
	},
	mounted() {
		GoiTapService.getAll()
			.then((res) => {
				this.goitap = res.data;
			})
			.finally(() => {
				this.loaded = true;
			});
	},
};
</script>
