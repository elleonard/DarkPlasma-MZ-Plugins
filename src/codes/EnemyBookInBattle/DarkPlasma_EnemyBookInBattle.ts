/// <reference path="./EnemyBookInBattle.d.ts" />
import { Scene_Battle_InputtingWindowMixIn } from '../../common/scene/battleInputtingWindow';
import { settings } from './_build/DarkPlasma_EnemyBookInBattle_parameters';

/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
function Scene_Battle_EnemyBookMixIn(sceneBattle: Scene_Battle) {
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
      true
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

function Window_EnemyBookIndex_InBattleMixIn(windowClass: Window_EnemyBookIndex) {
  const _forcusOnFirst = windowClass.forcusOnFirst;
  windowClass.forcusOnFirst = function () {
    _forcusOnFirst.call(this);
    if (this._isInBattle) {
      this._battlerEnemyIndexes = Array.from(
        new Set(
          $gameTroop
            .members()
            .map((gameEnemy) => this._list.indexOf(gameEnemy.enemy()))
            .filter((index) => index >= 0)
        )
      ).sort((a, b) => a - b);
      const firstIndex = this._battlerEnemyIndexes.length > 0 ? this._battlerEnemyIndexes[0] : -1;
      if (firstIndex >= 0) {
        this.setTopRow(firstIndex);
        this.select(firstIndex);
      }
    }
  };

  const _processHandling = windowClass.processHandling;
  windowClass.processHandling = function() {
    _processHandling.call(this);
    if (this.active && $gameParty.inBattle() && Input.isTriggered(settings.openKeyInBattle)) {
      this.processCancel();
    }
  };

  const _mustHighlight = windowClass.mustHighlight;
  windowClass.mustHighlight = function (enemy) {
    return _mustHighlight.call(this, enemy) ||
      this._isInBattle && $gameTroop.members().some((battlerEnemy) => battlerEnemy.enemyId() === enemy.id);
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

  windowClass.battlerEnemyIsInBook = function() {
    return this._battlerEnemyIndexes && this._battlerEnemyIndexes.length > 0;
  };

  const _cursorPagedown = windowClass.cursorPagedown;
  windowClass.cursorPagedown = function() {
    if (this.battlerEnemyIsInBook() && settings.skipToBattlerEnemy) {
      this.selectNextBattlerEnemy();
    } else {
      _cursorPagedown.call(this);
    }
  };

  const _cursorPageup = windowClass.cursorPageup;
  windowClass.cursorPageup = function() {
    if (this.battlerEnemyIsInBook() && settings.skipToBattlerEnemy) {
      this.selectPreviousBattlerEnemy();
    } else {
      _cursorPageup.call(this);
    }
  };

  windowClass.selectNextBattlerEnemy = function() {
    const nextIndex = this._battlerEnemyIndexes.find((index) => index > this.index()) || this._battlerEnemyIndexes[0];
    this.smoothSelect(nextIndex);
  };

  windowClass.selectPreviousBattlerEnemy = function() {
    const candidates = this._battlerEnemyIndexes.filter((index) => index < this.index());
    const prevIndex = candidates.length > 0 ? candidates.slice(-1)[0] : this._battlerEnemyIndexes.slice(-1)[0];
    this.smoothSelect(prevIndex);
  };
}

Window_EnemyBookIndex_InBattleMixIn(Window_EnemyBookIndex.prototype);
