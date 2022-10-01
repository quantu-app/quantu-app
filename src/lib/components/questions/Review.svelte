<svelte:options immutable />

<div class="row">
	<div class="col-12">
		<div class="d-flex flex-column h-100 pt-4">
			<slot name="content" />
		</div>
	</div>
	<div class="my-4">
		<div class="d-flex flex-column flex-grow-1">
			<slot name="input" />

			<div class="row justify-content-between mt-4">
				<div class="col text-end">
					<slot name="extra" />
				</div>
			</div>
			<div>
				<slot name="explanation" />
			</div>
		</div>
	</div>
</div>
