<div class="row">
	<div class="col-12">
		<div class="d-flex flex-column h-100 pt-4">
			<slot name="content" />
		</div>
	</div>
	<div class="col-12 p-0">
		<div class="d-flex flex-column pt-4 h-100 input">
			<slot name="input" />

			<div class="d-flex mt-2">
				<slot name="extra" />
			</div>
			<div>
				<slot name="explanation" />
			</div>
		</div>
	</div>
</div>
