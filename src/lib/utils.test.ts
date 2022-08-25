import { convertToUrlSafe, isUrlSafe } from "./utils";


describe("convertToUrl", () => {
    test("removes unsafe characters when converting a string to a url", () => {

        const t = [
            { o: "hello world 123   ", e: "hello-world-123" },
            { o: "Märchen von den Gebrüdern Grimm", e: "mrchen-von-den-gebrdern-grimm" },
            { o: "#@$%#@%&$^#&%^*$&(:", e: "" },
            { o: "<script>alert('foobar');</script>", e: "scriptalertfoobarscript" },
            { o: "今日は晴れです。", e: "" }
        ];

        for (let i = 0; i < t.length; i++) {
            const { o, e } = t[i];
            expect(convertToUrlSafe(o)).toEqual(e);
        }
    });

    test("allows setting a either '-' or '_' to replace whitespace, anything !a-z0-9_- is removed", () => {
        const t = [
            { o: "Hello World", e: "hello_world", ch: "_" },
            { o: "Hello World 2", e: "hello-world-2", ch: "-" },
            { o: "Hello World 3", e: "helloworld3", ch: "$" }
        ];

        for (let i = 0; i < t.length; i++) {
            const { o, e, ch } = t[i];
            expect(convertToUrlSafe(o, ch)).toEqual(e);
        }
    })
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