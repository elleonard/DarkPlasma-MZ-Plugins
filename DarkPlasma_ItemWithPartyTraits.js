// DarkPlasma_ItemWithPartyTraits 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/12/01 1.0.0 公開
 */

/*:
 * @plugindesc 持っているだけでパーティ全員に特徴を持たせるアイテム
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 所持しているだけでパーティメンバー全員が特徴を得るアイテムを実現します。
 *
 * アイテムのメモ欄に以下のように記述してください。
 * <partyTraits:actor/1>
 * アクターID1と同じ特徴を得ます。
 *
 * <partyTraits:class/1>
 * 職業ID1と同じ特徴を得ます。
 *
 * <partyTraits:weapon/1>
 * 武器ID1と同じ特徴を得ます。
 *
 * <partyTraits:armor/1>
 * 防具ID1と同じ特徴を得ます。
 *
 * <partyTraits:state/1>
 * ステートID1と同じ特徴を得ます。
 */

(() => {
  'use strict';

  function Game_Party_ItemWithPartyTraitsMixIn(gameParty) {
    gameParty.itemsWithPartyTrait = function () {
      return this.items().filter((item) => item.meta.partyTraits);
    };
  }
  Game_Party_ItemWithPartyTraitsMixIn(Game_Party.prototype);
  function Game_Actor_ItemWithPartyTraitsMixIn(gameActor) {
    const _traitObjects = gameActor.traitObjects;
    gameActor.traitObjects = function () {
      return _traitObjects.call(this).concat(this.traitObjectsByItem());
    };
    gameActor.traitObjectsByItem = function () {
      return $gameParty
        .itemsWithPartyTrait()
        .map((item) => {
          const t = String(item.meta.partyTraits).split('/');
          switch (t[0]) {
            case 'actor':
              return $dataActors[Number(t[1])];
            case 'class':
              return $dataClasses[Number(t[1])];
            case 'weapon':
              return $dataWeapons[Number(t[1])];
            case 'armor':
              return $dataArmors[Number(t[1])];
            case 'state':
              return $dataStates[Number(t[1])];
            default:
              return undefined;
          }
        })
        .filter((object) => !!object && 'traits' in object);
    };
  }
  Game_Actor_ItemWithPartyTraitsMixIn(Game_Actor.prototype);
})();
