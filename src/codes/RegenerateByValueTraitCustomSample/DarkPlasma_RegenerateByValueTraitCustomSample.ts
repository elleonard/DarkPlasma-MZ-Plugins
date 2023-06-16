/// <reference path="./RegenerateByValueTraitCustomSample.d.ts" />

import { settings } from "./_build/DarkPlasma_RegenerateByValueTraitCustomSample_parameters";

const CUSTOM_ID = 1;

function Game_Battler_RegenerateByValueCustomMixIn(gameBattler: Game_Battler) {
  const _hpRegenerationValue = gameBattler.hpRegenerationValue;
  gameBattler.hpRegenerationValue = function (customId) {
    /**
     * カスタムID1のHP回復値特徴をかき集め、変数の数値分だけ回復するようにする
     * 単純に変数の値に、カスタムID1のHP回復値特徴の数をかけても良いが、複雑な計算式の場合に応用が効きやすい実装とする
     */
    if (customId === CUSTOM_ID) {
      return this.traitsWithId(DataManager.hpRegenerationValueTraitId(), customId)
        .reduce((result, _) => result + $gameVariables.value(settings.variableId), 0);
    }
    return _hpRegenerationValue.call(this, customId);
  };
}

Game_Battler_RegenerateByValueCustomMixIn(Game_Battler.prototype);
