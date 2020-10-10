import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_TinyMedal_parameters';

const ITEM_KIND = {
  ITEM: 1,
  WEAPON: 2,
  ARMOR: 3,
};

let autoIncrementRewardId = 0;

/**
 * @type {RewardMessage[]}
 */
let reservedRewardMessages = [];

class RewardItem {
  /**
   * @param {number} id ID
   * @param {number} kind アイテム種別
   * @param {number} medalCount 必要メダル数
   */
  constructor(id, kind, medalCount) {
    this._id = id;
    this._kind = kind;
    this._medalCount = medalCount;
    this._rewardId = ++autoIncrementRewardId;
  }

  /**
   * @param {object} object パース済みオブジェクト
   * @param {number} kind アイテム種別
   * @return {RewardItem}
   */
  static fromObject(object, kind) {
    return new RewardItem(object.id, kind, object.medalCount);
  }

  get rewardId() {
    return this._rewardId;
  }

  get medalCount() {
    return this._medalCount;
  }

  get rewardData() {
    return {
      data: this.itemData,
      metalCount: this._medalCount,
      rewardId: this._rewardId,
    };
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
   * 報酬アイテムを入手する
   */
  complete() {
    $gameParty.gainItem(this.itemData, 1);
    $gameSystem.completeMedalReward(this._rewardId);
    rewardMessages
      .map((message) => {
        return new RewardMessage(this.itemData.name, message);
      })
      .forEach((message) => message.reserve());
  }

  /**
   * @return {boolean} 入手済みかどうか
   */
  completed() {
    return $gameSystem.isMedalRewardCompleted(this._rewardId);
  }
}

class RewardMessage {
  /**
   * @param {string} itemName アイテム名
   * @param {RewardMessageStatic} staticMessage 固定部分
   */
  constructor(itemName, staticMessage) {
    this._itemName = itemName;
    this._staticMessage = staticMessage;
  }

  reserve() {
    reservedRewardMessages.push(this);
  }

  /**
   * アイテムを入手した際の報酬メッセージを表示する
   */
  show() {
    this._staticMessage.show(this._itemName);
  }
}

/**
 * 報酬メッセージの固定部分
 */
class RewardMessageStatic {
  constructor(message, faceFile, faceIndex) {
    this._message = message;
    this._faceFile = faceFile;
    this._faceIndex = faceIndex;
  }

  static fromObject(object) {
    return new RewardMessageStatic(object.message, object.faceFile, object.faceIndex);
  }

