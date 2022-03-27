import { isUsernameValid, isBirthdayValid } from "./validators";
import { subYears, addDays, addYears } from "date-fns";


describe("validators", () => {
    test("isUsernameValid checks for valid usernames", () => {
        const t = [
            { i: "", o: false },
            { i: "foo123\n", o: false },
            { i: " foo ", o: false },
            { i: "FOO", o: false },
            { i: "1foo", o: false }, // cannot start with a number
            { i: "u", o: false }, // cannot be 1 character long
            { i: "u2", o: true },
        ];
        for (let k = 0; k < t.length; k++) {
            const { i, o } = t[k];
            expect(isUsernameValid(i)).toEqual(o);
        }
    });

    test("isBirthdayValid checks for valid birthdays", () => {
        const now = new Date();
        const t = [
            { i: subYears(now, 12), o: false },
            { i: addDays(subYears(now, 13), 1), o: false },
            { i: subYears(now, 13), o: true }, // 13 years and older are valid
            { i: addYears(now, 151), o: false } // older than 150 cannot be achieved
        ];
        for (let k = 0; k < t.length; k++) {
            const { i, o } = t[k];
            expect(isBirthdayValid(i)).toEqual(o);
        }
    });
});