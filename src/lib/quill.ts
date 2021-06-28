import Quill from 'quill';

const Block = Quill.import('blots/block'),
	Module = Quill.import('core/module'),
	Icons = Quill.import('ui/icons');

export class MathBlock extends Block {
	static blotName = 'math-block';
	static tagName = 'DIV';

	private inputNode: HTMLInputElement;
	private cachedText: string;

	attach() {
		if (!this.inputNode) {
			const document = this.domNode.ownerDocument;
			this.inputNode = document.createElement('input');
			this.inputNode.style.position = 'absolute';
			this.inputNode.value = this.domNode.innerText;
			document.body.appendChild(this.inputNode);
		}
		return super.attach();
	}

	detach() {
		if (this.inputNode) {
			this.inputNode.remove();
		}
		return super.detach();
	}

	renderMath() {
		const domNode: HTMLElement = this.domNode,
			text = this.inputNode.value;

		if (this.cachedText !== text) {
			if (text.trim().length > 0 || this.cachedText == null) {
				const position = domNode.getBoundingClientRect();
				this.inputNode.style.left = `${position.x}px`;
				this.inputNode.style.top = `${position.bottom}px`;
				(window as any).katex.render(text, this.domNode, {
					throwOnError: false,
					errorColor: '#f00'
				});
			}
			this.cachedText = text;
		}
	}
}

Icons['math-block'] = Icons['formula'];

export class MathModule extends Module {
	static register() {
		Quill.register(MathBlock, true);
	}

	constructor(quill, options) {
		super(quill, options);
		let timer = null;
		this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				this.renderMath();
				timer = null;
			}, this.options.interval);
		});
		this.renderMath();
	}

	renderMath() {
		if (this.quill.selection.composing) return;
		this.quill.update(Quill.sources.USER);
		const range = this.quill.getSelection();
		this.quill.scroll.descendants(MathBlock).forEach((block) => block.renderMath());
		this.quill.update(Quill.sources.SILENT);
		if (range != null) {
			this.quill.setSelection(range, Quill.sources.SILENT);
		}
	}
}

Quill.register('modules/math', MathModule, true);

export default Quill;
