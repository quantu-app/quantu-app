<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import { changesById } from '$lib/state/creator/changes';
	import type { StateMergeRequest } from '$lib/state/creator/mergeRequests';

	export let mergeRequest: StateMergeRequest;

	$: change = $changesById[mergeRequest.changeId];
</script>

<div class="col-6 col-md-3 mt-4">
	<div class="card">
		<div class="card-body">
			<h4 class="card-title">
				<a class="link-dark" href={`${base}/creator/merge-requests/${mergeRequest.id}`}
					>{change.name}</a
				>
			</h4>
			<div class="card-text">
				<a href={`${base}/user/profile/${mergeRequest.user.username}`}
					>{mergeRequest.user.username}</a
				>
			</div>
			<p class="m-0">{mergeRequest.updatedAt.toLocaleString()}</p>
		</div>
	</div>
</div>
