<script lang="ts">
	import { journelEmitter, updateJournel } from '$lib/state/journels';
	import type { Journel } from '$lib/api/quantu-app-api';
	import Tags from '$lib/Tags.svelte';
	import Text from './Text.svelte';
	import { beforeUpdate, onMount } from 'svelte';

	export let localId: string;
	export let journel: Journel;

	let text = journel.content;
	let prevLocalId = localId;

	function onNameChange(e: Event) {
		const name = (e.currentTarget as HTMLInputElement).value;
		updateJournel(localId, {
			name
		});
	}

	function onLocationChange(e: Event) {
		const location = (e.currentTarget as HTMLInputElement).value;
		updateJournel(localId, {
			location
		});
	}

	function onLanguageChange(e: Event) {
		const language = (e.currentTarget as HTMLInputElement).value;
		updateJournel(localId, {
			language
		});
	}

	function onTagsChange(e: CustomEvent<string[]>) {
		updateJournel(localId, {
			tags: e.detail
		});
	}

	beforeUpdate(() => {
		if (localId !== prevLocalId) {
			prevLocalId = localId;
			text = journel.content;
		}
	});

	function onSync() {
		text = journel.content;
	}

	onMount(() => {
		journelEmitter.on('sync', onSync);
		return () => {
			journelEmitter.off('sync', onSync);
		};
	});
</script>

<div class="container-fluid mt-2">
	<div class="row justify-content-between align-items-end">
		<div class="col-auto">
			<h2 class="d-inline">{journel.name}</h2>
			<h4 class="d-inline">- {journel.location}</h4>
		</div>
		<div class="col-auto flex-grow-1" />
		<div class="col-auto">
			<button
				type="button"
				role="button"
				class="btn btn-primary"
				data-bs-toggle="modal"
				data-bs-target="#journel-settings"
				aria-label="Journel Settings"><i class="bi bi-gear" /></button
			>
		</div>
	</div>
	<hr class="mt-0" />
</div>

<div
	class="modal fade"
	id="journel-settings"
	tabindex="-1"
	aria-labelledby="journel-settings-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="journel-settings-label" class="modal-title">Settings</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="mb-4">
					<label for="settings-journel-name" class="form-label">Title</label>
					<input
						id="settings-journel-name"
						type="text"
						class="form-control"
						placeholder="Enter title"
						value={journel.name}
						on:change={onNameChange}
					/>
				</div>
				<div class="mb-4">
					<label for="settings-journel-location" class="form-label">Location</label>
					<input
						id="settings-journel-location"
						type="text"
						class="form-control"
						placeholder="Enter location"
						value={journel.location}
						on:change={onLocationChange}
					/>
				</div>
				<div class="mb-4">
					<label for="settings-journel-language" class="form-label">Language</label>
					<input
						id="settings-journel-language"
						type="text"
						class="form-control"
						placeholder="Enter langauge"
						value={journel.language}
						on:change={onLanguageChange}
					/>
				</div>
				<div class="mb-4">
					<label for="settings-journel-tags" class="form-label mb-0">Tags</label>
					<Tags id="settings-journel-tags" tags={journel.tags || []} on:change={onTagsChange} />
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>

<div class="container-md">
	<Text {localId} {text} />
</div>
