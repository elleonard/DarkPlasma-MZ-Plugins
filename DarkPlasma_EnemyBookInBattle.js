// DarkPlasma_EnemyBookInBattle 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/03/18 1.0.0 公開
 */

/*:en
 * @plugindesc open enemy book in battle.
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_EnemyBook
 * @orderAfter DarkPlasma_EnemyBook
 *
 * @param openKeyInBattle
 * @desc Open key for enemy book window in battle
 * @text Open Key In Battle
 * @type select
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 * @default shift
 *
 * @param skipToBattlerEnemy
 * @desc Skip to battle enemy when pageup or pagedown key pressed.
 * @text Skip To Battle Enemy
 * @type boolean
 * @default false
 *
 * @param battlerEnemyToTop
 * @desc Display battler enemy to top of the list.
 * @text Battler Enemy to Top
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.0.0
 * You can open enemy book in battle.
 *
 * If you open enemy book in battle,
 * highlight enemy names included in the troop.
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_EnemyBook version:5.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_EnemyBook
 */

/*:
 * @plugindesc 戦闘中に敵キャラ図鑑を開く
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_EnemyBook
 * @orderAfter DarkPlasma_EnemyBook
 *
 * @param openKeyInBattle
 * @desc 戦闘中に図鑑ウィンドウを開閉するためのボタン。戦闘中に開ける設定の場合のみ有効です
 * @text 図鑑ウィンドウボタン
 * @type select
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 * @default shift
 *
 * @param skipToBattlerEnemy
 * @desc pageup,pagedownキーで出現モンスターにフォーカスします。
 * @text 出現モンスターフォーカス
 * @type boolean
 * @default false
 *
 * @param battlerEnemyToTop
 * @desc ONの場合、出現モンスターを最上部に表示する
 * @text 出現モンスター最上部表示
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.0.0
 * 戦闘中に敵キャラ図鑑を開きます。
 * 戦闘中に開いた場合、出現している敵がリスト中でハイライトされます。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_EnemyBook version:5.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_EnemyBook
 */

