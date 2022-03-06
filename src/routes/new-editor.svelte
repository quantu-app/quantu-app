<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import Editor from '$lib/new-editor/Editor.svelte';

	let value = [
		{
			type: 'paragraph',
			children: [{ text: '' }]
		}
	];
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<AppLayout>
	<div class="container">
		<Editor bind:value />
	</div>
</AppLayout>
