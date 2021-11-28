<script lang="ts">
	import { goto } from '$app/navigation';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { createLesson } from '$lib/state/organizationLessons';
	import { organizationPath } from '$lib/utils';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unitId: number = undefined;

	let lessonCreating = false;
	let newLessonName = '';

	async function onCreateLesson() {
		lessonCreating = true;
		try {
			const lesson = await createLesson(organizationId, { name: newLessonName, unitId });
			goto(organizationPath(organizationId, courseId, unitId, lesson.id, lesson.type));
		} catch (error) {
			lessonCreating = false;
			Object.entries(error.body.errors).map(([name, message]: [string, string[]]) => {
				addNotification({
					type: NotificationType.Danger,
					heading: name,
					description: message.join(', ')
				});
			});
		}
	}
</script>

<form on:submit|preventDefault class="mt-2">
	<div class="input-group">
		<input
			type="text"
			class="form-control"
			placeholder="New Lesson name"
			bind:value={newLessonName}
		/>
		<button
			type="submit"
			disabled={lessonCreating || !newLessonName.trim()}
			class="btn btn-primary"
			aria-label="Create Lesson"
			on:click={onCreateLesson}
		>
			{#if lessonCreating}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
			{/if}
			Create
		</button>
	</div>
</form>
