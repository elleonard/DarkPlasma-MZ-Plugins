/// <reference path="../../../typings/rmmz.d.ts" />

type TextWithPartialColor = {
  plainText: string;
  parts: { text: normalText, color?: string }[];
};

declare interface Bitmap {
  drawTextWithPartialColor(text: string, x: number, y: number, maxWidth?: number, lineHeight: number, align?: CanvasTextAlign): void;
  _drawTextBodyWithPartialColor(textWithPartialColor: TextWithPartialColor, tx: number, ty: number, maxWidth?: number): void;
  _parseTextForPartialColor(text: string): TextWithPartialColor;
}
