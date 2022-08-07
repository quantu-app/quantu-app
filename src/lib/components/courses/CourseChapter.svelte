<script lang="ts">
	import type { StateChapter } from '$lib/state/chapters';
	import ChapterLessonCard from './ChapterLessonCard.svelte';
	import ChapterQuizCard from './ChapterQuizCard.svelte';

	export let chapterNumber: number = 1;
	export let chapter: StateChapter;

	let lessons = [
		{
			name: 'Subsets',
			totalQuestions: 19,
			exp: 5,
			description: [
				{
					type: 'paragraph',
					children: [
						{
							text: 'Come to understand mathematical groups by looking at symmetries and transforming objects in a plane.'
						}
					]
				}
			]
		},
		{
			name: 'Probability Theory',
			totalQuestions: 15,
			exp: 4,
			description: [
				{
					type: 'paragraph',
					children: [
						{
							text: 'Learn the branch of mathematics concerned with probability.'
						}
					]
				}
			]
		},
		{
			name: 'Calculus',
			totalQuestions: 22,
			exp: 3,
			description: [
				{
					type: 'paragraph',
					children: [{ text: 'Make clear the concepts of continuous change.' }]
				}
			]
		},
		{
			name: 'Integration',
			totalQuestions: 18,
			exp: 5,
			description: [
				{
					type: 'paragraph',
					children: [{ text: 'Summation across continuous change.' }]
				}
			]
		}
	];

	let quizzes = [
		{
			name: 'Subsets',
			totalQuestions: 19,
			exp: 5,
			description: [
				{
					type: 'paragraph',
					children: [
						{
							text: 'Come to understand mathematical groups by looking at symmetries and transforming objects in a plane.'
						}
					]
				}
			]
		}
	];
</script>

<div class="container">
	<h1>Chapter {chapterNumber}: {chapter.name}</h1>
	<h2 class="my-4">Lessons</h2>

	<div class="row row-cols-lg-3 row-cols-md-3 row-cols-sm-2">
		{#each lessons as lesson, index}
			<div class="col-2 my-2">
				<ChapterLessonCard {lesson} />
			</div>
		{/each}
	</div>
</div>
<div class="container">
	<h2 class="my-4">Quizzes</h2>
	<div class="row row-cols-lg-3 row-cols-md-3 row-cols-sm-2">
		{#each quizzes as quiz, index}
			<div class="col-2 my-2">
				<ChapterQuizCard {quiz} quizNumber={index + 1} />
			</div>
		{/each}
	</div>
</div>
