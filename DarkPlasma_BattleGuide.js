// DarkPlasma_BattleGuide 1.3.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/01/28 1.3.0 SG表示スイッチNタグ及び一部のSGピクチャ関連タグに対応
 * 2024/05/23 1.2.4 不要なウィンドウレイヤーを削除
 * 2024/01/15 1.2.3 ビルド方式を変更 (configをTypeScript化)
 * 2022/11/13 1.2.2 typescript移行
 * 2022/07/02 1.2.1 ページ番号表示設定が正常に扱えない不具合の修正
 * 2022/06/21 1.2.0 ショートカットキーなし設定を追加
 * 2022/05/16 1.1.0 SceneGlossaryの説明文のみ引用する機能を追加
 *                  フォントサイズ設定を追加
 *                  左右キーでページめくり機能追加
 *                  ページめくり可能な場合、左右矢印を表示
 * 2022/04/25 1.0.1 ウィンドウレイヤー位置調整
 * 2022/04/24 1.0.0 公開
 */

/*:
 * @plugindesc 戦闘の手引書表示
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_CustomKeyHandler
 * @base DarkPlasma_ManualText
 * @orderAfter DarkPlasma_CustomKeyHandler
 * @orderAfter DarkPlasma_ManualText
 *
 * @param guides
 * @text 手引書
 * @type struct<Guide>[]
 * @default []
 *
 * @param listWidth
 * @desc 手引書の目次ウィンドウの横幅を設定します。
 * @text 目次横幅
 * @type number
 * @default 240
 *
 * @param fontSize
 * @desc 手引書のフォントサイズを設定します。
 * @text フォントサイズ
 * @type number
 * @default 22
 *
 * @param showPageNumber
 * @desc ページ番号の表示戦略を設定します。
 * @text ページ番号表示
 * @type select
 * @option default(2ページ以上の場合表示)
 * @value 0
 * @option always(常に表示)
 * @value 1
 * @option no(表示なし)
 * @value 2
 * @default 0
 *
 * @param key
 * @text 手引書を開くキー
 * @type select
 * @option
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 *
 * @param addPartyCommand
 * @text パーティコマンドに追加する
 * @type boolean
 * @default true
 *
 * @param partyCommandName
 * @text パーティコマンド名
 * @type string
 * @default 手引書
 *
 * @help
 * version: 1.3.0
 * 戦闘中に手引書を表示することができます。
 *
 * SceneGlossaryの一部タグを利用可能です。
 * - SG説明, SGDescription
 * - SG表示スイッチ, SGVisibleSwitch
 * - SGピクチャ, SGPicture
 * - SGピクチャX, SGPictureX
 * - SGピクチャY, SGPictureY
 * - SGピクチャ優先度, SGPicturePriority
 * - SGピクチャ揃え, SGPictureAlign
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_CustomKeyHandler version:1.1.0
 * DarkPlasma_ManualText version:1.3.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_CustomKeyHandler
 * DarkPlasma_ManualText
 */
/*~struct~Guide:
 * @param title
 * @desc 手引書の目次に表示される名前を設定します。
 * @text 名前
 * @type string
 *
 * @param texts
 * @desc 手引書の具体的な内容を設定します。
 * @text 内容
 * @type multiline_string[]
 * @default []
 *
 * @param glossaryItem
 * @desc SceneGlossaryで設定した説明文を参照します。指定した場合、名前と内容設定を無視します。
 * @text 用語集参照アイテム
 * @type item
 * @default 0
 *
 * @param condition
 * @desc この条件を満たした場合にのみ手引書に表示します。
 * @text 表示条件
 * @type struct<Condition>
 * @default {"switchId":"0","variableId":"0","threshold":"0"}
 */
/*~struct~Condition:
 * @param switchId
 * @desc 指定した場合、このスイッチがONの場合のみ手引書に表示します。
 * @text スイッチ
 * @type switch
 * @default 0
 *
 * @param variableId
 * @desc 指定した場合、この変数が閾値より大の場合のみ手引書に表示します。
 * @text 変数
 * @type variable
 * @default 0
 *
 * @param threshold
 * @text 閾値
 * @type number
 * @default 0
 */
