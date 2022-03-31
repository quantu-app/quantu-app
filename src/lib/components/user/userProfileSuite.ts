import { create, test, enforce } from 'vest';
import { isAfter, isBefore, subYears, parseISO } from 'date-fns';

export const validate = create((data = {}) => {
    const validUsernameRegex = /^[a-z]+[a-z0-9]+$/;
    const MIN_AGE = 16;

    test("username", "must be at least three characters long", () => {
        enforce(data.username).longerThanOrEquals(3);
    });
    test('username', 'must contain only letters and numbers and cannot start with a number', () => {
        enforce(data.username).matches(validUsernameRegex);
    });

    if (data.birthday) {
        test('birthday', `must be at least ${MIN_AGE} years old`, () => {
            enforce(data.birthday).condition(value => {
                const minAge = subYears(new Date(), MIN_AGE);
                const dob = parseISO(value);

                if (isAfter(dob, minAge)) {
                    return false;
                } else {
                    return true;
                }
            });
        });
        test('birthday', 'nobody lives to be that old', () => {
            enforce(data.birthday).condition(value => {
                const maxAge = subYears(new Date(), 150);
                const dob = parseISO(value);

                if (isBefore(dob, maxAge)) {
                    return false;
                } else {
                    return true;
                }
            })
        })
    }
});
