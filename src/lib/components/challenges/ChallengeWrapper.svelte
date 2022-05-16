<script lang="ts">
	import type { StateChallenge } from '$lib/state/creator/challenges';

	export let challenge: StateChallenge;
</script>

<div id="challenge--container" class="container-fluid flex-grow-1">
	<div class="row min-vh-100">
		<div id="challenge--sidebar" class="col-auto px-sm-2 px-0">
			<div class="d-flex flex-column mt-3" id="challenge--sidebarContent">
				<ul class="list-group list-group-flush">
					<li class="list-group-item">
						{#if challenge && challenge.department}
							<a
								href="/challenges"
								class="nav-link align-middle px-0 py-0"
								alt={challenge.department.name}
							>
								<i class="fs-4 bi-building d-sm-none" />
								<span id="challenge--departmentHeading" class="d-none d-sm-block">Department</span>
								<span id="challenge--department" class="d-none d-sm-inline"
									>{challenge.department.name}</span
								>
							</a>
						{/if}
					</li>
					<slot name="sidebar" />
				</ul>
			</div>
		</div>
		<div id="challenge--mainContent" class="col">
			{#if challenge}
				<div id="challenge-content" data-challenge-id={challenge.id}>
					<div class="row mt-3 mx-2">
						<div class="col-lg-8 col-md-10 mb-8">
							<slot />
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style type="css">
	#challenge--sidebar {
		border-right: 1px solid #707070;
	}
	#challenge--mainContent {
		min-height: 500px;
	}
	#challenge--departmentHeading {
		color: black;
		font-weight: bold;
		font-size: 18px;
	}
	#challenge--department {
		font-weight: 500;
		color: #999999;
		font-size: 18px;
	}
</style>
