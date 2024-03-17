/// <reference path="../object/labelAndValueText.d.ts" />

import { LabelAndValueText } from "../object/labelAndValueText.js";

export declare class Window_LabelAndValueTexts extends Window_Base {
  initialize(rect: Rectangle): void;
  drawPercent(): void;
  valueWidth(): number;
  labelAndValueTexts(): LabelAndValueText[];
  refresh(): void;
}
