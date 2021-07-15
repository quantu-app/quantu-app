import type { List, Text } from 'automerge';
import Automerge from 'automerge';
import type Op from 'quill-delta/dist/Op';

export enum BlockType {
	Text = 'text',
	Code = 'code'
}

export interface IBlockBase<T extends BlockType = BlockType> {
	type: T;
	index: number;
	insertedAt: string;
}

export function isBlock(value: unknown): value is IBlockBase {
	return value !== null && typeof value === 'object' && typeof value['type'] === 'string';
}

export interface ITextBlock extends IBlockBase<BlockType.Text> {
	text: List<Op>;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return isBlock(value) && value.type === BlockType.Text;
}

export interface ICodeBlock extends IBlockBase<BlockType.Code> {
	language: string;
	text: Text;
}

export function isCodeBlock(value: unknown): value is ICodeBlock {
	return isBlock(value) && value.type === BlockType.Code;
}

export type IBlock = ITextBlock | ICodeBlock;

export function createEmptyBlock<T extends BlockType>(type: T) {
	const block = {
		type,
		index: 0,
		insertedAt: new Date().toJSON()
	} as IBlock;

	if (isTextBlock(block)) {
		block.text = [];
	} else if (isCodeBlock(block)) {
		block.text = new Automerge.Text();
		block.language = 'typescript';
	}

	return block;
}
