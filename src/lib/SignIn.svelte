<script lang="ts">
	import Quote from './Quote.svelte';
</script>

<div>
	<Quote author="Victor Hugo">He who opens a school door, closes a prison.</Quote>
</div>

<div class="row p-4">
	<div class="col-md-8">
		<img
			src="https://github.com/quantu-app/design-platform/raw/master/app/resources/sign_up_and_login/1x/Door-Opening.png"
			alt="Opening a Door"
		/>
	</div>
	<div class="col-md-4">
		<slot />
	</div>
</div>
