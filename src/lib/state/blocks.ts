import { ChangeFn, TableRow, uuid } from 'automerge';
import { Table, Text } from 'automerge';
import { persistentStore } from './persistentStore';

export enum BlockType {
	Text = 'text'
}

export interface IBaseBlock {
	uuid: string;
	type: BlockType;
	bookUuid: string;
}

export interface IBaseBlockJSON extends IBaseBlock {
	uuid: string;
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
		uuid: block.uuid,
		bookUuid: block.bookUuid,
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
		uuid: json.uuid,
		bookUuid: json.bookUuid,
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

export function createBlock(bookUuid: string, type: BlockType) {
	const id = uuid();
	blocksStore.change(({ table }) => {
		const block = { uuid: id, bookUuid, type } as IBlock;

		if (isTextBlock(block)) {
			block.text = new Text();
		}

		table.add(block);
	});
	return id;
}

export function updateBlock(blockUuid: string, changeFn: ChangeFn<IBlock & TableRow>) {
	blocksStore.change(({ table }) => {
		const block = table.rows.find((row) => row.uuid === blockUuid);

		if (block) {
			changeFn(block);
		}
	});
}
