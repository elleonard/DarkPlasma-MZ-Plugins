import { settings } from './_build/DarkPlasma_RemoveBuffAtBattleEnd_parameters';

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
