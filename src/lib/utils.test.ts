import { convertToUrlSafe, isUrlSafe } from "./utils";


describe("convertToUrl", () => {
    test("removes unsafe characters when converting a string to a url", () => {

        const t = [
            { o: "hello world 123   ", e: "helloworld123" },
            { o: "Märchen von den Gebrüdern Grimm", e: "mrchenvondengebrderngrimm" },
            { o: "#@$%#@%&$^#&%^*$&(:", e: "" },
            { o: "<script>alert('foobar');</script>", e: "scriptalertfoobarscript" },
            { o: "今日は晴れです。", e: "" }
        ];

        for (let i = 0; i < t.length; i++) {
            const { o, e } = t[i];
            expect(convertToUrlSafe(o)).toEqual(e);
        }
    });
});

describe("isUrlSafe", () => {
    test("returns true when a string is urlsafe, false otherwise", () => {
        const t = [
            { o: "hello world 123   ", e: false },
            { o: "Märchen von den Gebrüdern Grimm", e: false },
            { o: "#@$%#@%&$^#&%^*$&(:", e: false },
            { o: "<script>alert('foobar');</script>", e: false },
            { o: "今日は晴れです。", e: false },
            { o: "this-is-a-nice-url", e: true },
            { o: "-may-the-force-be---with----you-", e: true },
        ];

        for (let i = 0; i < t.length; i++) {
            const { o, e } = t[i];
            expect(isUrlSafe(o)).toEqual(e);
        }
    })
})