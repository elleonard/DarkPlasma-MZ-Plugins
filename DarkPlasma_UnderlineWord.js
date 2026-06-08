// DarkPlasma_UnderlineWord 1.1.1
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/06/08 1.1.1 下線の色が想定外の値になる不具合を修正
 * 2026/06/07 1.1.0 下線を引く対象を追加するインターフェースを追加
 *            1.0.0 公開
 */

/*:
 * @plugindesc 指定した語句に下線を引く
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_DrawLine
 *
 * @param underlineGroups
 * @desc 下線を引く語句と下線の色・太さを設定します。
 * @text 語句と下線設定
 * @type struct<UnderlineGroup>[]
 * @default []
 *
 * @param targetWindows
 * @desc 自動下線の対象となるウィンドウクラスを指定します。
 * @text 対象ウィンドウ
 * @type string[]
 * @default ["Window_Message"]
 *
 * @help
 * version: 1.1.1
 * 指定した語句に下線を自動で描画します。
 *
 * プラグインパラメータで語句と下線の色・太さを設定してください。
 * 指定したウィンドウで表示されるテキスト内の語句に下線が描画されます。
 *
 * drawTextEx方式（メッセージウィンドウなど）の部分一致に対応しています。
 *
 * 下記の記法を使用し、手動で下線を引くこともできます。
 * \UL[色,線幅]下線を引く\UL[]
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_DrawLine version:1.0.0
 */
