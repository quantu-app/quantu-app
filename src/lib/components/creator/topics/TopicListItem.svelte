<script lang="ts">
	import { base } from '$app/paths';
	import type { Topic } from '@prisma/client';

	export let path: string;
	export let topic: Topic;
	export let onUpdate: () => void;
	export let onDelete: () => void;
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			<a
				href={`${base}/creator/topics/${path ? `${path}/${topic.url}` : topic.url}`}
				type="button"
				class="btn btn-link"
				on:click={onUpdate}>{topic.name} - {topic.url}</a
			>
		</h4>
		<div class="d-flex">
			<div class="dropdown">
				<button
					id={`topic-dropdown-${topic.id}`}
					class="btn btn-ghost dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<i class="bi bi-three-dots-vertical" />
				</button>
				<ul class="dropdown-menu dropdown-menu-end" aria-labelledby={`topic-dropdown-${topic.id}`}>
					<slot name="dropdown" {topic} {onUpdate} {onDelete}>
						<li>
							<button
								type="button"
								class="dropdown-item justify-content-between"
								data-bs-toggle="modal"
								data-bs-target="#update-topic"
								aria-label="Update"
								on:click={onUpdate}>Update</button
							>
						</li>
						<li>
							<button
								type="button"
								class="dropdown-item justify-content-between"
								data-bs-toggle="modal"
								data-bs-target="#delete-topic"
								aria-label="Delete"
								on:click={onDelete}>Delete</button
							>
						</li>
					</slot>
				</ul>
			</div>
		</div>
	</div>
</div>
