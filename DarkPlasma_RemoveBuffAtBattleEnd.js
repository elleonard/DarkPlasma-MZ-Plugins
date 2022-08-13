// DarkPlasma_RemoveBuffAtBattleEnd 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/08/13 1.0.0 公開
 */

/*:ja
 * @plugindesc 戦闘終了時に強化・弱体を解除するかどうか
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param removeBuffAtBattleEnd
 * @desc 戦闘終了時、逃走したバトラー含む全バトラーの強化・弱体を解除します。
 * @text 戦闘終了で強化・弱体を解除
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.0.0
 * 戦闘終了時に全バトラーの強化・弱体を解除するかどうかを設定します。
 *
 * MZデフォルトの仕様では、行動による逃走で戦闘を離脱したアクターの強化・弱体は
 * 戦闘終了時に解除されません。
 * 本プラグインでは、逃走したバトラーを含めて全バトラーの強化・弱体を
 * 解除するか否かを設定します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    removeBuffAtBattleEnd: String(pluginParameters.removeBuffAtBattleEnd || true) === 'true',
  };

  /**
   * @param {Game_Temp.prototype} gameTemp
   */
  function Game_Temp_RemoveBuffAtBattleEndMixIn(gameTemp) {
    gameTemp.isProcessingBattleEnd = function () {
      return this._isProcessingBattleEnd || false;
    };

    gameTemp.startProcessingBattleEnd = function () {
      this._isProcessingBattleEnd = true;
    };

    gameTemp.completeProcessingBattleEnd = function () {
      this._isProcessingBattleEnd = false;
    };
  }

  Game_Temp_RemoveBuffAtBattleEndMixIn(Game_Temp.prototype);

  /**
   * @param {Game_Battler.prototype} gameBattler
   */
  function Game_Battler_RemoveBuffAtBattleEndMixIn(gameBattler) {
    const _removeAllBuffs = gameBattler.removeAllBuffs;
    gameBattler.removeAllBuffs = function () {
      if ($gameTemp.isProcessingBattleEnd()) {
        if (settings.removeBuffAtBattleEnd) {
          const evacuatedIsAlive = this.isAlive;
          /**
           * 戦闘を離脱したバトラーも生存扱いとし、強化・弱体解除の対象とする
           */
          this.isAlive = () => evacuatedIsAlive.call(this) || this.isHidden();
          _removeAllBuffs.call(this);
          this.isAlive = evacuatedIsAlive;
        }
      } else {
        _removeAllBuffs.call(this);
      }
    };
  }

  Game_Battler_RemoveBuffAtBattleEndMixIn(Game_Battler.prototype);

  /**
   * @param {Scene_Battle.prototype} sceneBattle
   */
  function Scene_Battle_RemoveBuffAtBattleEndMixIn(sceneBattle) {
    const _terminate = sceneBattle.terminate;
    sceneBattle.terminate = function () {
      $gameTemp.startProcessingBattleEnd();
      _terminate.call(this);
      $gameTemp.completeProcessingBattleEnd();
    };
  }

  Scene_Battle_RemoveBuffAtBattleEndMixIn(Scene_Battle.prototype);
})();
