// DarkPlasma_SkillWithTraits 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/10/14 1.0.0 公開
 */

/*:
 * @plugindesc 特徴付きスキル
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 習得しているだけで特徴が得られるスキルを実現します。
 * 特徴によって追加されたスキルには効果がありません。
 *
 * スキルのメモ欄に以下のように記述してください。
 * <trait:actor/1>
 * アクターID1と同じ特徴を得ます。
 *
 * <trait:class/1>
 * 職業ID1と同じ特徴を得ます。
 *
 * <trait:weapon/1>
 * 武器ID1と同じ特徴を得ます。
 *
 * <trait:armor/1>
 * 防具ID1と同じ特徴を得ます。
 *
 * <trait:state/1>
 * ステートID1と同じ特徴を得ます。
 */

(() => {
  'use strict';

  function Game_Actor_SkillWithTraitsMixin(gameActor) {
    const _traitObjects = gameActor.traitObjects;
    gameActor.traitObjects = function () {
      return _traitObjects.call(this).concat(this.traitObjectsBySkill());
    };
    gameActor.traitObjectsBySkill = function () {
      return this._skills
        .map((skillId) => {
          const skill = $dataSkills[skillId];
          if (!skill.meta.traits) {
            return undefined;
          }
          const t = String(skill.meta.traits).split('/');
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
  Game_Actor_SkillWithTraitsMixin(Game_Actor.prototype);
})();
