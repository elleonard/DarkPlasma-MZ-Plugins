/// <reference path="./TinyMedal.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_gotoSceneMedal, command_processTinyMedal } from '../config/_build/DarkPlasma_TinyMedal_commands';
import { settings } from '../config/_build/DarkPlasma_TinyMedal_parameters';

const ITEM_KIND = {
  ITEM: 1,
  WEAPON: 2,
  ARMOR: 3,
};

/**
 * @type {RewardMessage[]}
 */
let reservedRewardMessages: RewardMessage[] = [];

class RewardItem {
  _id: number;
  _kind: number;
  _medalCount: number;

  /**
   * @param {number} id ID
   * @param {number} kind アイテム種別
   * @param {number} medalCount 必要メダル数
   */
  constructor(id: number, kind: number, medalCount: number) {
    this._id = id;
    this._kind = kind;
    this._medalCount = medalCount;
  }

  /**
   * @param {object} object パース済みオブジェクト
   * @param {number} kind アイテム種別
   * @return {RewardItem}
   */
  static fromObject(object: { id: number, medalCount: number }, kind: number): RewardItem {
    return new RewardItem(object.id, kind, object.medalCount);
  }

  get medalCount() {
    return this._medalCount;
  }

  get itemData() {
    switch (this._kind) {
      case ITEM_KIND.ITEM:
        return $dataItems[this._id];
      case ITEM_KIND.WEAPON:
        return $dataWeapons[this._id];
      case ITEM_KIND.ARMOR:
        return $dataArmors[this._id];
      default:
        return null;
    }
  }

  /**
   * 報酬獲得フラグ用のキー
   * @return {string}
   */
  rewardKey(): string {
    return `${this._medalCount}_${this._kind}_${this._id}`;
  }

  /**
   * 報酬アイテムを入手する
   */
  complete() {
    const item = this.itemData;
    if (!item) {
      return;
    }
    $gameParty.gainItem(item, 1);
    $gameSystem.completeMedalReward(this.rewardKey());
    rewardMessages
      .map((message) => {
        return new RewardMessage(item.name, this._medalCount, message);
      })
      .forEach((message) => message.reserve());
  }

  /**
   * @return {boolean} 入手済みかどうか
   */
  completed(): boolean {
    return $gameSystem.isMedalRewardCompleted(this.rewardKey());
  }
}

class RewardMessage {
  _itemName: string;
  _requiredMedalCount: number;
  _staticMessage: RewardMessageStatic;

  constructor(
    itemName: string,
    requiredMedalCount: number,
    staticMessage: RewardMessageStatic
  ) {
    this._itemName = itemName;
    this._requiredMedalCount = requiredMedalCount;
    this._staticMessage = staticMessage;
  }

  reserve() {
    reservedRewardMessages.push(this);
  }

  /**
   * アイテムを入手した際の報酬メッセージを表示する
   */
  show() {
    this._staticMessage.show(this._itemName, this._requiredMedalCount);
  }
}

/**
 * 報酬メッセージの固定部分
 */
class RewardMessageStatic {
  _message: string;
  _faceFile: string;
  _faceIndex: number;

  constructor(message: string, faceFile: string, faceIndex: number) {
    this._message = message;
    this._faceFile = faceFile;
    this._faceIndex = faceIndex;
  }

  static fromObject(object: { message: string, faceFile: string, faceIndex: number }) {
    return new RewardMessageStatic(object.message, object.faceFile, object.faceIndex);
  }

  /**
   * アイテムを入手した際の報酬メッセージを表示する
   */
  show(itemName: string, requiredMedalCount: number) {
    this.showFace();
    const message = this._message
      .replace(/\$\{itemName\}/gi, itemName)
      .replace(/\$\{medalCount\}/gi, `${requiredMedalCount}`);
    $gameMessage.add(message);
  }

  showFace() {
    if (this._faceFile) {
      $gameMessage.setFaceImage(this._faceFile, this._faceIndex);
    } else {
      $gameMessage.setFaceImage('', 0);
    }
  }
}

/**
 * @type {RewardItem[]}
 */
const rewardItems: RewardItem[] = settings.rewardItems
  .map((rewardItem) => RewardItem.fromObject(rewardItem, ITEM_KIND.ITEM))
  .concat(settings.rewardWeapons.map((rewardWeapon) => RewardItem.fromObject(rewardWeapon, ITEM_KIND.WEAPON)))
  .concat(settings.rewardArmors.map((rewardArmor) => RewardItem.fromObject(rewardArmor, ITEM_KIND.ARMOR)));

/**
 * @type {RewardMessageStatic[]}
 */
const rewardMessages = settings.rewardMessages.map((rewardMessage) => RewardMessageStatic.fromObject(rewardMessage));

PluginManager.registerCommand(pluginName, command_gotoSceneMedal, function () {
  SceneManager.push(Scene_TinyMedal);
});

PluginManager.registerCommand(pluginName, command_processTinyMedal, function () {
  $gameSystem.processTinyMedal();
  if (!$gameMessage.isBusy() && reservedRewardMessages.length > 0) {
    const reservedMessage = reservedRewardMessages.shift();
    reservedMessage?.show();
  }
});

