import { LabelAndValueText } from "../object/labelAndValueText";

export declare class Window_LabelAndValueTexts extends Window_Base {
  initialize(rect: Rectangle): void;
  drawPercent(): void;
  valueWidth(): number;
  labelAndValueTexts(): LabelAndValueText[];
  refresh(): void;
}
