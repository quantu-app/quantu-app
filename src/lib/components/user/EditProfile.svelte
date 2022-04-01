<script lang="ts">
	import countries from '$lib/data/countries';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { User } from '@prisma/client';
	import { updateUser } from '$lib/state/user';
	import { validate } from './userProfileSuite';
	import { format, subYears, parseISO } from 'date-fns';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';

	export let user: User;

	let updating = false;

	let maxDateOfBirth: string = format(subYears(new Date(), 16), 'yyyy-MM-dd');

	let formState = {
		username: user.username,
		firstName: user.firstName,
		lastName: user.lastName,
		birthday: user.birthday ? format(user.birthday, 'yyyy-MM-dd') : null,
		country: user.country || 'US',
		bio: user.bio
	};

	let result = validate.get();
	let errors: Record<string, string[]> = { username: [], birthday: [] };
	let warnings = {};

	const runValidation = (fieldname?: string) => {
		result = validate(formState, fieldname);
		errors = result.getErrors();
		warnings = result.getWarnings();
	};

	async function onUpdate() {
		result = runValidation();
		if (result.hasErrors()) {
			return;
		}

		updating = true;

		try {
			let { birthday, ...rest } = formState;
			let updateData: Record<string, any> = rest;
			if (birthday) {
				updateData.birthday = parseISO(birthday);
			}

			const user = await updateUser(updateData);
			await goto(`${base}/user/profile/${user.username}`);
		} finally {
			updating = false;
		}
	}

	const formatErrorMessage = (errors: Array<string>) => errors.join(', ');

	$: usernameError = errors.username && errors.username.length > 0;
	$: birthdayError = errors.birthday && errors.birthday.length > 0;
	$: disabled = result.hasErrors();
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
			<div class="input-group has-validation">
				<span class="input-group-text">@</span>
				<input
					type="text"
					class="form-control"
					class:is-invalid={usernameError}
					id="username"
					placeholder="Username"
					on:input={() => runValidation('username')}
					bind:value={formState.username}
				/>
				{#if usernameError}
					<div class="invalid-feedback">
						<p>
							{formatErrorMessage(errors.username)}
						</p>
					</div>
				{/if}
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
						bind:value={formState.firstName}
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
						bind:value={formState.lastName}
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
			<div class="input-group has-validation">
				<input
					type="date"
					class="form-control"
					class:is-invalid={birthdayError}
					id="birthday"
					placeholder="Birthday"
					on:blur={() => runValidation('birthday')}
					bind:value={formState.birthday}
					max={maxDateOfBirth}
				/>
				{#if birthdayError}
					<div class="invalid-feedback">
						<p>
							{formatErrorMessage(errors.birthday)}
						</p>
					</div>
				{/if}
			</div>
		</div>
		<div class="col-md-6">
			<label for="qu-user--biography" class="form-label">Biography</label>
			<p class="text-black-50 m-0">This is where you can tell us about yourself.</p>
			<RichEditor id="qu-user--biography" bind:value={formState.bio} />
		</div>
		<div class="row my-4">
			<div class="col-md-6">
				<label for="country">Country</label>
				<p class="text-black-50 m-0">
					This is the country you are currently living in or feel you belong to. It is shown in
					leaderboards and can be used for participating in country wide competitions.
				</p>
				<div class="input-group">
					<select id="country" class="form-select" bind:value={formState.country}>
						{#each countries as country}
							<option value={country.code}>{country.name}</option>
						{/each}
					</select>
					<span class="input-group-text"
						><img
							style="max-height: 38px"
							src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/png100px/${(
								formState.country || 'us'
							).toLowerCase()}.png`}
							alt={formState.country}
						/></span
					>
				</div>
			</div>
		</div>
		<div class="row my-4">
			<div class="d-inline-block text-end">
				<button type="submit" {disabled} class="btn btn-primary" on:click={onUpdate}>Update</button>
			</div>
		</div>
	</form>
</div>
