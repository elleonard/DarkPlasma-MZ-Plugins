// DarkPlasma_RandomGainItem 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/08/08 1.0.0 公開
 */

/*:
 * @plugindesc ランダムにアイテムを入手する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command randomGainItem
 * @text ランダムにアイテムを入手
 * @arg items
 * @text 抽選対象アイテム
 * @type struct<RandomItem>[]
 * @arg weapons
 * @text 抽選対象武器
 * @type struct<RandomWeapon>[]
 * @arg armors
 * @text 抽選対象防具
 * @type struct<RandomArmor>[]
 * @arg nameVariable
 * @text 名前変数
 * @desc 入手したアイテムの名前を指定した変数に代入します。
 * @type variable
 *
 * @help
 * version: 1.0.0
 * ランダムにアイテムを入手するプラグインコマンドを提供します。
 */
/*~struct~RandomItem:
 * @param id
 * @text アイテム
 * @type item
 *
 * @param weight
 * @desc アイテムが抽選される確率を決めるための重みを指定します。大きいほど確率は高くなります。
 * @text 重み
 * @type number
 * @default 1
 * @min 1
 */
/*~struct~RandomWeapon:
 * @param id
 * @text 武器
 * @type weapon
 *
 * @param weight
 * @desc アイテムが抽選される確率を決めるための重みを指定します。大きいほど確率は高くなります。
 * @text 重み
 * @type number
 * @default 1
 * @min 1
 */
/*~struct~RandomArmor:
 * @param id
 * @text 防具
 * @type armor
 *
 * @param weight
 * @desc アイテムが抽選される確率を決めるための重みを指定します。大きいほど確率は高くなります。
 * @text 重み
 * @type number
 * @default 1
 * @min 1
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_randomGainItem(args) {
    return {
      items: JSON.parse(args.items || '[]').map((e) => {
        return ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            id: Number(parsed.id || 0),
            weight: Number(parsed.weight || 1),
          };
        })(e || '{}');
      }),
      weapons: JSON.parse(args.weapons || '[]').map((e) => {
        return ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            id: Number(parsed.id || 0),
            weight: Number(parsed.weight || 1),
          };
        })(e || '{}');
      }),
      armors: JSON.parse(args.armors || '[]').map((e) => {
        return ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            id: Number(parsed.id || 0),
            weight: Number(parsed.weight || 1),
          };
        })(e || '{}');
      }),
      nameVariable: Number(args.nameVariable || 0),
    };
  }

  const command_randomGainItem = 'randomGainItem';

  PluginManager.registerCommand(pluginName, command_randomGainItem, function (args) {
    const parsedArgs = parseArgs_randomGainItem(args);
    const randomItems = parsedArgs.items
      .map((item) => {
        return { ...item, kind: 0 };
      })
      .concat(
        parsedArgs.weapons.map((item) => {
          return { ...item, kind: 1 };
        })
      )
      .concat(
        parsedArgs.armors.map((item) => {
          return { ...item, kind: 2 };
        })
      );
    const totalWeight = randomItems.reduce((result, current) => result + current.weight, 0);
    const lottery = Math.randomInt(totalWeight);
    let weight = 0;
    const resultItem = randomItems.find((randomItem) => {
      weight += randomItem.weight;
      return lottery < weight;
    });
    const resultItemData = (() => {
      switch (resultItem.kind) {
        case 0:
          return $dataItems[resultItem.id];
        case 1:
          return $dataWeapons[resultItem.id];
        case 2:
          return $dataArmors[resultItem.id];
      }
      return undefined;
    })();
    if (resultItemData) {
      $gameParty.gainItem(resultItemData, 1);
      if (parsedArgs.nameVariable > 0) {
        $gameVariables.setValue(parsedArgs.nameVariable, resultItemData.name);
      }
    }
  });
})();
