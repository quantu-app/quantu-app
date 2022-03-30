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

<div class="row ps-0 prompt">
	<div class="col-lg-12">
		<div class="d-flex flex-column flex-grow-1 pt-4">
			<slot name="content" />
		</div>
	</div>
	<div class="my-4">
		<div class="d-flex flex-column flex-grow-1">
			<slot name="input" />

			<div class="d-flex mt-3">
				{#if result != null}
					{#if !showExplanation && type !== 'MARK_AS_READ'}
						<button
							type="button"
							class="btn btn-secondary text-white"
							disabled={showExplanation}
							on:click={() => (showExplanation = true)}
						>
							Show Explanation
						</button>
					{/if}
					<slot name="extra" />
				{:else}
					<button
						type="button"
						class="btn btn-primary mt-2 me-4"
						disabled={isEmpty(input) || !!result || answering || explaining}
						on:click={onSubmitInternal}
					>
						{#if answering}
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
						{/if}
						Submit
					</button>
					{#if type !== 'MARK_AS_READ'}
						<button
							type="button"
							class="btn btn-outline-primary mt-2"
							disabled={explaining || answering}
							on:click={onExplainInternal}
						>
							{#if explaining}
								<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
							{/if}
							Show Explanation
						</button>
					{/if}
				{/if}
			</div>
			<div>
				<slot name="explanation" />
			</div>
		</div>
	</div>
</div>
