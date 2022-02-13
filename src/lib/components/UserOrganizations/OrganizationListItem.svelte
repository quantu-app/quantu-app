<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';

	export let organization: Organization;
	export let onDelete: () => void;

	$: updatedAt = new Date(organization.updatedAt || '');

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<div class="d-flex flex-column align-items-start">
			<h4>
				<a aria-label="Edit" href={`/user/organizations/${organization.id}`}>{organization.name}</a>
			</h4>
			<div>
				{#each organization.tags as tag}
					<span class="badge bg-primary me-2">{tag}</span>
				{/each}
			</div>
		</div>
		<div class="d-flex flex-column align-items-end">
			<div class="dropdown">
				<button
					id={`organization-dropdown-${organization.id}`}
					class="btn btn-ghost dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<i class="bi bi-three-dots-vertical" />
				</button>
				<ul
					class="dropdown-menu dropdown-menu-end"
					aria-labelledby={`organization-dropdown-${organization.id}`}
				>
					<li>
						<a
							class="dropdown-item justify-content-between"
							href={`/user/organizations/${organization.id}`}>Edit</a
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
			<div class="d-inline mt-2">
				Last updated {updatedAt.toLocaleTimeString()}
				{updatedAt.toLocaleDateString()}
			</div>
		</div>
	</div>
</div>
