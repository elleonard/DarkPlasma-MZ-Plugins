// DarkPlasma_TinyMedal 3.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/05/14 3.0.0 報酬獲得済みフラグのキーを変更（2.x以前とセーブデータ互換性がありません）
 * 2021/07/05 2.2.2 MZ 1.3.2に対応
 * 2021/06/22 2.2.1 サブフォルダからの読み込みに対応
 * 2021/02/13 2.2.0 報酬メッセージ複数行対応
 * 2020/10/10 2.1.2 リファクタ
 * 2020/09/29 2.1.1 プラグインコマンドに説明を追加
 * 2020/09/18 2.1.0 入手順を必要メダルの少ない順に変更
 * 2020/09/10 2.0.0 パラメータ名を変更
 *                  ウェイトなし歩行が遅れる不具合を修正
 * 2020/08/25 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc ちいさなメダルシステム
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param medalItem
 * @desc メダルアイテム
 * @text メダルアイテム
 * @type item
 * @default 1
 *
 * @param medalCountVariable
 * @desc メダルの預かり数を記録する変数
 * @text メダル預かり数変数
 * @type variable
 * @default 1
 * @min 1
 *
 * @param medalUnit
 * @desc メダルカウントの単位
 * @text メダルの単位
 * @type string
 * @default 枚
 *
 * @param rewardItems
 * @desc 報酬アイテムの一覧
 * @text 報酬アイテム
 * @type struct<RewardItems>[]
 * @default []
 *
 * @param rewardWeapons
 * @desc 報酬武器の一覧
 * @text 報酬武器
 * @type struct<RewardWeapons>[]
 * @default []
 *
 * @param rewardArmors
 * @desc 報酬防具の一覧
 * @text 報酬防具
 * @type struct<RewardArmors>[]
 * @default []
 *
 * @param rewardMessages
 * @desc 報酬メッセージリスト
 * @text 報酬メッセージ
 * @type struct<RewardMessage>[]
 * @default ["{\"message\":\"${itemName} を手に入れた！\",\"faceFile\":\"\",\"faceIndex\":\"0\"}"]
 *
 * @param migrateV2ToV3
 * @desc 2.xからバージョンアップする際のセーブデータ変換をするかどうか。詳細はヘルプ
 * @text 2.xからのセーブデータ変換
 * @type boolean
 * @default true
 *
 * @command gotoSceneMedal
 * @text ちいさなメダルシーンを開く
 * @desc 小さなメダルメニューが開き、報酬アイテム一覧が確認できます。
 *
 * @command processTinyMedal
 * @text ちいさなメダルを渡す
 * @desc ちいさなメダルシーンに移行せずにメダルを渡す処理だけします。
 *
 * @help
 * version: 3.0.0
 * DQシリーズのちいさなメダルシステム（累計式）を実現します。
 *
 * 同じメダル数で同じアイテム・武器・防具の報酬を
 * 設定した場合の動作は保証しません。
 * デフォルトにおける獲得済みフラグのキーは
 * メダル数とアイテム・武器・防具の種別とIDです。
 * 例: アイテムID:1のアイテムをメダル10枚で獲得した場合のキー
 * 10_1_1
 *
 * これをカスタマイズしたい場合、
 * 以下を上書きするプラグインを追加してください。
 * Data_TinyMedal_RewardItem.prototype.rewardKey: () => string
 *
 * ゲームのリリース後にキーとなる値を変更してしまうと、
 * セーブデータ互換性を破壊することに注意してください。
 *
 * 2.xからのセーブデータ変換について
 * この機能をONにした場合、2.x以前を使用していたときのセーブデータを
 * ロードした際に3.x用に変換します。
 * ただし、報酬設定の順序や内容を変更すると正しくセーブデータが変換されず、
 * 意図しない挙動となることに注意してください。
 *
 * 2.xから3.x以降へバージョンアップする場合、
 * セーブデータ変換をOFFにすると、
 * 2.x以前を使用していたときのセーブデータにおいて、
 * 報酬獲得状況がリセットされます。
 */
/*~struct~RewardItems:
 * @param medalCount
 * @desc アイテムをもらうために必要なメダルの数
 * @text 必要メダル数
 * @type number
 * @default 1
 *
 * @param id
 * @desc もらえるアイテム
 * @text 報酬アイテム
 * @type item
 * @default 1
 */
/*~struct~RewardWeapons:
 * @param medalCount
 * @desc 武器をもらうために必要なメダルの数
 * @text 必要メダル数
 * @type number
 * @default 1
 *
 * @param id
 * @desc もらえる武器
 * @text 報酬武器
 * @type weapon
 * @default 1
 */