/**
 * 2.xのデータから3.xのデータに変換する
 * @param {boolean[]} v2Array
 * @return {{[key: string]: boolean}}
 */
function convertV2DataToV3(v2Array: boolean[]) {
  const result: { [key: string]: boolean } = {};
  if (v2Array.length === 0) {
    return result;
  }
  /**
   * 元のセーブデータは先頭がダミーデータのため捨てる
   */
  v2Array.slice(1).forEach((isCompleted, oldRewardId) => {
    const reward = rewardItems[oldRewardId];
    if (reward) {
      result[reward.rewardKey()] = isCompleted;
    }
  });
  return result;
}

/**
 * @param {Game_System.prototype} gameSystem
 */
function Game_System_TinyMedalMixIn(gameSystem: Game_System) {
  const _initialize = gameSystem.initialize;
  gameSystem.initialize = function () {
    _initialize.call(this);
    this.initializeMedalRewardsCompletion();
  };

  /**
   * メダル報酬獲得フラグの初期化
   */
  gameSystem.initializeMedalRewardsCompletion = function () {
    this._medalRewardsCompletion = {};
  };

  /**
   * メダル報酬獲得フラグの更新
   * @param {string} rewardKey 報酬ID
   */
  gameSystem.completeMedalReward = function (rewardKey: string) {
    this._medalRewardsCompletion[rewardKey] = true;
  };

  gameSystem.isMedalRewardCompleted = function (rewardKey) {
    return this._medalRewardsCompletion[rewardKey] || false;
  };

  const _onAfterLoad = gameSystem.onAfterLoad;
  gameSystem.onAfterLoad = function () {
    _onAfterLoad.call(this);
    if (!this._medalRewardsCompletion) {
      this.initializeMedalRewardsCompletion();
    }
    /**
     * 2.xからのバージョンアップ用
     */
    if (settings.migrateV2ToV3 && Array.isArray(this._medalRewardsCompletion)) {
      this._medalRewardsCompletion = convertV2DataToV3(this._medalRewardsCompletion);
    }
  };

  gameSystem.processTinyMedal = function () {
    const beforeCount = $gameVariables.value(settings.medalCountVariable);
    $gameVariables.setValue(settings.medalCountVariable, beforeCount + $gameParty.numMedalItems());
    $gameParty.loseAllMedalItem();
    const afterCount = $gameVariables.value(settings.medalCountVariable);
    // 報酬アイテム入手
    const gainRewards = rewardItems
      .sort((a, b) => a.medalCount - b.medalCount)
      .filter((rewardItem) => !rewardItem.completed() && afterCount >= rewardItem.medalCount);
    gainRewards.forEach((rewardItem) => rewardItem.complete());
  };
}

Game_System_TinyMedalMixIn(Game_System.prototype);

/**
 * @param {Game_Party.prototype} gameParty
 */
function Game_Party_TinyMedalMixIn(gameParty: Game_Party) {
  /**
   * @return {number} メダルアイテムの数
   */
  gameParty.numMedalItems = function (): number {
    return this.numItems($dataItems[settings.medalItem]);
  };

  /**
   * @return {boolean} メダルアイテムを持っているかどうか
   */
  gameParty.hasMedalItem = function (): boolean {
    return this.hasItem($dataItems[settings.medalItem]);
  };

  /**
   * 所持しているメダルアイテムをすべて失う
   */
  gameParty.loseAllMedalItem = function () {
    this.loseItem($dataItems[settings.medalItem], this.numMedalItems(), false);
  };
}

Game_Party_TinyMedalMixIn(Game_Party.prototype);

/**
 * @param {Game_Interpreter.prototype} gameInterpreter
 */
function Game_Interpreter_TinyMedalMixIn(gameInterpreter: Game_Interpreter) {
  const _executeCommand = gameInterpreter.executeCommand;
  gameInterpreter.executeCommand = function () {
    /**
     * 報酬メッセージがあればそれを先に処理する
     */
    if (reservedRewardMessages.length > 0) {
      this.processReservedRewardMessages();
      return true;
    }
    return _executeCommand.call(this);
  };

  /**
   * 報酬メッセージを表示する
   */
  gameInterpreter.processReservedRewardMessages = function () {
    if (!$gameMessage.isBusy() && reservedRewardMessages.length > 0) {
      const reservedMessage = reservedRewardMessages.shift();
      reservedMessage?.show();
    }
  };
}

Game_Interpreter_TinyMedalMixIn(Game_Interpreter.prototype);

class Scene_TinyMedal extends Scene_Base {
  _rewardsAutoGained: boolean;
  _backgroundSprite: Sprite;
  _helpWindow: Window_Help;
  _menuWindow: Window_MedalMenu;
  _rewardsWindow: Window_MedalRewardList;
  _countWindow: Window_MedalCount;

  initialize() {
    Scene_Base.prototype.initialize.call(this);
    this._rewardsAutoGained = false;
  }

