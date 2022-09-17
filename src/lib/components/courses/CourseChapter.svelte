<script lang="ts">
	import type { StateChapter } from '$lib/state/chapters';
	import type { StateLesson } from '$lib/state/lessons';
	import ChapterLessonCard from './ChapterLessonCard.svelte';
	import ChapterQuizCard from './ChapterQuizCard.svelte';

	export let chapterNumber: number = 1;
	export let chapter: StateChapter;
	export let lessons: StateLesson[] = [];
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
						coming soon
					</h4>
				</div>
			</div>
		</div>
	{/if}
</div>
