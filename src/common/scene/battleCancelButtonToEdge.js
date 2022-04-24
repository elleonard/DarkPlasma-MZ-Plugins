/**
 * タッチUIのキャンセルボタンを右上端へ移動したり戻したりする
 * @param {Scene_Battle.prototype} sceneBattle
 */
export function Scene_Battle_MoveCancelButtonMixIn(sceneBattle) {
  if (!sceneBattle.moveCancelButtonToEdge) {
    sceneBattle.moveCancelButtonToEdge = function () {
      if (this._cancelButton) {
        this._cancelButton.y = Math.floor((this.buttonAreaHeight() - 48) / 2);
      }
    };
  }
  if (!sceneBattle.returnCancelButton) {
    sceneBattle.returnCancelButton = function () {
      if (this._cancelButton) {
        this._cancelButton.y = this.buttonY();
      }
    };
  }
}

Scene_Battle_MoveCancelButtonMixIn(Scene_Battle.prototype);
