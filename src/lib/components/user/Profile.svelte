<script lang="ts">
	import countries from '$lib/data/countries';
	import { base } from '$app/paths';
	import { currentUser } from '$lib/state/user';
	import type { User } from '@prisma/client';
	import RichViewer from '../Editor/RichViewer.svelte';
	import { formatRelative, subDays } from 'date-fns';

	export let user: User;

	let userCountry: string = user.country || '';
	let userCountryName: string = countries.find((c) => c.code == userCountry).name || '';
</script>

<div class="container-xxl mt-4">
	<div class="row">
		<div class="col-2 my-4">
			{#if user.id === $currentUser?.id}
				<div class="row">
					<a href={`${base}/user/profile/edit`}>Edit Profile</a>
				</div>
			{/if}
		</div>
		<div class="col-10 my-4">
			<div class="qu-user--info me-4">
				<h2 class="qu-user--fullname mb-0">{user.firstName} {user.lastName}</h2>
				<h3 class="qu-user--username mb-0">@{user.username}</h3>
			</div>
			<img
				class="img-thumbnail my-2"
				width="80"
				src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/png100px/${(
					userCountry || ''
				).toLowerCase()}.png`}
				alt={(userCountryName || 'No country') + ' Flag'}
			/>
			<p>Member since: {formatRelative(new Date(user.createdAt), new Date())}</p>
			<br />

			<h2>About</h2>
			<hr />
			{#if user.bio && user.bio.length > 0}
				<RichViewer id="qu-user--bio" value={user.bio} />
			{:else}
				<p>{user.firstName} {user.lastName} hasn't written their biography yet.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.qu-user--username {
		color: #707070;
	}
</style>
