<script lang="ts">
	import type { Lesson, Quiz, UnitChildList } from '$lib/api/quantu-app-api';
	import { deleteLesson } from '$lib/state/organizationLessons';
	import { deleteQuiz } from '$lib/state/organizationQuizzes';
	import DeleteLesson from '../Lessons/DeleteLesson.svelte';
	import DeleteQuiz from '../Quizzes/DeleteQuiz.svelte';
	import ChildListItem from './ChildListItem.svelte';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unitId: number;
	export let children: UnitChildList;

	let quizToDelete: Quiz;
	let lessonToDelete: Lesson;
	let childToDelete: Quiz | Lesson;

	function createOnDelete(child: Quiz | Lesson) {
		return function onDelete() {
			switch (child.type) {
				case 'quiz':
					quizToDelete = child;
					break;
				case 'lesson':
					lessonToDelete = child;
					break;
			}
			childToDelete = child;
		};
	}

	async function onDeleteChild() {
		if (childToDelete) {
			switch (childToDelete.type) {
				case 'quiz':
					await deleteQuiz(organizationId, childToDelete.id);
					break;
				case 'lesson':
					await deleteLesson(organizationId, childToDelete.id);
					break;
			}
			lessonToDelete = undefined;
			quizToDelete = undefined;
			childToDelete = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each children as child (child.id + child.type)}
		<ChildListItem {organizationId} {courseId} {unitId} {child} onDelete={createOnDelete(child)} />
	{/each}
</div>

<DeleteLesson lesson={lessonToDelete} onDeleteLesson={onDeleteChild} />
<DeleteQuiz quiz={quizToDelete} onDeleteQuiz={onDeleteChild} />
