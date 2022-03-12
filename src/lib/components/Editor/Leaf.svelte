<svelte:options immutable={true} />

<script lang="ts" context="module">
	export interface IText extends Text {
		bold?: boolean;
		italic?: boolean;
		code?: boolean;
		underline?: boolean;
		[key: string]: any;
	}
</script>

<script lang="ts">
	import type { Text } from 'slate';

	export let leaf: IText;
</script>

<span
	data-slate-leaf="true"
	class:bold={leaf.bold}
	class:italic={leaf.italic}
	class:code={leaf.code}
	class:underline={leaf.underline}
	class:comment={leaf.comment}
	class:url={leaf.operator || leaf.url}
	class:keyword={leaf.keyword}
	class:variable={leaf.variable | leaf.regex}
	class:primitive={leaf.number ||
		leaf.boolean ||
		leaf.tag ||
		leaf.constant ||
		leaf.symbol ||
		leaf['attr-name'] ||
		leaf.selector}
	class:punctuation={leaf.punctuation}
	class:string={leaf.string | leaf.char}
	class:function={leaf.function | leaf['class-name']}
>
	<slot /></span
>

<style>
	.bold {
		font-weight: bold;
	}
	.italic {
		font-style: italic;
	}
	.code {
		font-family: monospace;
		background-color: #eee;
		padding: 3px;
	}
	.underline {
		text-decoration: underline;
	}
	.comment {
		color: slategray;
	}
	.url {
		color: #9a6e3a;
	}
	.keyword {
		color: #07a;
	}
	.variable {
		color: #e90;
	}
	.primitive {
		color: #905;
	}
	.punctuation {
		color: #999;
	}
	.string {
		color: #690;
	}
	.function {
		color: #dd4a68;
	}
</style>
