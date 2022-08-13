<svelte:options immutable />

<script lang="ts" context="module">
	import { create, test, enforce, only, type SuiteResult } from 'vest';

	async function onUrl(origChapter: StateChapter, url: string) {
		if (url === origChapter.url) {
			return url;
		}
		try {
			const valid = await validChapterUrl(
				origChapter.course.department.url,
				origChapter.course.url,
				url as string
			);
			return valid ? url : Promise.reject(`${url} is already used in ${origChapter.course.name}`);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error validating URL',
				description: (e as Error).message
			});
			return Promise.reject(e);
		}
	}

	export const suite = create(
		'user_edit_profile_form',
		(data: Partial<StateChapter> = {}, origChapter: StateChapter, fieldname?: string) => {
			if (fieldname) {
				only(fieldname);
			}

			test('name', 'is not empty or blank', () => {
				enforce(data.name).isNotEmpty().isNotBlank();
			});

			test('url', 'must be a valid URL', () => {
				enforce(data.url).condition(isUrlSafe);
			});
			test('url', 'url must be unique to the Department', () => {
				return onUrl(origChapter, data.url as string);
			});
		}
	);
</script>

<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import { updateChapter, validChapterUrl, type StateChapter } from '$lib/state/creator/chapters';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import SelectAsset from '../assets/SelectAsset.svelte';
	import { isUrlSafe } from '$lib/utils';
	import classnames from 'vest/classnames';
	import InputMessages from '$lib/components/ui/InputMessages.svelte';

	export let chapter: StateChapter;

	let origChapter: StateChapter = { ...chapter };
	let prevChapter: StateChapter;
	$: if (prevChapter !== chapter) {
		prevChapter = chapter;
		origChapter = { ...chapter };
	}

	let result: SuiteResult = suite(chapter, origChapter).done((r) => {
		result = r;
	});
	$: disabled = updatingChapter || !result.isValid();
	$: formClassName = classnames(result, {
		warning: 'warning',
		invalid: 'is-invalid',
		valid: 'is-valid'
	});
	$: messageClassName = classnames(result, {
		warning: 'warning-feedback',
		invalid: 'invalid-feedback',
		valid: 'valid-feedback'
	});

	function runSuite(fieldname?: string) {
		return new Promise((resolve) => {
			suite(chapter, origChapter, fieldname).done((r) => {
				result = r;
				resolve(r.isValid());
			});
		});
	}
	function onChangeEvent({
		currentTarget: { name }
	}: Event & { currentTarget: { name?: string } }) {
		runSuite(name);
	}
	function onChange(name?: string) {
		runSuite(name);
	}

	let updatingChapter = false;
	async function onUpdateChapter() {
		updatingChapter = true;
		try {
			const { id, course, logo, ...data } = chapter;
			await updateChapter(chapter.id, data);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating',
				description: (e as Error).message
			});
		} finally {
			updatingChapter = false;
		}
	}
</script>

<div class="mt-4 d-flex">
	<h3>Chapter - {chapter.index + 1}: {chapter.name}</h3>
	<button type="button" on:click={onUpdateChapter} {disabled} class="btn btn-primary">
		{#if updatingChapter}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Update
	</button>
</div>
<div class="row">
	<div class="col-md">
		<label for="name" class="form-label">Name</label>
		<input
			name="name"
			type="text"
			class="form-control {formClassName('name')}"
			placeholder="Chapter Name"
			bind:value={chapter.name}
			on:change={onChangeEvent}
		/>
		<InputMessages className={messageClassName('name')} messages={result.getErrors('name')} />
	</div>
	<div class="col-md">
		<label for="url" class="form-label">URL</label>
		<input
			name="url"
			type="text"
			class="form-control {formClassName('url')}"
			placeholder="Chapter URL"
			bind:value={chapter.url}
			on:change={onChangeEvent}
		/>
		<InputMessages className={messageClassName('url')} messages={result.getErrors('url')} />
	</div>
</div>
<hr />
<div class="row">
	{#if chapter.id}
		<div class="col-md-3">
			<div class="form-control">
				<label for="logo" class="form-label">Logo</label>
				<SelectAsset
					name="logo"
					departmentId={chapter.course.department.id}
					bind:assetId={chapter.logoId}
					{onChange}
					type="IMAGE"
				/>
			</div>
		</div>
	{/if}
	<div class="col">
		<label for="description" class="form-label">Description</label>
		<RichEditor id="description" name="description" bind:value={chapter.description} {onChange} />
	</div>
</div>
