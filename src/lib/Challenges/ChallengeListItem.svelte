<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';
	import { titleCase } from 'title-case';

	export let question: Question;
</script>

<div class="list-group-item">
	<div class="row justify-content-center">
		<div class="col-md-6 border p-4">
			<div class="row">
				<div class="col-lg-6">
					<img
						src="https://studentchallenge.edublogs.org/files/2021/12/About-Page-Graphic.png"
						alt={question.name || 'No Name'}
					/>
				</div>
				<div class="col-lg-6">
					<h2>{question.name || 'No Name'}</h2>
					<p class="d-inline">{titleCase(question.type.replace('_', ' '))}</p>
				</div>
			</div>
			<div class="text-end">
				<a role="button" class="btn btn-primary me-2" href={`/questions/${question.id}`}>Solve</a>
				<a
					role="button"
					class="btn btn-secondary text-white me-2"
					href={`/questions/${question.id}/review`}>Review</a
				>
			</div>
		</div>
	</div>
</div>
