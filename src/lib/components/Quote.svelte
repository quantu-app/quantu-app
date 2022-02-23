<script lang="ts">
	export let author: string;
</script>

<div class="d-inline-block clearfix">
	<h3 class="d-inline-block fw-bold p-0 m-0 quote-quote"><slot /></h3>
	<br />
	<p class="d-inline-block p-0 m-0 text-black-50 fst-italic float-end quote-author">- {author}</p>
</div>
