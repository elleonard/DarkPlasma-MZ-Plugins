// DarkPlasma_WindowItemRectOptions 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/08/22 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 選択肢ウィンドウの矩形領域を動的にカスタマイズしやすくする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 以下のインターフェースで選択肢ウィンドウの矩形領域をカスタマイズできます。
 *
 * Window_Selectable.prototype.setItemRectOptions(options: WindowItemRectOptions): void;
 *
 * type WindowItemRectOptions = {
 *   itemWidth?: number;   // 矩形の幅
 *   itemHeight?: number;  // 矩形の高さ
 *   colSpacing?: number;  // 横方向の間隔
 *   rowSpacing?: number;  // 縦方向の間隔
 *   offsetX?: number;     // 横方向オフセット
 *   offsetY?: number;     // 縦方向オフセット
 * };
 */

(() => {
  'use strict';

  function Window_Selectable_ItemRectOptionsMixIn(windowSelectable) {
    windowSelectable.itemRectOptions = function () {
      if (!this._itemRectOptions) {
        return this.defaultItemRectOptions();
      }
      return this._itemRectOptions;
    };
    windowSelectable.defaultItemRectOptions = function () {
      return {};
    };
    windowSelectable.setItemRectOptions = function (position) {
      if (!this._itemRectOptions) {
        this._itemRectOptions = this.defaultItemRectOptions();
      }
      Object.keys(position).forEach((key) => {
        this._itemRectOptions[key] = position[key];
      });
      this.refresh();
    };
    const _itemWidth = windowSelectable.itemWidth;
    windowSelectable.itemWidth = function () {
      return this.itemRectOptions().itemWidth || _itemWidth.call(this);
    };
    const _itemHeight = windowSelectable.itemHeight;
    windowSelectable.itemHeight = function () {
      return this.itemRectOptions().itemHeight || _itemHeight.call(this);
    };
    const _colSpacing = windowSelectable.colSpacing;
    windowSelectable.colSpacing = function () {
      return this.itemRectOptions().colSpacing || _colSpacing.call(this);
    };
    const _rowSpacing = windowSelectable.rowSpacing;
    windowSelectable.rowSpacing = function () {
      return this.itemRectOptions().rowSpacing || _rowSpacing.call(this);
    };
    windowSelectable.itemRectOffsetX = function () {
      return this.itemRectOptions().offsetX || 0;
    };
    windowSelectable.itemRectOffsetY = function () {
      return this.itemRectOptions().offsetY || 0;
    };
    const _itemRect = windowSelectable.itemRect;
    windowSelectable.itemRect = function (index) {
      const rect = _itemRect.call(this, index);
      rect.x += this.itemRectOffsetX();
      rect.y += this.itemRectOffsetY();
      return rect;
    };
  }
  Window_Selectable_ItemRectOptionsMixIn(Window_Selectable.prototype);
})();
