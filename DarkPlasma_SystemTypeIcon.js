// DarkPlasma_SystemTypeIcon 1.1.1
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/01/15 1.1.1 ビルド方式を変更 (configをTypeScript化)
 * 2023/09/10 1.1.0 武器タイプアイコン、防具タイプアイコンを追加
 * 2023/03/18 1.0.0 公開
 */

/*:en
 * @plugindesc Set system type and debuff icons.
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param elementIcons
 * @desc Element Icons.(The order is corresponding to elements settings in database.)
 * @text Element Icons
 * @type icon[]
 * @default [0,76,64,65,66,67,68,69,70,71]
 *
 * @param debuffStatusIcons
 * @text Debuff Status Icons
 * @type struct<DebuffStatusIconsEn>
 * @default {"mhp":"{\"small\":\"48\",\"large\":\"56\"}","mmp":"{\"small\":\"49\",\"large\":\"57\"}","atk":"{\"small\":\"50\",\"large\":\"58\"}","def":"{\"small\":\"51\",\"large\":\"59\"}","mat":"{\"small\":\"52\",\"large\":\"60\"}","mdf":"{\"small\":\"53\",\"large\":\"61\"}","agi":"{\"small\":\"54\",\"large\":\"62\"}","luk":"{\"small\":\"55\",\"large\":\"63\"}"}
 *
 * @param weaponTypeIcons
 * @desc Weapon type Icons.(The order is corresponding to elements settings in database.)
 * @text Weapon type Icons
 * @type icon[]
 * @default [0,96,97,98,99,100,101,102,103,104,105,106,107]
 *
 * @param armorTypeIcons
 * @desc Equip type Icons.(The order is corresponding to elements settings in database.)
 * @text Armor type Icons
 * @type icon[]
 * @default [0,135,139,136,129,128]
 *
 * @help
 * version: 1.1.1
 * Set icons for system types and debuffs.
 */
/*~struct~DebuffStatusIconsEn:
 * @param mhp
 * @text Debuff max hp icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"48","large":"56"}
 *
 * @param mmp
 * @text Debuff max mp icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"49","large":"57"}
 *
 * @param atk
 * @text Debuff attack icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"50","large":"58"}
 *
 * @param def
 * @text Debuff defense icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"51","large":"59"}
 *
 * @param mat
 * @text Debuff magical attack icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"52","large":"60"}
 *
 * @param mdf
 * @text Debuff magical defense icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"53","large":"61"}
 *
 * @param agi
 * @text Debuff agility icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"54","large":"62"}
 *
 * @param luk
 * @text Debuff luck icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"55","large":"63"}
 */
/*~struct~DebuffStatusIconEn:
 * @param small
 * @text Debuff status icon Lv1.
 * @type number
 * @default 0
 *
 * @param large
 * @text Debuff status icon Lv2.
 * @type number
 * @default 0
 */
/*:
 * @plugindesc システムのタイプや弱体にアイコンを設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param elementIcons
 * @desc 属性アイコンを設定します（順序はデータベースのタイプ設定に対応します）
 * @text 属性アイコン
 * @type icon[]
 * @default [0,76,64,65,66,67,68,69,70,71]
 *
 * @param debuffStatusIcons
 * @text ステータス弱体アイコン
 * @type struct<DebuffStatusIcons>
 * @default {"mhp":"{\"small\":\"48\",\"large\":\"56\"}","mmp":"{\"small\":\"49\",\"large\":\"57\"}","atk":"{\"small\":\"50\",\"large\":\"58\"}","def":"{\"small\":\"51\",\"large\":\"59\"}","mat":"{\"small\":\"52\",\"large\":\"60\"}","mdf":"{\"small\":\"53\",\"large\":\"61\"}","agi":"{\"small\":\"54\",\"large\":\"62\"}","luk":"{\"small\":\"55\",\"large\":\"63\"}"}
 *
 * @param weaponTypeIcons
 * @desc 武器タイプアイコンを設定します（順序はデータベースのタイプ設定に対応します）
 * @text 武器タイプアイコン
 * @type icon[]
 * @default [0,96,97,98,99,100,101,102,103,104,105,106,107]
 *
 * @param armorTypeIcons
 * @desc 防具タイプアイコンを設定します（順序はデータベースのタイプ設定に対応します）
 * @text 防具タイプアイコン
 * @type icon[]
 * @default [0,135,139,136,129,128]
 *
 * @help
 * version: 1.1.1
 * システムのタイプや弱体にアイコンを設定します。
 * 本プラグインは、他プラグインでタイプや弱体に関するアイコンを扱う際に
 * その補助とするための設定プラグインです。
 * 単体では機能しません。
 */
