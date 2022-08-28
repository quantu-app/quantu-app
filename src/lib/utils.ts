import { random } from '@aicacia/rand';
import { range } from '@aicacia/range';
import type { Prisma } from '@prisma/client';
import type { IElement } from 'svelte-slate/plugins/Element.svelte';
import type { IText } from 'svelte-slate/plugins/Leaf.svelte';

export type IFetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

function checkPrototypeProperty(obj: Record<string, unknown>) {
	for (const key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) {
			return false;
		}
	}
	return true;
}

export function isEmptyObject(value: unknown, checkOwnProperty = false) {
	const result =
		value !== null &&
		typeof value === 'object' &&
		value.constructor === Object &&
		Object.keys(value).length === 0;
	if (!result || !checkOwnProperty) {
		return result;
	}
	return checkPrototypeProperty(value as Record<string, unknown>);
}

export function isEmptyArray(value: unknown) {
	return (
		value !== null &&
		typeof value === 'object' &&
		typeof (value as any)['length'] === 'number' &&
		(value as any)['length'] === 0
	);
}

export function isEmpty(value: unknown) {
	return value == null || isEmptyArray(value) || isEmptyObject(value);
}

export function timeSince(date: Date): string {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
	let interval = seconds / 31536000;

	if (interval > 1) {
		const years = Math.floor(interval);
		return `${years} year${years !== 1 ? 's' : ''} ago`;
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		const months = Math.floor(interval);
		return `${months} month${months !== 1 ? 's' : ''} ago`;
	}
	interval = seconds / 86400;
	if (interval > 1) {
		const days = Math.floor(interval);
		return `${days} day${days !== 1 ? 's' : ''} ago`;
	}
	interval = seconds / 3600;
	if (interval > 1) {
		const hours = Math.floor(interval);
		return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
	}
	interval = seconds / 60;
	if (interval > 1) {
		const minutes = Math.floor(interval);
		return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
	}
	return 'now';
}

export function toPercent(value: number): string {
	const percent = value * 100;

	if (percent % 1 === 0) {
		return `${percent}%`;
	} else {
		return `${percent.toFixed(2)}%`;
	}
}

export function randomString(length = 6): string {
	return range(0, length)
		.iter()
		.map(() =>
			random() < 0.25
				? Math.floor(1 + random() * 9)
				: String.fromCharCode(97 + Math.floor(random() * 26))
		)
		.join('')
		.toUpperCase();
}

export function groupBy<K extends string | symbol | number, T extends Record<K, any>>(
	array: T[],
	key: K
) {
	return array.reduce((acc, item) => {
		const value = item[key];
		const group = acc[value] || (acc[value] = []);
		group.push(item);
		return acc;
	}, {} as Record<string, T[]>);
}

export function convertToUrlSafe(value: string, replaceWhitespaceWith = '-'): string {
	/**
	 * Converts a string to a value which can safely be sent and read in the url bar of browsers.
	 *
	 * @remarks
	 * This method trims off beginning and ending space,
	 * replaces remaining whitespace with a given character "-"" by default, then deletes everything not a-z0-9_-,
	 * and finally lowercases the resulting value
	 */
	return value
		.trim()
		.replace(/\s+/g, replaceWhitespaceWith)
		.replace(/[^a-z0-9-_]/gi, '')
		.toLowerCase();
}

export function isUrlSafe(value: string): boolean {
	// TODO: should an empty string url safe?
	return /^[a-zA-Z0-9_-]+$/.test(value);
}

export function readFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = async (e) => {
			resolve((e.target as any).result as ArrayBuffer);
		};
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});
}

export function filterObjectBy<T extends object = object>(
	obj: T,
	fn: (value: T[keyof T], key: keyof T) => boolean
): T {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		if (fn(value, key as keyof T)) {
			(acc as any)[key] = value;
		}
		return acc;
	}, {} as T);
}

export function filterObjectByNullOrUndefined<T extends object = object>(obj: T): T {
	return filterObjectBy(obj, (value) => value != null);
}

type IPrimitive = number | string | boolean | null | undefined;

export function createQueryParams(params: Record<string, IPrimitive | IPrimitive[]>): string {
	const queryParams = Object.entries(params)
		.filter(([_key, value]) => value !== undefined)
		.map(([key, value]) => {
			if (Array.isArray(value)) {
				return value
					.map((v) => {
						if (v === null) {
							return `${encodeURIComponent(key)}`;
						} else if (v === undefined) {
							return '';
						} else {
							return `${encodeURIComponent(key)}=${encodeURIComponent(v as string)}`;
						}
					})
					.join('&');
			} else if (value === null) {
				return `${encodeURIComponent(key)}`;
			} else {
				return `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
			}
		})
		.join('&');
	return queryParams ? `?${queryParams}` : '';
}

export function sortByCreatedAt<T extends { createdAt: Date }>(a: T, b: T) {
	return b.createdAt.getMilliseconds() - a.createdAt.getMilliseconds();
}

export function sortByIndex<T extends { index: number }>(a: T, b: T) {
	return a.index - b.index;
}

export function sortById<T extends { id: number }>(a: T, b: T) {
	return a.id - b.id;
}

export function getContentString(nodes: (IElement | IText)[]): string;
export function getContentString(nodes: Prisma.JsonValue): string;

export function getContentString(value: any): string {
	const nodes = value as (IElement | IText)[];

	return nodes.reduce((string, node) => {
		if ('children' in node) {
			return getContentString(node.children) + '\n';
		} else {
			return string + node.text;
		}
	}, '');
}

export function isContentEmpty(nodes: (IElement | IText)[]): boolean;
export function isContentEmpty(nodes: Prisma.JsonValue): boolean;

export function isContentEmpty(value: any): boolean {
	const nodes = value as (IElement | IText)[];

	for (const node of nodes) {
		if ('children' in node) {
			if (!isContentEmpty(node.children)) {
				return false;
			}
		} else if (node.text.trim() !== '') {
			return false;
		}
	}

	return true;
}
