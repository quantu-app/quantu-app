<div class="row">
	<div class="col-12">
		<div class="d-flex flex-column h-100 pt-4">
			<slot name="content" />
		</div>
	</div>
	<div class="col-12">
		<div class="d-flex flex-column border-lg-start pt-4 h-100 input">
			<slot name="input" />

			<div class="d-flex justify-content-end mt-2">
				<slot name="extra" />
			</div>
		</div>
	</div>
</div>
