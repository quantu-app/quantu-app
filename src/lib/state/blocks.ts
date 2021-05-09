import { ChangeFn, TableRow } from 'automerge';
import { Table, Text } from 'automerge';
import { persistentStore } from './persistentStore';

export enum BlockType {
	Text = 'text'
}

export interface IBaseBlock {
	type: BlockType;
	bookId: string;
}

export interface IBaseBlockJSON extends IBaseBlock {
	id: string;
}

export interface ITextBlock extends IBaseBlock {
	type: BlockType.Text;
	text: Text;
}

export interface ITextBlockJSON extends IBaseBlockJSON {
	type: BlockType.Text;
	text: string;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return value !== null && typeof value === 'object' && value['type'] === BlockType.Text;
}

export type IBlock = ITextBlock;
export type IBlockJSON = ITextBlockJSON;

export function blockToJSON(block: IBlock & TableRow): IBlockJSON {
	const json = {
		id: block.id,
		bookId: block.bookId,
		type: block.type
	};

	if (isTextBlock(block)) {
		const textJSON = json as ITextBlockJSON;
		textJSON.text = block.text.toString();
	}

	return json as IBlockJSON;
}

export function blockFromJSON(json: IBlockJSON): IBlock {
	const block = {
		id: json.id,
		bookId: json.bookId,
		type: json.type
	};

	if (isTextBlock(block)) {
		const textBlock = block as ITextBlock;
		textBlock.text = new Text(json.text);
	}

	return block as any;
}

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

export function updateBlock(blockId: string, changeFn: ChangeFn<IBlock & TableRow>) {
	blocksStore.change(({ table }) => {
		const block = table.byId(blockId);

		if (block) {
			changeFn(block);
		}
	});
}
