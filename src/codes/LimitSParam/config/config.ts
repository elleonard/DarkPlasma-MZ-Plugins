import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
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

const structStatusLimit = createStruct("StatusLimit", [
  {
    param: "tgr",
    name: "狙われ率",
  },
  {
    param: "grd",
    name: "防御効果率",
  },
  {
    param: "rec",
    name: "回復効果率",
  },
  {
    param: "pha",
    name: "薬の知識",
  },
  {
    param: "mcr",
    name: "MP消費率",
  },
  {
    param: "tcr",
    name: "TPチャージ率",
  },
  {
    param: "pdr",
    name: "物理ダメージ率",
  },
  {
    param: "mdr",
    name: "魔法ダメージ率",
  },
  {
    param: "fdr",
    name: "床ダメージ率",
  },
  {
    param: "exr",
    name: "経験値獲得率",
  },
].map(x => createStructParam(x.param, {
  struct: structLimitValue,
  text: x.name,
  default: {
    enableUpperLimit: false,
    upperLimit: 999999,
    enableLowerLimit: true,
    lowerLimit: 0,
  },
})));

const parameters = [
  createStructParam("statusLimit", {
    struct: structStatusLimit,
    text: "限界値",
    description: "各ステータスの限界値を設定します。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "LimitSParam",
  2025,
  "特殊能力値の限界値を設定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structLimitValue)
  .withStructure(structStatusLimit)
  .withParameters(parameters)
  .withOrderAfterDependency({
    name: "DarkPlasma_AddSParamTrait",
  })
  .withHelp(dedent`特殊能力値の限界値を設定します。`)
  .build();
