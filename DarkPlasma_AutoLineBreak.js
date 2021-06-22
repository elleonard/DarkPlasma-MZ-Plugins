// DarkPlasma_AutoLineBreak 1.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/06/22 1.0.2 名前ウィンドウの表示が崩れる不具合を修正
 *            1.0.1 サブフォルダからの読み込みに対応
 * 2020/12/13 1.0.0 公開
 */

/*:ja
 * @plugindesc ウィンドウ幅を超える日本語文章を自動で折り返す
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param prohibitLineBreakBefore
 * @desc 行頭に表示してはならない文字
 * @text 行頭禁則文字
 * @type string
 * @default ,)]｝、〕〉》」』】〙〗〟’”｠»ゝゞーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇷ゚ㇺㇻㇼㇽㇾㇿ々〻‐゠–〜～?!‼⁇⁈⁉・:;/。.
 *
 * @param prohibitLineBreakAfter
 * @desc 行末に表示してはならない文字
 * @text 行末禁則文字
 * @type string
 * @default ([｛〔〈《「『【〘〖〝‘“｟«
 *
 * @param ignoreAutoLineBreakWindows
 * @desc 自動改行しないウィンドウ一覧
 * @text 自動改行無効ウィンドウ
 * @type string[]
 * @default []
 *
 * @param lineWidthMargin
 * @desc 行幅のマージン。禁則文字用に余裕を持たせるための幅
 * @text 行幅のマージン
 * @type number
 * @default 4
 *
 * @help
 * version: 1.0.2
 * ウィンドウ幅を超えるような文字列を自動で改行します。
 *
 * 以下の法則でゆるふわ禁則処理します。
 * - 行頭禁則文字はぶら下げによる処理を行います。
 * - 行末禁則文字は追い出しによる処理を行います。
 * - 行末禁則文字が連続する場合をサポートしません。
 *   （行末禁則文字が連続した場合、行末に対象の文字が表示されることがあります）
 * - 行頭行末揃えを行いません。（必ずしも各行の行頭と行末が一直線に揃いません）
 * - 分離禁則を適用しません。（英単語や連数字の途中で改行されることがあります）
 */

