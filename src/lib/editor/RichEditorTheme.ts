import Quill from 'quill';
import type { QuillOptionsStatic } from 'quill';
import type BubbleThemeClass from 'quill/themes/snow';
import type ThemeClass from 'quill/core/theme';
import { RichEditorTooltip } from './RichEditorTooltip';

const BubbleTheme: typeof BubbleThemeClass = Quill.import('themes/snow');
const Theme: typeof ThemeClass = Quill.import('core/theme');
const icons = Quill.import('ui/icons');

const TOOLBAR_CONFIG = [
	[{ header: ['1', '2', '3', false] }],
	['bold', 'italic', 'underline', 'strike'],
	[{ color: [] }, { background: [] }],
	['code-block', 'formula'],
	[
		{
			list: 'ordered'
		},
		{
			list: 'bullet'
		}
	],
	[
		{
			align: []
		}
	],
	['link', 'image'],
	['clean']
];

const BUBBLE_DEFAULTS = BubbleTheme.DEFAULTS;
export class RichEditorTheme extends Theme {
	static DEFAULTS = {
		...BUBBLE_DEFAULTS,
		modules: {
			...BUBBLE_DEFAULTS.modules,
			toolbar: {
				...BUBBLE_DEFAULTS.modules.toolbar,
				handlers: {
					...BUBBLE_DEFAULTS.modules.toolbar.handlers,
					link(value: string) {
						if (value) {
							const range = this.quill.getSelection();
							if (range == null || range.length === 0) return;
							let preview = this.quill.getText(range);
							if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
								preview = `mailto:${preview}`;
							}
							this.quill.theme.tooltip.edit('link', preview);
						} else {
							this.quill.format('link', false);
						}
					}
				}
			}
		}
	};
	public tooltip: RichEditorTooltip;
	public buildButtons: typeof BubbleTheme.prototype.buildButtons;
	public buildPickers: typeof BubbleTheme.prototype.buildPickers;

	constructor(quill: Quill, options: QuillOptionsStatic) {
		if (
			options.modules &&
			options.modules.toolbar != null &&
			options.modules.toolbar.container == null
		) {
			options.modules.toolbar.container = TOOLBAR_CONFIG;
		}
		super(quill, options);
		(this.quill as any).container.classList.add('ql-rich-editor');
	}

	extendToolbar(toolbar: any) {
		toolbar.container.classList.add('ql-rich-editor');

		this.tooltip = new RichEditorTooltip(this.quill, this.options.bounds);
		this.tooltip.root.appendChild(toolbar.container);

		this.buildButtons(toolbar.container.querySelectorAll('button'), icons);
		this.buildPickers(toolbar.container.querySelectorAll('select'), icons);
	}
}

RichEditorTheme.prototype.init = BubbleTheme.prototype.init;
RichEditorTheme.prototype.addModule = BubbleTheme.prototype.addModule;
RichEditorTheme.prototype.buildButtons = BubbleTheme.prototype.buildButtons;
RichEditorTheme.prototype.buildPickers = BubbleTheme.prototype.buildPickers;

Quill.register('themes/rich-editor', RichEditorTheme, true);
