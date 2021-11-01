// DarkPlasma_ItemCommandCooldown 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/11/01 1.0.0 公開
 */

/*:ja
 * @plugindesc アイテムコマンドにクールタイムを設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param defaultCooldownTurn
 * @desc デフォルトのクールタイムターン数を設定します。
 * @text デフォルトターン数
 * @type number
 * @default 3
 *
 * @param display
 * @desc コマンドの後ろにクールタイムターン数を表示する設定をします。
 * @text 表示設定
 * @type struct<DisplaySetting>
 * @default {"enabled":"true", "format":"CT:{turn}", "color":"2"}
 *
 * @help
 * version: 1.0.0
 * アイテムコマンドにクールタイムを設定します。
 * アイテムコマンドを使用した後、
 * 一定ターン数アイテムコマンドを使用不能にできます。
 *
 * アクター、装備、ステート、職業のメモ欄に以下のように記述することで
 * アイテムコマンドのクールタイムをデフォルトから増減できます。
 *
 * <itemCommandCooldownTurnPlus:1>
 *  クールタイムターン数を1増やす
 *
 * <itemCommandCooldownTurnPlus:-1>
 *  クールタイムターン数を1減らす
 */
/*~struct~DisplaySetting:
 * @param enabled
 * @desc ONの場合表示します。OFFの場合表示しません。
 * @text 表示する
 * @type boolean
 * @default true
 *
 * @param format
 * @desc 表示形式を設定します。{turn}がターン数に置き換えられます。
 * @text 表示形式
 * @type string
 * @default CT:{turn}
 *
 * @param color
 * @desc 表示色を設定します。
 * @text 色
 * @type number
 * @default 2
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    defaultCooldownTurn: Number(pluginParameters.defaultCooldownTurn || 3),
    display: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        enabled: String(parsed.enabled || true) === 'true',
        format: String(parsed.format || 'CT:{turn}'),
        color: Number(parsed.color || 2),
      };
    })(pluginParameters.display || '{"enabled":"true", "format":"CT:{turn}", "color":"2"}'),
  };

  class ItemCommandCooldownTurns {
    initialize() {
      this._turns = {};
      $gameParty.allMembers().forEach((actor) => (this._turns[actor.actorId()] = 0));
    }

    setup(actor) {
      this._turns[actor.actorId()] = actor.initialItemCommandCooldownTurn();
    }

    /**
     * @param {number} actorId
     * @return {number}
     */
    cooldownTurn(actorId) {
      if (!this._turns[actorId]) {
        this._turns[actorId] = 0;
      }
      return this._turns[actorId];
    }

    decrease() {
      $gameParty.allMembers().forEach((actor) => {
        this._turns[actor.actorId()] = this.cooldownTurn(actor.actorId()) - 1;
        if (this._turns[actor.actorId()] < 0) {
          this._turns[actor.actorId()] = 0;
        }
      });
    }
  }

  const itemCommandCooldownTurns = new ItemCommandCooldownTurns();

  /**
   * @param {BattleManager} battleManager
   */
  function BattleManager_ItemCommandCooldownMixIn(battleManager) {
    const _startBattle = battleManager.startBattle;
    battleManager.startBattle = function () {
      _startBattle.call(this);
      itemCommandCooldownTurns.initialize();
    };

    const _endTurn = battleManager.endTurn;
    battleManager.endTurn = function () {
      _endTurn.call(this);
      itemCommandCooldownTurns.decrease();
    };
  }

  BattleManager_ItemCommandCooldownMixIn(BattleManager);

  /**
   * @param {Game_Battler.prototype} gameBattler
   */
  function Game_Battler_ItemCommandCooldownMixIn(gameBattler) {
    const _useItem = gameBattler.useItem;
    gameBattler.useItem = function (item) {
      _useItem.call(this, item);
      if (DataManager.isItem(item) && $gameParty.inBattle()) {
        this.setupItemCooldownTurn();
      }
    };

    gameBattler.setupItemCooldownTurn = function () {};
  }

  Game_Battler_ItemCommandCooldownMixIn(Game_Battler.prototype);

  /**
   * @param {Game_Actor.prototype} gameActor
   */
  function Game_Actor_ItemCommandCooldownMixIn(gameActor) {
    gameActor.setupItemCooldownTurn = function () {
      itemCommandCooldownTurns.setup(this);
    };

    gameActor.itemCommandCooldownTurn = function () {
      /**
       * ターン終了時に減算されるため、+1しておく
       */
      return itemCommandCooldownTurns.cooldownTurn(this.actorId()) + 1;
    };

    gameActor.initialItemCommandCooldownTurn = function () {
      return settings.defaultCooldownTurn + this.itemCommandCooldownTurnPlus();
    };

    gameActor.itemCommandCooldownTurnPlus = function () {
      return this.traitObjects()
        .filter((object) => !!object.meta.itemCommandCooldownTurnPlus)
        .reduce((result, object) => result + Number(object.meta.itemCommandCooldownTurnPlus), 0);
    };

    gameActor.canItemCommand = function () {
      return !this.isInItemCommandCooldown();
    };

    gameActor.isInItemCommandCooldown = function () {
      return itemCommandCooldownTurns.cooldownTurn(this.actorId()) > 0;
    };
  }

  Game_Actor_ItemCommandCooldownMixIn(Game_Actor.prototype);

  /**
   * @param {Window_ActorCommand.prototype} windowClass
   */
  function Window_ActorCommand_ItemCommandCooldownMixIn(windowClass) {
    const _addItemCommand = windowClass.addItemCommand;
    windowClass.addItemCommand = function () {
      _addItemCommand.call(this);
      const itemCommand = this._list.find((command) => command.symbol === 'item');
      if (itemCommand) {
        if (settings.display.enabled && this._actor.isInItemCommandCooldown()) {
          itemCommand.name = `${itemCommand.name} ${settings.display.format.replace(
            /\{turn\}/gi,
            this._actor.itemCommandCooldownTurn()
          )}`;
        }
        itemCommand.enabled = this._actor.canItemCommand();
      }
    };
  }

  Window_ActorCommand_ItemCommandCooldownMixIn(Window_ActorCommand.prototype);
})();