(() => {
  'use strict';

  const pluginName = decodeURIComponent(document.currentScript.src.match(/^.*\/plugins\/(.*)\.js$/)[1]);

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    prohibitLineBreakBefore: String(
      pluginParameters.prohibitLineBreakBefore ||
        ',)]｝、〕〉》」』】〙〗〟’”｠»ゝゞーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇷ゚ㇺㇻㇼㇽㇾㇿ々〻‐゠–〜～?!‼⁇⁈⁉・:;/。.'
    ),
    prohibitLineBreakAfter: String(pluginParameters.prohibitLineBreakAfter || '([｛〔〈《「『【〘〖〝‘“｟«'),
    ignoreAutoLineBreakWindows: JSON.parse(pluginParameters.ignoreAutoLineBreakWindows || '[]').map((e) => {
      return String(e || '');
    }),
    lineWidthMargin: Number(pluginParameters.lineWidthMargin || 4),
  };

  /**
   * 自動折返しが無効なウィンドウであるかどうか
   * @return {boolean}
   */
  Window_Base.prototype.isIgnoreAutoLineBreakWindow = function () {
    return settings.ignoreAutoLineBreakWindows.includes(this.constructor.name);
  };

  /**
   * 自動折返しが有効かどうか
   * @return {boolean}
   */
  Window_Base.prototype.isAutoLineBreakEnabled = function () {
    if (this.isIgnoreAutoLineBreakWindow()) {
      return false;
    }
    return true;
  };

  const _Window_Base_processCharacter = Window_Base.prototype.processCharacter;
  Window_Base.prototype.processCharacter = function (textState) {
    if (this.shouldLineBreakHere(textState)) {
      this.flushTextState(textState);
      this.processNewLine(textState);
    }
    if (textState.text[textState.index].charCodeAt(0) >= 0x20) {
      textState.lineBuffer += textState.text[textState.index];
    }
    _Window_Base_processCharacter.call(this, textState);
  };

  const _Window_Base_processNewLine = Window_Base.prototype.processNewLine;
  Window_Base.prototype.processNewLine = function (textState) {
    _Window_Base_processNewLine.call(this, textState);
    textState.lineBuffer = this.createTextBuffer(textState.rtl);
  };

  const _Window_Base_createTextState = Window_Base.prototype.createTextState;
  Window_Base.prototype.createTextState = function (text, x, y, width) {
    const textState = _Window_Base_createTextState.call(this, text, x, y, width);
    textState.lineBuffer = textState.buffer;
    return textState;
  };

  const _Window_Base_flushTextState = Window_Base.prototype.flushTextState;
  Window_Base.prototype.flushTextState = function (textState) {
    _Window_Base_flushTextState.call(this, textState);
    textState.lineBuffer = textState.buffer;
  };

  /**
   * 自動改行すべき状態であるかどうか
   * @param {Window_Base.TextState} textState
   * @return {boolean}
   */
  Window_Base.prototype.shouldLineBreakHere = function (textState) {
    if (!textState || textState.index === 0 || !textState.text[textState.index] || !this.isAutoLineBreakEnabled()) {
      return false;
    }
    let nextCharacter = textState.text[textState.index];
    if (this.isSurrogatePair(nextCharacter)) {
      this._surrogatePairBuffer = nextCharacter;
      return false;
    }
    if (this._surrogatePairBuffer) {
      nextCharacter = this._surrogatePairBuffer + nextCharacter;
      this._surrogatePairBuffer = null;
    }
    const size = this.textWidth(`${textState.lineBuffer}${nextCharacter}`);
    if (size + textState.x > this.lineWidth()) {
      return !this.isProhibitLineBreakBefore(nextCharacter);
    }
    // 行末禁則チェック
    let targetIndex = textState.index + 1;
    if (!textState.text[targetIndex]) {
      return false;
    }
    if (this.isSurrogatePair(textState.text[targetIndex])) {
      targetIndex++;
    }
    const next2Character = textState.text.substring(textState.index + 1, targetIndex + 1);
    if (this.textWidth(`${textState.lineBuffer}${nextCharacter}${next2Character}`) + textState.x > this.lineWidth()) {
      return this.isProhibitLineBreakAfter(nextCharacter);
    }
    return false;
  };

  Window_Base.prototype.isSurrogatePair = function (character) {
    return character.charCodeAt(0) >= 0xdc00 && character.charCodeAt(0) <= 0xdfff;
  };

  /**
   * 行末禁則文字かどうか
   * @param {string} character
   * @return {boolean}
   */
  Window_Base.prototype.isProhibitLineBreakBefore = function (character) {
    return settings.prohibitLineBreakBefore.includes(character);
  };

  /**
   * 行頭禁則文字かどうか
   * @param {string} character
   * @return {boolean}
   */
  Window_Base.prototype.isProhibitLineBreakAfter = function (character) {
    return settings.prohibitLineBreakAfter.includes(character);
  };

  /**
   * 折返し幅
   * @return {number}
   */
  Window_Base.prototype.lineWidth = function () {
    return this.contentsWidth() - settings.lineWidthMargin;
  };

  /**
   * Window_ChoiceList は選択肢幅によってウィンドウサイズが変わる
   * そのため、自動折返しの対象外とする
   * @return {boolean}
   */
  Window_ChoiceList.prototype.isAutoLineBreakEnabled = function () {
    return false;
  };

  /**
   * Window_NameBox は名前の幅によってウィンドウサイズが変わる
   * そのため、自動折返しの対象外とする
   * @return {boolean}
   */
  Window_NameBox.prototype.isAutoLineBreakEnabled = function () {
    return false;
  };

  const _Window_BattleLog_initialize = Window_BattleLog.prototype.initialize;
  Window_BattleLog.prototype.initialize = function () {
    /**
     * 各テキストの改行の数
     * @type {number[]}
     */
    this._newLines = [];
    _Window_BattleLog_initialize.apply(this, arguments);
  };

  const _Window_BattleLog_clear = Window_BattleLog.prototype.clear;
  Window_BattleLog.prototype.clear = function () {
    _Window_BattleLog_clear.call(this);
    this._newLines = [];
  };

  const _Window_BattleLog_refresh = Window_BattleLog.prototype.refresh;
  Window_BattleLog.prototype.refresh = function () {
    this._lines.forEach((text, index) => {
      this._newLines[index] = 0;
      this.textSizeEx(text);
    });
    _Window_BattleLog_refresh.call(this);
  };

  const _Window_BattleLog_addText = Window_BattleLog.prototype.addText;
  Window_BattleLog.prototype.addText = function (text) {
    this._newLines.push(0);
    _Window_BattleLog_addText.call(this, text);
  };

  const _Window_BattleLog_numLines = Window_BattleLog.prototype.numLines;
  Window_BattleLog.prototype.numLines = function () {
    return _Window_BattleLog_numLines.call(this) + this._newLines.reduce((prev, current) => prev + current, 0);
  };

  const _Window_BattleLog_drawLineText = Window_BattleLog.prototype.drawLineText;
  Window_BattleLog.prototype.drawLineText = function (index) {
    /**
     * 描画中のindex
     * @type {number}
     */
    this._currentIndex = index;
    _Window_BattleLog_drawLineText.call(this, index);
  };

  const _Window_BattleLog_processNewLine = Window_BattleLog.prototype.processNewLine;
  Window_BattleLog.prototype.processNewLine = function (textState) {
    _Window_BattleLog_processNewLine.call(this, textState);
    if (!textState.drawing) {
      this._newLines[this._currentIndex]++;
    }
  };

  const _Window_BattleLog_lineRect = Window_BattleLog.prototype.lineRect;
  Window_BattleLog.prototype.lineRect = function (index) {
    const rect = _Window_BattleLog_lineRect.call(this, index);
    rect.y += this._newLines.slice(0, index).reduce((prev, current) => prev + current, 0) * this.lineHeight();
    return rect;
  };
})();
