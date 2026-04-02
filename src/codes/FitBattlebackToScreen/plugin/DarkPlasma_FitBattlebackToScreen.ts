/// <reference path="./FitBattlebackToScreen.d.ts" />

function Sprite_Battleback_FitToScreenMixIn(spriteBattleback: Sprite_Battleback) {
  spriteBattleback.adjustPosition = function () {
    this.width = Math.max(Graphics.width, this.bitmap!.width);
    this.height = Math.max(Graphics.height, this.bitmap!.height);
    
    const ratioX = Graphics.width / this.bitmap!.width;
    const ratioY = Graphics.height / this.bitmap!.height;
    const scale = Math.max(ratioX, ratioY);
    this.scale.x = scale;
    this.scale.y = scale;
  };
}

Sprite_Battleback_FitToScreenMixIn(Sprite_Battleback.prototype);
