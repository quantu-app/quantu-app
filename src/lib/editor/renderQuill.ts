import type Quill from "quill";
import type Delta from "quill-delta";
import type Op from "quill-delta/dist/Op";
import { createQuill } from "./createQuill";

export function renderQuill(node: HTMLElement, quill: Quill) {
  node.innerHTML = `<div class="ql-container ql-snow ql-rich-editor ql-read-only"><div class="ql-editor">${
    (quill as any).root.innerHTML
  }</div></div>`;

  Array.from(node.querySelectorAll<HTMLElement>(".ql-code-block")).forEach(
    (codeBlock) => {
      codeBlock.innerHTML = (window as any).hljs.highlight(
        codeBlock.getAttribute("data-language"),
        codeBlock.innerText
      ).value;
    }
  );
}

export function renderOps(node: HTMLElement, ops: Op[]) {
  const document = node.ownerDocument,
    tmp = document.createElement("div");

  tmp.style.display = "none";
  document.body.appendChild(tmp);

  const quill = createQuill(tmp);
  quill.setContents({ ops } as Delta);

  renderQuill(node, quill);
  document.body.removeChild(tmp);
}
