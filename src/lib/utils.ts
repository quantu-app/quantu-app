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

const MAX_INT: number = (Math.pow(2, 31) - 1) | 0;

export function createRandom(seed: number) {
	return function random(): number {
		seed = Math.imul(48271, seed) | 0 % MAX_INT;
		return seed & MAX_INT;
	};
}

export function randomFloat(random: () => number) {
	return random() / MAX_INT;
}

export function randomInRange(random: () => number, min = 0.0, max = 1.0) {
	return min + randomFloat(random) * (max - min);
}

export function shuffle<T>(random: () => number, array: T[]) {
	const length = array.length;
	for (let i = 0; i < length; i++) {
		const randomIndex = i + Math.round(randomInRange(random, 0, length - i - 1)),
			tmp = array[i];

		array[i] = array[randomIndex];
		array[randomIndex] = tmp;
	}
	return array;
}
