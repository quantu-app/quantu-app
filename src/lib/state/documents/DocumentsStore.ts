import Automerge from 'automerge';
import type { UUID, FreezeObject } from 'automerge';
import type { Updater } from 'svelte/store';
import { getAutomergeContentHash } from '$lib/utils';
import { PersistentStore } from '../PersistentStore';
import { BlockType, createEmptyBlock, ITextBlock } from './blocks';
import type { IDocument, IDocumentMeta } from './documents';
import {
	createDocument,
	createEmptyDocument,
	DEFAULT_BOOK_TYPE,
	getWordCount,
	DocumentType,
	isJournalDocument
} from './documents';
import { DocumentStore } from './DocumentStore';
import { isSignedIn } from '../user';
import { DocumentService } from '$lib/api/quantu-app-api';

export class DocumentsStore extends PersistentStore<Record<UUID, IDocumentMeta>> {
	private documentStores: Record<UUID, DocumentStore> = {};

	constructor(name: string, initialState: Record<UUID, IDocumentMeta>, timeoutMS?: number) {
		super(name, initialState, timeoutMS);

		if (isSignedIn()) {
			DocumentService.quantuAppWebControllerDocumentIndex().then((response) =>
				this.update((state) =>
					response.reduce((state, document) => ({ ...state, [document.id]: document }), state)
				)
			);
		}
	}

	private onPersist = (document: FreezeObject<IDocument>) => {
		const newDocumentMeta = {
			contentHash: getAutomergeContentHash(document),
			name: document.name.toString(),
			wordCount: getWordCount(document),
			updatedAt: new Date().toJSON()
		};

		this.update((state) => ({
			...state,
			[document.id]: {
				...state[document.id],
				newDocumentMeta
			}
		}));
	};

	private createDocumentStore(documentId: string, document: IDocument) {
		const documentStore = new DocumentStore(documentId, Automerge.from(document));
		documentStore.on('persist', (doc) => {
			const documentMeta = this.get()[doc.id];

			if (documentMeta) {
				this.onPersist(doc);
			}
		});
		return documentStore;
	}

	private createDocumentUUID() {
		const documentId = Automerge.uuid();

		if (documentId in this.get()) {
			return this.createDocumentUUID();
		} else {
			return documentId;
		}
	}

	updateDocument(id: UUID, updater: Updater<Partial<IDocumentMeta>>) {
		this.update((state) => {
			const documentMeta = state[id];

			if (documentMeta) {
				const newDocumentMeta = updater(documentMeta);

				if (isSignedIn()) {
					DocumentService.quantuAppWebControllerDocumentUpdate(id, newDocumentMeta);
				}

				return {
					...state,
					[id]: { ...state[id], newDocumentMeta }
				};
			} else {
				return state;
			}
		});
	}

	async createDocument<T extends DocumentType = DocumentType>(type: T, name?: string) {
		const documentId = this.createDocumentUUID(),
			document = await createDocument(documentId, type, name);

		let documentMeta = {
			id: documentId,
			name: document.name.toString(),
			type: type as string,
			tags: [],
			wordCount: 0,
			language: 'en',
			insertedAt: document.insertedAt,
			updatedAt: document.insertedAt
		};

		if (isSignedIn()) {
			documentMeta = await DocumentService.quantuAppWebControllerDocumentCreate(documentMeta);
		}

		this.update((state) => ({
			...state,
			[documentId]: documentMeta
		}));

		const documentStore = this.createDocumentStore(documentId, document);
		documentStore.change((doc) => {
			if (isJournalDocument(doc)) {
				doc.blocks.add(createEmptyBlock(BlockType.Text) as ITextBlock);
			}
		});
		documentStore;
		this.documentStores[documentId] = documentStore;
		return documentStore;
	}

	deleteDocumentById(documentId: UUID) {
		DocumentStore.deleteDocument(documentId);
		this.update((state) => {
			const newState = { ...state };
			delete newState[documentId];
			return newState;
		});
	}

	getDocumentById(documentId: UUID) {
		const documentStore = this.documentStores[documentId];

		if (documentStore) {
			return documentStore;
		} else {
			const documentStore = this.createDocumentStore(
				documentId,
				createEmptyDocument(documentId, DEFAULT_BOOK_TYPE, undefined)
			);
			this.documentStores[documentId] = documentStore;
			return documentStore;
		}
	}

	async unloadDocumentById(documentId: string) {
		const documentStore = this.documentStores[documentId];
		if (documentStore) {
			delete this.documentStores[documentId];
			await documentStore.close();
		}
		return this;
	}
}
