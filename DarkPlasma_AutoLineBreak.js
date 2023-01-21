// DarkPlasma_AutoLineBreak 1.3.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/01/21 1.3.0 typescript移行
 *                  単語ベースの自動改行をサポート
 *                  英語ヘルプを追加
 * 2022/04/19 1.2.1 文字列の長さ次第で二重改行される不具合を修正
 * 2022/01/07 1.2.0 行幅マージンを取得するメソッドを追加
 * 2021/12/30 1.1.0 行頭禁則文字が行末に2文字連続で来る場合に対応
 *            1.0.4 自動改行によって改ページが挟まる際に1文字抜ける不具合を修正
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 名前ウィンドウの表示が崩れる不具合を修正
 *            1.0.1 サブフォルダからの読み込みに対応
 * 2020/12/13 1.0.0 公開
 */

/*:ja
 * @plugindesc ウィンドウ幅を超える文章を自動で折り返す
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
 * @param wordBaseLineBreak
 * @desc 単語ベースで自動改行を行うかどうか。半角スペースで区切られたひとかたまりを1単語とみなします。
 * @text 単語ベース改行
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.3.0
 * ウィンドウ幅を超えるような文字列を自動で改行します。
 *
 * 以下の法則でゆるふわ禁則処理します。
 * - 行頭禁則文字は連続1文字の場合、ぶら下げによる処理を行います。
 * - 行頭禁則文字は連続2文字の場合、追い出しによる処理を行います。
 * - 行末禁則文字は追い出しによる処理を行います。
 * - 行末禁則文字が連続する場合をサポートしません。
 *   （行末禁則文字が連続した場合、行末に対象の文字が表示されることがあります）
 * - 行頭行末揃えを行いません。（必ずしも各行の行頭と行末が一直線に揃いません）
 * - 分離禁則を適用しません。（英単語や連数字の途中で改行されることがあります）
 */

