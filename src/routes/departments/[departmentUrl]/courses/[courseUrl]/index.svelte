<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const courseUrl = input.params.courseUrl;
		const department = await showDepartmentByUrl(departmentUrl, input.fetch);
		await showCourseByUrl(departmentUrl, courseUrl, input.fetch);

		return {
			props: {
				departmentUrl,
				courseUrl
			}
		};
	};
</script>

<script lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { showCourseByUrl, coursesByUrl } from '$lib/state/courses';
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';

	export let departmentUrl: string;
	export let courseUrl: string;

	$: department = $departmentsByUrl[departmentUrl];
	$: course = $coursesByUrl[departmentUrl][courseUrl];

	let fallbackImage = 'https://loremflickr.com/320/240';
</script>

<svelte:head>
	<title>{course.name}</title>
</svelte:head>

<UserLayout>
	<div class="container-full-bg bg-dark py-5">
		<div class="container">
			<div class="row text-white">
				<div class="col-8">
					<a href={`${base}/courses`} class="linkToCourses">Back to Courses</a>

					<h1 class="mt-3">{course.name}</h1>
					<RichViewer value={course.description} />
				</div>
				<div class="col-4">
					<div class="card darkerBgColor">
						<img
							src={course.logoId ? `${base}/api/assets/${course.logoId}` : fallbackImage}
							alt={course.name}
							class="card-img-top"
						/>
						<div class="card-body">
							<div class="row text-center">
								<div class="col-4">
									<h4>32</h4>
									<p>Lessons</p>
								</div>
								<div class="col-4">
									<h4>80</h4>
									<p>Quizzes</p>
								</div>
								<div class="col-4">
									<h4>5</h4>
									<p>Tests</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</UserLayout>

<style>
	a.linkToCourses {
		color: white;
		text-decoration: underline;
	}
	.card.darkerBgColor {
		background: #3e3e3e;
	}
</style>
