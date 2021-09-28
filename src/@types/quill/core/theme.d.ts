declare module 'quill/core/theme' {
	import Quill, { QuillOptionsStatic } from 'quill';

	export default class Theme {
		public quill: Quill;
		public options: QuillOptionsStatic;
		public modules: Record<string, unknown>;

		constructor(quill: Quill, options: QuillOptionsStatic);

		init(): void;
		addModule(name: string): void;
	}
}
