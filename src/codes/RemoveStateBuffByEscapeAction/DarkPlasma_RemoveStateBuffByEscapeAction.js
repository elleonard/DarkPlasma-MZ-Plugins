import { settings } from './_build/DarkPlasma_RemoveStateBuffByEscapeAction_parameters';

/**
 * @param {typeof DataManager} dataManager
 */
function DataManager_RemoveStateByEscapeActionMixIn(dataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ($dataStates && $dataStates.contains(data)) {
      data.removeByEscapeAction = data.meta.removeByEscapeAction !== 'false';
    }
  };
}

DataManager_RemoveStateByEscapeActionMixIn(DataManager);

/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_RemoveStateBuffByEscapeActionMixIn(gameBattler) {
  const _escape = gameBattler.escape;
  gameBattler.escape = function () {
    if (settings.removeBuffByEscapeAction) {
      const evacuatedResultPushRemovedBuff = this._result.pushRemovedBuff;
      /**
       * 逃走時にバフを消去した旨をバトルログに出さない
       */
      this._result.pushRemovedBuff = () => {};
      this.removeAllBuffs();
      this._result.pushRemovedBuff = evacuatedResultPushRemovedBuff;
    }
    const evacuatedClearStates = this.clearStates;
    this.clearStates = this.removeStatesByEscapeAction;
    const evacuatedResultPushRemovedState = this._result.pushRemovedState;
    this._result.pushRemovedState = () => {};
    _escape.call(this);
    this.clearStates = evacuatedClearStates;
    this._result.pushRemovedState = evacuatedResultPushRemovedState;
  };

  gameBattler.removeStatesByEscapeAction = function () {
    this.states()
      .filter((state) => state.removeByEscapeAction)
      .forEach((state) => this.removeState(state.id));
  };
}

Game_Battler_RemoveStateBuffByEscapeActionMixIn(Game_Battler.prototype);
