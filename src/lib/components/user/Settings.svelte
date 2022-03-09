<script lang="ts">
	import languages from '$lib/data/languages';

	let displayLanguage: string = 'en';
</script>

<div class="container">
	<div class="row">
		<h1>Application Settings</h1>
		<hr />
	</div>

	<form on:submit|preventDefault class="my-4">
		<div class="row my-4">
			<div class="col-12">
				<label for="display-languange">Display Language</label>
				<p class="text-black-50 mt-2 mb-2">
					This will set the desired display language for the application. <small
						>*Please note our translations are community driven and currently we only support
						English. However, choosing a desired language will help us focus on adding and updating
						interface languages in the future.</small
					>
				</p>
				<div class="input-group">
					<select id="display-languange" class="form-select" bind:value={displayLanguage}>
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

<style>
	label {
		font-weight: bold;
		font-size: 18px;
	}
</style>
