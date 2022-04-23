<script lang="ts">
	import type { Comment } from '@prisma/client';
	import RichEditor from '../editor/RichEditor.svelte';

	export let comment: Partial<Comment> = {};
</script>

<RichEditor bind:value={comment.content} />
