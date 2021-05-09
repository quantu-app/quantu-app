<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page: { params } }) {
		return {
			props: {
				bookId: params.bookId
			}
		};
	}
</script>

<script lang="ts">
	import { bookFromJSON, booksStore, bookToJSON } from '$lib/state/books';
	import Book from '$lib/Book.svelte';
	import type { IMessage, Room } from '@aicacia/peer';
	import { onDestroy, onMount } from 'svelte';
	import { getAppId, getPeer, peer } from '$lib/state/peer';
	import { blockFromJSON, blocksStore, blockToJSON } from '$lib/state/blocks';

	export let bookId: string;

	$: book = $booksStore.table.rows.find((row) => row.id === bookId);

	let room: Room | undefined;

	function onMessage(message: IMessage) {
		console.log(message);
		if (message.type === 'book') {
			booksStore.change(({ table }) => {
				table.add(bookFromJSON(message.payload.book));
			});
			blocksStore.change(({ table }) => {
				message.payload.blocks.forEach((block) => {
					table.add(blockFromJSON(block));
				});
			});
		} else if (message.type === 'get-book' && book) {
			room.send(message.from, 'book', {
				book: bookToJSON(book),
				blocks: $blocksStore.table.filter((row) => row.bookId === bookId).map(blockToJSON)
			});
		}
	}

	function onConnection() {
		if (book) {
			room.off('connection' as any, onConnection);
		} else {
			room.broadcast('get-book', undefined);
		}
	}

	onMount(async () => {
		const peer = await getPeer();
		room = await peer.connectToRoom(getAppId(bookId));

		room.on('message' as any, onMessage);
		room.on('connection' as any, onConnection);
	});

	onDestroy(() => {
		$peer?.disconnectFromRoom(room.getRoomId());
	});
</script>

<svelte:head>
	<title>Book: {book?.name}</title>
</svelte:head>

{#if book}
	<Book {book} {room} />
{:else}
	<div class="d-flex align-items-center justify-content-center">
		<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
	</div>
{/if}
