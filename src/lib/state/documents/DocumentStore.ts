import type { ChangeFn, TableRow, FreezeObject } from 'automerge';
import type { IBlock, IBlockBase } from './blocks';
import { AutomergePersistentStore } from '../AutomergePersistentStore';
import { BlockType, createEmptyBlock } from './blocks';
import type { IDocumentBase, IJournalDocument, INotesDocument } from './documents';

export class DocumentStore<
	T extends IDocumentBase = IDocumentBase
> extends AutomergePersistentStore<T> {
	private documentId: string;

	constructor(documentId: string, initialState: FreezeObject<T>) {
		super(`documents/${documentId}`, initialState);
		this.documentId = documentId;
	}

	static async deleteDocument(documentId: string) {
		await AutomergePersistentStore.remove(`documents/${documentId}`);
	}

	asJournalDocument(): DocumentStore<IJournalDocument> {
		return this as unknown as DocumentStore<IJournalDocument>;
	}
	asNotesDocument(): DocumentStore<INotesDocument> {
		return this as unknown as DocumentStore<INotesDocument>;
	}

	getDocumentId() {
		return this.documentId;
	}

	createBlock<T extends BlockType = BlockType>(type: T) {
		const block = createEmptyBlock(type);

		this.change((doc) => {
			block.index = doc.blocks.rows.reduce(
				(maxIndex, b) => (maxIndex <= b.index ? b.index + 1 : maxIndex),
				0
			);
			doc.blocks.add(block as unknown as IBlock);
		});

		return block;
	}

	updateBlock<B extends IBlockBase = IBlockBase>(blockId: string, changeFn: ChangeFn<B>) {
		this.change((doc) => {
			const block = doc.blocks.byId(blockId);

			if (block) {
				changeFn(block as unknown as B & TableRow);
			}
		});
	}
}
