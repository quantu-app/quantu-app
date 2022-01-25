<script lang="ts">
	import type { UserPrivate } from '$lib/api/quantu-app-api';
	import { updateUser } from '$lib/state/user';
	import countries from '$lib/data/countries';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	export let user: UserPrivate;

	const isNowActive = user.active;
	let username = user.username;
	let firstName = user.firstName;
	let lastName = user.lastName;
	let birthday = user.birthday;
	let country = user.country;

	function onUpdate() {
		updateUser({
			active: true,
			username,
			firstName,
			lastName,
			birthday,
			country
		});
		if (isNowActive) {
			goto(`${base}/challenges`);
		}
	}
</script>

<div class="container">
	{#if user.active}
		<div class="row">
			<h1>Welcome to our community</h1>
			<p>
				We ask the users on our platform to use their real data because we think honesty and
				transparency fosters more thoughtfulness, kindness, and a better community spirit.
			</p>
			<p>Please confirm or adjust the following information to finish activating your profile.</p>
		</div>
	{/if}

	<form on:submit|preventDefault class="my-4">
		<div class="row my-4">
			<label for="username">Username</label>
			<p class="text-black-50 m-0">
				This is your main handle on the platform and how other users reference you
			</p>
			<div class="input-group">
				<span class="input-group-text">@</span>
				<input
					type="text"
					class="form-control"
					id="username"
					placeholder="Username"
					bind:value={username}
				/>
			</div>
		</div>
		<div class="row my-4">
			<div class="col-md-6">
				<label for="first-name">First name</label>
				<p class="text-black-50 m-0">
					This is your real first name, no other user on the system can see this.
				</p>
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						id="first-name"
						placeholder="First name"
						bind:value={firstName}
					/>
				</div>
			</div>
			<div class="col-md-6">
				<label for="last-name">Last name</label>
				<p class="text-black-50 m-0">
					This is your real last name, no other user on the system can see this.
				</p>
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						id="last-name"
						placeholder="Last name"
						bind:value={lastName}
					/>
				</div>
			</div>
		</div>
		<div class="row my-4">
			<label for="birthday">Birthday</label>
			<p class="text-black-50 m-0">
				Your birthday is used to calculate your age and for olympiads, competitions, and awards
				across the platform
			</p>
			<div class="input-group">
				<input
					type="date"
					class="form-control"
					id="birthday"
					placeholder="Birthday"
					bind:value={birthday}
				/>
			</div>
		</div>
		<div class="row my-4">
			<div class="col-md-6">
				<label for="country">Country</label>
				<p class="text-black-50 m-0">
					This is the country you are currently living in or feel you belong to. It is shown in
					leaderboards and can be used for participating in country wide competitions.
				</p>
				<div class="input-group">
					<select id="country" class="form-select" bind:value={country}>
						{#each countries as country}
							<option value={country.code}>{country.name}</option>
						{/each}
					</select>
					<span class="input-group-text"
						><img
							style="max-height: 38px"
							src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/png100px/${(
								country || 'us'
							).toLowerCase()}.png`}
							alt={country}
						/></span
					>
				</div>
			</div>
		</div>
		<div class="row my-4">
			<div class="d-inline-block text-end">
				<button type="submit" class="btn btn-primary" on:click={onUpdate}>Update</button>
			</div>
		</div>
	</form>
</div>
