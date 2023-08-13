// DarkPlasma_TextShadow 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/08/13 1.0.0 公開
 */

/*:
 * @plugindesc 文字に影をつける
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param shadows
 * @text 影設定一覧
 * @type struct<Shadow>[]
 *
 * @help
 * version: 1.0.0
 * 制御文字でテキストに影をつけます。
 *
 * \SHADOW[設定ID]
 * プラグインパラメータで設定した設定IDを記述します。
 * 0とした場合、影を描画しないモードにします。
 */
/*~struct~Shadow:
 * @param id
 * @desc 影設定のIDです。制御文字のパラメータとして利用します。
 * @text 設定ID
 * @type number
 * @min 1
 *
 * @param blur
 * @desc 影のぼかしを設定します。
 * @text ぼかし
 * @type number
 * @default 0
 *
 * @param color
 * @desc 影の色を設定します。
 * @text 色
 * @type color
 * @default 0
 *
 * @param offsetX
 * @desc 横方向の影の長さを設定します。
 * @text 横方向の長さ
 * @type number
 * @default 0
 *
 * @param offsetY
 * @desc 縦方向の影の長さを設定します。
 * @text 縦方向の長さ
 * @type number
 * @default 0
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    shadows: JSON.parse(pluginParameters.shadows || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          id: Number(parsed.id || 0),
          blur: Number(parsed.blur || 0),
          color: parsed.color?.startsWith('#') ? String(parsed.color) : Number(parsed.color || 0),
          offsetX: Number(parsed.offsetX || 0),
          offsetY: Number(parsed.offsetY || 0),
        };
      })(e || '{}');
    }),
  };

  function Bitmap_TextShadowMixIn(bitmap) {
    const _drawTextOutline = bitmap._drawTextOutline;
    bitmap._drawTextOutline = function (text, tx, ty, maxWidth) {
      if (this.shadow) {
        this.context.shadowBlur = this.shadow.blur;
        this.context.shadowColor = this.shadow.color;
        this.context.shadowOffsetX = this.shadow.offsetX;
        this.context.shadowOffsetY = this.shadow.offsetY;
      }
      _drawTextOutline.call(this, text, tx, ty, maxWidth);
    };
    bitmap.setTextShadow = function (shadow) {
      this.shadow = shadow;
    };
  }
  Bitmap_TextShadowMixIn(Bitmap.prototype);
  function Window_TextShadowMixIn(windowClass) {
    const _processEscapeCharacter = windowClass.processEscapeCharacter;
    windowClass.processEscapeCharacter = function (code, textState) {
      if (code === 'SHADOW') {
        this.processShadowChange(this.obtainEscapeParam(textState));
      }
      _processEscapeCharacter.call(this, code, textState);
    };
    windowClass.processShadowChange = function (shadowId) {
      if (shadowId === 0) {
        this.resetTextShadow();
      } else {
        const shadowSetting = settings.shadows.find((shadow) => shadow.id === shadowId);
        this.contents.setTextShadow(
          shadowSetting
            ? {
                blur: shadowSetting.blur,
                color:
                  typeof shadowSetting.color === 'string'
                    ? shadowSetting.color
                    : ColorManager.textColor(shadowSetting.color),
                offsetX: shadowSetting.offsetX,
                offsetY: shadowSetting.offsetY,
              }
            : undefined
        );
      }
    };
    windowClass.resetTextShadow = function () {
      this.contents.setTextShadow(undefined);
    };
  }
  Window_TextShadowMixIn(Window_Base.prototype);
})();
