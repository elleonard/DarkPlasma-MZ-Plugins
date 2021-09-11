// DarkPlasma_ChangeBattlebackInBattle 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/09/11 1.0.0 公開
 */

/*:ja
 * @plugindesc 戦闘中に戦闘背景を変更する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command changeBattleback
 * @text 戦闘背景を変更する
 * @arg back1
 * @text 背景1
 * @type file
 * @dir img/battlebacks1/
 * @arg back2
 * @text 背景2
 * @type file
 * @dir img/battlebacks2/
 *
 * @help
 * version: 1.0.0
 * 戦闘中に戦闘背景を変更するプラグインコマンドを提供します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

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
})();
