<template>
	<el-skeleton animated>
		<template #template>
			<div class="row" v-for="e in 6" :key="e">
				<div class="col col-3" v-for="e in 4" :key="e">
					<el-skeleton-item variant="p"></el-skeleton-item>
				</div>
			</div>
		</template>
	</el-skeleton>
</template>
