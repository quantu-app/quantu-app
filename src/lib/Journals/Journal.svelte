<script lang="ts">
	import { journalEmitter, updateJournal } from '$lib/state/journals';
	import type { Journal } from '$lib/api/quantu-app-api';
	import Tags from '$lib/Tags.svelte';
	import Text from './Text.svelte';
	import { beforeUpdate, onMount } from 'svelte';

	export let localId: string;
	export let journal: Journal;

	let text = journal.content;
	let prevLocalId = localId;
	let innerWidth: number;

	function onNameChange(e: Event) {
		const name = (e.currentTarget as HTMLInputElement).value;
		updateJournal(localId, {
			name
		});
	}

	function onLocationChange(e: Event) {
		const location = (e.currentTarget as HTMLInputElement).value;
		updateJournal(localId, {
			location
		});
	}

	function onLanguageChange(e: Event) {
		const language = (e.currentTarget as HTMLInputElement).value;
		updateJournal(localId, {
			language
		});
	}

	function onTagsChange(e: CustomEvent<string[]>) {
		updateJournal(localId, {
			tags: e.detail
		});
	}

	beforeUpdate(() => {
		if (localId !== prevLocalId) {
			prevLocalId = localId;
			text = journal.content;
		}
	});

	function onSync() {
		prevLocalId = undefined;
		text = journal.content;
	}

	onMount(() => {
		journalEmitter.on('sync', onSync);
		return () => {
			journalEmitter.off('sync', onSync);
		};
	});
</script>

<svelte:window bind:innerWidth />

<div class="container-fluid mt-2">
	<div class="row justify-content-between align-items-end">
		<div class="col-auto">
			<h2 class="d-inline">{journal.name}</h2>
			{#if innerWidth >= 1200}
				<h4 class="d-inline">- {journal.location}</h4>
			{/if}
		</div>
		<div class="col-auto flex-grow-1" />
		<div class="col-auto">
			<p class="mb-0">Words: {journal.wordCount}</p>
		</div>
		<div class="col-auto">
			<button
				type="button"
				role="button"
				class="btn btn-primary"
				data-bs-toggle="modal"
				data-bs-target="#journal-settings"
				aria-label="Journal Settings"><i class="bi bi-gear" /></button
			>
		</div>
	</div>
	<hr class="mt-2" />
</div>

<div
	class="modal fade"
	id="journal-settings"
	tabindex="-1"
	aria-labelledby="journal-settings-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="journal-settings-label" class="modal-title">Settings</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="mb-4">
					<label for="settings-journal-name" class="form-label">Title</label>
					<input
						id="settings-journal-name"
						type="text"
						class="form-control"
						placeholder="Enter title"
						value={journal.name}
						on:change={onNameChange}
					/>
				</div>
				<div class="mb-4">
					<label for="settings-journal-location" class="form-label">Location</label>
					<input
						id="settings-journal-location"
						type="text"
						class="form-control"
						placeholder="Enter location"
						value={journal.location}
						on:change={onLocationChange}
					/>
				</div>
				<div class="mb-4">
					<label for="settings-journal-language" class="form-label">Language</label>
					<input
						id="settings-journal-language"
						type="text"
						class="form-control"
						placeholder="Enter langauge"
						value={journal.language}
						on:change={onLanguageChange}
					/>
				</div>
				<div class="mb-4">
					<label for="settings-journal-tags" class="form-label mb-0">Tags</label>
					<Tags id="settings-journal-tags" tags={journal.tags || []} on:change={onTagsChange} />
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
