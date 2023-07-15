// DarkPlasma_Rosedale_CAP_8DirBugFix 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/07/16 1.0.0 公開
 */

/*:
 * @plugindesc Rosedale_CollisionAlteringPluginの8方向歩行グラの不具合修正パッチ
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base Rosedale_CollisionAlteringPlugin
 * @orderBefore DarkPlasma_ExpandCharacterPattern
 *
 * @help
 * version: 1.0.0
 * 公式DLC Rosedale_CollisionAlteringPlugin の以下の不具合を修正します。
 *
 * 8方向歩行グラフィックを用いるとセーブ画面などで
 * キャラクター正常に表示されない。
 *
 * 本プラグインは公式DLCプラグインのバグ修正パッチプラグインです。
 * 公式DLC本体に修正が入り次第、本プラグインの公開を終了します。
 *
 * 本プラグインはグローバルセーブデータ以下の情報を追加します。
 * - 各セーブデータのパーティメンバーのアクターID
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * Rosedale_CollisionAlteringPlugin version:1.1.0
 * 下記プラグインと共に利用する場合、それよりも上に追加してください。
 * DarkPlasma_ExpandCharacterPattern
 */

(() => {
  'use strict';

  function DataManager_CAP_BugFixMixIn(dataManager) {
    dataManager.characterNameToActor = function (characterName) {
      return $dataActors.find((dataActor) => dataActor && dataActor.characterName === characterName);
    };
    const _makeSavefileInfo = dataManager.makeSavefileInfo;
    dataManager.makeSavefileInfo = function () {
      const info = _makeSavefileInfo.call(this);
      /**
       * セーブ・ロード画面に歩行グラフィックを表示するため、アクターIDを控えておく
       */
      info.partyMembers = $gameParty.allMembers().map((actor) => actor.actorId());
      return info;
    };
  }
  DataManager_CAP_BugFixMixIn(DataManager);
  function Game_Actor_CAP_BugFixMixIn(gameActor) {
    gameActor.maxCharacterPattern = function () {
      return ImageManager.isBigCharacter(this.characterName()) ? 3 : 12;
    };
    gameActor.characterPatternYCount = function () {
      return ImageManager.isBigCharacter(this.characterName()) ? 8 : 16;
    };
  }
  Game_Actor_CAP_BugFixMixIn(Game_Actor.prototype);
  function Window_CAP_BugFixMixIn(windowClass) {
    windowClass.drawActorCharacterWith8Dir = function (actor, x, y) {
      const bitmap = ImageManager.loadCharacter(actor.characterName());
      const big = ImageManager.isBigCharacter(actor.characterName());
      const pw = bitmap.width / actor.maxCharacterPattern();
      const ph = bitmap.height / actor.characterPatternYCount();
      const n = big ? 0 : actor.characterIndex();
      const sx = ((n % 4) * 3 + 1) * pw;
      const sy = (Math.floor(n / 4) * 4 + 1) * ph;
      this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    };
  }
  Window_CAP_BugFixMixIn(Window_Base.prototype);
  function Window_StatusBase_CAP_BugFixMixIn(windowClass) {
    const _drawActorCharacter = windowClass.drawActorCharacter;
    windowClass.drawActorCharacter = function (actor, x, y) {
      if (actor.actor().meta['8dir']) {
        this.drawActorCharacterWith8Dir(actor, x, y);
      } else {
        _drawActorCharacter.call(this, actor, x, y);
      }
    };
  }
  Window_StatusBase_CAP_BugFixMixIn(Window_StatusBase.prototype);
  function Window_SavefileList_CAP_BugFixMixIn(windowClass) {
    windowClass.drawPartyCharacters = function (info, x, y) {
      if (info.characters) {
        let characterX = x;
        info.characters.forEach((data, index) => {
          if (
            info.partyMembers &&
            info.partyMembers[index] !== undefined &&
            $dataActors[info.partyMembers[index]]?.meta['8dir']
          ) {
            const dataActor = $dataActors[info.partyMembers[index]];
            const actor = new Game_Actor(dataActor.id);
            actor.setCharacterImage(data[0], data[1]);
            this.drawActorCharacterWith8Dir(actor, characterX, y);
          } else {
            this.drawCharacter(data[0], data[1], characterX, y);
          }
          characterX += 48;
        });
      }
    };
  }
  Window_SavefileList_CAP_BugFixMixIn(Window_SavefileList.prototype);
})();
