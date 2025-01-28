/// <reference path="./BattleGuide.d.ts" />

import { Scene_Battle_MoveCancelButtonMixIn } from '../../../common/scene/battleCancelButtonToEdge';
import { Scene_Battle_InputtingWindowMixIn } from '../../../common/scene/battleInputtingWindow';
import { settings } from '../config/_build/DarkPlasma_BattleGuide_parameters';

class Data_BattleGuide {
  _title: string;
  _pages: Data_BattleGuidePage[];
  _condition: Data_BattleGuideCondition;

  constructor(title: string, pages: Data_BattleGuidePage[], condition: Data_BattleGuideCondition) {
    this._title = title;
    this._pages = pages;
    this._condition = condition;
  }

  static fromPluginSetting(title: string, texts: string[], condition: Data_BattleGuideCondition): Data_BattleGuide {
    return new Data_BattleGuide(
      title,
      texts.map(text => new Data_BattleGuidePage(text)),
      condition
    );
  }

  static fromGlossaryItem(item: MZ.Item, condition: Data_BattleGuideCondition): Data_BattleGuide {
    const texts = getGlossaryDescription(item);
    if (!texts) {
      throw Error(`説明文のない用語です: ${item.name}`);
    }
    return new Data_BattleGuide(
      item.name,
      texts.map((_, index) => Data_BattleGuidePage.fromGlossaryItem(item, index+1)),
      condition
    );
  }

  get title() {
    return this._title;
  }

  get texts() {
    return this._pages.filter(page => page.isValid()).map(page => page.text);
  }

  picture(page: number): Data_BattleGuidePicture|undefined {
    return this._pages[page].picture;
  }

  /**
   * @return {boolean}
   */
  isValid(): boolean {
    return this._condition.isValid();
  }
}

class Data_BattleGuidePage {
  _text: string;
  _picture?: Data_BattleGuidePicture;
  _condition?: Data_BattleGuideCondition;

  constructor(text: string, picture?: Data_BattleGuidePicture, condition?: Data_BattleGuideCondition) {
    this._text = text;
    this._picture = picture;
    this._condition = condition;
  }

  static fromGlossaryItem(item: MZ.Item, page: number): Data_BattleGuidePage {
    const pageSuffix = page === 1 ? "" : `${page}`;
    return new Data_BattleGuidePage(
      String(item.meta[`SG説明${pageSuffix}`] || item.meta[`SGDescription${pageSuffix}`]),
      Data_BattleGuidePicture.fromGlossaryItem(item, page),
      Data_BattleGuideCondition.fromGlossaryItem(item, page)
    );
  }

  get text() {
    return this._text;
  }

  get picture() {
    return this._picture;
  }

  isValid(): boolean {
    return !this._condition || this._condition.isValid();
  }
}

type Data_BattleGuidePicturePriority = "bottom"|"top";
type Data_BattleGuidePictureAlign = "left"|"center"|"right";

class Data_BattleGuidePicture {
  _name: string;
  _xOffset: number;
  _yOffset: number;
  _priority: Data_BattleGuidePicturePriority;
  _align: Data_BattleGuidePictureAlign;

  constructor(
    name: string,
    xOffset: number,
    yOffset: number,
    priority: Data_BattleGuidePicturePriority,
    align: Data_BattleGuidePictureAlign
  ) {
    this._name = name;
    this._xOffset = xOffset;
    this._yOffset = yOffset;
    this._priority = priority;
    this._align = align;
  }

  static fromGlossaryItem(item: MZ.Item, page: number): Data_BattleGuidePicture|undefined {
    const pageSuffix = page === 1 ? "" : `${page}`;
    const name = item.meta[`SGピクチャ${pageSuffix}`] || item.meta[`SGPicture${pageSuffix}`];
    if (!name) {
      return undefined;
    }
    const xOffset = Number(item.meta[`SGピクチャX${pageSuffix}`] || item.meta[`SGPictureX${pageSuffix}`] || 0);
    const yOffset = Number(item.meta[`SGピクチャY${pageSuffix}`] || item.meta[`SGPictureY${pageSuffix}`] || 0);
    const sceneGlossaryParameters = PluginManager.parameters("SceneGlossary");
    const priority = String(item.meta[`SGピクチャ優先度${pageSuffix}`] || item.meta[`SGPicturePriority${pageSuffix}`] || sceneGlossaryParameters.PicturePriority);
    const align = String(item.meta[`SGピクチャ揃え${pageSuffix}`] || item.meta[`SGPictureAlign${pageSuffix}`] || sceneGlossaryParameters.PictureAlign);
    if (priority !== "top" && priority !== "bottom") {
      throw Error(`不正な優先度設定です: ${item.name}: ${priority}`);
    }
    if (align !== "left" && align !== "center" && align !== "right") {
      throw Error(`不正な揃え設定です: ${item.name}: ${align}`)
    }
    return new Data_BattleGuidePicture(
      String(name),
      xOffset,
      yOffset,
      priority,
      align
    );
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

  adjustedX(baseX: number, contentsWidth: number, pictureWidth: number): number {
    switch (this.align) {
      case "left":
        return baseX + this.xOffset;
      case "center":
        return baseX + contentsWidth / 2 - pictureWidth / 2 + this.xOffset;
      case "right":
        return baseX + contentsWidth - pictureWidth + this.xOffset;
    }
  }
}

class Data_BattleGuideCondition {
  _switchId: number;
  _variableId: number;
  _threshold: number;

