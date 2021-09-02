<script lang="ts">
	import type { Question, QuestionAnswer, QuestionResult } from '$lib/api/quantu-app-api';
	import { answerQuestion, explainQuestion } from '$lib/state/questionResults';
	import { isEmpty } from '$lib/utils';

	export let question: Question;
	export let input: QuestionAnswer['input'];
	export let result: QuestionResult = undefined;

	let answering = false;
	let explaining = false;
	$: onExplain = async () => {
		explaining = true;
		try {
			result = await explainQuestion(question.id, question.quizId);
		} finally {
			explaining = false;
		}
	};
	$: onSubmit = async () => {
		answering = true;
		try {
			result = await answerQuestion(question.id, input, question.quizId);
		} finally {
			answering = false;
		}
	};
</script>

<div class="row h-100">
	<div class="col-md-8">
		<div class="d-flex flex-column h-100 pt-4">
			<slot name="content" />
		</div>
	</div>
	<div class="col-md-4">
		<div class="d-flex flex-column border-lg-start pt-4 h-100 input">
			<slot name="input" />

			<div class="d-flex justify-content-end mt-2">
				{#if result?.result === 1}
					<h3 class="m-0 me-auto">
						<span class="badge bg-success"><i class="bi bi-check" /></span>
					</h3>
				{:else if result?.result > 0 && result?.result < 1}
					<h3 class="m-0 me-auto">
						<span class="badge bg-warning"><i class="bi bi-check" /></span>
					</h3>
				{:else if result?.result === 0}
					<h3 class="m-0 me-auto"><span class="badge bg-danger"><i class="bi bi-x" /></span></h3>
				{/if}
				{#if result != null}
					<slot name="extra" />
				{:else}
					<button
						type="button"
						class="btn btn-secondary"
						disabled={explaining || answering}
						on:click={onExplain}
					>
						{#if explaining}
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
						{/if}
						Explain
					</button>
					<button
						type="button"
						class="btn btn-primary"
						disabled={isEmpty(input) || !!result || answering || explaining}
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

<style lang="scss">
	// find a way to use bootstrap variables and mixins in components
	@media (min-width: 768px) {
		.input {
			border-left: 1px solid #dee2e6;
		}
	}
</style>
