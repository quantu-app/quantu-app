import { isAfter, isBefore, subYears } from 'date-fns';

export function isUsernameValid(value: string): boolean {
    const usernameRegex = /^[a-z]+[a-z0-9]+$/;

    return usernameRegex.test(value);
}

export function isBirthdayValid(birthday: Date): boolean {
    const minAge = subYears(new Date(), 13);
    const maxAge = subYears(new Date(), 150);

    if (isAfter(birthday, minAge) || isBefore(birthday, maxAge)) {
        return false;
    } else {
        return true;
    }
}