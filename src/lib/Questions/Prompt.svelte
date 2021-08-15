<script lang="ts">
	import type { Question, QuestionAnswer } from '$lib/api/quantu-app-api';
	import { answerQuestion } from '$lib/state/questions';

	export let question: Question;
	export let getInput: () => QuestionAnswer['input'];
	export let ready = false;

	let answering = false;
	let answerResult: number;

	function onSubmit() {
		answering = true;
		answerQuestion(question.id, getInput())
			.then(({ result }) => {
				answerResult = result;
			})
			.finally(() => {
				answering = false;
			});
	}
</script>

<div class="row h-100">
	<div class="col-md-8">
		<div class="d-flex flex-column justify-content-center h-100">
			<slot name="content" />
		</div>
	</div>
	<div class="col-md-4">
		<div class="d-flex flex-column justify-content-center h-100">
			<slot name="input" />

			<div class="d-flex justify-content-end">
				{#if answerResult === 1}
					<h3 class="m-0 me-auto">
						<span class="badge bg-success"><i class="bi bi-check" /></span>
					</h3>
				{:else if answerResult > 0 && answerResult < 1}
					<h3 class="m-0 me-auto">
						<span class="badge bg-warning"><i class="bi bi-check" /></span>
					</h3>
				{:else if answerResult != null}
					<h3 class="m-0 me-auto"><span class="badge bg-danger"><i class="bi bi-x" /></span></h3>
				{/if}
				<button
					type="button"
					class="btn btn-primary"
					disabled={!ready || answering || answerResult != null}
					on:click={onSubmit}
				>
					{#if answering}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Submit
				</button>
			</div>
		</div>
	</div>
</div>
