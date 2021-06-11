import type { List } from 'automerge';
import type Op from 'quill-delta/dist/Op';

export enum BlockType {
	Text = 'text'
}

export interface IBlockBase {
	type: BlockType;
	index: number;
	createdAt: string;
}

export interface ITextBlock extends IBlockBase {
	type: BlockType.Text;
	text: List<Op>;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return value !== null && typeof value === 'object' && value['type'] === BlockType.Text;
}

export type IBlock = ITextBlock;
