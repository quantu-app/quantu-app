<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let course: StateCourse;
</script>

<div class="col-6 col-md-3 mt-4">
	<div class="card">
		{#if course.logoId}
			<img
				class="card-img-top"
				src={`${base}/api/assets/${course.logoId}`}
				alt={course.logo?.name}
			/>
		{/if}
		<div class="card-body">
			<h4 class="card-title">
				<a
					class="link-dark"
					href={`${base}/creator/departments/${department.id}/courses/${course.id}`}
					>{course.name} - {course.url}</a
				>
			</h4>
			<div class="card-text">
				<RichViewer value={course.description} />
			</div>
		</div>
	</div>
</div>
