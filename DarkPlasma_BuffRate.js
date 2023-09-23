// DarkPlasma_BuffRate 2.1.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/09/23 2.1.0 typescript移行
 *                  最大HP,最大MPに対応
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:
 * @plugindesc 強化・弱体の倍率を個別に設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param maxHp
 * @text 最大HPの強化・弱体倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param maxMp
 * @text 最大MPの強化・弱体倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param attack
 * @text 攻撃力の強化・弱体倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param defense
 * @text 防御力の強化・弱体倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param magicAttack
 * @text 魔法力の強化・弱体倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param magicDefense
 * @text 魔法防御力の強化・弱体倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param agility
 * @text 敏捷性の強化・弱体倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @param luck
 * @text 運の強化・弱体倍率
 * @type struct<BuffRate>
 * @default {"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}
 *
 * @help
 * version: 2.1.0
 * 能力強化・弱体の倍率を個別に設定できるようにします。
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

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    maxHp: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        buffRate1: Number(parsed.buffRate1 || 25),
        buffRate2: Number(parsed.buffRate2 || 50),
        debuffRate1: Number(parsed.debuffRate1 || 25),
        debuffRate2: Number(parsed.debuffRate2 || 50),
      };
    })(pluginParameters.maxHp || '{"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}'),
    maxMp: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        buffRate1: Number(parsed.buffRate1 || 25),
        buffRate2: Number(parsed.buffRate2 || 50),
        debuffRate1: Number(parsed.debuffRate1 || 25),
        debuffRate2: Number(parsed.debuffRate2 || 50),
      };
    })(pluginParameters.maxMp || '{"buffRate1":"25", "buffRate2":"50", "debuffRate1":"25", "debuffRate2":"50"}'),
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

  const paramNames = ['maxHp', 'maxMp', 'attack', 'defense', 'magicAttack', 'magicDefense', 'agility', 'luck'];
  const buffRates = paramNames.map((paramName) => [0, settings[paramName].buffRate1, settings[paramName].buffRate2]);
  const debuffRates = paramNames.map((paramName) => [
    0,
    -1.0 * settings[paramName].debuffRate1,
    -1.0 * settings[paramName].debuffRate2,
  ]);
  Game_BattlerBase.prototype.paramBuffRate = function (paramId) {
    const buffRate =
      this._buffs[paramId] > 0
        ? buffRates[paramId][this._buffs[paramId]]
        : debuffRates[paramId][-1.0 * this._buffs[paramId]];
    return buffRate / 100 + 1.0;
  };
})();
