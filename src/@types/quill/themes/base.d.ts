declare module "quill/themes/base" {
  import Quill, { BoundsStatic } from "quill";
  import Tooltip from "quill/ui/tooltip";

  export default class BaseTooltip extends Tooltip {
    public quill: Quill;
    public root: HTMLElement;
    public textbox: HTMLInputElement;
    public linkRange: { index: number; length: number } | undefined;

    constructor(quill: Quill, bounds: BoundsStatic);

    show(): void;
    hide(): void;
    position(bounds: BoundsStatic): void;
    restoreFocus(): void;
    listen(): void;
    save(): void;
    edit(mode: string, value: string): void;
  }
}
