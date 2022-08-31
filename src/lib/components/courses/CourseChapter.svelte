<script lang="ts">
	import type { StateChapter } from '$lib/state/chapters';
	import type { StateLesson } from '$lib/state/lessons';
	import ChapterLessonCard from './ChapterLessonCard.svelte';
	import ChapterQuizCard from './ChapterQuizCard.svelte';

	export let chapterNumber: number = 1;
	export let chapter: StateChapter;
	export let lessons: StateLesson[] = [];
	export let quizzes: any[] = [];
</script>

<div class="container">
	<h1>Chapter {chapterNumber}: {chapter.name}</h1>
</div>

<div class="container">
	{#if lessons.length > 0}
		<h2 class="my-4">Lessons</h2>

		<div class="row row-cols-md-3 row-cols-sm-2">
			{#each lessons as lesson (lesson.id)}
				<div class="col my-2">
					<ChapterLessonCard {lesson} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="row mt-4">
			<div class="col text-center">
				<div class="alert alert-primary">
					<h4 class="mb-0">
						<i class="bi bi-info-circle" />
						No lessons yet
					</h4>
				</div>
			</div>
		</div>
	{/if}
</div>
{#if quizzes.length}
	<div class="container">
		<h2 class="my-4">Quizzes</h2>
		<div class="row row-cols-lg-3 row-cols-md-3 row-cols-sm-2">
			{#each quizzes as quiz, index (quiz.id)}
				<div class="col-2 my-2">
					<ChapterQuizCard {quiz} quizNumber={index + 1} />
				</div>
			{/each}
		</div>
	</div>
{/if}
