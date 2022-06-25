import { create, test, enforce, only, warn } from 'vest';
import { isAfter, isBefore, subYears, parseISO } from 'date-fns';

export interface IUserProfile {
	username: string;
	firstName: string;
	lastName: string;
	birthday: Date;
	country: string;
}

export const validUsernameRegex = /^[a-z]+[a-z0-9]+$/;
export const MIN_AGE = 16;

export const validate = create(
	'user_edit_profile_form',
	(data: Partial<IUserProfile> = {}, fieldname?) => {
		if (fieldname) {
			only(fieldname);
		}

		test('username', 'is not empty or blank', () => {
			enforce(data.username).isNotEmpty().isNotBlank();
		});

		test('username', 'must contain only letters and numbers and cannot start with a number', () => {
			enforce(data.username).matches(validUsernameRegex);
		});

		test('username', 'must be at least three characters long', () => {
			enforce(data.username).longerThanOrEquals(3);
		});

		test('firstName', 'is not empty or blank', () => {
			enforce(data.firstName).isNotEmpty().isNotBlank();
		});

		test('lastName', 'is not empty or blank', () => {
			enforce(data.lastName).isNotEmpty().isNotBlank();
		});

		test('birthday', `must be at least ${MIN_AGE} years old`, () => {
			enforce(data.birthday).condition((value) => {
				const minAge = subYears(new Date(), MIN_AGE);

				if (isAfter(value, minAge)) {
					return false;
				} else {
					return true;
				}
			});
		});
		test('birthday', 'nobody lives to be that old', () => {
			enforce(data.birthday).condition((value) => {
				const maxAge = subYears(new Date(), 150);

				if (isBefore(value, maxAge)) {
					return false;
				} else {
					return true;
				}
			});
		});
	}
);
