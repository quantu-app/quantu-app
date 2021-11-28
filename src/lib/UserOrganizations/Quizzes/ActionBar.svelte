<script lang="ts">
	import { goto } from '$app/navigation';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { createQuiz } from '$lib/state/organizationQuizzes';

	export let organizationId: number;
	export let unitId: number = undefined;

	let quizCreating = false;
	let newQuizName = '';

	async function onCreateQuiz() {
		quizCreating = true;
		try {
			const quiz = await createQuiz(organizationId, { name: newQuizName, unitId });
			goto(`/user/organizations/${organizationId}/quizzes/${quiz.id}`);
		} catch (error) {
			quizCreating = false;
			Object.entries(error.body.errors).map(([name, message]: [string, string[]]) => {
				addNotification({
					type: NotificationType.Danger,
					heading: name,
					description: message.join(', ')
				});
			});
		}
	}
</script>

<form on:submit|preventDefault class="mt-2">
	<div class="input-group">
		<input type="text" class="form-control" placeholder="New Quiz name" bind:value={newQuizName} />
		<button
			type="submit"
			disabled={quizCreating || !newQuizName.trim()}
			class="btn btn-primary"
			aria-label="Create Quiz"
			on:click={onCreateQuiz}
		>
			{#if quizCreating}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
			{/if}
			Create
		</button>
	</div>
</form>
