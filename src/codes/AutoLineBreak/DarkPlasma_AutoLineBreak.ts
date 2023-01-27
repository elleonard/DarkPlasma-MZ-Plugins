import { settings } from './_build/DarkPlasma_AutoLineBreak_parameters';

function Window_AutoLineBreakMixIn(windowClass: Window_Base) {
  windowClass.startIgnoreAutoLineBreakTemporary = function () {
    this._ignoreAutoLineBreakTemporary = true;
  };

  windowClass.finishIgnoreAutoLineBreakTemporary = function () {
    this._ignoreAutoLineBreakTemporary = false;
  };

  /**
   * 自動折返しが無効なウィンドウであるかどうか
   */
  windowClass.isIgnoreAutoLineBreakWindow = function () {
    return settings.ignoreAutoLineBreakWindows.includes(this.constructor.name) || this._ignoreAutoLineBreakTemporary;
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
      if (textState.text[textState.index] !== "\n") {
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

  const _processEscapeCharacter = windowClass.processEscapeCharacter;
  windowClass.processEscapeCharacter = function (code, textState) {
    _processEscapeCharacter.call(this, code, textState);
    switch (code) {
      case "IGNOREAUTOLINEBREAK":
        const param = this.obtainEscapeParamText(textState);
        if (param.toUpperCase() === "START") {
          this.startIgnoreAutoLineBreakTemporary();
        } else if (param.toUpperCase() === "FINISH") {
          this.finishIgnoreAutoLineBreakTemporary();
        }
        break;
    }
  };

  windowClass.obtainEscapeParamText = function (textState) {
    const regExp = /^\[(.+)\]/;
    const arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
      textState.index += arr[0].length;
      return arr[1];
    }
    return "";
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
    const isInitialOfWord = textState.text[textState.index-1] === " " && textState.text[textState.index] !== " ";
    const nextSpaceIndex = textState.text.indexOf(" ", textState.index+1);
    const nextLineBreakIndex = textState.text.indexOf("\n", textState.index+1);
    if (!isInitialOfWord || nextSpaceIndex < 0 || nextLineBreakIndex > 0 && nextSpaceIndex > nextLineBreakIndex) {
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

function Window_DisableAutoLineBreakMixIn(windowClass: Window_Base) {
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

function Window_BattleLog_AutoLineBreakMixIn(windowClass: Window_BattleLog) {
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
