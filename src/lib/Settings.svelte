<script lang="ts">
	import languages from './data/languages';
	import timezones from './data/timezones';

	let timezone: string = 'EST';
	let displayLanguange: string = 'en';
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
				<select id="timezone" class="form-select" bind:value={timezone}>
					{#each timezones as timezone}
						<option value={timezone.abbr}>{timezone.value}</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="row my-4">
			<div class="col-md-6">
				<label for="display-languange">Display Language</label>
				<p class="text-black-50 m-0">
					This is your real first name, no other user on the system can see this.
				</p>
				<div class="input-group">
					<select id="display-languange" class="form-select" bind:value={displayLanguange}>
						{#each languages as language}
							<option value={language.code}>{language.nativeName} | {language.name}</option>
						{/each}
					</select>
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
