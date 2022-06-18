// DarkPlasma_TriggerTouchWithThrough 1.0.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/06/18 1.0.1 MITライセンスとして公開
 * 2022/02/19 1.0.0 初版
 */

/*:ja
 * @plugindesc すり抜けでもイベントからの接触が有効なイベント
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.1
 * すり抜けをONにしてもイベントからの接触を有効にできる
 * イベント用メタタグを提供します。
 *
 * すり抜けONでもイベントからの接触を有効にしたいイベントの
 * メモ欄に下記のように記述してください。
 * <triggerTouch>
 *
 * 対象のイベントはプレイヤーのみすり抜けられなくなり、
 * イベントからの接触トリガーが有効になります。
 */

(() => {
  'use strict';

  /**
   * @param {Game_CharacterBase.prototype} gameCharacterBase
   */
  function Game_CharacterBase_TriggerTouchWithThroughMixIn(gameCharacterBase) {
    gameCharacterBase.canThroughPlayer = function () {
      return this.isThrough() || this.isDebugThrough();
    };

    gameCharacterBase.isCollidedWithPlayerCharacters = function (x, y) {
      return false;
    };

    const _canPass = gameCharacterBase.canPass;
    gameCharacterBase.canPass = function (x, y, d) {
      const result = _canPass.call(this, x, y, d);
      const x2 = $gameMap.roundXWithDirection(x, d);
      const y2 = $gameMap.roundYWithDirection(y, d);
      if (result && !this.canThroughPlayer() && this.isCollidedWithPlayerCharacters(x2, y2)) {
        return false;
      }
      return result;
    };
  }

  Game_CharacterBase_TriggerTouchWithThroughMixIn(Game_CharacterBase.prototype);

  /**
   * @param {Game_Player.prototype} gamePlayer
   */
  function Game_Player_TriggerTouchWithThroughMixIn(gamePlayer) {
    gamePlayer.isCollidedWithEvents = function (x, y) {
      return $gameMap.eventsXyCannotThroughPlayer(x, y).some((event) => event.isNormalPriority());
    };
  }

  Game_Player_TriggerTouchWithThroughMixIn(Game_Player.prototype);

  /**
   * @param {Game_Event.prototype} gameEvent
   */
  function Game_Event_TriggerTouchWithThroughMixIn(gameEvent) {
    gameEvent.canThroughPlayer = function () {
      return (
        (this.isThrough() || this.isDebugThrough()) &&
        ((this.isPrefab && this.isPrefab()) || !this.event().meta.triggerTouch)
      );
    };
  }

  Game_Event_TriggerTouchWithThroughMixIn(Game_Event.prototype);

  /**
   * @param {Game_Map.prototype} gameMap
   */
  function Game_Map_TriggerTouchWithThroughMixIn(gameMap) {
    gameMap.eventsXyCannotThroughPlayer = function (x, y) {
      return this.events().filter((event) => event.pos(x, y) && !event.canThroughPlayer());
    };
  }

  Game_Map_TriggerTouchWithThroughMixIn(Game_Map.prototype);
})();