  create() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    if (!this._rewardsAutoGained) {
      this.createWindowLayer();
      this.createMedalWindow();
    }
  }

  createBackground() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
  }

  createMedalWindow() {
    this._helpWindow = new Window_Help(this.helpWindowRect());
    this._menuWindow = new Window_MedalMenu(this.medalMenuWindowRect());
    this._menuWindow.setHandler('pushMedal', this.commandPushMedal.bind(this));
    this._menuWindow.setHandler('showRewards', this.commandShowRewards.bind(this));
    this._menuWindow.setHandler('cancel', this.popScene.bind(this));
    this._rewardsWindow = new Window_MedalRewardList(this.medalRewardListWindowRect());
    this._rewardsWindow.setHandler('cancel', this.onRewardsListCancel.bind(this));
    this._rewardsWindow.setHelpWindow(this._helpWindow);
    this._countWindow = new Window_MedalCount(this.medalCountWindowRect());
    this.addChild(this._helpWindow);
    this.addChild(this._menuWindow);
    this.addChild(this._rewardsWindow);
    this.addChild(this._countWindow);
  }

  helpWindowRect() {
    return new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(2, false));
  }

  medalMenuWindowRect() {
    return new Rectangle(0, this._helpWindow.height, 240, this.calcWindowHeight(3, true));
  }

  medalRewardListWindowRect() {
    const x = this._menuWindow.width;
    const y = this._helpWindow.height;
    return new Rectangle(x, y, Graphics.boxWidth - x, Graphics.boxHeight - y);
  }

  medalCountWindowRect() {
    const height = this.calcWindowHeight(1, true);
    return new Rectangle(0, Graphics.boxHeight - height, 240, height);
  }

  /**
   * メダルを預かってもらう
   */
  processMedal() {
    $gameSystem.processTinyMedal();
  }

  /**
   * 所持しているメダルを預かってもらう
   */
  commandPushMedal() {
    this.processMedal();
    this.popScene();
  }

  commandShowRewards() {
    this._menuWindow.deselect();
    this._rewardsWindow.activate();
  }

  onRewardsListCancel() {
    this._rewardsWindow.deselect();
    this._menuWindow.activate();
    this._menuWindow.selectSymbol('showRewards');
  }
}

class Window_MedalMenu extends Window_Command {
  makeCommandList() {
    this.addCommand('メダルを預ける', 'pushMedal', $gameParty.hasMedalItem());
    this.addCommand('報酬を確認する', 'showRewards');
    this.addCommand('閉じる', 'cancel');
  }
}

type Constructor<T = Window_Selectable> = new (...args: any[]) => T;
function Window_ItemListLikeMixIn<TWindow extends Constructor, TItem>(windowClass: TWindow) {
  return class extends windowClass {
    _data: TItem[];

    maxCols() {
      return 2;
    };

    public colSpacing(): number {
      return 16;
    }

    public maxItems(): number {
      return this._data ? this._data.length : 1;
    }

    item(): TItem | null {
      return this.itemAt(this.index());
    }

    itemAt(index: number): TItem | null {
      return this._data && index >= 0 ? this._data[index] : null;
    }

    public isCurrentItemEnabled(): boolean {
      return this.isEnabled(this.item());
    }

    isEnabled(item: TItem | null): boolean {
      return false;
    }

    includes(item: TItem): boolean {
      return false;
    }

    makeItemList(): void {
    }

    public drawItem(index: number): void {
      const item = this.itemAt(index);
      if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(this.drawableItem(item), rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
      }
    }

    drawableItem(item: TItem): DataManager.DrawableItem|null {
      return null;
    }

    numberWidth(): number {
      return this.textWidth("000");
    }

    needsNumber(): boolean {
      return false;
    }

    drawItemNumber(item: TItem, x: number, y: number, width: number) {
      if (this.needsNumber()) {
        this.drawText(":", x, y, width - this.textWidth("00"), "right");
        this.drawText(`${this.number(item)}`, x, y, width, "right");
      }
    }

    number(item: TItem): number {
      return 0;
    }

    refresh() {
      this.makeItemList();
      super.refresh();
    }
  }
}

class Window_MedalRewardList extends Window_ItemListLikeMixIn<typeof Window_Selectable, RewardItem>(Window_Selectable) {
  constructor(rect: Rectangle) {
    super(rect);
    this.initialize(rect);
    this.refresh();
  }

  maxCols() {
    return 1;
  }

  isEnabled(item: RewardItem): boolean {
    return !item.completed();
  }

  makeItemList() {
    this._data = rewardItems;
  }

  includes(item: RewardItem): boolean {
    return true;
  }

  drawableItem(item: RewardItem): DataManager.DrawableItem | null {
    return item.itemData;
  }

  needsNumber(): boolean {
    return true;
  }

  number(item: RewardItem): number {
    return item.medalCount;
  }

  updateHelp() {
    this.setHelpWindowItem(this.item()?.itemData || null);
  }
}

class Window_MedalCount extends Window_Gold {
  value() {
    return $gameParty.numMedalItems();
  }

  currencyUnit() {
    return settings.medalUnit;
  }
}

declare global {
  var Data_TinyMedal_RewardItem: typeof RewardItem;
}
globalThis.Data_TinyMedal_RewardItem = RewardItem;
