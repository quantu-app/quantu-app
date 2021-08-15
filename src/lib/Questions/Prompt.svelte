<script lang="ts">
	import type { Question, QuestionAnswer } from '$lib/api/quantu-app-api';
	import { answerQuestion } from '$lib/state/questions';
	import { isEmpty } from '$lib/utils';

	export let question: Question;
	export let input: QuestionAnswer['input'];
	export let answered = false;
	export let result: number;

	let answering = false;

	$: onSubmit = () => {
		answering = true;
		answerQuestion(question.id, input)
			.then((response) => {
				result = response.result;
				answered = true;
			})
			.finally(() => {
				answering = false;
			});
	};
</script>

<div class="row h-100">
	<div class="col-md-8">
		<div class="d-flex flex-column h-100 pt-4">
			<slot name="content" />
		</div>
	</div>
	<div class="col-md-4">
		<div class="d-flex flex-column border-start pt-4 h-100">
			<slot name="input" />

			<div class="d-flex justify-content-end">
				{#if result === 1}
					<h3 class="m-0 me-auto">
						<span class="badge bg-success"><i class="bi bi-check" /></span>
					</h3>
				{:else if result > 0 && result < 1}
					<h3 class="m-0 me-auto">
						<span class="badge bg-warning"><i class="bi bi-check" /></span>
					</h3>
				{:else if result != null}
					<h3 class="m-0 me-auto"><span class="badge bg-danger"><i class="bi bi-x" /></span></h3>
				{/if}
				{#if answered}
					<slot name="extra" />
				{:else}
					<button
						type="button"
						class="btn btn-primary"
						disabled={isEmpty(input) || answered || answering}
						on:click={onSubmit}
					>
						{#if answering}
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
						{/if}
						Submit
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
