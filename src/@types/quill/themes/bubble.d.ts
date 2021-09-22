declare module "quill/themes/snow" {
  import Quill, { QuillOptionsStatic } from "quill";
  import Tooltip from "quill/ui/tooltip";
  import BaseTheme from "quill/themes/base";

  export default class SnowTheme extends BaseTheme {
    static DEFAULTS: Record<string, unknown>;

    public quill: Quill;
    public root: HTMLElement;
    public tooltip: Tooltip;
    public options: any;

    constructor(quill: Quill, options: QuillOptionsStatic);

    extendToolbar(toolbar: any): void;
    buildButtons(buttons: NodeList, icons: any): void;
    buildPickers(pickers: NodeList, icons: any): void;
  }
}
