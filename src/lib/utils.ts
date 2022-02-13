import { random } from '@aicacia/rand';
import { range } from '@aicacia/range';
import type { Channel } from 'phoenix';
import type { Lesson, Quiz } from '$lib/api/quantu-app-api';

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

export function channelPush(
	channel: Channel,
	event: string,
	payload: any,
	timeout?: number
): Promise<void> {
	return new Promise((resolve, reject) =>
		channel.push(event, payload, timeout).receive('ok', resolve).receive('error', reject)
	);
}

export function childTypePath(type: Lesson['type'] | Quiz['type']): string {
	switch (type) {
		case 'quiz':
			return 'quizzes';
		case 'lesson':
			return 'lessons';
	}
}

export function organizationPath(
	organizationId: number,
	courseId?: number,
	unitId?: number,
	childId?: number,
	childType?: Lesson['type'] | Quiz['type']
): string {
	let path = `/user/organizations/${organizationId}`;

	if (courseId) {
		path += `/courses/${courseId}`;
	}
	if (unitId) {
		path += `/units/${unitId}`;
	}
	if (childId && childType) {
		path += `/${childTypePath(childType)}/${childId}`;
	}

	return path;
}
