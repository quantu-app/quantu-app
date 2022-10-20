<script lang="ts">
	import PublicLayout from '$lib/components/layouts/PublicLayout.svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		Cookies.set('token', data.token, {
			path: '/',
			expires: 30
		});
	});
</script>

<svelte:head>
	<title>OAuth Callback</title>
</svelte:head>

<PublicLayout>
	<div class="container">
		<p>This window will close automatically.</p>
	</div>
</PublicLayout>