/*~struct~RewardArmors:
 * @param medalCount
 * @desc 防具をもらうために必要なメダルの数
 * @text 必要メダル数
 * @type number
 * @default 1
 *
 * @param id
 * @desc もらえる防具
 * @text 報酬防具
 * @type armor
 * @default 1
 */
/*~struct~RewardMessage:
 * @param message
 * @desc 報酬をもらった際のメッセージ
 * @text 報酬メッセージ
 * @type multiline_string
 * @default ${itemName} を手に入れた！
 *
 * @param faceFile
 * @desc 報酬メッセージの顔グラファイル
 * @text 顔グラファイル
 * @type file
 * @dir img/faces
 *
 * @param faceIndex
 * @desc 報酬メッセージの顔グラ番号
 * @text 顔グラ番号
 * @type number
 * @default 0
 * @max 7
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const command_gotoSceneMedal = 'gotoSceneMedal';

  const command_processTinyMedal = 'processTinyMedal';

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    medalItem: Number(pluginParameters.medalItem || 1),
    medalCountVariable: Number(pluginParameters.medalCountVariable || 1),
    medalUnit: String(pluginParameters.medalUnit || '枚'),
    rewardItems: JSON.parse(pluginParameters.rewardItems || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          medalCount: Number(parsed.medalCount || 1),
          id: Number(parsed.id || 1),
        };
      })(e || '{}');
    }),
    rewardWeapons: JSON.parse(pluginParameters.rewardWeapons || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          medalCount: Number(parsed.medalCount || 1),
          id: Number(parsed.id || 1),
        };
      })(e || '{}');
    }),
    rewardArmors: JSON.parse(pluginParameters.rewardArmors || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          medalCount: Number(parsed.medalCount || 1),
          id: Number(parsed.id || 1),
        };
      })(e || '{}');
    }),
    rewardMessages: JSON.parse(
      pluginParameters.rewardMessages || '[{"message":"${itemName} を手に入れた！","faceFile":"","faceIndex":"0"}]'
    ).map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          message: String(parsed.message || '${itemName} を手に入れた！'),
          faceFile: String(parsed.faceFile || ''),
          faceIndex: Number(parsed.faceIndex || 0),
        };
      })(e || '{}');
    }),
    migrateV2ToV3: String(pluginParameters.migrateV2ToV3 || true) === 'true',
  };

  const ITEM_KIND = {
    ITEM: 1,
    WEAPON: 2,
    ARMOR: 3,
  };

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
    }

    /**
     * @param {object} object パース済みオブジェクト
     * @param {number} kind アイテム種別
     * @return {RewardItem}
     */
    static fromObject(object, kind) {
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
    rewardKey() {
      return `${this._medalCount}_${this._kind}_${this._id}`;
    }

    /**
     * 報酬アイテムを入手する
     */
    complete() {
      $gameParty.gainItem(this.itemData, 1);
      $gameSystem.completeMedalReward(this.rewardKey());
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
      return $gameSystem.isMedalRewardCompleted(this.rewardKey());
    }
  }

  globalThis.Data_TinyMedal_RewardItem = RewardItem;

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

  /**
   * @type {RewardItem[]}
   */
  const rewardItems = settings.rewardItems
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
      reservedMessage.show();
    }
  });

  /**
   * 2.xのデータから3.xのデータに変換する
   * @param {boolean[]} v2Array
   * @return {{[key: string]: boolean}}
   */
  function convertV2DataToV3(v2Array) {
    const result = {};
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
  function Game_System_TinyMedalMixIn(gameSystem) {
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
    gameSystem.completeMedalReward = function (rewardKey) {
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
  function Game_Party_TinyMedalMixIn(gameParty) {
    /**
     * @return {number} メダルアイテムの数
     */
    gameParty.numMedalItems = function () {
      return this.numItems($dataItems[settings.medalItem]);
    };

    /**
     * @return {boolean} メダルアイテムを持っているかどうか
     */
    gameParty.hasMedalItem = function () {
      return this.hasItem($dataItems[settings.medalItem]);
    };

    /**
     * 所持しているメダルアイテムをすべて失う
     */
    gameParty.loseAllMedalItem = function () {
      this.loseItem($dataItems[settings.medalItem], this.numMedalItems());
    };
  }

  Game_Party_TinyMedalMixIn(Game_Party.prototype);

  /**
   * @param {Game_Interpreter.prototype} gameInterpreter
   */
  function Game_Interpreter_TinyMedalMixIn(gameInterpreter) {
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
        reservedMessage.show();
      }
    };
  }

  Game_Interpreter_TinyMedalMixIn(Game_Interpreter.prototype);

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
})();
