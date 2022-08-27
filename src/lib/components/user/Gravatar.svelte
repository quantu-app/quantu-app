<script lang="ts">
	import { MD5 } from 'md5-js-tools';

	const gravatarBaseUrl = 'https://www.gravatar.com/avatar/';

	export let email: string;
	export let rating: string = 'pg';
	export let fallbackImage: string = 'mp';
	export let size: number = 80;
	export let alt: string = 'Gravatar';

	let hash = MD5.generate(email);
</script>

<img
	class="rounded-circle"
	src={`${gravatarBaseUrl}${hash}?s=${size}&r=${rating}&d=${fallbackImage}`}
	{alt}
/>
