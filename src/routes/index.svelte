<script lang="ts">
	import AppLayout from '$lib/AppLayout.svelte';
	import { currentUser } from '$lib/state/user';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<AppLayout>
	<div class="d-flex justify-content-center align-items-center h-100">
		<div class="d-flex flex-column align-items-center">
			<h1>Quant[U]</h1>

			{#if $currentUser}
				<div class="d-flex">
					<a role="button" class="btn btn-primary me-1" href="/quizzes">Quizzes</a>
					<a role="button" class="btn btn-primary ms-1" href="/questions">Questions</a>
				</div>
			{:else}
				<div class="d-flex">
					<button
						type="button"
						data-bs-toggle="modal"
						data-bs-target="#sign-in-up-modal"
						class="btn btn-primary"
					>
						Sign in/up
					</button>
				</div>
			{/if}
		</div>
	</div>
</AppLayout>
