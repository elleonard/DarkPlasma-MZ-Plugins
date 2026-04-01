/// <reference path="./FitBattlebackToScreen.d.ts" />

function Sprite_Battleback_FitToScreenMixIn(spriteBattleback: Sprite_Battleback) {
  spriteBattleback.adjustPosition = function () {
    this.width = Graphics.width;
    this.height = Graphics.height;
    const ratioX = this.width / this.bitmap!.width;
    const ratioY = this.height / this.bitmap!.height;
    const scale = Math.max(ratioX, ratioY, 1.0);
    this.scale.x = scale;
    this.scale.y = scale;
  };
}

Sprite_Battleback_FitToScreenMixIn(Sprite_Battleback.prototype);