(() => {
  'use strict';

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
    openKeyInBattle: String(pluginParameters.openKeyInBattle || `shift`),
    skipToBattlerEnemy: String(pluginParameters.skipToBattlerEnemy || false) === 'true',
    battlerEnemyToTop: String(pluginParameters.battlerEnemyToTop || true) === 'true',
  };

  /**
   * @param {Scene_Battle.prototype} sceneBattle
   */
  function Scene_Battle_EnemyBookMixIn(sceneBattle) {
    const _createWindowLayer = sceneBattle.createWindowLayer;
    sceneBattle.createWindowLayer = function () {
      _createWindowLayer.call(this);
      this.createEnemyBookWindowLayer();
    };
    sceneBattle.createEnemyBookWindowLayer = function () {
      this._enemyBookLayer = new WindowLayer();
      this._enemyBookLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
      this._enemyBookLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
      this.addChild(this._enemyBookLayer);
    };
    const _createAllWindows = sceneBattle.createAllWindows;
    sceneBattle.createAllWindows = function () {
      _createAllWindows.call(this);
      this.createEnemyBookWindows();
    };
    const _createPartyCommandWindow = sceneBattle.createPartyCommandWindow;
    sceneBattle.createPartyCommandWindow = function () {
      _createPartyCommandWindow.call(this);
      this._partyCommandWindow.setHandler('enemyBook', this.openEnemyBook.bind(this));
    };
    const _createActorCommandWindow = sceneBattle.createActorCommandWindow;
    sceneBattle.createActorCommandWindow = function () {
      _createActorCommandWindow.call(this);
      this._actorCommandWindow.setHandler('enemyBook', this.openEnemyBook.bind(this));
    };
    const _isAnyInputWindowActive = sceneBattle.isAnyInputWindowActive;
    sceneBattle.isAnyInputWindowActive = function () {
      return _isAnyInputWindowActive.call(this) || this._enemyBookWindows.isActive();
    };
    sceneBattle.createEnemyBookWindows = function () {
      this._enemyBookWindows = new EnemyBookWindows(
        this.closeEnemyBook.bind(this),
        this._enemyBookLayer,
        Scene_EnemyBook.prototype.percentWindowRect.call(this),
        Scene_EnemyBook.prototype.indexWindowRect.call(this),
        Scene_EnemyBook.prototype.mainWindowRect.call(this),
        true,
      );
      this.closeEnemyBook();
    };
    sceneBattle.percentWindowHeight = function () {
      return Scene_EnemyBook.prototype.percentWindowHeight.call(this);
    };
    sceneBattle.indexWindowWidth = function () {
      return Scene_EnemyBook.prototype.indexWindowWidth.call(this);
    };
    sceneBattle.indexWindowHeight = function () {
      return Scene_EnemyBook.prototype.indexWindowHeight.call(this);
    };
    sceneBattle.closeEnemyBook = function () {
      this._enemyBookWindows.close();
      if (this._returnFromEnemyBook) {
        this._returnFromEnemyBook.activate();
        this._returnFromEnemyBook = null;
      }
    };
    sceneBattle.openEnemyBook = function () {
      this._returnFromEnemyBook = this.inputtingWindow();
      if (this._returnFromEnemyBook) {
        this._returnFromEnemyBook.deactivate();
      }
      this._enemyBookWindows.open();
    };
  }
  Scene_Battle_InputtingWindowMixIn(Scene_Battle.prototype);
  Scene_Battle_EnemyBookMixIn(Scene_Battle.prototype);
  Window_CustomKeyHandlerMixIn(settings.openKeyInBattle, Window_PartyCommand.prototype, 'enemyBook');
  Window_CustomKeyHandlerMixIn(settings.openKeyInBattle, Window_ActorCommand.prototype, 'enemyBook');
  function Window_EnemyBookIndex_InBattleMixIn(windowClass) {
    const _forcusOnFirst = windowClass.forcusOnFirst;
    windowClass.forcusOnFirst = function () {
      _forcusOnFirst.call(this);
      if (this._isInBattle) {
        this._battlerEnemyIndexes = Array.from(
          new Set(
            $gameTroop
              .members()
              .map((gameEnemy) => this._list.indexOf(gameEnemy.enemy()))
              .filter((index) => index >= 0),
          ),
        ).sort((a, b) => a - b);
        const firstIndex = this._battlerEnemyIndexes.length > 0 ? this._battlerEnemyIndexes[0] : -1;
        if (firstIndex >= 0) {
          this.setTopRow(firstIndex);
          this.select(firstIndex);
        }
      }
    };
    const _processHandling = windowClass.processHandling;
    windowClass.processHandling = function () {
      _processHandling.call(this);
      if (this.active && $gameParty.inBattle() && Input.isTriggered(settings.openKeyInBattle)) {
        this.processCancel();
      }
    };
    const _mustHighlight = windowClass.mustHighlight;
    windowClass.mustHighlight = function (enemy) {
      return (
        _mustHighlight.call(this, enemy) ||
        (this._isInBattle && $gameTroop.members().some((battlerEnemy) => battlerEnemy.enemyId() === enemy.id))
      );
    };
    const _makeItemList = windowClass.makeItemList;
    windowClass.makeItemList = function () {
      _makeItemList.call(this);
      if (this._isInBattle && settings.battlerEnemyToTop) {
        this._list = this._list
          .filter((enemy) => $gameTroop.members().some((gameEnemy) => gameEnemy.enemy() === enemy))
          .concat(this._list.filter((enemy) => $gameTroop.members().every((gameEnemy) => gameEnemy.enemy() !== enemy)));
      }
    };
    windowClass.battlerEnemyIsInBook = function () {
      return this._battlerEnemyIndexes && this._battlerEnemyIndexes.length > 0;
    };
    const _cursorPagedown = windowClass.cursorPagedown;
    windowClass.cursorPagedown = function () {
      if (this.battlerEnemyIsInBook() && settings.skipToBattlerEnemy) {
        this.selectNextBattlerEnemy();
      } else {
        _cursorPagedown.call(this);
      }
    };
    const _cursorPageup = windowClass.cursorPageup;
    windowClass.cursorPageup = function () {
      if (this.battlerEnemyIsInBook() && settings.skipToBattlerEnemy) {
        this.selectPreviousBattlerEnemy();
      } else {
        _cursorPageup.call(this);
      }
    };
    windowClass.selectNextBattlerEnemy = function () {
      const nextIndex = this._battlerEnemyIndexes.find((index) => index > this.index()) || this._battlerEnemyIndexes[0];
      this.smoothSelect(nextIndex);
    };
    windowClass.selectPreviousBattlerEnemy = function () {
      const candidates = this._battlerEnemyIndexes.filter((index) => index < this.index());
      const prevIndex = candidates.length > 0 ? candidates.slice(-1)[0] : this._battlerEnemyIndexes.slice(-1)[0];
      this.smoothSelect(prevIndex);
    };
  }
  Window_EnemyBookIndex_InBattleMixIn(Window_EnemyBookIndex.prototype);
})();
