<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';

	export let localId: string;
	export let organization: Organization;
	export let onDelete: () => void;

	$: updatedAt = new Date(organization.updatedAt || '');

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			<a aria-label="Edit" href={`/user/organizations/${localId}`}>{organization.name}</a>
		</h4>
		<div class="dropdown">
			<button
				id={`dropdown-${localId}`}
				class="btn btn-ghost dropdown-toggle"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				<i class="bi bi-three-dots-vertical" />
			</button>
			<ul class="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${localId}`}>
				<li>
					<a class="dropdown-item justify-content-between" href={`/user/organizations/${localId}`}
						>Edit</a
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-organization"
						aria-label="Delete"
						on:click={onDelete}>Delete</button
					>
				</li>
			</ul>
		</div>
	</div>
	<div class="d-flex justify-content-between align-items-start">
		<div class="d-inline">
			Last updated {updatedAt.toLocaleTimeString()}
			{updatedAt.toLocaleDateString()}
		</div>
		{#if innerWidth >= 768}
			<div class="flex-grow-1" />
			<div class="d-inline" style="margin-right:60px;">
				<p class="mb-0">
					{organization.url} words
				</p>
			</div>
		{/if}
	</div>
</div>
