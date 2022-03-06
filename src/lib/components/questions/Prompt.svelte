<script lang="ts">
	import type { Answer } from '$lib/types';
	import { isEmpty } from '$lib/utils';
	import type { QuestionType } from '@prisma/client';
	import type { Result } from '@prisma/client';

	export let type: QuestionType;
	export let input: Answer;
	export let result: Result = undefined;
	export let showExplanation = false;
	export let onExplain: () => Promise<Result>;
	export let onSubmit: (answer: Answer) => Promise<Result>;

	let answering = false;
	let explaining = false;
	$: onExplainInternal = async () => {
		explaining = true;
		try {
			result = await onExplain();
			showExplanation = true;
		} finally {
			explaining = false;
		}
	};
	$: onSubmitInternal = async () => {
		answering = true;
		try {
			result = await onSubmit(input);
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
					{#if !showExplanation && type !== 'MARK_AS_READ'}
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
					{#if type !== 'MARK_AS_READ'}
						<button
							type="button"
							class="btn btn-secondary text-white"
							disabled={explaining || answering}
							on:click={onExplainInternal}
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
						on:click={onSubmitInternal}
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
