<script lang="ts">
	import type { QuestionResult } from '$lib/api/quantu-app-api';

	export let result: QuestionResult;
</script>

<div class="row h-100">
	<div class="col-md-8">
		<div class="d-flex flex-column h-100 pt-4">
			<slot name="content" />
		</div>
	</div>
	<div class="col-md-4">
		<div class="d-flex flex-column border-lg-start pt-4 h-100 input">
			<slot name="input" />

			<div class="d-flex justify-content-end mt-2">
				<slot name="extra" />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	// find a way to use bootstrap variables and mixins in components
	@media (min-width: 768px) {
		.input {
			border-left: 1px solid #dee2e6;
		}
	}
</style>
