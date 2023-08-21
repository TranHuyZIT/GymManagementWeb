<template>
	<el-container>
		<el-aside width="200px">
			<el-scrollbar>
				<el-menu :default-active="$route.path">
					<router-link to="/admin/goi-tap">
						<el-menu-item index="/admin/goi-tap">
							<el-icon><Tickets /></el-icon>
							Gói tập
						</el-menu-item>
					</router-link>

					<router-link to="/admin/goi-pt">
						<el-menu-item index="/admin/goi-pt">
							<el-icon>
								<Help></Help>
							</el-icon>
							Gói PT
						</el-menu-item>
					</router-link>

					<router-link to="/admin/pt">
						<el-menu-item index="/admin/pt">
							<el-icon>
								<User></User>
							</el-icon>
							PT
						</el-menu-item>
					</router-link>

					<router-link to="/admin/khach">
						<el-menu-item index="/admin/khach">
							<el-icon>
								<User></User>
							</el-icon>
							Khách hàng
						</el-menu-item>
					</router-link>

					<el-sub-menu index="/admin/hoa-don">
						<template #title>
							<el-icon>
								<Memo></Memo>
							</el-icon>
							Hóa đơn
						</template>

						<router-link to="/admin/hoa-don/chua-duyet">
							<el-menu-item
								index="/admin/hoa-don/chua-duyet"
							>
								<el-icon><remove></remove></el-icon>
								Chưa duyệt
							</el-menu-item>
						</router-link>
						<router-link to="/admin/hoa-don/da-duyet">
							<el-menu-item index="/admin/hoa-don/da-duyet">
								<el-icon><plus></plus></el-icon>
								Đã duyệt
							</el-menu-item>
						</router-link>
					</el-sub-menu>
				</el-menu>
			</el-scrollbar>
		</el-aside>

		<el-container>
			<el-main>
				<slot></slot>
			</el-main>
		</el-container>
	</el-container>
</template>
