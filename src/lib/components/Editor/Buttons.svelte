<script lang="ts">
	import BlockButton from './BlockButton.svelte';
	import MarkButton from './MarkButton.svelte';
	import ImageButton from './ImageButton.svelte';
	import CodeButton from './CodeButton.svelte';
	import LatexButton from './LatexButton.svelte';
</script>

<MarkButton format="bold"><i class="bi bi-type-bold" /></MarkButton>
<MarkButton format="italic"><i class="bi bi-type-italic" /></MarkButton>
<MarkButton format="underline"><i class="bi bi-type-underline" /></MarkButton>
<MarkButton format="code"><i class="bi bi-code" /></MarkButton>
<BlockButton format="heading-one"><i class="bi bi-type-h1" /></BlockButton>
<BlockButton format="heading-two"><i class="bi bi-type-h2" /></BlockButton>
<BlockButton format="block-quote"><i class="bi bi-quote" /></BlockButton>
<BlockButton format="numbered-list"><i class="bi bi-list-ol" /></BlockButton>
<BlockButton format="bulleted-list"><i class="bi bi-list-ul" /></BlockButton>
<ImageButton />
<CodeButton />
<LatexButton />
