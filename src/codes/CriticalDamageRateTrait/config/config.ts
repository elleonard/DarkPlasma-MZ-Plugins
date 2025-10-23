import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createNumberParam, createStringParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/10/23",
    version: "1.2.0",
    description: "特徴ID変数、デフォルト会心ダメージ率インターフェースを追加",
  },
  {
    date: "2025/09/15",
    version: "1.1.0",
    description: "装備絞り込み用の特徴名設定を追加",
  },
  {
    date: "2024/02/20",
    version: "1.0.0",
    description: "公開",
  }
];

const structNamesForFilter: PluginStruct = createStruct("NamesForFilter", [
  createStringParam("traitName", {
    text: "特徴名",
    default: "追加能力値",
  }),
  createStringParam("effectName", {
    text: "効果名",
    default: "会心ダメージ率",
  }),
]);

const parameters = [
  createNumberParam("defaultCriticalDamageRate", {
    text: "デフォルト会心ダメージ率",
    description: "会心ダメージ率の初期値を設定します。",
    min: 0,
    default: 300,
  }),
  createStructParam("namesForFilter", {
    struct: structNamesForFilter,
    text: "フィルタ用特徴名",
    description: "装備絞り込みの際に使用する特徴名を設定します。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "CriticalDamageRateTrait",
  2024,
  "会心ダメージ率の特徴を設定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structNamesForFilter)
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.1",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_FilterEquip",
  })
  .withHelp(dedent`会心ダメージ率の特徴を設定できます。
  
  アクター、職業、スキル、武器、防具、敵キャラ、ステートのメモ欄に
  以下のように記述すると、対象に会心ダメージ率を+n％する特徴を追加します。
  
  <criticalDamageRate:n>`)
  .build();
