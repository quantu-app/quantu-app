<script lang="ts">
	import { base } from '$app/paths';
	import { currentUser } from '$lib/state/user';
	import type { User } from '@prisma/client';

	export let user: User;
</script>

<div class="container">
	{#if user.id === $currentUser?.id}
		<div class="row">
			<a href={`${base}/user/profile/edit`}>Edit Profile</a>
		</div>
	{/if}
	<h1>@{user.username}</h1>
</div>
