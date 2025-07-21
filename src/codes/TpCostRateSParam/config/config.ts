import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createNumberParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/07/21",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const structLimitValue = createStruct("LimitValue", [
  createBooleanParam("enableUpperLimit", {
    text: "上限値を有効にする",
    description: "ONにすると上限値設定が有効になります。OFFにすると上限値なしとなります。",
    default: false,
  }),
  createNumberParam("upperLimit", {
    text: "上限値",
  }),
  createBooleanParam("enableLowerLimit", {
    text: "下限値を有効にする",
    description: "ONにすると下限値設定が有効になります。OFFにすると下限値なしとなります。",
    default: false,
  }),
  createNumberParam("lowerLimit", {
    text: "下限値",
  }),
]);

const parameters: PluginParameterSchema[] = [
  createStructParam("limitSetting", {
    struct: structLimitValue,
    text: "限界値設定",
    description: "TP消費率の限界値を設定します。DarkPlasma_LimitSParam利用時のみ有効。",
    default: {
      enableLowerLimit: false,
      enableUpperLimit: false,
      lowerLimit: 0,
      upperLimit: 10000,
    },
  }),
];

export const config = new ConfigDefinitionBuilder(
  "TpCostRateSParam",
  2025,
  "特殊能力値 TP消費率を追加する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structLimitValue)
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitDataId",
    version: "1.1.0",
    order: 'after',
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_AddSParamTrait",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_LimitSParam",
  })
  .withHelp(dedent`特殊能力値特徴にTP消費率を追加します。
    特徴を追加したいデータのメモ欄に以下のように記述してください。
    
    <tpCostRate:倍率(％)>
    
    例:
    TP消費率150％
    <tpCostRate:150>
    
    加算で変化させたい場合は、DarkPlasma_AddSParamTraitを利用してください。
    
    例:
    TP消費率+10％
    <addSParam:tpCostRate:10>`)
  .build();