/*~struct~UnderlineGroup:
 * @param title
 * @desc 設定の管理用の名前を指定します。わかりやすい名前をつけてください。
 * @text 名前
 * @type string
 *
 * @param color
 * @desc 下線の色を指定します。#から始まるカラーコードも指定可能です。
 * @text 下線色
 * @type color
 * @default 0
 *
 * @param lineWidth
 * @desc 下線の太さをピクセル数で指定します。
 * @text 下線の太さ
 * @type number
 * @max 10
 * @min 1
 * @default 2
 *
 * @param texts
 * @desc 下線を引きたい語句を指定します。
 * @text 語句
 * @type string[]
 * @default []
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    underlineGroups: pluginParameters.underlineGroups
      ? JSON.parse(pluginParameters.underlineGroups).map((e) => {
          return e
            ? ((parameter) => {
                const parsed = JSON.parse(parameter);
                return {
                  title: String(parsed.title || ``),
                  color: parsed.color?.startsWith('#') ? String(parsed.color) : Number(parsed.color || 0),
                  lineWidth: Number(parsed.lineWidth || 2),
                  texts: parsed.texts
                    ? JSON.parse(parsed.texts).map((e) => {
                        return String(e || ``);
                      })
                    : [],
                };
              })(e)
            : { title: '', color: 0, lineWidth: 2, texts: [] };
        })
      : [],
    targetWindows: pluginParameters.targetWindows
      ? JSON.parse(pluginParameters.targetWindows).map((e) => {
          return String(e || ``);
        })
      : ['Window_Message'],
  };

  function ColorManagerMixIn(colorManager) {
    colorManager.convertColorParameter = function (colorParameter) {
      return typeof colorParameter === 'string' ? colorParameter : this.textColor(colorParameter);
    };
  }

  function regExpEscape(text) {
    return text.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  ColorManagerMixIn(ColorManager);
  class UnderlineWordEntry {
    constructor(word, color, lineWidth) {
      this._word = word;
      this._color = color;
      this._lineWidth = lineWidth;
    }
    get word() {
      return this._word;
    }
    get color() {
      return ColorManager.convertColorParameter(this._color);
    }
    get lineWidth() {
      return this._lineWidth;
    }
  }
  class UnderlineWords {
    constructor() {
      this._entries = [];
      this._sortedWords = null;
      this._colorInfoCache = {};
      this._needsRefreshCache = false;
    }
    add(entry) {
      this._entries.push(entry);
      this._needsRefreshCache = true;
    }
    sortedWords() {
      if (!this._sortedWords || this._needsRefreshCache) {
        this.refreshCache();
      }
      return this._sortedWords || [];
    }
    refreshCache() {
      this._sortedWords = this._entries.map((e) => e.word).sort((a, b) => b.length - a.length);
      this._colorInfoCache = {};
      this._entries.forEach((e) => {
        this._colorInfoCache[e.word] = { color: e.color, lineWidth: e.lineWidth };
      });
      this._needsRefreshCache = false;
    }
    findColorInfoByWord(word) {
      if (!this._colorInfoCache || this._needsRefreshCache) {
        this.refreshCache();
      }
      return this._colorInfoCache[word];
    }
    getRegExp() {
      return new RegExp(
        `(${this.sortedWords()
          .map((word) => regExpEscape(word))
          .join('|')})`,
        'g',
      );
    }
    underlineText(text) {
      if (this.sortedWords().length === 0) {
        return text;
      }
      return text.replace(this.getRegExp(), (match) => {
        const info = this.findColorInfoByWord(match);
        return `\x1bUL[${info?.color ?? 0},${info?.lineWidth ?? 1}]${match}\x1bUL[]`;
      });
    }
  }
  const underlineWords = new UnderlineWords();
  function Scene_Boot_UnderlineWordMixIn(sceneBoot) {
    sceneBoot.addUnderlineWordEntry = function (word, color, lineWidth) {
      underlineWords.add(new UnderlineWordEntry(word, color, lineWidth));
    };
    const _start = sceneBoot.start;
    sceneBoot.start = function () {
      _start.call(this);
      settings.underlineGroups.forEach((group) => {
        group.texts.forEach((text) => {
          if (text) {
            this.addUnderlineWordEntry(text, group.color, group.lineWidth);
          }
        });
      });
    };
  }
  Scene_Boot_UnderlineWordMixIn(Scene_Boot.prototype);
  function Window_UnderlineWordMixIn(windowBase) {
    const _convertEscapeCharacters = windowBase.convertEscapeCharacters;
    windowBase.convertEscapeCharacters = function (text) {
      text = _convertEscapeCharacters.call(this, text);
      if (this.isUnderlineWindow()) {
        return underlineWords.underlineText(text);
      }
      return text;
    };
    const _processNewLine = windowBase.processNewLine;
    windowBase.processNewLine = function (textState) {
      if (textState.underlineColor) {
        this.drawUnderline(textState);
      }
      _processNewLine.call(this, textState);
      if (textState.underlineColor) {
        textState.underlineStartX = textState.x;
      }
    };
    const _processEscapeCharacter = windowBase.processEscapeCharacter;
    windowBase.processEscapeCharacter = function (code, textState) {
      if (code === 'UL') {
        const regExp = /^\[([^\]]*)\]/;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
          textState.index += arr[0].length;
          if (arr[1]) {
            const [color, lineWidth] = arr[1].split(',');
            textState.underlineColor = color;
            textState.underlineLineWidth = Number(lineWidth);
            textState.underlineStartX = textState.x;
          } else if (textState.underlineColor) {
            this.drawUnderline(textState);
            textState.underlineColor = null;
          }
        }
        return;
      }
      _processEscapeCharacter.call(this, code, textState);
    };
    windowBase.drawUnderline = function (textState) {
      const lineWidth = textState.underlineLineWidth ?? 1;
      const underlineY = textState.y + this.lineHeight() - lineWidth;
      this.contents.drawLine(
        textState.underlineStartX ?? textState.x,
        underlineY,
        textState.x,
        underlineY,
        lineWidth,
        textState.underlineColor,
      );
    };
    windowBase.isUnderlineWindow = function () {
      return settings.targetWindows.some((targetWindow) => this.constructor.name === targetWindow);
    };
  }
  Window_UnderlineWordMixIn(Window_Base.prototype);
})();
