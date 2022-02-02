<script lang="ts">
	let timezone: string;
	let displayLanguange: string;
</script>

<div class="container">
	<div class="row">
		<h1>Application Settings</h1>
		<hr />
	</div>

	<form on:submit|preventDefault class="my-4">
		<div class="row my-4">
			<label for="timezone">Timezone</label>
			<p class="text-black-50 m-0">
				This will display dates and times correctly for your learning needs.
			</p>
			<div class="input-group">
				<input
					type="timezone"
					class="form-control"
					id="timezone"
					placeholder="Timezone"
					bind:value={timezone}
				/>
			</div>
		</div>
		<div class="row my-4">
			<div class="col-md-6">
				<label for="display-languange">Display Language</label>
				<p class="text-black-50 m-0">
					This is your real first name, no other user on the system can see this.
				</p>
				<div class="input-group">
					<input
						type="locale"
						class="form-control"
						id="display-languange"
						placeholder="Display Language"
						bind:value={displayLanguange}
					/>
				</div>
			</div>
		</div>
		<div class="row my-4">
			<div class="d-inline-block text-end">
				<button type="submit" class="btn btn-primary">Update</button>
			</div>
		</div>
	</form>
</div>
