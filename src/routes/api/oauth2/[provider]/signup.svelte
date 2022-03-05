<script context="module" lang="ts">
	import { providers } from '$lib/oauth2';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const provider = providers[input.params.provider];
		return {
			headers: {
				Location: await provider.signin(input.url, { isCreate: true })
			},
			status: 302
		};
	}
</script>
