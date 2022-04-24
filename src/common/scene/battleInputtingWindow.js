/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
export function Scene_Battle_InputtingWindowMixIn(sceneBattle) {
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
