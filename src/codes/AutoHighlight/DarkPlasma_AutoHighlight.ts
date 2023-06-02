/// <reference path="./AutoHighlight.d.ts" />

import { settings } from './_build/DarkPlasma_AutoHighlight_parameters';
import { ColorManagerMixIn } from '../../common/manager/ColorManagerMixIn';

ColorManagerMixIn(ColorManager);

class HighlightWords {
  _highlightWords: HighlightWord[];
  _sortedWords: string[] | null;
  _colors: { [word: string]: string };
  _needsRefreshCache: boolean;

  constructor() {
    this._highlightWords = [];
    this._sortedWords = null;
    this._colors = {};
    this._needsRefreshCache = false;
  }

  getRegExp(): RegExp {
    return new RegExp(`(${this.sortedWords().join('|')})`, 'gi');
  }

  /**
   * 長さ順にソートしたハイライト語句一覧
   */
  sortedWords(): string[] {
    if (!this._sortedWords || this._needsRefreshCache) {
      this.refreshCache();
    }
    return this._sortedWords || [];
  }

  /**
   * @param {HighlightWord} highlightWord ハイライトする語句と色
   */
  add(highlightWord: HighlightWord): void {
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
  findColorByWord(word: string): string | number {
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
  highlightText(text: string): string {
    return text.replace(this.getRegExp(), (match) => {
      return `\x1bC[${this.findColorByWord(match)}]${match}\x1bC[0]`;
    });
  }
}

class HighlightWord {
  _word: string;
  _color: string | number;

  constructor(word: string, color: string | number) {
    this._word = word;
    this._color = color;
  }

  get word(): string {
    return this._word;
  }

  get color(): string {
    return ColorManager.convertColorParameter(this._color);
  }
}

const highlightWords = new HighlightWords();

/**
 * @param {Scene_Boot.prototype} sceneBoot
 */
function Scene_Boot_AutoHighlightMixIn(sceneBoot: Scene_Boot) {
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

function Window_AutoHighlightMixIn(windowClass: Window_Base) {
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
