<svelte:options immutable />

<script lang="ts">
	import type { User } from '@prisma/client';
	import EditProfile from './EditProfile.svelte';

	export let user: User;
</script>

<div class="row mt-4">
	<h1>Welcome to our community</h1>
	<p>
		We ask the users on our platform to use their real data because we think honesty and
		transparency fosters more thoughtfulness, kindness, and a better community spirit.
	</p>
	<p>Please confirm or adjust the following information to finish activating your profile.</p>
</div>

<EditProfile {user} />
