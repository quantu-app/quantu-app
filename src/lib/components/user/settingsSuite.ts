import { create, test, enforce, only } from 'vest';

export interface ISettingsState {
	lang: string;
}

export const settingsSuite = create(
	'settings',
	(data: Partial<ISettingsState> = {}, fieldname?: keyof ISettingsState) => {
		if (fieldname) {
			only(fieldname);
		}

		test('lang', 'is empty or blank', () => {
			enforce(data.lang).isNotBlank();
		});
	}
);
