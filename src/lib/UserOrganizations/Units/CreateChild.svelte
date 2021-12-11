<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Lesson, Quiz, Unit } from '$lib/api/quantu-app-api';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { createLesson } from '$lib/state/organizationLessons';
	import { createQuiz } from '$lib/state/organizationQuizzes';
	import { organizationPath } from '$lib/utils';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unit: Unit;

	let childCreating = false;
	let newChildName: string;
	let newChildType: Lesson['type'] | Quiz['type'];

	$: onCreateChild = async () => {
		childCreating = true;
		try {
			const child =
				newChildType === 'quiz'
					? await createQuiz(organizationId, { name: newChildName, unitId: unit.id })
					: await createLesson(organizationId, { name: newChildName, unitId: unit.id });
			goto(organizationPath(organizationId, courseId, unit.id, child.id, newChildType));
		} catch (error) {
			childCreating = false;
			Object.entries(error.body.errors).map(([name, message]: [string, string[]]) => {
				addNotification({
					type: NotificationType.Danger,
					heading: name,
					description: message.join(', ')
				});
			});
		}
	};
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#create-child"
	aria-label="Create">Create Quiz/Lesson</button
>

<div
	class="modal fade"
	id="create-child"
	tabindex="-1"
	aria-labelledby="create-child-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="create-child-label" class="modal-title">Create Quiz/Lesson</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="form-group">
					<label for="child-type">Type</label>
					<select
						id="child-type"
						class="form-select"
						bind:value={newChildType}
						aria-label="Child Type"
					>
						<option value="quiz">Quiz</option>
						<option value="lesson">Lesson</option>
					</select>
				</div>
				<div class="form-group">
					<label for="child-name">Name</label>
					<input
						type="text"
						class="form-control"
						id="child-name"
						placeholder="Name"
						bind:value={newChildName}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreateChild}
					disabled={!newChildName || childCreating}
					data-bs-dismiss="modal"
					class="btn btn-primary"
				>
					{#if childCreating}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Create
				</button>
				<button type="button" class="btn btn-danger text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
