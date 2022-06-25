import { CODE_LINE_TYPE } from 'svelte-slate/plugins/CodeEditorElement.svelte';
import { CODE_TYPE } from 'svelte-slate/plugins/CodeElement.svelte';
import type { IElement } from 'svelte-slate/plugins/Element.svelte';
import { IMAGE_TYPE } from 'svelte-slate/plugins/ImageElement.svelte';
import type { IText } from 'svelte-slate/plugins/Leaf.svelte';
import { MATH_TYPE } from 'svelte-slate/plugins/MathElement.svelte';
import { PARAGRAPH_TYPE } from 'svelte-slate/plugins/ParagraphElement.svelte';

export interface IAttributes {
	[key: string]: any;
}

export abstract class ContentBuilder {
	block(type = PARAGRAPH_TYPE, attributes: IAttributes = {}): Block {
		return this.addBlock(type, [], attributes);
	}

	image(url: string, attributes: IAttributes = {}) {
		this.addBlock(IMAGE_TYPE, [{ text: '' }], { ...attributes, url } as any);
		return this;
	}

	math(math: string, inline = false, attributes: IAttributes = {}) {
		this.addBlock(MATH_TYPE, [{ text: '' }], { ...attributes, math, inline } as any);
		return this;
	}

	code(language: string, code: string, attributes: IAttributes = {}) {
		this.addBlock(CODE_TYPE, {
			...attributes,
			language,
			children: code.split('\n').map((text) => ({
				type: CODE_LINE_TYPE,
				children: [{ text }]
			}))
		} as any);
		return this;
	}

	text(value = '', attributes: IAttributes = {}) {
		this.addText(value, attributes);
		return this;
	}

	abstract addBlock(
		type?: string,
		children?: Array<IElement | IText>,
		attributes?: IAttributes
	): Block;
	abstract addText(value?: string, attributes?: IAttributes): this;
}

export class Content extends ContentBuilder {
	private value: Array<IElement | IText> = [];

	static content() {
		return content();
	}

	addBlock(
		type = PARAGRAPH_TYPE,
		children: Array<IElement | IText> = [],
		attributes: IAttributes = {}
	): Block {
		const block = new Block(type, children, attributes);
		this.value.push(block.value);
		return block;
	}
	addText(value = '', attributes: IAttributes = {}) {
		this.value.push({ ...attributes, text: value });
		return this;
	}

	build() {
		return this.value;
	}
}

export class Block extends ContentBuilder {
	value: IElement;

	constructor(type: string, children: Array<IElement | IText> = [], attributes: IAttributes = {}) {
		super();
		this.value = { ...attributes, type, children };
	}

	addBlock(
		type = PARAGRAPH_TYPE,
		attributes: IAttributes = {},
		children: Array<IElement | IText> = []
	): Block {
		const block = new Block(type, children, attributes);
		this.value.children.push(block.value);
		return block;
	}
	addText(value = '', attributes: IAttributes = {}) {
		this.value.children.push({ ...attributes, text: value });
		return this;
	}
}

export function content() {
	return new Content();
}
