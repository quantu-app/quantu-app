import Quill from 'quill';

const Embed = Quill.import('blots/embed');

export interface IFormulaValue {
	expr: string;
	block?: boolean;
}

export class Formula extends Embed {
	static blotName = 'formula';
	static className = 'ql-formula';
	static tagName = 'SPAN';

	static create(value?: IFormulaValue) {
		if (window.katex == null) {
			throw new Error('Formula module requires KaTeX.');
		}
		const node = super.create(value && value.expr) as HTMLSpanElement;
		if (typeof value === 'object') {
			window.katex.render(value.expr, node, {
				displayMode: !!value.block,
				throwOnError: false,
				errorColor: '#f00'
			});
			node.setAttribute('data-value', value.expr);
			if (value.block) {
				node.setAttribute('data-block', 'true');
			}
		}
		return node;
	}

	static value(domNode: HTMLSpanElement): IFormulaValue {
		return {
			expr: domNode.getAttribute('data-value'),
			block: Boolean(domNode.getAttribute('data-block'))
		};
	}

	html() {
		const { formula } = this.value() as { formula: IFormulaValue };
		return `<span data-value="${formula.expr}" ${formula.block ? 'data-block="true"' : ''}">${
			formula.expr
		}</span>`;
	}
}

Quill.register(
	{
		'formats/formula': Formula
	},
	true
);
