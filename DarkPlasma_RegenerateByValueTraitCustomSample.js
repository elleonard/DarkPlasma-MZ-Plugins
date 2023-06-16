// DarkPlasma_RegenerateByValueTraitCustomSample 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/06/16 1.0.0 公開
 */

/*:
 * @plugindesc HP再生値 MP再生値特徴のカスタムIDサンプル
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_RegenerateByValueTrait
 * @orderAfter DarkPlasma_RegenerateByValueTrait
 *
 * @param variableId
 * @text 変数
 * @type variable
 *
 * @help
 * version: 1.0.0
 * DarkPlasma_RegenerateByValueTrait で定義するカスタムIDの実装サンプルです。
 * HP再生値のカスタムID:1について、パラメータで指定した変数の値分回復します。
 *
 * サンプルのための特徴は以下のように定義します。
 * <hpRegenerationValue:0> (この0は任意の数値で構いません。無視されます)
 * <hpRegenerationCustomId:1>
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_RegenerateByValueTrait version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_RegenerateByValueTrait
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    variableId: Number(pluginParameters.variableId || 0),
  };

  const CUSTOM_ID = 1;
  function Game_Battler_RegenerateByValueCustomMixIn(gameBattler) {
    const _hpRegenerationValue = gameBattler.hpRegenerationValue;
    gameBattler.hpRegenerationValue = function (customId) {
      /**
       * カスタムID1のHP回復値特徴をかき集め、変数の数値分だけ回復するようにする
       * 単純に変数の値に、カスタムID1のHP回復値特徴の数をかけても良いが、複雑な計算式の場合に応用が効きやすい実装とする
       */
      if (customId === CUSTOM_ID) {
        return this.traitsWithId(DataManager.hpRegenerationValueTraitId(), customId).reduce(
          (result, _) => result + $gameVariables.value(settings.variableId),
          0
        );
      }
      return _hpRegenerationValue.call(this, customId);
    };
  }
  Game_Battler_RegenerateByValueCustomMixIn(Game_Battler.prototype);
})();
