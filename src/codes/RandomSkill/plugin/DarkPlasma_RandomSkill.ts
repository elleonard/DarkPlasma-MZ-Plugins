/// <reference path="./RandomSkill.d.ts" />

import { pluginName } from '../../../common/pluginName';

const randomSkillEffect = uniqueEffectCodeCache.allocate(pluginName, 0);

type RandomSkillTargetType = "same" | "random";

type RandomSkillSetting = {
  skillId: number;
  weight: number;
  targetType: RandomSkillTargetType;
};

type Data_RandomSkillEffect = {
  dataId: number;
  skills: RandomSkillSetting[];
};

const $dataRandomSkillEffects: Data_RandomSkillEffect[] = [];

function registerRandomSkillEffect(skills: RandomSkillSetting[]) {
  const dataId = $dataRandomSkillEffects.length;
  $dataRandomSkillEffects.push({
    dataId,
    skills,
  });
  return dataId;
}

function DataManager_RandomSkillMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("effects" in data && data.meta.randomSkill) {
      const dataId = registerRandomSkillEffect(
        String(data.meta.randomSkill).split('\n')
          .filter(line => /skillId:[ ]?[0-9]+/.test(line))
          .map(line => {
            const result: RandomSkillSetting = {
              skillId: 1,
              weight: 1,
              targetType: "random",
            };
            line.split(',').forEach(column => {
              const type: "skillId" | "weight" | "target" = (() => {
                const c = column.trim();
                if (c.startsWith("skillId")) {
                  return "skillId";
                } else if (c.startsWith("weight")) {
                  return "weight";
                } else if (c.startsWith("target")) {
                  return "target";
                }
                throw Error(`不正なトークン ${c}`);
              })();
              if (type === "target") {
                result.targetType = column.split(':')[1].trim() === "same" ? "same" : "random";
              } else {
                result[type] = Number(column.split(':')[1].trim() || '1');
              }
            });
            return result;
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
      this.subject().forceAction(
        skill.skillId,
        skill.targetType === "same" && (target.isActor() || target.isEnemy()) ? target.index() : -1
      );
      this.subject().currentAction().setTriggerAction(this);
      this.makeSuccess(target);
    } else {
      _applyItemEffect.call(this, target, effect);
    }
  };

  gameAction.setTriggerAction = function (action) {
    this._triggerAction = action;
  };

  gameAction.triggerAction = function () {
    return this._triggerAction;
  };

  gameAction.hasRandomSkillEffect = function () {
    return this.item()?.effects.some(effect => effect.code === randomSkillEffect.code) || false;
  };
}

Game_Action_RandomSkillMixIn(Game_Action.prototype);
