<svelte:options immutable />

<script lang="ts">
	import countries from '$lib/data/countries';
	import { base } from '$app/paths';
	import { currentUser, getPrimaryEmail, type StateUser } from '$lib/state/user';
	import type { User } from '@prisma/client';
	import RichViewer from '../editor/RichViewer.svelte';
	import { formatRelative } from 'date-fns';
	import Gravatar from './Gravatar.svelte';

	export let user: StateUser;

	let userCountry: string = user.country || '';
	let userCountryName: string = countries.find((c) => c.code == userCountry).name || '';
	let memberSince = formatRelative(new Date(user.createdAt), new Date());
</script>

<div class="container-xxl mt-4">
	<div class="row my-4">
		<div class="col-1 pe-0">
			<Gravatar email={getPrimaryEmail(user)} />
		</div>
		<div class="col-11">
			<div class="qu-user--info me-4">
				<h2 class="mb-0">
					<span class="fw-bold">{user.firstName} {user.lastName}</span>
					<span class="small text-muted">(@{user.username})</span>
					<img
						class="img-thumbnail my-2"
						width="50"
						src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/png100px/${(
							userCountry || ''
						).toLowerCase()}.png`}
						alt={(userCountryName || 'No country') + ' Flag'}
					/>
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
