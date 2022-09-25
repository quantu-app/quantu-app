<script lang="ts">
	import { redoLesson, type StateLesson } from '$lib/state/lessons';
	import type { StateLessonBlock } from '$lib/state/lessonBlocks';
	import LessonSummaryCard from './LessonSummaryCard.svelte';

	export let lesson: StateLesson;
	export let lessonBlocks: StateLessonBlock[];
	export let upvote: (event: Event) => void = (_event) => {};
	export let downvote: (event: Event) => void = (_event) => {};
	export let continueLink: string;

	let redoingLesson = false;
	async function onRedoLesson() {
		redoingLesson = true;
		try {
			await redoLesson(
				lesson.chapter.course.department.url,
				lesson.chapter.course.url,
				lesson.chapter.url,
				lesson.url
			);
			window.location.reload();
		} finally {
			redoingLesson = false;
		}
	}
</script>

<div class="container">
	<div class="row">
		<div class="col-6 mx-auto">
			<h2 class="text-center mx-auto my-5">Lesson complete</h2>

			<div class="row mb-4">
				<LessonSummaryCard {lesson} {lessonBlocks} />
				<p class="my-4 text-center">Did you like this lesson?</p>
				<div class="col-6 mx-auto text-center">
					<button class="btn btn-outline-dark" aria-label="thumbs up" on:click={upvote}>
						<i class="bi bi-hand-thumbs-up" />
					</button>
					<button class="btn btn-outline-dark" aria-label="thumbs down" on:click={downvote}>
						<i class="bi bi-hand-thumbs-down" />
					</button>
				</div>
			</div>
			<div class="row text-center mb-6">
				<div class="col-6 mx-auto">
					<a class="btn btn-dark" style="width: 120px" href={continueLink}>Continue</a><br />
					<button
						class="btn mt-2"
						style="width: 120px"
						on:click={onRedoLesson}
						disabled={redoingLesson}>Redo lesson</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
