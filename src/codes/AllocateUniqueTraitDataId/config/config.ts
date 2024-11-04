import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/11/04",
    version: "1.0.0",
    description: "公開",
  }
];

const structUniqueDataIds = createStruct("uniqueDataIds", [
  createNumberParam("debuffRate", {
    text: "弱体有効度",
    description: "弱体有効度特徴の独自データID始点を定義します。",
    default: 8,
    min: 8,
  }),
  createNumberParam("param", {
    text: "通常能力値",
    description: "通常能力値特徴の独自データID始点を定義します。",
    default: 8,
    min: 8,
  }),
  createNumberParam("xparam", {
    text: "追加能力値",
    description: "追加能力値特徴の独自データID始点を定義します。",
    default: 10,
    min: 10,
  }),
  createNumberParam("sparam", {
    text: "特殊能力値",
    description: "特殊能力値特徴の独自データID始点を定義します。",
    default: 10,
    min: 10,
  }),
  createNumberParam("slotType", {
    text: "スロットタイプ",
    description: "スロットタイプ特徴の独自データID始点を定義します。",
    default: 2,
    min: 2,
  }),
  createNumberParam("specialFlag", {
    text: "特殊フラグ",
    description: "特殊フラグ特徴の独自データID始点を定義します。",
    default: 4,
    min: 4,
  }),
  createNumberParam("partyAbility", {
    text: "パーティ能力",
    description: "パーティ能力特徴の独自データID始点を定義します。",
    default: 6,
    min: 6,
  }),
]);

const parameters = [
  createStructParam("startId", {
    struct: structUniqueDataIds,
    text: "独自ID始点",
    description: "各種特徴の独自ID始点を定義します。",
    default: {
      debuffRate: 8,
      param: 8,
      xparam: 10,
      sparam: 10,
      slotType: 2,
      specialFlag: 4,
      partyAbility: 6,
    },
  }),
];

export const config = new ConfigDefinitionBuilder(
  "AllocateUniqueTraitDataId",
  2024,
  "独自の特徴データIDを確保する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structUniqueDataIds)
  .withParameters(parameters)
  .withHelp(dedent`独自の特徴データIDを確保し、利用できるようにします。`)
  .build();
