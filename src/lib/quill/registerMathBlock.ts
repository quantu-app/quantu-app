import type Quill from 'quill';
import Delta from 'quill-delta';

function renderkatex(node: HTMLElement, value: string) {
	window.katex.render(value, node, {
		throwOnError: false,
		errorColor: '#f00'
	});
}

function getModal(value: string, onUpdate: (value: string) => void, onDelete: () => void) {
	const element = document.getElementById('math-block-modal'),
		input = element.querySelector<HTMLInputElement>('.modal-body .input'),
		output = element.querySelector<HTMLDivElement>('.modal-body .output'),
		remove = element.querySelector<HTMLButtonElement>('.modal-footer button.delete'),
		update = element.querySelector<HTMLButtonElement>('.modal-footer button.update'),
		modal = new window.bootstrap.Modal(element);

	input.value = value;
	if (value) {
		renderkatex(output, value);
	}

	function onClickDelete() {
		removeClickDelete();
		onDelete();
	}
	function onClickUpdate() {
		removeClickUpdate();
		onUpdate(input.value);
	}
	function onInputChange(e: InputEvent) {
		renderkatex(output, (e.target as HTMLInputElement).value);
	}

	function removeClickDelete() {
		remove.removeEventListener('click', onClickDelete);
	}
	function removeClickUpdate() {
		update.removeEventListener('click', onClickUpdate);
	}
	function removeInputChange() {
		update.removeEventListener('input', onInputChange);
	}
	function removeAll() {
		removeClickDelete();
		removeClickUpdate();
		removeInputChange();
	}

	remove.addEventListener('click', onClickDelete);
	update.addEventListener('click', onClickUpdate);
	input.addEventListener('input', onInputChange);

	element.addEventListener('hidden.bs.modal', removeAll);

	modal.show();
}

export function registerMathBlock(quill: typeof Quill) {
	const Embed = quill.import('blots/embed'),
		Icons = quill.import('ui/icons');

	class MathBlock extends Embed {
		static blotName = 'math-block';
		static className = 'ql-math-block';
		static tagName = 'DIV';

		static create(value: string) {
			const node = super.create(value);
			renderkatex(node, value);
			if (value) {
				node.setAttribute('data-value', value);
			}
			return node;
		}

		private onEdit = () => {
			getModal(
				this.domNode.getAttribute('data-value'),
				(value) => {
					renderkatex(this.domNode, value);
					this.domNode.setAttribute('data-value', value);
				},
				() => {
					this.remove();
				}
			);
		};

		attach() {
			super.attach();
			const domNode: HTMLElement = this.domNode;
			domNode.addEventListener('click', this.onEdit);
		}

		remove() {
			const domNode: HTMLElement = this.domNode;
			domNode.removeEventListener('click', this.onEdit);
			super.remove();
		}

		static value(domNode: HTMLElement) {
			return domNode.getAttribute('data-value');
		}

		html() {
			const { formula } = this.value();
			return `<div>${formula}</div>`;
		}
	}

	Icons['math-block'] = Icons['formula'];

	quill.register('formats/math', MathBlock, true);
}

export function mathBlockHandler(this: { quill: Quill }) {
	const [range] = (this.quill as any).selection.getRange();

	getModal(
		'',
		(value) =>
			this.quill.updateContents(
				new Delta().retain(range.index).delete(range.length).insert({ 'math-block': value }),
				'user'
			),
		() => undefined
	);
}
