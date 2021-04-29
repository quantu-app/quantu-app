import type { ChangeFn } from 'automerge';
import { Table } from 'automerge';
import { persistentStore } from './persistentStore';

export enum BlockType {
	Markdown = 'markdown'
}

export interface IBaseBlock {
	type: string;
	bookId: string;
}

export interface IMarkdownBlock extends IBaseBlock {
	type: BlockType.Markdown;
	markdown: string;
}

export function isMarkdownBlock(value: unknown): value is IMarkdownBlock {
	return value !== null && typeof value === 'object' && value['type'] === BlockType.Markdown;
}

export type IBlock = IMarkdownBlock;

export const blocksStore = persistentStore('blocks', {
	table: new Table<IBlock>()
});

export function createBlock(bookId: string, type: BlockType) {
	let id: string;
	blocksStore.change(({ table }) => {
		const block = { bookId, type } as IBlock;

		if (isMarkdownBlock(block)) {
			block.markdown = '';
		}

		id = table.add(block);
	});
	return id;
}

export function updateBlock(blockId: string, changeFn: ChangeFn<IBlock>) {
	blocksStore.change(({ table }) => {
		const block = table.byId(blockId);

		if (block) {
			changeFn(block);
		}
	});
}
