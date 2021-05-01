import type { ChangeFn } from 'automerge';
import { Table, Text } from 'automerge';
import { persistentStore } from './persistentStore';

export enum BlockType {
	Text = 'text'
}

export interface IBaseBlock {
	type: BlockType;
	bookId: string;
}

export interface ITextBlock extends IBaseBlock {
	type: BlockType.Text;
	text: Text;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return value !== null && typeof value === 'object' && value['type'] === BlockType.Text;
}

export type IBlock = ITextBlock;

export const blocksStore = persistentStore('blocks', {
	table: new Table<IBlock>()
});

export function createBlock(bookId: string, type: BlockType) {
	let id: string;
	blocksStore.change(({ table }) => {
		const block = { bookId, type } as IBlock;

		if (isTextBlock(block)) {
			block.text = new Text();
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
