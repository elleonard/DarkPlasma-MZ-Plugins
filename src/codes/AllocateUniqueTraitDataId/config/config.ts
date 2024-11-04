import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/11/04",
    version: "1.1.0",
    description: "特徴データ名のDBロード後評価に対応",
  },
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
  .withOrderAfterDependency({
    name: "DarkPlasma_FilterEquip",
  })
  .withHelp(dedent`独自の特徴データIDを確保し、利用できるようにします。

  本プラグインは単体では機能しません。
  本プラグインを必要とする別のプラグインと一緒に利用してください。

  以下、プラグインの開発者向けの情報です。
  uniqueTraitDataIdCache オブジェクトに対してリクエストを投げてください。

  uniqueTraitDataIdCache.allocate
    : (pluginName: string, traitId: number, localId: number, name: string|(() => string)) => UniqueTraitDataId
    プラグインで独自の特殊フラグIDを確保します。
    名前をデータベースロード後に評価する関数にすることもできます。

  UniqueSpecialFlagId.prototype.id: number
    確保した特殊フラグID

  UniqueSpecialFlagId.prototype.name: string
    確保した特殊フラグIDの名前`)
  .build();
