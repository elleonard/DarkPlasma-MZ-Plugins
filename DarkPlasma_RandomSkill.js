// DarkPlasma_RandomSkill 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/11/25 1.0.0 公開
 */

/*:
 * @plugindesc 指定したスキルのうちどれかひとつを発動する使用効果
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueEffectCode
 * @orderAfter DarkPlasma_AllocateUniqueEffectCode
 *
 * @help
 * version: 1.0.0
 * 使用するとランダムで指定したスキルのうち
 * どれか一つを発動する使用効果を実現します。
 *
 * スキルまたはアイテムのメモ欄に以下のように記述すると
 * 2/3でスキルID5、1/3でスキルID6が発動します。
 *
 * <randomSkill:
 *   skillId:5, weight:2
 *   skillId:6, weight:1
 * >
 *
 * この使用効果を持つスキル・アイテムの対象は
 * 使用者に設定してください。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueEffectCode version:1.0.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueEffectCode
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const randomSkillEffect = uniqueEffectCodeCache.allocate(pluginName, 0);
  const $dataRandomSkillEffects = [];
  function registerRandomSkillEffect(skills) {
    const dataId = $dataRandomSkillEffects.length;
    $dataRandomSkillEffects.push({
      dataId: dataId,
      skills: skills,
    });
    return dataId;
  }
  function DataManager_RandomSkillMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('effects' in data && data.meta.randomSkill) {
        const dataId = registerRandomSkillEffect(
          String(data.meta.randomSkill)
            .split('\n')
            .filter((line) => /skillId:[ ]?[0-9]+/.test(line))
            .map((line) => {
              const columns = line.split(',').map((column) => {
                return {
                  type: column.trim().startsWith('skillId') ? 'skillId' : 'weight',
                  value: Number(column.split(':')[1].trim() || '1'),
                };
              });
              return {
                skillId: columns.find((c) => c.type === 'skillId')?.value || 1,
                weight: columns.find((c) => c.type === 'weight')?.value || 1,
              };
            })
        );
        data.effects.push({
          code: randomSkillEffect.code,
          dataId: dataId,
          value1: 0,
          value2: 0,
        });
      }
    };
  }
  DataManager_RandomSkillMixIn(DataManager);
  function Game_Action_RandomSkillMixIn(gameAction) {
    const _testItemEffect = gameAction.testItemEffect;
    gameAction.testItemEffect = function (target, effect) {
      if (effect.code === randomSkillEffect.code) {
        return $dataRandomSkillEffects[effect.dataId].skills.length > 0;
      }
      return _testItemEffect.call(this, target, effect);
    };
    const _applyItemEffect = gameAction.applyItemEffect;
    gameAction.applyItemEffect = function (target, effect) {
      if (effect.code === randomSkillEffect.code) {
        /**
         * 重みをベースにして抽選する
         */
        const totalWeight = $dataRandomSkillEffects[effect.dataId].skills.reduce(
          (result, skill) => result + skill.weight,
          0
        );
        let w = Math.randomInt(totalWeight);
        const skill = $dataRandomSkillEffects[effect.dataId].skills.find((skill) => {
          w -= skill.weight;
          return w < 0;
        });
        this.subject().forceAction(skill.skillId, -1);
        this.makeSuccess(target);
      } else {
        _applyItemEffect.call(this, target, effect);
      }
    };
  }
  Game_Action_RandomSkillMixIn(Game_Action.prototype);
})();
