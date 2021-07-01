import type Quill from 'quill';

let registered = false;

export function registerMathBlock(quill: typeof Quill) {
	if (registered) {
		return;
	}
	internalRegisterMathBlock(quill);
	registered = true;
}

const MODAL_TEMPLATE = `<div class="modal" style="display:block" tabindex="-1">
<div class="modal-dialog">
	<div class="modal-content">
		<div class="modal-header">
			<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal" />
		</div>
		<div class="modal-body">
			<div class="input-group">
				<input type="text" class="form-control" placeholder="Type Latex Math." />
			</div>
			<div class="input-group">
				<div class="output" />
			</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Update</button>
		</div>
	</div>
</div>
</div>`;

function internalRegisterMathBlock(quill: typeof Quill) {
	const Embed = quill.import('blots/embed'),
		Icons = quill.import('ui/icons');

	class MathBlock extends Embed {
		static blotName = 'math-block';
		static className = 'ql-math-block';
		static tagName = 'SPAN';

		static create(value) {
			if ((window as any).katex == null) {
				throw new Error('Math block module requires KaTeX.');
			}
			const node = super.create(value);
			MathBlock.updateDataValue(node, value);
			return node;
		}

		private deleteModal() {
			this.modal.remove();
			this.modal = null;
		}

		private createModal(value: string) {
			const builder: HTMLSpanElement = this.domNode.ownerDocument.createElement('span');
			builder.innerHTML = MODAL_TEMPLATE;
			this.modal = builder.firstChild as HTMLDivElement;
			document.body.appendChild(this.modal);

			const output = this.modal.querySelector<HTMLDivElement>('.modal-body .output'),
				input = this.modal.querySelector<HTMLInputElement>('.modal-body input'),
				close = this.modal.querySelector<HTMLButtonElement>('.modal-header button'),
				update = this.modal.querySelector<HTMLButtonElement>('.modal-footer button');

			input.value = value;

			input?.addEventListener('input', (e) => {
				(window as any).katex.render((e.target as HTMLInputElement).value, output, {
					throwOnError: false,
					errorColor: '#f00'
				});
			});
			close?.addEventListener('click', () => this.deleteModal());
			update?.addEventListener('click', () => {
				MathBlock.updateDataValue(this.domNode, input.value);
				this.deleteModal();
			});
		}

		private static updateDataValue(node: HTMLElement, value: string) {
			if (typeof value === 'string') {
				(window as any).katex.render(value, node, {
					throwOnError: false,
					errorColor: '#f00'
				});
				node.setAttribute('data-value', value);
			}
		}

		private modal: HTMLDivElement;

		private onEdit = () => {
			if (this.modal) {
				this.deleteModal();
			} else {
				this.createModal(this.domNode.getAttribute('data-value'));
			}
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
			return `<span>${formula}</span>`;
		}
	}

	Icons['math-block'] = Icons['formula'];

	quill.register('formats/math', MathBlock, true);
}
