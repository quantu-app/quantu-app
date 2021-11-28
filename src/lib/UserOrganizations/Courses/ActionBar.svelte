<script lang="ts">
	import { goto } from '$app/navigation';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { createCourse } from '$lib/state/organizationCourses';

	export let organizationId: number;

	let courseCreating = false;
	let newCourseName = '';

	async function onCreateCourse() {
		courseCreating = true;
		try {
			const course = await createCourse(organizationId, { name: newCourseName });
			goto(`/user/organizations/${organizationId}/courses/${course.id}`);
		} catch (error) {
			courseCreating = false;
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
			placeholder="New Course name"
			bind:value={newCourseName}
		/>
		<button
			type="submit"
			disabled={courseCreating || !newCourseName.trim()}
			class="btn btn-primary"
			aria-label="Create Course"
			on:click={onCreateCourse}
		>
			{#if courseCreating}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
			{/if}
			Create
		</button>
	</div>
</form>
