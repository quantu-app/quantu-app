import type { Updater } from 'svelte/store';
import { v4 } from 'uuid';
import { persistentStore } from './persistentStore';

export enum BlockType {
	Text = 'text'
}

export interface IBaseBlock {
	id: string;
	type: BlockType;
	bookId: string;
}

export interface ITextBlock extends IBaseBlock {
	type: BlockType.Text;
	text: string;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return value !== null && typeof value === 'object' && value['type'] === BlockType.Text;
}

export type IBlock = ITextBlock;

export interface IBlocks {
	byId: Record<string, IBlock>;
}

export const blocksStore = persistentStore<IBlocks>('blocks', {
	byId: {}
});

export function createBlock(bookId: string, type: BlockType) {
	const block = { id: v4(), bookId, type } as IBlock;

	if (isTextBlock(block)) {
		block.text = '';
	}

	blocksStore.update((blocks) => {
		blocks.byId[block.id] = block;
		return blocks;
	});
}

export function updateBlock(blockId: string, updater: Updater<IBlock>) {
	blocksStore.update((blocks) => {
		const block = blocks.byId[blockId];

		if (block) {
			blocks.byId[block.id] = updater(block);
		}

		return blocks;
	});
}
