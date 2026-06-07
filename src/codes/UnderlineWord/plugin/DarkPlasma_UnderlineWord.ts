/// <reference path="./UnderlineWord.d.ts" />

import { settings } from '../config/_build/DarkPlasma_UnderlineWord_parameters';
import { ColorManagerMixIn } from '../../../common/manager/ColorManagerMixIn';

function regExpEscape(text: string) {
  return text.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

ColorManagerMixIn(ColorManager);

class UnderlineWordEntry {
  _word: string;
  _color: string | number;
  _lineWidth: number;

  constructor(word: string, color: string | number, lineWidth: number) {
    this._word = word;
    this._color = color;
    this._lineWidth = lineWidth;
  }

  get word(): string {
    return this._word;
  }

  get color(): string {
    return ColorManager.convertColorParameter(this._color);
  }

  get lineWidth(): number {
    return this._lineWidth;
  }
}

class UnderlineWords {
  _entries: UnderlineWordEntry[];
  _sortedWords: string[] | null;
  _colorInfoCache: { [word: string]: { color: string; lineWidth: number } };
  _needsRefreshCache: boolean;

  constructor() {
    this._entries = [];
    this._sortedWords = null;
    this._colorInfoCache = {};
    this._needsRefreshCache = false;
  }

  add(entry: UnderlineWordEntry): void {
    this._entries.push(entry);
    this._needsRefreshCache = true;
  }

  sortedWords(): string[] {
    if (!this._sortedWords || this._needsRefreshCache) {
      this.refreshCache();
    }
    return this._sortedWords || [];
  }

  refreshCache(): void {
    this._sortedWords = this._entries.map(e => e.word).sort((a, b) => b.length - a.length);
    this._colorInfoCache = {};
    this._entries.forEach(e => {
      this._colorInfoCache[e.word] = { color: e.color, lineWidth: e.lineWidth };
    });
    this._needsRefreshCache = false;
  }

  findColorInfoByWord(word: string): { color: string; lineWidth: number } | undefined {
    if (!this._colorInfoCache || this._needsRefreshCache) {
      this.refreshCache();
    }
    return this._colorInfoCache[word];
  }

  getRegExp(): RegExp {
    return new RegExp(`(${this.sortedWords().map(word => regExpEscape(word)).join('|')})`, 'g');
  }

  underlineText(text: string): string {
    if (this.sortedWords().length === 0) {
      return text;
    }
    return text.replace(this.getRegExp(), (match) => {
      return `\x1bUL[${match}]${match}\x1bUL[]`;
    });
  }
}

const underlineWords = new UnderlineWords();

function Scene_Boot_UnderlineWordMixIn(sceneBoot: Scene_Boot) {
  const _start = sceneBoot.start;
  sceneBoot.start = function () {
    _start.call(this);
    settings.underlineGroups.forEach((group) => {
      group.texts.forEach((text) => {
        if (text) {
          underlineWords.add(new UnderlineWordEntry(text, group.color, group.lineWidth));
        }
      });
    });
  };
}

Scene_Boot_UnderlineWordMixIn(Scene_Boot.prototype);

function Window_UnderlineWordMixIn(windowBase: Window_Base) {
  const _convertEscapeCharacters = windowBase.convertEscapeCharacters;
  windowBase.convertEscapeCharacters = function (text) {
    text = _convertEscapeCharacters.call(this, text);
    if (this.isUnderlineWindow()) {
      return underlineWords.underlineText(text);
    }
    return text;
  };

  const _processEscapeCharacter = windowBase.processEscapeCharacter;
  windowBase.processEscapeCharacter = function (code, textState) {
    if (code === 'UL') {
      const regExp = /^\[([^\]]*)\]/;
      const arr = regExp.exec(textState.text.slice(textState.index));
      if (arr) {
        textState.index += arr[0].length;
        textState.underlineWord = arr[1] || null;
      }
      return;
    }
    _processEscapeCharacter.call(this, code, textState);
  };

  const _flushTextState = windowBase.flushTextState;
  windowBase.flushTextState = function (textState) {
    const beforeX = textState.x;
    _flushTextState.call(this, textState);
    const word = textState.underlineWord;
    if (word) {
      const afterX = textState.x;
      const info = underlineWords.findColorInfoByWord(word);
      if (info) {
        const underlineY = textState.y + this.lineHeight() - info.lineWidth;
        this.contents.drawLine(beforeX, underlineY, afterX, underlineY, info.lineWidth, info.color);
      }
    }
  };

  windowBase.isUnderlineWindow = function () {
    return settings.targetWindows.some((targetWindow) => this.constructor.name === targetWindow);
  };
}

Window_UnderlineWordMixIn(Window_Base.prototype);
