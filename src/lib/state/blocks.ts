import type { List } from 'automerge';
import type Op from 'quill-delta/dist/Op';

export enum BlockType {
	Text = 'text',
	Code = 'code'
}

export interface IBlockBase {
	type: BlockType;
	index: number;
	createdAt: string;
}

export function isBlock(value: unknown): value is IBlockBase {
	return value !== null && typeof value === 'object' && typeof value['type'] === 'string';
}

export interface ITextBlock extends IBlockBase {
	type: BlockType.Text;
	text: List<Op>;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return isBlock(value) && value.type === BlockType.Text;
}

export interface ICodeBlock extends IBlockBase {
	type: BlockType.Code;
	lang: string;
	text: List<Op>;
}

export function isCodeBlock(value: unknown): value is ICodeBlock {
	return isBlock(value) && value.type === BlockType.Code;
}

export type IBlock = ITextBlock | ICodeBlock;
