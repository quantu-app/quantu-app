<script lang="ts">
	import RichEditor from '$lib/components/RichEditor.svelte';
	import type { Topic } from '@prisma/client';

	export let topic: Partial<Topic>;
	export let disabled = false;
</script>

<div class="row">
	<div class="col-md">
		<label for="topic-name" class="form-label">Topic Name</label>
		<input
			id="topic-name"
			type="text"
			class="form-control"
			placeholder="Topic Name"
			{disabled}
			bind:value={topic.name}
		/>
	</div>
	<div class="col-md">
		<label for="topic-url" class="form-label">Topic URL</label>
		<input
			id="topic-url"
			type="text"
			class="form-control"
			placeholder="Topic URL"
			{disabled}
			bind:value={topic.url}
		/>
	</div>
</div>
<hr />
<div class="row">
	<div class="col-md">
		<label for="topic-description" class="form-label">Description</label>
		<RichEditor id="topic-description" bind:content={topic.description} />
	</div>
</div>
