<script lang="ts">
	import InputAnswerEditor from '$lib/UserOrganizations/Questions/InputAnswerEditor.svelte';

	export let type: string;
	export let input: string;
	export let correct: boolean | undefined = undefined;
	export let disabled = false;
</script>

<InputAnswerEditor {type} bind:input {correct} {disabled} />
