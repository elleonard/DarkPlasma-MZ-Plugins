// DarkPlasma_AutoHighlight 2.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/06/02 2.0.0 色設定をMZ1.6.0形式に変更
 *                  ベースプラグインを追加
 *                  TypeScript移行
 * 2022/06/08 1.0.1 対象ウィンドウのクラス名がグローバルに展開されていなくても有効にする
 * 2022/01/02 1.0.0 公開
 */

/*:
 * @plugindesc 指定した語句に自動で色をつける
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_SetColorByCode
 *
 * @param highlightGroups
 * @desc ハイライトする際の色と語句を設定します。
 * @text 色と語句
 * @type struct<HighlightGroup>[]
 * @default []
 *
 * @param targetWindows
 * @desc 自動ハイライトの対象となるウィンドウクラスを指定します。
 * @text 対象ウィンドウ
 * @type string[]
 * @default ["Window_Message"]
 *
 * @help
 * version: 2.0.0
 * 指定した語句を指定した色でハイライトします。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_SetColorByCode version:1.0.0
 */
/*~struct~HighlightGroup:
 * @param title
 * @desc 色と語句設定の管理用の名前を指定します。わかりやすい名前をつけてください。
 * @text 名前
 * @type string
 *
 * @param color
 * @desc 色を指定します。#から始まるカラーコードも指定可能です。
 * @text 色
 * @type color
 *
 * @param texts
 * @desc ハイライトしたい語句を指定します。
 * @text 語句
 * @type string[]
 * @default []
 *
 * @param skills
 * @desc 名前をハイライトしたいスキルを指定します。
 * @text スキル
 * @type skill[]
 * @default []
 *
 * @param items
 * @desc 名前をハイライトしたいアイテムを指定します。
 * @text アイテム
 * @type item[]
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
    highlightGroups: JSON.parse(pluginParameters.highlightGroups || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          title: String(parsed.title || ``),
          color: parsed.color?.startsWith('#') ? String(parsed.color) : Number(parsed.color || 0),
          texts: JSON.parse(parsed.texts || '[]').map((e) => {
            return String(e || ``);
          }),
          skills: JSON.parse(parsed.skills || '[]').map((e) => {
            return Number(e || 0);
          }),
          items: JSON.parse(parsed.items || '[]').map((e) => {
            return Number(e || 0);
          }),
        };
      })(e || '{}');
    }),
    targetWindows: JSON.parse(pluginParameters.targetWindows || '["Window_Message"]').map((e) => {
      return String(e || ``);
    }),
  };

  function ColorManagerMixIn(colorManager) {
    colorManager.convertColorParameter = function (colorParameter) {
      return typeof colorParameter === 'string' ? colorParameter : this.textColor(colorParameter);
    };
  }

  ColorManagerMixIn(ColorManager);
  class HighlightWords {
    constructor() {
      this._highlightWords = [];
      this._sortedWords = null;
      this._colors = {};
      this._needsRefreshCache = false;
    }
    getRegExp() {
      return new RegExp(`(${this.sortedWords().join('|')})`, 'gi');
    }
    /**
     * 長さ順にソートしたハイライト語句一覧
     */
    sortedWords() {
      if (!this._sortedWords || this._needsRefreshCache) {
        this.refreshCache();
      }
      return this._sortedWords || [];
    }
    /**
     * @param {HighlightWord} highlightWord ハイライトする語句と色
     */
    add(highlightWord) {
      this._highlightWords.push(highlightWord);
      this._needsRefreshCache = true;
    }
    refreshCache() {
      /**
       * 毎度ソートするのはパフォーマンス的に許容できないため、キャッシュする
       */
      this._sortedWords = this._highlightWords.map((word) => word.word).sort((a, b) => b.length - a.length);
      this._colors = {};
      /**
       * パフォーマンスに気を使い、ランダムアクセスできるようにキャッシュする
       */
      this._highlightWords.forEach((highlightWord) => {
        this._colors[highlightWord.word] = highlightWord.color;
      });
      this._needsRefreshCache = false;
    }
    /**
     * ハイライト色を返す
     * @param {string} word ハイライトする語句
     * @return {string|number}
     */
    findColorByWord(word) {
      if (!this._colors) {
        this.refreshCache();
      }
      return this._colors[word];
    }
    /**
     * テキスト内の指定語句をハイライトして返す
     * @param {string} text ハイライト対象テキスト
     * @return {string}
     */
    highlightText(text) {
      return text.replace(this.getRegExp(), (match) => {
        return `\x1bC[${this.findColorByWord(match)}]${match}\x1bC[0]`;
      });
    }
  }
  class HighlightWord {
    constructor(word, color) {
      this._word = word;
      this._color = color;
    }
    get word() {
      return this._word;
    }
    get color() {
      return ColorManager.convertColorParameter(this._color);
    }
  }
  const highlightWords = new HighlightWords();
  /**
   * @param {Scene_Boot.prototype} sceneBoot
   */
  function Scene_Boot_AutoHighlightMixIn(sceneBoot) {
    const _start = sceneBoot.start;
    sceneBoot.start = function () {
      _start.call(this);
      /**
       * データベースのロードが完了しているので、ハイライトテキストを設定する。
       */
      settings.highlightGroups.forEach((highlightGroup) => {
        highlightGroup.texts.forEach((text) => {
          if (text) {
            highlightWords.add(new HighlightWord(text, highlightGroup.color));
          }
        });
        highlightGroup.skills.forEach((skillId) => {
          const skillName = $dataSkills[skillId].name;
          if (skillName) {
            highlightWords.add(new HighlightWord(skillName, highlightGroup.color));
          }
        });
        highlightGroup.items.forEach((itemId) => {
          const itemName = $dataItems[itemId].name;
          if (itemName) {
            highlightWords.add(new HighlightWord(itemName, highlightGroup.color));
          }
        });
      });
    };
  }
  Scene_Boot_AutoHighlightMixIn(Scene_Boot.prototype);
  function Window_AutoHighlightMixIn(windowClass) {
    const _convertEscapeCharacters = windowClass.convertEscapeCharacters;
    windowClass.convertEscapeCharacters = function (text) {
      text = _convertEscapeCharacters.call(this, text);
      if (this.isHighlightWindow()) {
        return highlightWords.highlightText(text);
      }
      return text;
    };
    windowClass.isHighlightWindow = function () {
      return settings.targetWindows.some((targetWindow) => this.constructor.name === targetWindow);
    };
  }
  Window_AutoHighlightMixIn(Window_Base.prototype);
})();
