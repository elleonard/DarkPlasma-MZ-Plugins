/// <reference path="../../../typings/rmmz.d.ts" />

type WindowItemRectOptions = {
  itemWidth?: number;
  itemHeight?: number;
  colSpacing?: number;
  rowSpacing?: number;
  offsetX?: number;
  offsetY?: number;
};

declare interface Window_Selectable {
  _itemRectOptions?: WindowItemRectOptions;

  setItemRectOptions(options: WindowItemRectOptions): void;
  itemRectOptions(): WindowItemRectOptions;
  defaultItemRectOptions(): WindowItemRectOptions;

  itemRectOffsetX(): number;
  itemRectOffsetY(): number;
}
