<script lang="ts">
	import countries from '$lib/data/countries';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { User } from '@prisma/client';
	import { updateUser } from '$lib/state/user';

	export let user: User;

	let username = user.username;
	let firstName = user.firstName;
	let lastName = user.lastName;
	let birthday = user.birthday;
	let country = user.country || 'US';
	let updating = false;

	let date: Date;
	let eighteenYearsAgo = new Date();
	eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
	$: date = new Date(birthday || '');

	async function onUpdate() {
		updating = true;
		try {
			updateUser({
				username,
				firstName,
				lastName,
				birthday,
				country
			});
			await goto(`${base}/challenges`);
		} finally {
			updating = false;
		}
	}
</script>

<div class="container">
	<form on:submit|preventDefault class="my-4">
		<div class="row">
			<h1>Profile Information</h1>
			<hr />
		</div>
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

		<div class="row">
			<h1>Personal Information</h1>
			<hr />
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
				<button
					type="submit"
					disabled={Number.isNaN(date.getDate()) ||
						date.getTime() >= eighteenYearsAgo.getTime() ||
						updating}
					class="btn btn-primary"
					on:click={onUpdate}>Update</button
				>
			</div>
		</div>
	</form>
</div>
