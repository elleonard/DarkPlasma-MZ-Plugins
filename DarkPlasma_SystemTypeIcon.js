// DarkPlasma_SystemTypeIcon 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
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
 * @desc Element Icons for weak and resist.(The order is corresponding to elements settings in database.)
 * @text Element Icons
 * @type icon[]
 * @default ["0", "76", "64", "65", "66", "67", "68", "69", "70", "71"]
 *
 * @param debuffStatusIcons
 * @text Debuff Status Icons
 * @type struct<DebuffStatusIconsEn>
 * @default {"mhp":"{\"small\":\"48\", \"large\":\"56\"}", "mmp":"{\"small\":\"49\", \"large\":\"57\"}", "atk":"{\"small\":\"50\", \"large\":\"58\"}", "def":"{\"small\":\"51\", \"large\":\"59\"}", "mat":"{\"small\":\"52\", \"large\":\"60\"}", "mdf":"{\"small\":\"53\", \"large\":\"61\"}", "agi":"{\"small\":\"54\", \"large\":\"62\"}", "luk":"{\"small\":\"55\", \"large\":\"63\"}"}
 * @parent debuffStatus
 *
 * @help
 * version: 1.0.0
 * Set icons for system types and debuffs.
 */
/*~struct~DebuffStatusIconsEn:
 * @param mhp
 * @text Debuff max hp icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"48", "large":"56"}
 *
 * @param mmp
 * @text Debuff max mp icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"49", "large":"57"}
 *
 * @param atk
 * @text Debuff attack icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"50", "large":"58"}
 *
 * @param def
 * @text Debuff defense icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"51", "large":"59"}
 *
 * @param mat
 * @text Debuff magical attack icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"52", "large":"60"}
 *
 * @param mdf
 * @text Debuff magical defense icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"53", "large":"61"}
 *
 * @param agi
 * @text Debuff agility icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"54", "large":"62"}
 *
 * @param luk
 * @text Debuff luck icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"55", "large":"63"}
 */
/*~struct~DebuffStatusIconEn:
 * @param small
 * @text Debuff status icon Lv1.
 * @type number
 *
 * @param large
 * @text Debuff status icon Lv2.
 * @type number
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
 * @default ["0", "76", "64", "65", "66", "67", "68", "69", "70", "71"]
 *
 * @param debuffStatusIcons
 * @text ステータス弱体アイコン
 * @type struct<DebuffStatusIcons>
 * @default {"mhp":"{\"small\":\"48\", \"large\":\"56\"}", "mmp":"{\"small\":\"49\", \"large\":\"57\"}", "atk":"{\"small\":\"50\", \"large\":\"58\"}", "def":"{\"small\":\"51\", \"large\":\"59\"}", "mat":"{\"small\":\"52\", \"large\":\"60\"}", "mdf":"{\"small\":\"53\", \"large\":\"61\"}", "agi":"{\"small\":\"54\", \"large\":\"62\"}", "luk":"{\"small\":\"55\", \"large\":\"63\"}"}
 * @parent debuffStatus
 *
 * @help
 * version: 1.0.0
 * システムのタイプや弱体にアイコンを設定します。
 * 本プラグインは、他プラグインでタイプや弱体に関するアイコンを扱う際に
 * その補助とするための設定プラグインです。
 * 単体では機能しません。
 */
/*~struct~DebuffStatusIcons:
 * @param mhp
 * @text 最大HP弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"48", "large":"56"}
 *
 * @param mmp
 * @text 最大MP弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"49", "large":"57"}
 *
 * @param atk
 * @text 攻撃力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"50", "large":"58"}
 *
 * @param def
 * @text 防御力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"51", "large":"59"}
 *
 * @param mat
 * @text 魔法力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"52", "large":"60"}
 *
 * @param mdf
 * @text 魔法防御弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"53", "large":"61"}
 *
 * @param agi
 * @text 敏捷性弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"54", "large":"62"}
 *
 * @param luk
 * @text 運弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"55", "large":"63"}
 */
/*~struct~DebuffStatusIcon:
 * @param small
 * @text 弱体アイコン（小）
 * @type number
 *
 * @param large
 * @text 弱体アイコン（大）
 * @type number
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    elementIcons: JSON.parse(
      pluginParameters.elementIcons || '["0", "76", "64", "65", "66", "67", "68", "69", "70", "71"]'
    ).map((e) => {
      return Number(e || 0);
    }),
    debuffStatusIcons: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        mhp: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.mhp || '{"small":"48", "large":"56"}'),
        mmp: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.mmp || '{"small":"49", "large":"57"}'),
        atk: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.atk || '{"small":"50", "large":"58"}'),
        def: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.def || '{"small":"51", "large":"59"}'),
        mat: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.mat || '{"small":"52", "large":"60"}'),
        mdf: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.mdf || '{"small":"53", "large":"61"}'),
        agi: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.agi || '{"small":"54", "large":"62"}'),
        luk: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.luk || '{"small":"55", "large":"63"}'),
      };
    })(
      pluginParameters.debuffStatusIcons ||
        '{"mhp":{"small":"48", "large":"56"}, "mmp":{"small":"49", "large":"57"}, "atk":{"small":"50", "large":"58"}, "def":{"small":"51", "large":"59"}, "mat":{"small":"52", "large":"60"}, "mdf":{"small":"53", "large":"61"}, "agi":{"small":"54", "large":"62"}, "luk":{"small":"55", "large":"63"}}'
    ),
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
  }
  Game_System_SystemTypeIconMixIn(Game_System.prototype);
})();
