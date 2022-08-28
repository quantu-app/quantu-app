import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, test } from "vitest";
import Checkbox from "./Checkbox.svelte";

describe("Test Checkbox", () => {

    test("renders rounded unchecked and enabled by default", () => {
        const { container } = render(Checkbox, {});

        const checkbox = container.querySelector("input[type='checkbox']") as HTMLInputElement;

        expect(checkbox).toBeInTheDocument();
        expect(checkbox.checked).toBe(false);
        expect(checkbox).toHaveClass("rounded-circle");
    });

    test("clicking on the checkbox calles onChange and sets the checkbox to checked", async () => {
        let counter = 0;
        const customOnChange = () => counter += 1;
        const { container } = render(Checkbox, { props: { onChange: customOnChange } });
        const checkbox = container.querySelector("input[type='checkbox']") as HTMLInputElement;

        await fireEvent.click(checkbox);
        expect(counter).toBe(1);
        expect(checkbox.checked).toBe(true);
    });

});