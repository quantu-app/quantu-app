/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

import type { IToken } from '$lib/api/jwt';
import type { User } from '@prisma/client';
import type bootstrap from 'bootstrap';
import type HLJSApi from 'highlight.js';
import type katex from 'katex';

declare namespace MathQuill {
	export class EditableField {
		id: string;
		latex(): string;
	}
	export class MathField extends EditableField {}
	export interface IMathFieldOptions {
		handlers?: {
			edit?: (mathField: MathField) => void;
		};
	}
	export class MathQuill {
		MathField(element: HTMLElement, options: IMathFieldOptions = {}): MathField;
	}
	export function getInterface(value: number): MathQuill;
}

declare global {
	interface Window {
		katex: katex;
		hljs: HLJSApi;
		bootstrap: bootstrap;
		MathQuill: MathQuill;
		gtag(type: string, id: string, config?: any): void;
	}

	declare namespace App {
		interface Locals {
			token?: IToken<{ userId: string }>;
		}
		interface Session {
			user: User;
		}
	}
}
