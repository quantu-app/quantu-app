<script lang="ts">
	export let correct: number;
	export let totalSolvers: number;

	let wrong = totalSolvers - correct;

	let t = correct / (totalSolvers + Number.EPSILON);
	let successRate = Math.round((t + Number.EPSILON) * 100) / 100;
	let successRatePercentage = `${successRate * 100}%`;
	let percentageComplete = 100 - successRate * 100;

	let solverCountText = totalSolvers == 1 ? `${totalSolvers} solver` : `${totalSolvers} solvers`;

	let btnClass = 'bi-chevron-right';
	let showingStats = false;

	function showStats() {
		if (showingStats) {
			btnClass = 'bi-chevron-right';
			showingStats = false;
		} else {
			btnClass = 'bi-chevron-down';
			showingStats = true;
		}
	}
</script>

<button type="button" class="btn btn-link link-dark" on:click={showStats}
	>Stats
	<i class="bi {btnClass}" />
</button>

{#if showingStats}
	<div class="card challengeStats">
		<div class="card-body text-center">
			<h1 class="percentageCorrect">{successRatePercentage}</h1>
			<svg class="circle-container" viewBox="2 -2 28 36" xmlns="http://www.w3.org/2000/svg">
				<circle class="circle-container__background" r="16" cx="16" cy="16" />
				<circle
					class="circle-container__progress"
					r="16"
					cx="16"
					cy="16"
					style="stroke-dashoffset: {percentageComplete}"
				/>
			</svg>
			<h2 class="successRate">Success Rate</h2>
			<h3 class="solversCount mt-4">{solverCountText}</h3>
			<p>
				<span class="solversCorrect">{correct} correct</span>
				<span class="solversWrong">{wrong} wrong</span>
			</p>
		</div>
	</div>
{/if}

<style>
	.card {
		width: 300px;
	}
	h1.percentageCorrect {
		font-family: 'Computer Modern';
		font-size: 85px;
		font-weight: bold;
		position: absolute;
		top: 100px;
		left: 70px;
		z-index: 1;
	}
	h2.successRate {
		font-family: 'Computer Modern';
		font-size: 44px;
		font-weight: bold;
	}
	h3.solversCount {
		font-size: 32px;
	}
	.solversCorrect {
		color: #4fff4b;
	}
	.solversWrong {
		color: #ff4e4f;
	}

	:root {
		--dot-diameter: 260px;
		--circle-border-width: 2px;
		--default-color: #ff4e4f;
		--completion-color: #4fff4b;
	}

	.circle-container {
		width: var(--dot-diameter);
		height: var(--dot-diameter);
		transform: rotate(-90deg);
	}

	.circle-container__background {
		fill: none;
		stroke: var(--default-color);
		stroke-width: var(--circle-border-width);
	}

	.circle-container__progress {
		fill: none;
		stroke: var(--completion-color);
		stroke-dasharray: 100 100;
		stroke-linecap: square;
		stroke-width: var(--circle-border-width);
	}
</style>
