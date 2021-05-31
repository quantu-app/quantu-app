import type { Text } from 'automerge';

export const BLOCKS_TABLE = 'blocks';

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
	text: Text;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return value !== null && typeof value === 'object' && value['type'] === BlockType.Text;
}

export type IBlock = ITextBlock;
