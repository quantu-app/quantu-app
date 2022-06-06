<svelte:options immutable />

<script lang="ts" context="module">
	import type { ApplicationSettings } from '@prisma/client';

	function fromUserSettings(settings: Partial<ApplicationSettings>) {
		const data: Partial<ISettingsState> = {};
		data.lang = settings.lang || 'en';
		return data;
	}
</script>

<script lang="ts">
	import classnames from 'vest/classnames';
	import languages from '$lib/data/languages';
	import { currentUser, updateSettings } from '$lib/state/user';
	import { settingsSuite, type ISettingsState } from './settingsSuite';
	import InputMessages from '../ui/InputMessages.svelte';
	import { addNotification, NotificationType } from '$lib/state/notifications';

	let data = fromUserSettings($currentUser.settings || {});
	let result = settingsSuite(data);
	$: disabled = submitting || !result.isValid();
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

	function onChange(event: Event & { currentTarget: HTMLSelectElement | HTMLInputElement }) {
		result = settingsSuite(data, event.currentTarget.name as keyof ISettingsState);
	}

	let submitting = false;
	async function onSubmit() {
		submitting = true;
		try {
			await updateSettings(data);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: "Error updating User's Settings",
				description: (e as Error).message
			});
		} finally {
			submitting = false;
		}
	}
</script>

<div class="container">
	<div class="row">
		<h1>Application Settings</h1>
		<hr />
	</div>

	<form on:submit|preventDefault={onSubmit} class="my-4">
		<div class="row my-4">
			<div class="col-12">
				<label for="display-languange">Display Language</label>
				<p class="text-black-50 mt-2 mb-2">
					This will set the desired display language for the application. <small
						>*Please note our translations are community driven and currently we only support
						English. However, choosing a desired language will help us focus on adding and updating
						interface languages in the future.</small
					>
				</p>
				<div class="input-group has-validation">
					<select
						id="display-languange"
						class="form-select {formClassName('lang')}"
						bind:value={data.lang}
						on:input={onChange}
					>
						{#each languages as language}
							<option value={language.code}>{language.nativeName} | {language.name}</option>
						{/each}
					</select>
					<InputMessages className={messageClassName('lang')} messages={result.getErrors('lang')} />
				</div>
			</div>
		</div>
		<div class="row my-4">
			<div class="d-inline-block text-end">
				<input type="submit" class="btn btn-primary" {disabled} value="Update" />
			</div>
		</div>
	</form>
</div>

<style>
	label {
		font-weight: bold;
		font-size: 18px;
	}
</style>
