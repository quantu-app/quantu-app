<script lang="ts">
	import { page } from '$app/stores';

	export let editing: boolean;
	export let isOwner: boolean;
	export let shareLink: string;
	export let onUpdate: () => void;
	export let onDelete: (solution: any) => void;

	let updating = false;

	function toggleEdit() {
		editing = !editing;
	}

	async function internalUpdate() {
		updating = true;
		await onUpdate();
		updating = false;
	}

	let hostName = $page.url.origin;

	function copyShareLinkToClipboard(event: any) {
		navigator.clipboard.writeText(`${hostName}${shareLink}`);
		return false;
	}
</script>

<div>
	<a href={shareLink} class="btn fs-6 btn-light">
		<i class="bi bi-chat-left" />
		<span>Reply</span>
	</a>
	<a href="#" class="btn fs-6 btn-light" on:click|preventDefault={copyShareLinkToClipboard}>
		<i class="bi bi-share" />
		<span>Share</span>
	</a>
	{#if isOwner}
		{#if !editing}
			<button class="btn fs-6 btn-light" on:click={toggleEdit}>
				<i class="bi bi-pencil" />
				<span>Edit</span>
			</button>
			<button class="btn fs-6 btn-light" on:click={onDelete}>
				<i class="bi bi-trash" />
				<span>Delete</span>
			</button>
		{:else}
			<button class="btn fs-6 btn-light" on:click={onUpdate} disabled={updating}>
				<i class="bi bi-arrow-repeat" />
				<span>Update</span>
			</button>
			<button class="btn fs-6 btn-light" on:click={toggleEdit} disabled={updating}>
				<i class="bi bi-x" />
				<span>Cancel</span>
			</button>
		{/if}
	{/if}
</div>
