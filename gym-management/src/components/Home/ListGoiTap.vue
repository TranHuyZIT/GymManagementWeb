<template>
	<section class="section" id="features">
		<div class="container">
			<div class="row">
				<div class="col-lg-6 offset-lg-3">
					<div class="section-heading">
						<h2>Chọn <em>Dịch Vụ</em></h2>
						<img
							src="../../assets/images/line-dec.png"
							alt="waves"
						/>
						<p>
							Trải nghiệm các dịch vụ tại phòng gym và thay
							đổi bản thân từ hôm nay!
						</p>
					</div>
				</div>
				<div class="col-lg-6">
					<ul class="features-items">
						<li class="feature-item">
							<div class="left-icon">
								<img
									src="../../assets/images/features-first-icon.png"
									alt="First One"
								/>
							</div>
							<div class="right-content">
								<h4>Gói PT</h4>
								<p>
									Cùng cải thiện mỗi ngày với một huấn luyện
									viên chuyên nghiệp đồng hành trên con
									đường của bạn.
								</p>
								<router-link
									to="/goi-pt"
									class="text-button"
								>
									Xem thêm
								</router-link>
							</div>
						</li>
					</ul>
				</div>
				<div class="col-lg-6">
					<ul class="features-items">
						<li class="feature-item">
							<div class="left-icon">
								<img
									src="../../assets/images/features-first-icon.png"
									alt="fourth muscle"
								/>
							</div>
							<div class="right-content">
								<h4>Gói tập</h4>
								<p>
									Trải nghiệm những trang thiết bị tân tiến,
									và đầy đủ cho những người mới đến vận động
									viên chuyên nghiệp .
								</p>
								<router-link
									to="/goi-tap"
									class="text-button"
									>Xem thêm</router-link
								>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
	<!-- ***** Features Item End ***** -->
</template>
<script>
export default {
	name: "ListGoiTap",
};
</script>
