import Automerge from 'automerge';
import type { Table, ChangeFn, UUID, Text } from 'automerge';
import { AutomergePersistentStore } from '$lib/state/AutomergePersistentStore';

export const BLOCKS_TABLE = 'blocks';

export enum BlockType {
	Text = 'text'
}

export interface IBaseBlock {
	type: BlockType;
	index: number;
	createdAt: string;
}

export interface ITextBlock extends IBaseBlock {
	type: BlockType.Text;
	text: Text;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return value !== null && typeof value === 'object' && value['type'] === BlockType.Text;
}

export type IBlock = ITextBlock;

export interface IBlocks {
	bookId: UUID;
	blocks: Table<IBlock>;
}

export class BlocksStore extends AutomergePersistentStore<IBlocks> {
	constructor(bookId: string) {
		super(
			`${BLOCKS_TABLE}/${bookId}`,
			Automerge.from({
				bookId,
				blocks: new Automerge.Table()
			})
		);
	}

	createBlock(type: BlockType) {
		const block: IBaseBlock = {
			type,
			index: 0,
			createdAt: new Date().toJSON()
		};

		if (isTextBlock(block)) {
			block.text = new Automerge.Text();
		}

		this.change((doc) => {
			block.index = doc.blocks.rows.reduce(
				(maxIndex, b) => (maxIndex <= b.index ? b.index + 1 : maxIndex),
				0
			);
			doc.blocks.add(block as IBlock);
		});

		return block;
	}

	updateBlock(blockId: string, changeFn: ChangeFn<IBlock>) {
		this.change((doc) => {
			const block = doc.blocks.byId(blockId);

			if (block) {
				changeFn(block);
			}
		});
	}
}
