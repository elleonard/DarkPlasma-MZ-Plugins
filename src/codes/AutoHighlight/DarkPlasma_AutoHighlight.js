import { settings } from './_build/DarkPlasma_AutoHighlight_parameters';

class HighlightWords {
  constructor() {
    this._highlightWords = [];
    this._sortedWords = null;
    this._colors = null;
  }

  /**
   * @return {RegExp}
   */
  getRegExp() {
    return new RegExp(`(${this.sortedWords().join('|')})`, 'gi');
  }

  /**
   * 長さ順にソートしたハイライト語句一覧
   * @return {string[]}
   */
  sortedWords() {
    if (!this._sortedWords || this._needsRefreshCache) {
      this.refreshCache();
    }
    return this._sortedWords;
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
    return this._colors[word].startsWith('#') ? this._colors[word] : Number(this._colors[word]);
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
    return this._color;
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

const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function (text) {
  text = _Window_Base_convertEscapeCharacters.call(this, text);
  if (this.isHighlightWindow()) {
    return highlightWords.highlightText(text);
  }
  return text;
};

Window_Base.prototype.isHighlightWindow = function () {
  return settings.targetWindows.some(
    (targetWindow) => typeof window[targetWindow] === 'function' && this instanceof window[targetWindow]
  );
};
