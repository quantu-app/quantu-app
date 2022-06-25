<svelte:options immutable />

<script lang="ts" context="module">
	const DEFAULT_DATE = new Date();
	DEFAULT_DATE.setFullYear(DEFAULT_DATE.getFullYear() - MIN_AGE);
</script>

<script lang="ts">
	import { updateUser } from '$lib/state/user';
	import countries from '$lib/data/countries';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { User } from '@prisma/client';
	import classnames from 'vest/classnames';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { validate, MIN_AGE } from './userProfileSuite';
	import InputMessages from '../ui/InputMessages.svelte';
	import { onMount } from 'svelte';

	export let user: User;

	let username = user.username;
	let firstName = user.firstName || '';
	let lastName = user.lastName || '';
	let birthday = (user.birthday || DEFAULT_DATE).toISOString().substring(0, 10);
	let country = user.country || 'US';

	let date: Date;
	$: date = new Date(birthday);

	let result = validate({
		username,
		firstName,
		lastName,
		birthday: date,
		country
	});
	$: disabled = updating || !result.isValid();
	$: formClassName = classnames(result, {
		warning: 'warning',
		invalid: 'is-invalid',
		valid: 'is-valid'
	});
	$: messageClassName = classnames(result, {
		warning: 'warning-feedback',
		invalid: 'invalid-feedback',
		valid: 'valid-feedback'
	});

	function runValidation(fieldname?: string) {
		result = validate(
			{
				username,
				firstName,
				lastName,
				birthday: date,
				country
			},
			fieldname
		);
	}

	function onChange({ currentTarget: { name } }: Event & { currentTarget: { name?: string } }) {
		runValidation(name);
	}

	let updating = false;
	async function onConfirm() {
		updating = true;
		try {
			await updateUser({
				confirmed: true,
				username,
				firstName,
				lastName,
				birthday: date,
				country
			});
			await goto(`${base}/challenges`);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Confirming',
				description: (e as Error).message
			});
		} finally {
			updating = false;
		}
	}

	onMount(() => {});
</script>

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
				class="form-control {formClassName('username')}"
				id="username"
				name="username"
				placeholder="Username"
				bind:value={username}
				on:input={onChange}
			/>
			<InputMessages
				className={messageClassName('username')}
				messages={result.getErrors('username')}
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
					class="form-control {formClassName('firstName')}"
					id="first-name"
					name="firstName"
					placeholder="First name"
					bind:value={firstName}
					on:input={onChange}
				/>
				<InputMessages
					className={messageClassName('firstName')}
					messages={result.getErrors('firstName')}
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
					class="form-control {formClassName('lastName')}"
					id="last-name"
					name="lastName"
					placeholder="Last name"
					bind:value={lastName}
					on:input={onChange}
				/>
				<InputMessages
					className={messageClassName('lastName')}
					messages={result.getErrors('lastName')}
				/>
			</div>
		</div>
	</div>
	<div class="row my-4">
		<label for="birthday">Birthday</label>
		<p class="text-black-50 m-0">
			Your birthday is used to calculate your age and for olympiads, competitions, and awards across
			the platform
		</p>
		<div class="input-group has-validation">
			<input
				type="date"
				class="form-control {formClassName('birthday')}"
				id="birthday"
				name="birthday"
				placeholder="Birthday"
				bind:value={birthday}
				on:input={onChange}
			/>
			<InputMessages
				className={messageClassName('birthday')}
				messages={result.getErrors('birthday')}
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
			<button type="submit" {disabled} class="btn btn-primary" on:click={onConfirm}>Confirm</button>
		</div>
	</div>
</form>