  /**
   * @param {number} switchId
   * @param {number} variableId
   * @param {number} threshold
   */
  constructor(switchId: number, variableId: number, threshold: number) {
    this._switchId = switchId;
    this._variableId = variableId;
    this._threshold = threshold;
  }

  static fromGlossaryItem(item: MZ.Item, page: number): Data_BattleGuideCondition|undefined {
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
      const switchId = item.meta[`SG表示スイッチ${i}`];
      if (switchId) {
        return new Data_BattleGuideCondition(
          Number(switchId),
          0,
          0
        );
      }
    }
    return undefined;
  }

  /**
   * @return {boolean}
   */
  isValid(): boolean {
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
function isGlossaryItem(item: MZ.Item): boolean {
  return !!item && !!item.meta && !!(item.meta['SG説明'] || item.meta.SGDescription);
}

/**
 * SceneGlossary.js で定義される用語集アイテムの説明文を取得する
 */
function getGlossaryDescription(item: MZ.Item): string[]|null {
  if (!isGlossaryItem(item)) {
    return null;
  }
  const result: string[] = [];
  const metaTag = item.meta['SG説明'] ? 'SG説明' : 'SGDescription';
  result.push(String(item.meta[metaTag]));
  for (let i = 2; item.meta[`${metaTag}${i}`]; i++) {
    result.push(String(item.meta[`${metaTag}${i}`]));
  }
  return result;
}

let $dataBattleGuides: Data_BattleGuide[] = [];

function Game_Temp_BattleGuideMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._needsBattleGuideRefresh = false;
  };

  gameTemp.requestBattleGuideRefresh = function () {
    this._needsBattleGuideRefresh = $gameParty.inBattle();
  };

  gameTemp.clearBattleGuideRefreshRequest = function () {
    this._needsBattleGuideRefresh = false;
  };

  gameTemp.isBattleGuideRefreshRequested = function () {
    return this._needsBattleGuideRefresh;
  };
}

Game_Temp_BattleGuideMixIn(Game_Temp.prototype);

function Game_Switches_Variables_BattleGuideMixIn(gameClass: Game_Switches|Game_Variables) {
  const _onChange = gameClass.onChange;
  gameClass.onChange = function () {
    _onChange.call(this);
    $gameTemp.requestBattleGuideRefresh();
  };
}

Game_Switches_Variables_BattleGuideMixIn(Game_Switches.prototype);
Game_Switches_Variables_BattleGuideMixIn(Game_Variables.prototype);

function Scene_Boot_GuideMixIn(sceneBoot: Scene_Boot) {
  const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
  sceneBoot.onDatabaseLoaded = function () {
    _onDatabaseLoaded.call(this);
    $dataBattleGuides = settings.guides.map((guide: SettingsGuide) => {
      return guide.glossaryItem
        ? Data_BattleGuide.fromGlossaryItem(
            $dataItems[guide.glossaryItem],
            new Data_BattleGuideCondition(
              guide.condition.switchId,
              guide.condition.variableId,
              guide.condition.threshold
            )
          )
        : Data_BattleGuide.fromPluginSetting(
            guide.title,
            guide.texts,
            new Data_BattleGuideCondition(
              guide.condition.switchId,
              guide.condition.variableId,
              guide.condition.threshold
            )
          );
    });
  };
}

Scene_Boot_GuideMixIn(Scene_Boot.prototype);

Scene_Battle_InputtingWindowMixIn(Scene_Battle.prototype);

/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
function Scene_Battle_GuideMixIn(sceneBattle: Scene_Battle) {
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
  _textWindow: Window_BattleGuideText;
  _list: Data_BattleGuide[];

  initialize(rect: Rectangle) {
    super.initialize(rect);
    this.makeItemList();
    this.refresh();
  }

  /**
   * @param {Window_BattleGuideText} textWindow
   */
  setTextWindow(textWindow: Window_BattleGuideText) {
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

  drawItem(index: number) {
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
  _guide: Data_BattleGuide;
  _page: number;

  /**
   * @param {Data_BattleGuide} guide
   */
  setGuide(guide: Data_BattleGuide) {
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
  setPage(page: number) {
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

  public update(): void {
    super.update();
    if ($gameTemp.isBattleGuideRefreshRequested()) {
      this.refresh();
      $gameTemp.clearBattleGuideRefreshRequest();
    }
  }

  updateArrows() {
    this.downArrowVisible = this._page > 0;
    this.upArrowVisible = this._page < this.maxPage() - 1;
  }

  /**
   * @return {boolean}
   */
  isPageNumberVisible(): boolean {
    return (
      (settings.showPageNumber === SHOW_PAGE_NUMBER.DEFAULT && this.maxPage() > 1) ||
      settings.showPageNumber === SHOW_PAGE_NUMBER.ALWAYS
    );
  }

  drawGuide(text: string, x: number, y: number, bitmap?: Bitmap, picture?: Data_BattleGuidePicture) {
    const pictureHandler = bitmap && picture
      ? () => {
          this.drawPicture(
            bitmap,
            picture.adjustedX(x, this.contentsWidth(), bitmap.width),
            y + picture.yOffset
          )
        }
      : () => {};
    if (picture?.priority === "top") {
      pictureHandler();
    }
    this.drawTextEx(text, x, y);
    if (picture?.priority === "bottom") {
      pictureHandler();
    }
  }

  drawPicture(bitmap: Bitmap, x: number, y: number) {
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
function Window_PartyCommand_GuideMixIn(windowClass: Window_PartyCommand) {
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
