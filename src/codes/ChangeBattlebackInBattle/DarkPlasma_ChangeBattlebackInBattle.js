import { pluginName } from '../../common/pluginName';

PluginManager.registerCommand(pluginName, 'changeBattleback', function (args) {
  if ($gameParty.inBattle()) {
    const back1Bitmap = ImageManager.loadBattleback1(args.back1);
    const back2Bitmap = ImageManager.loadBattleback2(args.back2);
    $gameTemp.requestChangeBattleback(back1Bitmap, back2Bitmap);
  }
});

function Game_Temp_ChangeBattlebackMixIn(gameTemp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._requestedBattlebacks = [];
  };

  gameTemp.requestChangeBattleback = function (back1Bitmap, back2Bitmap) {
    this._requestedBattlebacks = [];
    this._requestedBattlebacks.push(back1Bitmap);
    this._requestedBattlebacks.push(back2Bitmap);
  };

  gameTemp.changeBattlebackReady = function () {
    return this._requestedBattlebacks.length > 0 && this._requestedBattlebacks.every((bitmap) => bitmap.isReady());
  };

  gameTemp.newBattlebackBitmaps = function () {
    return this._requestedBattlebacks;
  };

  gameTemp.changeBattlebackDone = function () {
    this._requestedBattlebacks = [];
  };
}

Game_Temp_ChangeBattlebackMixIn(Game_Temp.prototype);

function Spriteset_Battle_ChangeBattlebackMixIn(spritesetClass) {
  const _updateBattleback = spritesetClass.updateBattleback;
  spritesetClass.updateBattleback = function () {
    if ($gameTemp.changeBattlebackReady()) {
      const backBitmaps = $gameTemp.newBattlebackBitmaps();
      this._back1Sprite.bitmap = backBitmaps[0];
      if (backBitmaps.length > 1) {
        this._back2Sprite.bitmap = backBitmaps[1];
      }
      this._battlebackLocated = false;
      $gameTemp.changeBattlebackDone();
    }
    _updateBattleback.call(this);
  };
}

Spriteset_Battle_ChangeBattlebackMixIn(Spriteset_Battle.prototype);
