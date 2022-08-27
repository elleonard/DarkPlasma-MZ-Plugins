// DarkPlasma_ManualText 1.4.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/08/27 1.4.1 typescript移行
 * 2022/07/02 1.4.0 マニュアルの行間設定を追加
 * 2022/04/24 1.3.0 公開
 * 2022/03/14 1.2.0 マニュアル設定ごとにrefreshしないように修正
 *                  行間変更に対応
 * 2021/11/20 1.1.0 フォントサイズ変更に対応
 * 2021/10/24 1.0.0 初版
 */

/*:ja
 * @plugindesc ウィンドウに操作説明を表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param linePadding
 * @desc マニュアルの行間を指定します。
 * @text 行間
 * @type number
 * @default 12
 *
 * @help
 * version: 1.4.1
 * ウィンドウ右下に操作説明を表示できるようにします。
 *
 * 本プラグインは単体では機能しません。
 * 本プラグインを必要とする別のプラグインと一緒に利用してください。
 *
 * 開発者向け説明
 * Window_ManualTextMixIn をウィンドウクラスに適用し、
 * drawManual メソッドを適当な場所で呼び出してください。
 *
 * drawManual: () => void
 * 操作説明テキストを描画します。
 *
 * manualX: () => number
 * 操作説明テキストのX座標を返します。
 *
 * manualY: () => number
 * 操作説明テキストのY座標を返します。
 *
 * setManualOffsetY: (number) => void
 * 操作説明テキストのY座標オフセットを設定します。
 *
 * manualOffsetY: () => void
 * 操作説明テキストのY座標オフセットを返します。
 *
 * manualLineHeight: () => number
 * 操作説明テキストの行の高さを返します。
 *
 * setManualPadding: (number) => void
 * 操作説明テキストの行間を設定します。
 *
 * manualPadding: () => number
 * 操作説明テキストの行間を返します。
 *
 * initManualTexts: () => void
 * 操作説明テキストを初期化します。
 *
 * addManualText: (string) => void
 * 操作説明テキストを追加します。
 *
 * manualTexts: () => string[]
 * 操作説明テキスト一覧を返します。
 *
 * setManualFontSize: (number) => void
 * 操作説明テキストのフォントサイズを設定します。
 *
 * manualFontSize: () => number
 * 操作説明テキストのフォントサイズを返します。
 * デフォルトは21
 *
 * isManualVisible: () => boolean
 * 操作説明テキストの可視状態を返します。
 *
 * setIsManualVisible: (boolean) => void
 * 操作説明テキストの可視状態を変更します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    linePadding: Number(pluginParameters.linePadding || 12),
  };

  /**
   * @param {Window_Base.prototype} windowClass
   */
  function Window_ManualTextMixIn(windowClass) {
    windowClass.drawManual = function () {
      if (this.isManualVisible()) {
        this.contents.fontSize = this.manualFontSize();
        this.changeTextColor(ColorManager.textColor(6));
        this.manualTexts().forEach((text, index) => {
          this.drawText(text, this.manualX(), this.manualY(index), this.innerWidth);
        });
        this.resetFontSettings();
      }
    };
    windowClass.manualX = function () {
      const maxWidth = this.manualTexts().reduce((result, text) => Math.max(result, this.textWidth(text)), 0);
      return this.innerWidth - maxWidth;
    };
    windowClass.manualY = function (index) {
      return this.innerHeight - this.manualLineHeight() * (this.manualTexts().length - index) + this.manualOffsetY();
    };
    windowClass.setManualOffsetY = function (offset) {
      this._manualOffsetY = offset;
    };
    windowClass.manualOffsetY = function () {
      return this._manualOffsetY || -settings.linePadding;
    };
    windowClass.manualLineHeight = function () {
      return this.manualFontSize() + this.manualPadding();
    };
    windowClass.setManualPadding = function (padding) {
      this._manualPadding = padding;
    };
    windowClass.manualPadding = function () {
      return this._manualPadding || settings.linePadding;
    };
    windowClass.initManualTexts = function () {
      this._manualTexts = [];
    };
    windowClass.addManualText = function (text) {
      if (!this._manualTexts) {
        this.initManualTexts();
      }
      this._manualTexts.push(text);
    };
    windowClass.manualTexts = function () {
      return this._manualTexts;
    };
    windowClass.setManualFontSize = function (fontSize) {
      this._manualFontSize = fontSize;
    };
    windowClass.manualFontSize = function () {
      if (!this._manualFontSize) {
        this._manualFontSize = 21;
      }
      return this._manualFontSize;
    };
    windowClass.isManualVisible = function () {
      return this._isManualVisible;
    };
    windowClass.setIsManualVisible = function (visible) {
      if (this._isManualVisible !== visible) {
        this._isManualVisible = visible;
        this.refresh();
      }
    };
    const _refresh = windowClass.refresh;
    windowClass.refresh = function () {
      if (_refresh) {
        _refresh.call(this);
      }
      /**
       * drawManualは各利用元から呼び出される
       */
    };
  }
  globalThis.Window_ManualTextMixIn = Window_ManualTextMixIn;
})();