(() => {
  'use strict';

  /**
   * タッチUIのキャンセルボタンを右上端へ移動したり戻したりする
   * @param {Scene_Battle.prototype} sceneBattle
   */
  function Scene_Battle_MoveCancelButtonMixIn(sceneBattle) {
    if (!sceneBattle.moveCancelButtonToEdge) {
      sceneBattle.moveCancelButtonToEdge = function () {
        if (this._cancelButton) {
          this._cancelButton.y = Math.floor((this.buttonAreaHeight() - 48) / 2);
        }
      };
    }
    if (!sceneBattle.returnCancelButton) {
      sceneBattle.returnCancelButton = function () {
        if (this._cancelButton) {
          this._cancelButton.y = this.buttonY();
        }
      };
    }
  }

  Scene_Battle_MoveCancelButtonMixIn(Scene_Battle.prototype);

  /**
   * @param {Scene_Battle.prototype} sceneBattle
   */
  function Scene_Battle_InputtingWindowMixIn(sceneBattle) {
    const _inputtingWindow = sceneBattle.inputtingWindow;
    if (!_inputtingWindow) {
      sceneBattle.inputtingWindow = function () {
        return this.inputWindows().find((inputWindow) => inputWindow.active);
      };
    }

    const _inputWindows = sceneBattle.inputWindows;
    if (!_inputWindows) {
      sceneBattle.inputWindows = function () {
        return [
          this._partyCommandWindow,
          this._actorCommandWindow,
          this._skillWindow,
          this._itemWindow,
          this._actorWindow,
          this._enemyWindow,
        ];
      };
    }
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    guides: pluginParameters.guides
      ? JSON.parse(pluginParameters.guides).map((e) => {
          return e
            ? ((parameter) => {
                const parsed = JSON.parse(parameter);
                return {
                  title: String(parsed.title || ``),
                  texts: parsed.texts
                    ? JSON.parse(parsed.texts).map((e) => {
                        return String(e || ``);
                      })
                    : [],
                  glossaryItem: Number(parsed.glossaryItem || 0),
                  condition: parsed.condition
                    ? ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          switchId: Number(parsed.switchId || 0),
                          variableId: Number(parsed.variableId || 0),
                          threshold: Number(parsed.threshold || 0),
                        };
                      })(parsed.condition)
                    : { switchId: 0, variableId: 0, threshold: 0 },
                };
              })(e)
            : { title: '', texts: [], glossaryItem: 0, condition: { switchId: 0, variableId: 0, threshold: 0 } };
        })
      : [],
    listWidth: Number(pluginParameters.listWidth || 240),
    fontSize: Number(pluginParameters.fontSize || 22),
    showPageNumber: Number(pluginParameters.showPageNumber || 0),
    key: String(pluginParameters.key || ``),
    addPartyCommand: String(pluginParameters.addPartyCommand || true) === 'true',
    partyCommandName: String(pluginParameters.partyCommandName || `手引書`),
  };

  class Data_BattleGuide {
    constructor(title, pages, condition) {
      this._title = title;
      this._pages = pages;
      this._condition = condition;
    }
    static fromPluginSetting(title, texts, condition) {
      return new Data_BattleGuide(
        title,
        texts.map((text) => new Data_BattleGuidePage(text)),
        condition,
      );
    }
    static fromGlossaryItem(item, condition) {
      const texts = getGlossaryDescription(item);
      if (!texts) {
        throw Error(`説明文のない用語です: ${item.name}`);
      }
      return new Data_BattleGuide(
        item.name,
        texts.map((_, index) => Data_BattleGuidePage.fromGlossaryItem(item, index + 1)),
        condition,
      );
    }
    get title() {
      return this._title;
    }
    get texts() {
      return this._pages.map((page) => page.text);
    }
    picture(page) {
      return this._pages[page].picture;
    }
    /**
     * @return {boolean}
     */
    isValid() {
      return this._condition.isValid();
    }
  }
  class Data_BattleGuidePage {
    constructor(text, picture, condition) {
      this._text = text;
      this._picture = picture;
      this._condition = condition;
    }
    static fromGlossaryItem(item, page) {
      const pageSuffix = page === 1 ? '' : `${page}`;
      return new Data_BattleGuidePage(
        String(item.meta[`SG説明${pageSuffix}`] || item.meta[`SGDescription${pageSuffix}`]),
        Data_BattleGuidePicture.fromGlossaryItem(item, page),
        Data_BattleGuideCondition.fromGlossaryItem(item, page),
      );
    }
    get text() {
      return this._text;
    }
    get picture() {
      return this._picture;
    }
  }
  class Data_BattleGuidePicture {
    constructor(name, xOffset, yOffset, priority, align) {
      this._name = name;
      this._xOffset = xOffset;
      this._yOffset = yOffset;
      this._priority = priority;
      this._align = align;
    }
    static fromGlossaryItem(item, page) {
      const pageSuffix = page === 1 ? '' : `${page}`;
      const name = item.meta[`SGピクチャ${pageSuffix}`] || item.meta[`SGPicture${pageSuffix}`];
      if (!name) {
        return undefined;
      }
      const xOffset = Number(item.meta[`SGピクチャX${pageSuffix}`] || item.meta[`SGPictureX${pageSuffix}`] || 0);
      const yOffset = Number(item.meta[`SGピクチャY${pageSuffix}`] || item.meta[`SGPictureY${pageSuffix}`] || 0);
      const sceneGlossaryParameters = PluginManager.parameters('SceneGlossary');
      const priority = String(
        item.meta[`SGピクチャ優先度${pageSuffix}`] ||
          item.meta[`SGPicturePriority${pageSuffix}`] ||
          sceneGlossaryParameters.PicturePriority,
      );
      const align = String(
        item.meta[`SGピクチャ揃え${pageSuffix}`] ||
          item.meta[`SGPictureAlign${pageSuffix}`] ||
          sceneGlossaryParameters.PictureAlign,
      );
      if (priority !== 'top' && priority !== 'bottom') {
        throw Error(`不正な優先度設定です: ${item.name}: ${priority}`);
      }
      if (align !== 'left' && align !== 'center' && align !== 'right') {
        throw Error(`不正な揃え設定です: ${item.name}: ${align}`);
      }
      return new Data_BattleGuidePicture(String(name), xOffset, yOffset, priority, align);
    }
    get name() {
      return this._name;
    }
    get xOffset() {
      return this._xOffset;
    }
    get yOffset() {
      return this._yOffset;
    }
    get priority() {
      return this._priority;
    }
    get align() {
      return this._align;
    }
    adjustedX(baseX, contentsWidth, pictureWidth) {
      switch (this.align) {
        case 'left':
          return baseX + this.xOffset;
        case 'center':
          return baseX + contentsWidth / 2 - pictureWidth / 2 + this.xOffset;
        case 'right':
          return baseX + contentsWidth - pictureWidth + this.xOffset;
      }
    }
  }
  class Data_BattleGuideCondition {
    /**
     * @param {number} switchId
     * @param {number} variableId
     * @param {number} threshold
     */
    constructor(switchId, variableId, threshold) {
      this._switchId = switchId;
      this._variableId = variableId;
      this._threshold = threshold;
    }
    static fromGlossaryItem(item, page) {
      /**
       * 1ページ目は設定なし
       */
      if (page < 2) {
        return undefined;
      }
      /**
       * 2ページ目以降は、前のページの設定を引き継ぐ
       */
      for (let i = page; i >= 2; i--) {
        const switchId = item.meta[`表示スイッチ${i}`];
        if (switchId) {
          return new Data_BattleGuideCondition(Number(switchId), 0, 0);
        }
      }
      return undefined;
    }
    /**
     * @return {boolean}
     */
    isValid() {
      return (
        (!this._switchId || $gameSwitches.value(this._switchId)) &&
        (!this._variableId || $gameVariables.value(this._variableId) > this._threshold)
      );
    }
  }
  /**
   * SceneGlossary.js で定義される用語集アイテムであるかどうか
   * $gameParty.isGlossaryItem でも判定可能だが、
   * セーブデータロード前にゲームセーブデータインスタンスに依存するべきではないため独自に定義する
   * @param {MZ.Item} item
   * @return {boolean}
   */
  function isGlossaryItem(item) {
    return !!item && !!item.meta && !!(item.meta['SG説明'] || item.meta.SGDescription);
  }
  /**
   * SceneGlossary.js で定義される用語集アイテムの説明文を取得する
   */
  function getGlossaryDescription(item) {
    if (!isGlossaryItem(item)) {
      return null;
    }
    const result = [];
    const metaTag = item.meta['SG説明'] ? 'SG説明' : 'SGDescription';
    result.push(String(item.meta[metaTag]));
    for (let i = 2; item.meta[`${metaTag}${i}`]; i++) {
      result.push(String(item.meta[`${metaTag}${i}`]));
    }
    return result;
  }
  /**
   * @type {Data_BattleGuide[]}
   */
  let $dataBattleGuides = [];
  /**
   * @param {Scene_Boot.prototype} sceneBoot
   */
  function Scene_Boot_GuideMixIn(sceneBoot) {
    const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
    sceneBoot.onDatabaseLoaded = function () {
      _onDatabaseLoaded.call(this);
      $dataBattleGuides = settings.guides.map((guide) => {
        return guide.glossaryItem
          ? Data_BattleGuide.fromGlossaryItem(
              $dataItems[guide.glossaryItem],
              new Data_BattleGuideCondition(
                guide.condition.switchId,
                guide.condition.variableId,
                guide.condition.threshold,
              ),
            )
          : Data_BattleGuide.fromPluginSetting(
              guide.title,
              guide.texts,
              new Data_BattleGuideCondition(
                guide.condition.switchId,
                guide.condition.variableId,
                guide.condition.threshold,
              ),
            );
      });
    };
  }
  Scene_Boot_GuideMixIn(Scene_Boot.prototype);
  Scene_Battle_InputtingWindowMixIn(Scene_Battle.prototype);
  /**
   * @param {Scene_Battle.prototype} sceneBattle
   */
  function Scene_Battle_GuideMixIn(sceneBattle) {
    const _createAllWindows = sceneBattle.createAllWindows;
    sceneBattle.createAllWindows = function () {
      _createAllWindows.call(this);
      this.createGuideListWindow();
      this.createGuideTextWindow();
    };
    const _createPartyCommandWindow = sceneBattle.createPartyCommandWindow;
    sceneBattle.createPartyCommandWindow = function () {
      _createPartyCommandWindow.call(this);
      this._partyCommandWindow.setHandler('guide', this.openGuide.bind(this));
    };
    const _createActorCommandWindow = sceneBattle.createActorCommandWindow;
    sceneBattle.createActorCommandWindow = function () {
      _createActorCommandWindow.call(this);
      this._actorCommandWindow.setHandler('guide', this.openGuide.bind(this));
    };
    sceneBattle.createGuideListWindow = function () {
      this._guideListWindow = new Window_BattleGuideList(this.guideListWindowRect());
      this._guideListWindow.setHandler('ok', this.onTurnGuidePage.bind(this));
      this._guideListWindow.setHandler('cancel', this.onCancelGuideList.bind(this));
      this._guideListWindow.hide();
      this.addWindow(this._guideListWindow);
    };
    sceneBattle.createGuideTextWindow = function () {
      this._guideTextWindow = new Window_BattleGuideText(this.guideTextWindowRect());
      this._guideListWindow.setTextWindow(this._guideTextWindow);
      /**
       * 初期選択（項目数0は想定しない）
       */
      this._guideListWindow.select(0);
      this._guideTextWindow.hide();
      this.addWindow(this._guideTextWindow);
    };
    sceneBattle.guideListWindowRect = function () {
      return new Rectangle(0, 0, settings.listWidth, Graphics.boxHeight);
    };
    sceneBattle.guideTextWindowRect = function () {
      return new Rectangle(settings.listWidth, 0, Graphics.boxWidth - settings.listWidth, Graphics.boxHeight);
    };
    sceneBattle.openGuide = function () {
      this._returnFromGuide = this.inputtingWindow();
      if (this._returnFromGuide) {
        this._returnFromGuide.deactivate();
      }
      this._guideListWindow.show();
      this._guideTextWindow.show();
      this._guideListWindow.activate();
      this.moveCancelButtonToEdge();
    };
    sceneBattle.onCancelGuideList = function () {
      this._guideListWindow.hide();
      this._guideTextWindow.hide();
      this._guideListWindow.deactivate();
      if (this._returnFromGuide) {
        this._returnFromGuide.activate();
        this._returnFromGuide = null;
      }
      /**
       * パーティコマンドへ戻る際のチラツキ防止
       */
      this.updateCancelButton();
      this.returnCancelButton();
    };
    sceneBattle.onTurnGuidePage = function () {
      this._guideTextWindow.turnPage();
      this._guideListWindow.activate();
    };
    const _isAnyInputWindowActive = sceneBattle.isAnyInputWindowActive;
    sceneBattle.isAnyInputWindowActive = function () {
      return _isAnyInputWindowActive.call(this) || this._guideListWindow.active;
    };
    const _inputWindows = sceneBattle.inputWindows;
    sceneBattle.inputWindows = function () {
      return _inputWindows.call(this).concat([this._guideListWindow]);
    };
  }
  Scene_Battle_GuideMixIn(Scene_Battle.prototype);
  Scene_Battle_MoveCancelButtonMixIn(Scene_Battle.prototype);
  class Window_BattleGuideList extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this.makeItemList();
      this.refresh();
    }
    /**
     * @param {Window_BattleGuideText} textWindow
     */
    setTextWindow(textWindow) {
      this._textWindow = textWindow;
    }
    maxItems() {
      return this._list ? this._list.length : 0;
    }
    update() {
      super.update();
      this.updateText();
    }
    updateText() {
      if (this._textWindow) {
        this._textWindow.setGuide(this._list[this.index()]);
      }
    }
    makeItemList() {
      this._list = $dataBattleGuides.filter((guide) => guide.isValid());
    }
    drawItem(index) {
      const guide = this._list[index];
      if (guide) {
        const rect = this.itemLineRect(index);
        this.drawText(guide.title, rect.x, rect.y, rect.width);
      }
    }
    /**
     * ページめくりの音はテキストウィンドウに任せる
     */
    playOkSound() {}
    cursorRight() {
      if (this._textWindow) {
        this._textWindow.turnPage();
      }
    }
    cursorLeft() {
      if (this._textWindow) {
        this._textWindow.backPage();
        this.playCursorSound();
      }
    }
  }
  const SHOW_PAGE_NUMBER = {
    DEFAULT: 0,
    ALWAYS: 1,
    NO: 2,
  };
  class Window_BattleGuideText extends Window_Base {
    /**
     * @param {Data_BattleGuide} guide
     */
    setGuide(guide) {
      if (guide !== this._guide) {
        this._guide = guide;
        this._page = 0;
        this.refresh();
      }
    }
    resetFontSettings() {
      super.resetFontSettings();
      this.contents.fontSize = settings.fontSize;
    }
    /**
     * @param {number} page
     */
    setPage(page) {
      if (page !== this._page) {
        this._page = page;
        this.refresh();
      }
    }
    maxPage() {
      return this._guide ? this._guide.texts.length : 0;
    }
    turnPage() {
      const page = this._page;
      this._page++;
      if (this._page >= this.maxPage()) {
        this._page = 0;
      }
      if (page !== this._page) {
        this.playCursorSound();
      }
      this.refresh();
    }
    backPage() {
      const page = this._page;
      this._page--;
      if (this._page < 0) {
        this._page = this.maxPage() - 1;
      }
      if (page !== this._page) {
        this.playCursorSound();
      }
      this.refresh();
    }
    refresh() {
      this.contents.clear();
      if (this._guide) {
        const text = this._guide.texts[this._page];
        const picture = this._guide.picture(this._page);
        if (picture) {
          const bitmap = ImageManager.loadPicture(picture.name);
          bitmap.addLoadListener(() => this.drawGuide(text, 0, 0, bitmap, picture));
        } else {
          this.drawTextEx(text, 0, 0);
        }
        this.drawPageNumber();
      }
      this.updateArrows();
    }
    updateArrows() {
      this.downArrowVisible = this._page > 0;
      this.upArrowVisible = this._page < this.maxPage() - 1;
    }
    /**
     * @return {boolean}
     */
    isPageNumberVisible() {
      return (
        (settings.showPageNumber === SHOW_PAGE_NUMBER.DEFAULT && this.maxPage() > 1) ||
        settings.showPageNumber === SHOW_PAGE_NUMBER.ALWAYS
      );
    }
    drawGuide(text, x, y, bitmap, picture) {
      const pictureHandler =
        bitmap && picture
          ? () => {
              const pictureAlignX = this.drawPicture(
                bitmap,
                picture.adjustedX(x, this.contentsWidth(), bitmap.width),
                y + picture.yOffset,
              );
            }
          : () => {};
      if (picture?.priority === 'top') {
        pictureHandler();
      }
      this.drawTextEx(text, x, y);
      if (picture?.priority === 'bottom') {
        pictureHandler();
      }
    }
    drawPicture(bitmap, x, y) {
      const scale = 1;
      const dw = bitmap.width * scale;
      const dh = bitmap.height * scale;
      this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y, dw, dh);
    }
    drawPageNumber() {
      this.initManualTexts();
      /**
       * refreshの中で実行されるため、直接代入する
       */
      this._isManualVisible = this.isPageNumberVisible();
      this.addManualText(this.getPageNumberText());
      this.drawManual();
    }
    getPageNumberText() {
      return `[ ${this._page + 1} / ${this.maxPage()} ]`;
    }
    _refreshArrows() {
      super._refreshArrows();
      const horizontalPadding = 12;
      this._downArrowSprite.rotation = Math.PI / 2;
      this._downArrowSprite.move(horizontalPadding, this.height / 2);
      this._upArrowSprite.rotation = Math.PI / 2;
      this._upArrowSprite.move(this.width - horizontalPadding, this.height / 2);
    }
  }
  Window_ManualTextMixIn(Window_BattleGuideText.prototype);
  if (settings.key) {
    Window_CustomKeyHandlerMixIn(settings.key, Window_PartyCommand.prototype, 'guide');
    Window_CustomKeyHandlerMixIn(settings.key, Window_ActorCommand.prototype, 'guide');
  }
  /**
   * @param {Window_PartyCommand.prototype} windowClass
   */
  function Window_PartyCommand_GuideMixIn(windowClass) {
    const _makeCommandList = windowClass.makeCommandList;
    windowClass.makeCommandList = function () {
      _makeCommandList.call(this);
      if (settings.addPartyCommand) {
        this.addCommand(settings.partyCommandName, 'guide', true, 'keepActive');
      }
    };
    const _callOkHandler = windowClass.callOkHandler;
    windowClass.callOkHandler = function () {
      /**
       * シーンから渡されるハンドラで処理するため、ここで強引にactiveに変えておく
       */
      if (this.currentExt() === 'keepActive' && !this.active) {
        this.activate();
      }
      _callOkHandler.call(this);
    };
  }
  Window_PartyCommand_GuideMixIn(Window_PartyCommand.prototype);
})();