  /**
   * アイテムを入手した際の報酬メッセージを表示する
   * @param {string} itemName アイテム名
   */
  show(itemName) {
    this.showFace();
    const message = this._message.replace(/\$\{itemName\}/gi, itemName);
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

const rewardItems = settings.rewardItems
  .map((rewardItem) => RewardItem.fromObject(rewardItem, ITEM_KIND.ITEM))
  .concat(settings.rewardWeapons.map((rewardWeapon) => RewardItem.fromObject(rewardWeapon, ITEM_KIND.WEAPON)))
  .concat(settings.rewardArmors.map((rewardArmor) => RewardItem.fromObject(rewardArmor, ITEM_KIND.ARMOR)));

const rewardMessages = settings.rewardMessages.map((rewardMessage) => RewardMessageStatic.fromObject(rewardMessage));

class Scene_TinyMedal extends Scene_Base {
  constructor() {
    super();
    this.initialize.apply(this, arguments);
  }

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

  /**
   * @return {Rectangle}
   */
  helpWindowRect() {
    return new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(2, false));
  }

  /**
   * @return {Rectangle}
   */
  medalMenuWindowRect() {
    return new Rectangle(0, this._helpWindow.height, 240, this.calcWindowHeight(3, true));
  }

  /**
   * @return {Rectangle}
   */
  medalRewardListWindowRect() {
    const x = this._menuWindow.width;
    const y = this._helpWindow.height;
    return new Rectangle(x, y, Graphics.boxWidth - x, Graphics.boxHeight - y);
  }

  /**
   * @return {Rectangle}
   */
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
    this._rewardsWindow.selectLast();
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

class Window_MedalRewardList extends Window_ItemList {
  constructor(rect) {
    super(rect);
    this.initialize.apply(this, arguments);
    this.refresh();
  }

  maxCols() {
    return 1;
  }

  isEnabled(item) {
    return !item.completed();
  }

  makeItemList() {
    this._data = rewardItems;
  }

  drawItem(index) {
    const item = this._data[index];
    if (item) {
      const numberWidth = this.numberWidth();
      let rect = this.itemRect(index);
      rect.width -= this.itemPadding();
      this.changePaintOpacity(this.isEnabled(item));
      this.drawItemName(item.itemData, rect.x, rect.y, rect.width - numberWidth);
      this.drawItemNumber(item, rect.x, rect.y, rect.width);
      this.changePaintOpacity(1);
    }
  }

  drawItemNumber(item, x, y, width) {
    this.drawText(':', x, y, width - this.textWidth('00'), 'right');
    this.drawText(item.medalCount, x, y, width, 'right');
  }

  updateHelp() {
    this.setHelpWindowItem(this.item().itemData);
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

const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
  _Game_System_initialize.call(this);
  this.initializeMedalRewardsCompletion();
};

/**
 * メダル報酬獲得状態の初期化
 */
Game_System.prototype.initializeMedalRewardsCompletion = function () {
  this._medalRewardsCompletion = rewardItems.map((_) => false);
  this._medalRewardsCompletion.unshift(true);
};

/**
 * メダル報酬を獲得する
 * @param {number} rewardId 報酬ID
 */
Game_System.prototype.completeMedalReward = function (rewardId) {
  this._medalRewardsCompletion[rewardId] = true;
};

Game_System.prototype.isMedalRewardCompleted = function (rewardId) {
  return this._medalRewardsCompletion[rewardId];
};

const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function () {
  _Game_System_onAfterLoad.call(this);
  if (!this._medalRewardsCompletion) {
    this.initializeMedalRewardsCompletion();
  }
};

/**
 * @return {number} メダルアイテムの数
 */
Game_Party.prototype.numMedalItems = function () {
  return this.numItems($dataItems[settings.medalItem]);
};

/**
 * @return {boolean} メダルアイテムを持っているかどうか
 */
Game_Party.prototype.hasMedalItem = function () {
  return this.hasItem($dataItems[settings.medalItem]);
};

/**
 * 所持しているメダルアイテムをすべて失う
 */
Game_Party.prototype.loseAllMedalItem = function () {
  this.loseItem($dataItems[settings.medalItem], this.numMedalItems());
};

Game_System.prototype.processTinyMedal = function () {
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

const _Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand;
Game_Interpreter.prototype.executeCommand = function () {
  /**
   * 報酬メッセージがあればそれを先に処理する
   */
  if (reservedRewardMessages.length > 0) {
    this.processReservedRewardMessages();
    return true;
  }
  return _Game_Interpreter_executeCommand.call(this);
};

/**
 * 報酬メッセージを表示する
 */
Game_Interpreter.prototype.processReservedRewardMessages = function () {
  if (!$gameMessage.isBusy() && reservedRewardMessages.length > 0) {
    const reservedMessage = reservedRewardMessages.shift();
    reservedMessage.show();
  }
};

PluginManager.registerCommand(pluginName, 'gotoSceneMedal', function () {
  SceneManager.push(Scene_TinyMedal);
});

PluginManager.registerCommand(pluginName, 'processTinyMedal', function () {
  $gameSystem.processTinyMedal();
  if (!$gameMessage.isBusy() && reservedRewardMessages.length > 0) {
    const reservedMessage = reservedRewardMessages.shift();
    reservedMessage.show();
  }
});
