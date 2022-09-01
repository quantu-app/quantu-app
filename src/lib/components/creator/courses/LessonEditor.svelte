<svelte:options immutable />

<script lang="ts" context="module">
	import { create, test, enforce, only, type SuiteResult } from 'vest';

	async function onUrl(origLesson: StateLesson, url: string) {
		if (url === origLesson.url) {
			return url;
		}
		try {
			const valid = await validLessonUrl(
				origLesson.chapter.course.department.url,
				origLesson.chapter.course.url,
				origLesson.chapter.url,
				url as string
			);
			return valid ? url : Promise.reject(`${url} is already used in ${origLesson.chapter.name}`);
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
		(data: Partial<StateLesson> = {}, origLesson: StateLesson, fieldname?: string) => {
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
				return onUrl(origLesson, data.url as string);
			});
		}
	);
</script>

<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import { updateLesson, validLessonUrl, type StateLesson } from '$lib/state/creator/lessons';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import SelectAsset from '../assets/SelectAsset.svelte';
	import { isUrlSafe } from '$lib/utils';
	import classnames from 'vest/classnames';
	import InputMessages from '$lib/components/ui/InputMessages.svelte';
	import DateTimeInput from '$lib/components/ui/DateTimeInput.svelte';

	export let lesson: StateLesson;

	let origLesson: StateLesson = { ...lesson };
	let prevLesson: StateLesson;
	$: if (prevLesson !== lesson) {
		prevLesson = lesson;
		origLesson = { ...lesson };
	}

	let result: SuiteResult = suite(lesson, origLesson).done((r) => {
		result = r;
	});
	$: disabled = !result.isValid() || updatingLesson;
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

	function runSuite(fieldName?: string) {
		return new Promise((resolve) => {
			suite(lesson, origLesson, fieldName).done((r) => {
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

	let updatingLesson = false;
	async function onUpdateLesson() {
		updatingLesson = true;
		try {
			const { id, chapter, logo, ...data } = lesson;
			await updateLesson(lesson.id, data);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating',
				description: (e as Error).message
			});
		} finally {
			updatingLesson = false;
		}
	}
</script>

<div class="mt-4 d-flex justify-content-between">
	<h3>Lesson {lesson.chapter.index + 1}.{lesson.index + 1}: {lesson.name}</h3>
	<button type="button" on:click={onUpdateLesson} {disabled} class="btn btn-primary">
		{#if updatingLesson}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Update
	</button>
</div>
<div class="row">
	<div class="col-6">
		<label for="name" class="form-label">Name</label>
		<input
			name="name"
			type="text"
			class="form-control {formClassName('name')}"
			placeholder="Lesson Name"
			bind:value={lesson.name}
			on:change={onChangeEvent}
		/>
		<InputMessages className={messageClassName('name')} messages={result.getErrors('name')} />
	</div>
	<div class="col-6">
		<label for="url" class="form-label">URL</label>
		<input
			name="url"
			type="text"
			class="form-control {formClassName('url')}"
			placeholder="Lesson URL"
			bind:value={lesson.url}
			on:change={onChangeEvent}
		/>
		<InputMessages className={messageClassName('url')} messages={result.getErrors('url')} />
	</div>
</div>
<div class="row my-2">
	<div class="col-1">
		<label for="visible" class="form-label">Visible</label>
		<input class="form-check-input" type="checkbox" name="visible" bind:checked={lesson.visible} />
	</div>
	{#if lesson.visible}
		<div class="col-md">
			<label for="releasedAt" class="form-label">Release At</label>
			<DateTimeInput id="releasedAt" bind:date={lesson.releasedAt} {disabled} />
		</div>
	{/if}
</div>
<div class="row">
	{#if lesson.id}
		<div class="col-md-3">
			<div class="form-control">
				<label for="logo" class="form-label">Logo</label>
				<SelectAsset
					name="logo"
					departmentId={lesson.chapter.course.department.id}
					bind:assetId={lesson.logoId}
					type="IMAGE"
					{onChange}
				/>
			</div>
		</div>
	{/if}
	<div class="col">
		<label for="lesson-description" class="form-label">Description</label>
		<RichEditor name="description" bind:value={lesson.description} {onChange} />
	</div>
</div>
