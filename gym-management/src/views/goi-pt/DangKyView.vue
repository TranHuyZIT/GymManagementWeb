<script setup>
import formatter from "@/utils/formatter";
</script>
<template>
	<div class="container" v-auto-animate>
		<h2 style="padding: 20px 0">Đăng ký gói PT</h2>

		<div class="row" v-if="goipt" v-auto-animate>
			<div class="col col-12">
				<h1 style="text-align: center; line-height: 2">
					{{ goipt.ten }}
				</h1>
			</div>

			<div class="col col-12">
				<p
					style="
						font-size: 20px;
						text-align: center;
						line-height: 2;
					"
				>
					{{ goipt.mota }}
				</p>
			</div>

			<div
				class="col col-12"
				style="text-align: center; line-height: 2"
			>
				<el-icon><Money /></el-icon>
				<strong>{{ formatter.format(goipt.gia) }}</strong>
			</div>

			<div
				class="col col-12 mb-4"
				style="text-align: center; line-height: 2"
			>
				<el-icon><Timer /></el-icon>
				<strong>{{ goipt.songay }} ngày</strong>
			</div>

			<div class="col col-12 mt-2 mb-2">
				<h4>Vui lòng chọn PT của bạn</h4>
			</div>

			<div class="row col col-12 mb-4" v-if="loaded">
				<div
					v-for="ptItem in pt"
					:key="ptItem._id"
					class="col col-12 col-md-4 col-lg-3"
				>
					<el-card
						shadow="hover"
						@click="selectedPt = ptItem._id"
					>
						<div class="p-2">
							<h6>{{ ptItem.ten }}</h6>

							<p>
								Giới tính:
								{{ ptItem.gioitinh ? "Nam" : "Nữ" }}
							</p>

							<p>
								Chiều cao:
								{{ ptItem.chieucao }}cm
							</p>

							<p>
								Cân nặng:
								{{ ptItem.cannang }}kg
							</p>

							<el-divider></el-divider>

							<el-button
								style="width: 100%"
								:type="
									ptItem._id === selectedPt
										? 'success'
										: 'default'
								"
								:icon="
									selectedPt === ptItem._id ? 'check' : ''
								"
							>
								{{
									selectedPt === ptItem._id
										? "Đã chọn"
										: "Chọn"
								}}
							</el-button>
						</div>
					</el-card>
				</div>
			</div>

			<div class="row col col-12" v-else>
				<div
					class="col col-12 col-md-4 col-lg-3"
					v-for="e in 2"
					:key="e"
				>
					<card-skeleton></card-skeleton>
				</div>
			</div>

			<div class="col col-6">
				<el-button
					style="width: 100%"
					plain
					icon="arrow-left"
					@click="$router.back"
				>
					Hủy
				</el-button>
			</div>

			<div class="col col-6">
				<el-button
					style="width: 100%"
					type="success"
					:loading="loading"
					:disabled="!selectedPt"
					@click="subscribe"
				>
					{{
						selectedPt
							? `Đăng ký - ${formatter.format(goipt.gia)}`
							: "Vui lòng chọn PT"
					}}
				</el-button>
			</div>
		</div>

		<el-skeleton v-else animated>
			<template #template>
				<el-skeleton-item
					variant="h1"
					style="text-align: center; height: 150px"
				></el-skeleton-item>

				<el-skeleton-item
					variant="p"
					style="text-align: center; height: 100px"
				></el-skeleton-item>

				<div class="row">
					<div class="col col-6">
						<el-skeleton-item
							variant="button"
							style="width: 100%"
						></el-skeleton-item>
					</div>
					<div class="col col-6">
						<el-skeleton-item
							variant="button"
							style="width: 100%"
						></el-skeleton-item>
					</div>
				</div>
			</template>
		</el-skeleton>
	</div>
</template>

<script>
import GoiPtService from "@/services/goipt.service";
import { ElNotification } from "element-plus";
import hoadonService from "@/services/hoadon.service";
import ptService from "@/services/pt.service";
import CardSkeleton from "@/components/Skeleton/CardSkeleton.vue";

export default {
	components: { CardSkeleton },
	data() {
		return {
			goipt: null,
			pt: [],
			loading: false,
			selectedPt: null,
			loaded: false,
		};
	},
	mounted() {
		GoiPtService.getById(this.$route.params.id).then(
			(res) => {
				this.goipt = res;
			}
		);

		ptService
			.getAll()
			.then((res) => {
				this.pt = res.data;
			})
			.finally(() => {
				this.loaded = true;
			});
	},
	methods: {
		async subscribe() {
			try {
				this.loading = true;
				await hoadonService.create({
					dkypt: [
						{
							magoipt: this.$route.params.id,
							ngaydk: Date.now(),
							mapt: this.selectedPt,
						},
					],
					dkytap: [],
				});
				ElNotification.success("Đăng ký gói PT thành công");
				this.$router.push("/hoa-don");
			} catch (error) {
				ElNotification.error(error.response.data.message);
			} finally {
				this.loading = false;
			}
		},
	},
};
</script>
