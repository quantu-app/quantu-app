declare module 'quill/themes/base' {
	import Quill, { BoundsStatic } from 'quill';
	import Theme from 'quill/core/theme';

	export default class BaseTheme extends Theme {
		buildButtons(buttons: HTMLButtonElement[], icons: Record<string, string>): void;
		buildPickers(selects: HTMLInputElement[], icons: Record<string, string>): void;
	}

	export class BaseTooltip extends Tooltip {
		public quill: Quill;
		public root: HTMLElement;
		public textbox: HTMLInputElement;
		public linkRange: { index: number; length: number } | undefined;

		constructor(quill: Quill, bounds: BoundsStatic);

		show(): void;
		hide(): void;
		position(bounds: BoundsStatic): void;
		restoreFocus(): void;
		listen(): void;
		save(): void;
		edit(mode: string, value: string): void;
	}
}
