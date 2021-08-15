<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import { titleCase } from 'title-case';

	export let question: Question;

	$: updatedAt = new Date(question.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			{#if question.index != null}
				<span class="badge bg-primary">{question.index + 1}</span>
			{/if}
			<a type="button" class="btn btn-link" href={`/questions/${question.id}`}
				>{question.name || 'No Name'}</a
			>
			<h6 class="d-inline">- {titleCase(question.type.replace('_', ' '))}</h6>
		</h4>
	</div>
	<div class="d-flex justify-content-between align-items-start">
		<div class="d-inline">
			Last updated {updatedAt.toLocaleTimeString()}
			{updatedAt.toLocaleDateString()}
		</div>
	</div>
</div>
