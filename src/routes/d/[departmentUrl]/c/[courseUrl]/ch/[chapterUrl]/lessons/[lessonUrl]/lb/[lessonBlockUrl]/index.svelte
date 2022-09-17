<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { authGuard } from '$lib/guard/authGuard';
	import { showLessonBlock } from '$lib/state/lessonBlocks';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const courseUrl = input.params.courseUrl;
		const chapterUrl = input.params.chapterUrl;
		const lessonUrl = input.params.lessonUrl;
		const lessonBlockUrl = input.params.lessonBlockUrl;
		let lessonBlock = await showLessonBlock(
			departmentUrl,
			courseUrl,
			chapterUrl,
			lessonUrl,
			lessonBlockUrl,
			input.fetch
		);

		return {
			props: {
				departmentUrl,
				courseUrl,
				chapterUrl,
				lessonUrl,
				lessonBlockUrl
			}
		};
	};
</script>

<script lang="ts">
	import { lessonBlocksByUrl } from '$lib/state/lessonBlocks';

	export let departmentUrl: string;
	export let courseUrl: string;
	export let chapterUrl: string;
	export let lessonUrl: string;
	export let lessonBlockUrl: string;

	$: lessonBlock = (((($lessonBlocksByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] ||
		{})[lessonUrl] || {})[lessonBlockUrl];
</script>

<svelte:head>
	<title>{lessonBlock.lesson.name} | {lessonBlock.name}</title>
</svelte:head>
