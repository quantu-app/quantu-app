<script lang="ts">
	import type { Question, QuestionAnswer, QuestionResult } from '$lib/api/quantu-app-api';
	import { answerQuestion, explainQuestion } from '$lib/state/questionResults';
	import { isEmpty } from '$lib/utils';

	export let question: Question;
	export let input: QuestionAnswer['input'];
	export let result: QuestionResult = undefined;
	export let showExplanation = false;

	let answering = false;
	let explaining = false;
	$: onExplain = async () => {
		explaining = true;
		try {
			result = await explainQuestion(question.id, question.quizId);
			showExplanation = true;
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

<div class="row flex-grow-1">
	<div class="col-lg-8">
		<div class="d-flex flex-column flex-grow-1 pt-4">
			<slot name="content" />
		</div>
	</div>
	<div class="col-lg-4 border-xxl-start input">
		<div class="d-flex flex-column pt-4 flex-grow-1">
			<slot name="input" />

			<div class="d-flex justify-content-end mt-2">
				{#if result != null}
					{#if !showExplanation && question.type !== 'mark_as_read'}
						<button
							type="button"
							class="btn btn-secondary text-white"
							disabled={showExplanation}
							on:click={() => (showExplanation = true)}
						>
							Explain
						</button>
					{/if}
					<slot name="extra" />
				{:else}
					{#if question.type !== 'mark_as_read'}
						<button
							type="button"
							class="btn btn-secondary text-white"
							disabled={explaining || answering}
							on:click={onExplain}
						>
							{#if explaining}
								<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
							{/if}
							Explain
						</button>
					{/if}
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
	@media (min-width: 960px) {
		.input {
			border-left: 1px solid #dee2e6;
		}
	}
</style>
