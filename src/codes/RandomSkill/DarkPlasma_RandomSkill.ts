/// <reference path="./RandomSkill.d.ts" />

import { pluginName } from '../../common/pluginName';

const randomSkillEffect = uniqueEffectCodeCache.allocate(pluginName, 0);

type RandomSkillSetting = {
  skillId: number;
  weight: number;
};

type Data_RandomSkillEffect = {
  dataId: number;
  skills: RandomSkillSetting[];
};

const $dataRandomSkillEffects: Data_RandomSkillEffect[] = [];

function registerRandomSkillEffect(skills: RandomSkillSetting[]) {
  const dataId = $dataRandomSkillEffects.length;
  $dataRandomSkillEffects.push({
    dataId: dataId,
    skills: skills,
  });
  return dataId;
}

function DataManager_RandomSkillMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("effects" in data && data.meta.randomSkill) {
      const dataId = registerRandomSkillEffect(String(data.meta.randomSkill).split('\n')
        .filter(line => /skillId:[ ]?[0-9]+/.test(line)).map(line => {
          const columns = line.split(',')
            .map((column): { type: "skillId"|"weight", value: number } => {
              return {
                type: column.trim().startsWith("skillId") ? "skillId" : "weight",
                value: Number(column.split(':')[1].trim() || '1'),
              }
            });
          return {
            skillId: columns.find(c => c.type === "skillId")?.value || 1,
            weight: columns.find(c => c.type === "weight")?.value || 1,
          };
        }));
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

function Game_Action_RandomSkillMixIn(gameAction: Game_Action) {
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
      const totalWeight = $dataRandomSkillEffects[effect.dataId].skills
        .reduce((result, skill) => result + skill.weight, 0);
      let w = Math.randomInt(totalWeight);
      const skill = $dataRandomSkillEffects[effect.dataId].skills.find(skill => {
        w -= skill.weight;
        return w < 0;
      })!;
      this.subject().forceAction(skill.skillId, -1);
      this.makeSuccess(target);
    } else {
      _applyItemEffect.call(this, target, effect);
    }
  };
}

Game_Action_RandomSkillMixIn(Game_Action.prototype);
