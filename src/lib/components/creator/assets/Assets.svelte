<script lang="ts">
	import AssetManager from './AssetManager.svelte';

	export let departmentId: string;
</script>

<div class="container">
	<AssetManager {departmentId} />
</div>
