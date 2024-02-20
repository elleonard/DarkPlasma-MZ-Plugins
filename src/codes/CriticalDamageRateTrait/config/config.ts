import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories = [
  {
    date: "2024/02/20",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters = [
  createNumberParam("defaultCriticalDamageRate", {
    text: "デフォルト会心ダメージ率",
    description: "会心ダメージ率の初期値を設定します。",
    min: 0,
    default: 300,
  })
];

export const config = new ConfigDefinitionBuilder(
  "CriticalDamageRateTrait",
  2024,
  "会心ダメージ率の特徴を設定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`会心ダメージ率の特徴を設定できます。
  
  アクター、職業、スキル、武器、防具、敵キャラ、ステートのメモ欄に
  以下のように記述すると、対象に会心ダメージ率を+n％する特徴を追加します。
  
  <criticalDamageRate:n>`)
  .build();
