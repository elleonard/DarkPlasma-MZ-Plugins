// DarkPlasma_BuffRate 2.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc バフの倍率を個別に設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param attack
 * @text 攻撃力の強化/弱化倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param defense
 * @text 防御力の強化/弱化倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param magicAttack
 * @text 魔法力の強化/弱化倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param magicDefense
 * @text 魔法防御力の強化/弱化倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param agility
 * @text 敏捷性の強化/弱化倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param luck
 * @text 運の強化/弱化倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @help
 * version: 2.0.2
 * バフ（強化状態）の能力強化/弱化倍率を個別に設定できるようにします。
 */
/*~struct~BuffRate:
 * @param buffRate1
 * @text 1段階目強化倍率（％）
 * @type number
 * @default 25
 *
 * @param buffRate2
 * @text 2段階目強化倍率（％）
 * @type number
 * @default 50
 *
 * @param debuffRate1
 * @text 1段階目弱化倍率（％）
 * @type number
 * @default 25
 *
 * @param debuffRate2
 * @text 2段階目弱化倍率（％）
 * @type number
 * @default 50
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    attack: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        buffRate1: Number(parsed.buffRate1 || 25),
        buffRate2: Number(parsed.buffRate2 || 50),
        debuffRate1: Number(parsed.debuffRate1 || 25),
        debuffRate2: Number(parsed.debuffRate2 || 50),
      };
    })(pluginParameters.attack || '{"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}'),
    defense: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        buffRate1: Number(parsed.buffRate1 || 25),
        buffRate2: Number(parsed.buffRate2 || 50),
        debuffRate1: Number(parsed.debuffRate1 || 25),
        debuffRate2: Number(parsed.debuffRate2 || 50),
      };
    })(pluginParameters.defense || '{"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}'),
    magicAttack: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        buffRate1: Number(parsed.buffRate1 || 25),
        buffRate2: Number(parsed.buffRate2 || 50),
        debuffRate1: Number(parsed.debuffRate1 || 25),
        debuffRate2: Number(parsed.debuffRate2 || 50),
      };
    })(pluginParameters.magicAttack || '{"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}'),
    magicDefense: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        buffRate1: Number(parsed.buffRate1 || 25),
        buffRate2: Number(parsed.buffRate2 || 50),
        debuffRate1: Number(parsed.debuffRate1 || 25),
        debuffRate2: Number(parsed.debuffRate2 || 50),
      };
    })(pluginParameters.magicDefense || '{"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}'),
    agility: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        buffRate1: Number(parsed.buffRate1 || 25),
        buffRate2: Number(parsed.buffRate2 || 50),
        debuffRate1: Number(parsed.debuffRate1 || 25),
        debuffRate2: Number(parsed.debuffRate2 || 50),
      };
    })(pluginParameters.agility || '{"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}'),
    luck: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        buffRate1: Number(parsed.buffRate1 || 25),
        buffRate2: Number(parsed.buffRate2 || 50),
        debuffRate1: Number(parsed.debuffRate1 || 25),
        debuffRate2: Number(parsed.debuffRate2 || 50),
      };
    })(pluginParameters.luck || '{"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}'),
  };

  const PARAM_ID = {
    ATTACK: 2,
    DEFENSE: 3,
    MAGIC_ATTACK: 4,
    MAGIC_DEFENSE: 5,
    AGILITY: 6,
    LUCK: 7,
  };

  const parsedParameters = {
    [PARAM_ID.ATTACK]: settings.attack,
    [PARAM_ID.DEFENSE]: settings.defense,
    [PARAM_ID.MAGIC_ATTACK]: settings.magicAttack,
    [PARAM_ID.MAGIC_DEFENSE]: settings.magicDefense,
    [PARAM_ID.AGILITY]: settings.agility,
    [PARAM_ID.LUCK]: settings.luck,
  };

  function findBuffRateSettings(paramId) {
    return [0, parsedParameters[paramId].buffRate1, parsedParameters[paramId].buffRate2];
  }

  function findDebuffRateSettings(paramId) {
    return [0, -1.0 * parsedParameters[paramId].debuffRate1, -1.0 * parsedParameters[paramId].debuffRate2];
  }

  settings.buffRate = {};
  settings.debuffRate = {};

  Object.entries(PARAM_ID).map((param) => {
    settings.buffRate[param[1]] = findBuffRateSettings(param[1]);
    settings.debuffRate[param[1]] = findDebuffRateSettings(param[1]);
  });

  const _Game_BattlerBase_paramBuffRate = Game_BattlerBase.prototype.paramBuffRate;
  Game_BattlerBase.prototype.paramBuffRate = function (paramId) {
    switch (paramId) {
      case PARAM_ID.ATTACK:
      case PARAM_ID.DEFENSE:
      case PARAM_ID.MAGIC_ATTACK:
      case PARAM_ID.MAGIC_DEFENSE:
      case PARAM_ID.AGILITY:
      case PARAM_ID.LUCK:
        const buffRate =
          this._buffs[paramId] > 0
            ? settings.buffRate[paramId][this._buffs[paramId]]
            : settings.debuffRate[paramId][-1.0 * this._buffs[paramId]];
        return buffRate / 100 + 1.0;
    }
    return _Game_BattlerBase_paramBuffRate.call(this, paramId);
  };
})();
