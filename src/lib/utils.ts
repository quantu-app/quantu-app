import { random } from '@aicacia/rand';
import { range } from '@aicacia/range';

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
		typeof value['length'] === 'number' &&
		value['length'] === 0
	);
}

export function isEmpty(value: unknown) {
	return value == null || isEmptyArray(value) || isEmptyObject(value);
}

const MS_IN_SECONDS = 1000 * 60,
	MS_IN_HOUR = MS_IN_SECONDS * 60,
	MS_IN_DAY = MS_IN_HOUR * 24,
	MS_IN_WEEK = MS_IN_DAY * 7,
	MS_IN_MONTH = MS_IN_WEEK * 4,
	MS_IN_YEAR = MS_IN_MONTH * 12;

export function nowOffset(date: Date) {
	const today = new Date(),
		diff = +today - +date;

	if (diff < MS_IN_HOUR) {
		return `${(diff / MS_IN_SECONDS) | 0} minute(s) ago`;
	} else if (diff < MS_IN_DAY) {
		return `${(diff / MS_IN_HOUR) | 0} hour(s) ago`;
	} else if (diff < MS_IN_WEEK) {
		return `${(diff / MS_IN_DAY) | 0} day(s) ago`;
	} else if (diff < MS_IN_MONTH) {
		return `${(diff / MS_IN_WEEK) | 0} week(s) ago`;
	} else if (diff < MS_IN_YEAR) {
		return `${(diff / MS_IN_MONTH) | 0} month(s) ago`;
	} else {
		return `${(diff / MS_IN_YEAR) | 0} year(s) ago`;
	}
}

export function toPercent(value: number): string {
	const percent = value * 100;

	if (percent % 1 === 0) {
		return `${percent}%`;
	} else {
		return `${percent.toFixed(2)}%`;
	}
}

export function sortById(a: { id: number }, b: { id: number }) {
	return a.id - b.id;
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

export function convertToUrlSafe(value: string): string {
	/**
	 * Converts a string to a value which can safely be sent and read in the url bar of browsers.
	 *
	 * @remarks
	 * This method trims off beginning and ending space,
	 * converts remaining space to a single character, deletes everything not a-z0-9,
	 * and finally lowercases the resultant value
	 */
	return value
		.trim()
		.replace(/\s\s+/g, ' ')
		.replace(/[^a-z0-9]/gi, '')
		.toLowerCase();
}

export function isUrlSafe(value: string): boolean {
	// is an empty string url safe?
	return /^[a-zA-Z0-9_-]+$/.test(value);
}

export function readFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = async (e) => {
			resolve(e.target.result as ArrayBuffer);
		};
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});
}