/*:en
 * @plugindesc Automatically line break when text width is over window's
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param prohibitLineBreakBefore
 * @desc character that cannot be displayed at the beginning of line.
 * @text Character can't be at the beginning
 * @type string
 * @default ,)]｝、〕〉》」』】〙〗〟’”｠»ゝゞーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇷ゚ㇺㇻㇼㇽㇾㇿ々〻‐゠–〜～?!‼⁇⁈⁉・:;/。.
 *
 * @param prohibitLineBreakAfter
 * @desc character that cannot be displayed at the end of line.
 * @text Character can't be at the end
 * @type string
 * @default ([｛〔〈《「『【〘〖〝‘“｟«
 *
 * @param ignoreAutoLineBreakWindows
 * @desc Windows should not be auto line breaking.
 * @text No auto line break windows
 * @type string[]
 * @default []
 *
 * @param lineWidthMargin
 * @desc Margin for characters that cannot be at the beginning or end of line.
 * @text Line width margin
 * @type number
 * @default 4
 *
 * @param wordBaseLineBreak
 * @desc When this is ON, it is enabled word base line breaking. Word is separated by half-width space.
 * @text Word base line break
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.3.0
 * This is plugin for automatically line break when text width is over window's.
 *
 * Especially, it supports line breaking rule for Japanese (multi byte characters) partially.
 * (see Japanese help in this file.)
 *
 * For English, I recommend enabling word base line break settings.
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

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
    wordBaseLineBreak: String(pluginParameters.wordBaseLineBreak || false) === 'true',
  };

  function Window_AutoLineBreakMixIn(windowClass) {
    /**
     * 自動折返しが無効なウィンドウであるかどうか
     */
    windowClass.isIgnoreAutoLineBreakWindow = function () {
      return settings.ignoreAutoLineBreakWindows.includes(this.constructor.name);
    };
    /**
     * 自動折返しが有効かどうか
     */
    windowClass.isAutoLineBreakEnabled = function () {
      if (this.isIgnoreAutoLineBreakWindow()) {
        return false;
      }
      return true;
    };
    const _processCharacter = windowClass.processCharacter;
    windowClass.processCharacter = function (textState) {
      if (this.shouldLineBreakHere(textState)) {
        this.flushTextState(textState);
        if (textState.text[textState.index] !== '\n') {
          this.processNewLine(textState);
        }
        /**
         * 改ページが必要になったら次の文字は処理しない
         */
        if (this.needsNewPage && this.needsNewPage(textState)) {
          return;
        }
      }
      if (textState.text[textState.index].charCodeAt(0) >= 0x20) {
        textState.lineBuffer += textState.text[textState.index];
      }
      _processCharacter.call(this, textState);
    };
    const _processNewLine = windowClass.processNewLine;
    windowClass.processNewLine = function (textState) {
      _processNewLine.call(this, textState);
      textState.lineBuffer = this.createTextBuffer(textState.rtl);
    };
    const _createTextState = windowClass.createTextState;
    windowClass.createTextState = function (text, x, y, width) {
      const textState = _createTextState.call(this, text, x, y, width);
      textState.lineBuffer = textState.buffer;
      return textState;
    };
    const _flushTextState = windowClass.flushTextState;
    windowClass.flushTextState = function (textState) {
      _flushTextState.call(this, textState);
      textState.lineBuffer = textState.buffer;
    };
    /**
     * 自動改行すべき状態であるかどうか
     */
    windowClass.shouldLineBreakHere = function (textState) {
      if (!textState || textState.index === 0 || !textState.text[textState.index] || !this.isAutoLineBreakEnabled()) {
        return false;
      }
      return this.shouldCharacterBaseLineBreakHere(textState) || this.shouldWordBaseLineBreakHere(textState);
    };
    windowClass.shouldCharacterBaseLineBreakHere = function (textState) {
      let nextCharacter = textState.text[textState.index];
      if (this.isSurrogatePair(nextCharacter)) {
        return false;
      }
      let next2Character = this.nextNCharacter(textState, 2);
      let next3Character = this.nextNCharacter(textState, 3);
      const size = this.textWidth(`${textState.lineBuffer}${nextCharacter}`);
      if (size + textState.x > this.lineWidth()) {
        return !this.isProhibitLineBreakBefore(nextCharacter);
      } else if (
        next2Character &&
        next3Character &&
        size + textState.x + this.textWidth(`${next2Character}${next3Character}`) > this.lineWidth()
      ) {
        // 行頭禁則文字が行末に2つ並んでおり、かつ枠をはみ出す場合
        // 例えば、 しゅー のように、2つまでであれば並ぶ余地が十分に考えられる
        // 3つ以上は流石に先読みコストがかかりすぎるので対応しない
        return this.isProhibitLineBreakBefore(next2Character) && this.isProhibitLineBreakBefore(next3Character);
      }
      // 行末禁則チェック
      if (
        next2Character &&
        this.textWidth(`${textState.lineBuffer}${nextCharacter}${next2Character}`) + textState.x > this.lineWidth()
      ) {
        return this.isProhibitLineBreakAfter(nextCharacter);
      }
      return false;
    };
    windowClass.shouldWordBaseLineBreakHere = function (textState) {
      if (!settings.wordBaseLineBreak) {
        return false;
      }
      const isInitialOfWord = textState.text[textState.index - 1] === ' ' && textState.text[textState.index] !== ' ';
      const nextSpaceIndex = textState.text.indexOf(' ', textState.index + 1);
      if (!isInitialOfWord || nextSpaceIndex < 0) {
        return false;
      }
      const currentWord = textState.text.substring(textState.index, nextSpaceIndex);
      const size = this.textWidth(`${textState.lineBuffer}${currentWord}`);
      return size + textState.x > this.lineWidth();
    };
    /**
     * N文字先の文字
     */
    windowClass.nextNCharacter = function (textState, n) {
      let targetIndex = textState.index + n - 1;
      if (!textState.text[targetIndex]) {
        return null;
      }
      return textState.text.substring(targetIndex, targetIndex + 1);
    };
    windowClass.isSurrogatePair = function (character) {
      return character.charCodeAt(0) >= 0xdc00 && character.charCodeAt(0) <= 0xdfff;
    };
    /**
     * 行末禁則文字かどうか
     */
    windowClass.isProhibitLineBreakBefore = function (character) {
      return settings.prohibitLineBreakBefore.includes(character);
    };
    /**
     * 行頭禁則文字かどうか
     */
    windowClass.isProhibitLineBreakAfter = function (character) {
      return settings.prohibitLineBreakAfter.includes(character);
    };
    /**
     * 折返し幅
     */
    windowClass.lineWidth = function () {
      return this.contentsWidth() - settings.lineWidthMargin;
    };
    windowClass.lineWidthMargin = function () {
      return settings.lineWidthMargin;
    };
  }
  Window_AutoLineBreakMixIn(Window_Base.prototype);
  function Window_DisableAutoLineBreakMixIn(windowClass) {
    windowClass.isAutoLineBreakEnabled = function () {
      return false;
    };
  }
  /**
   * Window_ChoiceList は選択肢幅によってウィンドウサイズが変わる
   * そのため、自動折返しの対象外とする
   */
  Window_DisableAutoLineBreakMixIn(Window_ChoiceList.prototype);
  /**
   * Window_NameBox は名前の幅によってウィンドウサイズが変わる
   * そのため、自動折返しの対象外とする
   */
  Window_DisableAutoLineBreakMixIn(Window_NameBox.prototype);
  function Window_BattleLog_AutoLineBreakMixIn(windowClass) {
    const _initialize = windowClass.initialize;
    windowClass.initialize = function (rect) {
      /**
       * 各テキストの改行の数
       */
      this._newLines = [];
      _initialize.call(this, rect);
    };
    const _clear = windowClass.clear;
    windowClass.clear = function () {
      _clear.call(this);
      this._newLines = [];
    };
    const _refresh = windowClass.refresh;
    windowClass.refresh = function () {
      this._lines.forEach((text, index) => {
        this._newLines[index] = 0;
        this.textSizeEx(text);
      });
      _refresh.call(this);
    };
    const _addText = windowClass.addText;
    windowClass.addText = function (text) {
      this._newLines.push(0);
      _addText.call(this, text);
    };
    const _numLines = windowClass.numLines;
    windowClass.numLines = function () {
      return _numLines.call(this) + this._newLines.reduce((prev, current) => prev + current, 0);
    };
    const _drawLineText = windowClass.drawLineText;
    windowClass.drawLineText = function (index) {
      /**
       * 描画中のindex
       */
      this._currentIndex = index;
      _drawLineText.call(this, index);
    };
    const _processNewLine = windowClass.processNewLine;
    windowClass.processNewLine = function (textState) {
      _processNewLine.call(this, textState);
      if (!textState.drawing) {
        this._newLines[this._currentIndex]++;
      }
    };
    const _lineRect = windowClass.lineRect;
    windowClass.lineRect = function (index) {
      const rect = _lineRect.call(this, index);
      rect.y += this._newLines.slice(0, index).reduce((prev, current) => prev + current, 0) * this.lineHeight();
      return rect;
    };
  }
  Window_BattleLog_AutoLineBreakMixIn(Window_BattleLog.prototype);
})();
