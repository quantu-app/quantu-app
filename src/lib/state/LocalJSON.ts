import { v4 } from 'uuid';
import localforage from 'localforage';

export class LocalJSON<T> {
	private regex: RegExp;
	protected table: string;

	constructor(table: string) {
		this.table = table;
		this.regex = new RegExp(`\\b${table}\\b/(.*)`);
	}

	async getKeys() {
		const fullKeys = await localforage.keys(),
			keys: string[] = [];

		for (const fullKey of fullKeys) {
			const match = fullKey.match(this.regex);
			if (match) {
				keys.push(match[1]);
			}
		}

		return keys;
	}

	async createTableId() {
		const keys = new Set(await this.getKeys());
		let key = v4();
		while (keys.has(key)) {
			key = v4();
		}
		return key;
	}

	all(filter: (value: T, key: string) => boolean = () => true) {
		const records: Record<string, T> = {};

		return new Promise<Record<string, T>>((resolve) =>
			localforage.iterate(
				(json: string, fullKey) => {
					const match = fullKey.match(this.regex);
					if (match) {
						const key = match[1],
							value = this.valueFromJSON(json);
						if (filter(value, key)) {
							records[key] = value;
						}
					}
				},
				(error) => {
					if (error) {
						console.error(error);
						return records;
					} else {
						resolve(records);
					}
				}
			)
		);
	}

	async get(key: string) {
		const json = await localforage.getItem<string>(`${this.table}/${key}`);
		return this.valueFromJSON(json);
	}

	async set(key: string, value: T) {
		await localforage.setItem(`${this.table}/${key}`, this.valueToJSON(value));
	}

	async batch(values: Array<[string, T]>) {
		await Promise.all(values.map(([key, value]) => this.set(key, value)));
	}

	async remove(key: string) {
		await localforage.removeItem(`${this.table}/${key}`);
	}

	valueToJSON(value: T): string {
		return JSON.stringify(value);
	}
	valueFromJSON(json: string): T {
		return JSON.parse(json);
	}
}
