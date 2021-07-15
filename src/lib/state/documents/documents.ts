import Automerge from 'automerge';
import type { Table, Text, UUID } from 'automerge';
import { applyOpsToText, getLocationName } from '$lib/utils';
import { IBlock, isCodeBlock, isTextBlock } from './blocks';
import type { Document_Show } from '$lib/api/quantu-app-api';

export enum DocumentType {
	Journal = 'journal',
	Notes = 'notes'
}

export const DEFAULT_BOOK_TYPE = DocumentType.Notes;

export interface IDocumentBase<T extends DocumentType = DocumentType> {
	id: UUID;
	name: Text;
	type: T;
	insertedAt: string;
	blocks: Table<IBlock>;
}

export type IDocumentMeta = Document_Show;

export interface IJournalDocument extends IDocumentBase<DocumentType.Journal> {
	location: Text;
}

export function isJournalDocument(value: unknown): value is IJournalDocument {
	return value !== null && typeof value === 'object' && value['type'] === DocumentType.Journal;
}

export type INotesDocument = IDocumentBase<DocumentType.Notes>;

export function isNotesDocument(value: unknown): value is INotesDocument {
	return value !== null && typeof value === 'object' && value['type'] === DocumentType.Notes;
}

export type IDocument = IJournalDocument | INotesDocument;

export function createEmptyDocument<T extends DocumentType = DocumentType>(
	id: UUID,
	type: T,
	name: string
) {
	return {
		id,
		name: new Automerge.Text(name),
		type,
		insertedAt: new Date().toJSON(),
		blocks: new Automerge.Table()
	} as unknown as IDocument;
}

export async function createDocument<T extends DocumentType = DocumentType>(
	id: UUID,
	type: T,
	name?: string
) {
	const document = createEmptyDocument(id, type, name || new Date().toDateString());

	if (isJournalDocument(document)) {
		document.location = new Automerge.Text(await getLocationName());
	}

	return document;
}

export function getWordCount(document: IDocument) {
	return document.blocks.rows.reduce((count, block) => {
		if (isTextBlock(block)) {
			return (
				count +
				applyOpsToText(new Automerge.Text(), block.text)
					.toString()
					.replace(/[\s]+/g, ' ')
					.trim()
					.split(' ').length
			);
		} else if (isCodeBlock(block)) {
			return count + block.text.toString().replace(/[\s]+/g, ' ').trim().split(' ').length;
		} else {
			return count;
		}
	}, 0);
}
