declare module 'quill/ui/tooltip' {
	import Quill, { BoundsStatic } from 'quill';

	export default class Tooltip {
		public quill: Quill;
		public root: HTMLElement;
		public boundsContainer: HTMLElement;

		constructor(quill: Quill, bounds?: HTMLElement);

		show(): void;
		hide(): void;
		position(bounds: BoundsStatic): void;
	}
}
