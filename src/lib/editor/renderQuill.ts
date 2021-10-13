import type Quill from 'quill';
import type Delta from 'quill-delta';
import type Op from 'quill-delta/dist/Op';
import { createQuill } from './createQuill';

export function renderQuill(node: HTMLElement, quill: Quill) {
	node.innerHTML = `<div class="ql-container ql-snow ql-rich-editor ql-read-only"><div class="ql-editor">${quill.root.innerHTML}</div></div>`;

	Array.from(node.querySelectorAll<HTMLElement>('.ql-code-block')).forEach((codeBlock) => {
		codeBlock.innerHTML = window.hljs.highlight(
			codeBlock.getAttribute('data-language'),
			codeBlock.innerText
		).value;
	});
}

export function renderOps(node: HTMLElement, ops: Op[]) {
	const tmp = getOrCreateTmpNode(node.ownerDocument);

	const quill = createQuill(tmp);
	quill.setContents({ ops } as Delta);

	renderQuill(node, quill);
	tmp.innerHTML = '';
}

const TMP_NODE_ID = 'quill-render-tmp-node';
function getOrCreateTmpNode(document: Document) {
	let tmp = document.getElementById(TMP_NODE_ID);
	if (!tmp) {
		tmp = document.createElement('div');
		tmp.id = TMP_NODE_ID;
		tmp.style.display = 'none';
		document.body.appendChild(tmp);
	}
	return tmp;
}
