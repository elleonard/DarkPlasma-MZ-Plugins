import { Scene_Battle_MoveCancelButtonMixIn } from '../../common/scene/battleCancelButtonToEdge';
import { Scene_Battle_InputtingWindowMixIn } from '../../common/scene/battleInputtingWindow';
import { settings } from './_build/DarkPlasma_BattleGuide_parameters';

class Data_BattleGuide {
  /**
   * @param {string} title
   * @param {string[]} texts
   * @param {Data_BattleGuideCondition} condition
   */
  constructor(title, texts, condition) {
    this._title = title;
    this._texts = texts;
    this._condition = condition;
  }

  get title() {
    return this._title;
  }

  get texts() {
    return this._texts;
  }

  /**
   * @return {boolean}
   */
  isValid() {
    return this._condition.isValid();
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
 * @type {Data_BattleGuide[]}
 */
let $dataBattleGuides = settings.guides.map((guide) => {
  return new Data_BattleGuide(
    guide.title,
    guide.texts,
    new Data_BattleGuideCondition(guide.condition.switchId, guide.condition.variableId, guide.condition.threshold)
  );
});

Scene_Battle_InputtingWindowMixIn(Scene_Battle.prototype);

/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
function Scene_Battle_GuideMixIn(sceneBattle) {
  const _createWindowLayer = sceneBattle.createWindowLayer;
  sceneBattle.createWindowLayer = function () {
    _createWindowLayer.call(this);
    this._guideWindowLayer = new WindowLayer();
    this._guideWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._guideWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._guideWindowLayer);
  };

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
   * ページめくりの音はカーソル音にしておく
   */
  playOkSound() {
    this.playCursorSound();
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
    this._page++;
    if (this._page >= this.maxPage()) {
      this._page = 0;
    }
    this.refresh();
  }

  refresh() {
    this.contents.clear();
    if (this._guide) {
      this.drawTextEx(this._guide.texts[this._page], 0, 0);
      this.drawPageNumber();
    }
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

  drawPageNumber() {
    this.initManualTexts();
    /**
     * refreshの中で実行されるため、直接代入する
     */
    this._isManualVisible = this.isPageNumberVisible();
    this.addManualText(`[ ${this._page + 1} / ${this.maxPage()} ]`);
    this.drawManual();
  }
}

Window_ManualTextMixIn(Window_BattleGuideText.prototype);

Window_CustomKeyHandlerMixIn(settings.key, Window_PartyCommand.prototype, 'guide');
Window_CustomKeyHandlerMixIn(settings.key, Window_ActorCommand.prototype, 'guide');

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
