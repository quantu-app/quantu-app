<svelte:options immutable />

<script lang="ts">
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Answer } from '$lib/types';
	import { isEmpty } from '$lib/utils';
	import type { QuestionType } from '@prisma/client';
	import type { Result } from '@prisma/client';

	export let type: QuestionType;
	export let input: Answer | undefined = undefined;
	export let result: Result | undefined = undefined;
	export let showExplanation = false;
	export let onExplain: () => Promise<Result>;
	export let onSubmit: (answer: Answer) => Promise<Result>;
	export let disabled = false;

	let answering = false;
	let explaining = false;
	$: onExplainInternal = async () => {
		explaining = true;
		try {
			result = await onExplain();
			showExplanation = true;
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error getting Explaination',
				description: (e as Error).message
			});
		} finally {
			explaining = false;
		}
	};
	$: onSubmitInternal = async () => {
		answering = true;
		try {
			result = await onSubmit(input);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Submitting',
				description: (e as Error).message
			});
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

			<div class="row justify-content-between mt-4">
				{#if !disabled && !showExplanation && type !== 'MARK_AS_READ'}
					<div class="col">
						<a
							type="button"
							class="link-dark"
							disabled={disabled || explaining || answering}
							on:click={onExplainInternal}
						>
							{#if explaining}
								<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
							{/if}
							Show Explanation
						</a>
					</div>
				{/if}
				<div class="col text-end">
					{#if !disabled && result != null}
						<slot name="extra" />
					{:else if !disabled}
						<button
							type="button"
							class="btn btn-primary mt-2 me-4"
							disabled={disabled || isEmpty(input) || !!result || answering || explaining}
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
			<div>
				<slot name="explanation" />
			</div>
		</div>
	</div>
</div>
