<script lang="ts" context="module">
	import { create, test, enforce, only, type SuiteResult } from 'vest';

	async function onUrl(origCourse: StateCourse, url: string) {
		if (url === origCourse.url) {
			return url;
		}
		try {
			const valid = await validCourseUrl(origCourse.department.url, url as string);
			return valid
				? url
				: Promise.reject(`${url} is already used in ${origCourse.department.name}`);
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
		(data: Partial<StateCourse> = {}, origCourse: StateCourse, fieldname?: string) => {
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
				return onUrl(origCourse, data.url as string);
			});
		}
	);
</script>

<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import { updateCourse, validCourseUrl, type StateCourse } from '$lib/state/creator/courses';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import SelectAsset from '../assets/SelectAsset.svelte';
	import { isUrlSafe } from '$lib/utils';
	import classnames from 'vest/classnames';
	import InputMessages from '$lib/components/ui/InputMessages.svelte';
	import DateTimeInput from '$lib/components/ui/DateTimeInput.svelte';

	export let course: StateCourse;

	let origCourse: StateCourse = { ...course };
	let prevCourse: StateCourse;
	$: if (prevCourse !== course) {
		prevCourse = course;
		origCourse = { ...course };
	}

	let result: SuiteResult = suite(course, origCourse).done((r) => {
		result = r;
	});
	$: disabled = updatingCourse || !result.isValid();
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
		suite(course, origCourse, fieldname).done((r) => {
			result = r;
		});
	}
	function onChange({ currentTarget: { name } }: Event & { currentTarget: { name?: string } }) {
		runSuite(name);
	}

	let updatingCourse = false;
	async function onUpdateCourse() {
		updatingCourse = true;
		try {
			const { id, department, logo, ...data } = course;
			await updateCourse(course.id, data);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating',
				description: (e as Error).message
			});
		} finally {
			updatingCourse = false;
		}
	}
</script>

<div class="mt-4 d-flex justify-content-between">
	<h3>Course: {course.name}</h3>
	<button type="button" on:click={onUpdateCourse} {disabled} class="btn btn-primary">
		{#if updatingCourse}
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
			placeholder="Course Name"
			bind:value={course.name}
			on:change={onChange}
		/>
		<InputMessages className={messageClassName('name')} messages={result.getErrors('name')} />
	</div>
	<div class="col-md">
		<label for="url" class="form-label">URL</label>
		<input
			name="url"
			type="text"
			class="form-control {formClassName('url')}"
			placeholder="Course URL"
			bind:value={course.url}
			on:change={onChange}
		/>
		<InputMessages className={messageClassName('url')} messages={result.getErrors('url')} />
	</div>
	<div class="col-1">
		<label for="visible" class="form-label">Visible</label><br />
		<input class="form-check-input" type="checkbox" name="visible" bind:checked={course.visible} />
	</div>
	{#if course.visible}
		<div class="col-md">
			<label for="releasedAt" class="form-label">Release At</label>
			<DateTimeInput id="releasedAt" bind:date={course.releasedAt} {disabled} />
		</div>
	{/if}
</div>
<hr />
<div class="row">
	{#if course.id}
		<div class="col-md-3">
			<div class="form-control">
				<label for="logo" class="form-label">Logo</label>
				<SelectAsset
					name="logo"
					departmentId={course.departmentId}
					bind:assetId={course.logoId}
					type="IMAGE"
				/>
			</div>
		</div>
	{/if}
	<div class="col">
		<label for="course-description" class="form-label">Description</label>
		<RichEditor id="course-description" bind:value={course.description} />
	</div>
</div>