/*~struct~DebuffStatusIcons:
 * @param mhp
 * @text 最大HP弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"48","large":"56"}
 *
 * @param mmp
 * @text 最大MP弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"49","large":"57"}
 *
 * @param atk
 * @text 攻撃力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"50","large":"58"}
 *
 * @param def
 * @text 防御力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"51","large":"59"}
 *
 * @param mat
 * @text 魔法力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"52","large":"60"}
 *
 * @param mdf
 * @text 魔法防御弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"53","large":"61"}
 *
 * @param agi
 * @text 敏捷性弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"54","large":"62"}
 *
 * @param luk
 * @text 運弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"55","large":"63"}
 */
/*~struct~DebuffStatusIcon:
 * @param small
 * @text 弱体アイコン（小）
 * @type number
 * @default 0
 *
 * @param large
 * @text 弱体アイコン（大）
 * @type number
 * @default 0
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    elementIcons: pluginParameters.elementIcons
      ? JSON.parse(pluginParameters.elementIcons).map((e) => {
          return Number(e || 0);
        })
      : [0, 76, 64, 65, 66, 67, 68, 69, 70, 71],
    debuffStatusIcons: pluginParameters.debuffStatusIcons
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            mhp: parsed.mhp
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.mhp)
              : { small: 48, large: 56 },
            mmp: parsed.mmp
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.mmp)
              : { small: 49, large: 57 },
            atk: parsed.atk
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.atk)
              : { small: 50, large: 58 },
            def: parsed.def
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.def)
              : { small: 51, large: 59 },
            mat: parsed.mat
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.mat)
              : { small: 52, large: 60 },
            mdf: parsed.mdf
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.mdf)
              : { small: 53, large: 61 },
            agi: parsed.agi
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.agi)
              : { small: 54, large: 62 },
            luk: parsed.luk
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.luk)
              : { small: 55, large: 63 },
          };
        })(pluginParameters.debuffStatusIcons)
      : {
          mhp: { small: 48, large: 56 },
          mmp: { small: 49, large: 57 },
          atk: { small: 50, large: 58 },
          def: { small: 51, large: 59 },
          mat: { small: 52, large: 60 },
          mdf: { small: 53, large: 61 },
          agi: { small: 54, large: 62 },
          luk: { small: 55, large: 63 },
        },
    weaponTypeIcons: pluginParameters.weaponTypeIcons
      ? JSON.parse(pluginParameters.weaponTypeIcons).map((e) => {
          return Number(e || 0);
        })
      : [0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107],
    armorTypeIcons: pluginParameters.armorTypeIcons
      ? JSON.parse(pluginParameters.armorTypeIcons).map((e) => {
          return Number(e || 0);
        })
      : [0, 135, 139, 136, 129, 128],
  };

  function Game_System_SystemTypeIconMixIn(gameSystem) {
    gameSystem.elementIconIndex = function (elementId) {
      return settings.elementIcons[elementId] || 0;
    };
    gameSystem.largeDebuffStatusIconIndex = function (paramName) {
      return settings.debuffStatusIcons[paramName]?.large || 0;
    };
    gameSystem.smallDebuffStatusIconIndex = function (paramName) {
      return settings.debuffStatusIcons[paramName]?.small || 0;
    };
    gameSystem.weaponTypeIconIndex = function (weaponTypeId) {
      return settings.weaponTypeIcons[weaponTypeId] || 0;
    };
    gameSystem.armorTypeIconIndex = function (armorTypeId) {
      return settings.armorTypeIcons[armorTypeId] || 0;
    };
  }
  Game_System_SystemTypeIconMixIn(Game_System.prototype);
})();
