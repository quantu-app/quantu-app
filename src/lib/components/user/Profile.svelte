<svelte:options immutable />

<script lang="ts">
	import countries from '$lib/data/countries';
	import { base } from '$app/paths';
	import { currentUser, type StateUser } from '$lib/state/user';
	import { formatRelative } from 'date-fns';
	import Gravatar from './Gravatar.svelte';

	export let user: StateUser;

	let userCountry: string = user.country || '';
	let userCountryName: string = countries.find((c) => c.code == userCountry)?.name || '';
	let memberSince = formatRelative(new Date(user.createdAt), new Date());

	// TODO: use our own country flags so it will still work if this repo goes down.
	const countryFlagURL =
		'https://raw.githubusercontent.com/hampusborgos/country-flags/main/png100px/';
	const userCountryFlag =
		userCountry.length > 0 ? `${countryFlagURL}/${userCountry.toLowerCase()}.png` : null;
</script>

<div class="container-xxl mt-4">
	<div class="row my-4">
		<div class="col-1 pe-0">
			<Gravatar hash={user.emailHash} />
		</div>
		<div class="col-11">
			<div class="qu-user--info me-4">
				<h2 class="mb-0">
					<span class="fw-bold">{user.firstName} {user.lastName}</span>
					<span class="small text-muted">(@{user.username})</span>
					{#if userCountryFlag}
						<img
							class="img-thumbnail my-2"
							width="50"
							src={userCountryFlag}
							alt={(userCountryName || 'No country') + ' Flag'}
						/>
					{/if}
				</h2>
				<p>
					<span>Joined: {memberSince}</span>
					{#if user.id === $currentUser?.id}<br />
						<a href={`${base}/user/profile/edit`}>Edit Profile</a>
					{/if}
				</p>
			</div>
		</div>
	</div>
</div>
