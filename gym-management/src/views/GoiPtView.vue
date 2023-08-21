<template>
	<div class="container" v-auto-animate>
		<h2 style="padding: 20px 0">PT</h2>
		<div class="row" v-if="loaded">
			<div
				class="col col-12 col-md-6 col-lg-3"
				v-for="ptItem in pt"
				:key="ptItem._id"
			>
				<goi-pt-item :pt="ptItem"></goi-pt-item>
			</div>
		</div>

		<div class="row" v-else>
			<div
				class="col col-12 col-md-6 col-lg-3"
				v-for="e in 12"
				:key="e"
			>
				<card-skeleton></card-skeleton>
			</div>
		</div>
	</div>
</template>

<script>
import GoiPtItem from "@/components/GoiPt/GoiPtItem.vue";
import goiptService from "@/services/goipt.service";
import CardSkeleton from "@/components/Skeleton/CardSkeleton.vue";

export default {
	components: { GoiPtItem, CardSkeleton },
	data() {
		return {
			pt: [],
			loaded: false,
		};
	},
	mounted() {
		goiptService
			.getAll()
			.then((res) => {
				this.pt = res.data;
			})
			.finally(() => {
				this.loaded = true;
			});
	},
};
</script>
