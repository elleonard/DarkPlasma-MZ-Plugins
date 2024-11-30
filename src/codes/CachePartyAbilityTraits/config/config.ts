import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/11/30",
    version: "1.0.0",
    description: "公開",
  }
];

const structClearCache = createStruct("ClearCache", [
  createBooleanParam("changeEquip", {
    text: "装備変更",
    description: "装備にパーティ能力特徴を設定する場合はONにします。",
    default: true,
  }),
  createBooleanParam("changeState", {
    text: "ステート変更",
    description: "ステートにパーティ能力特徴を設定する場合はONにします。",
    default: true,
  }),
  createBooleanParam("changeClass", {
    text: "職業変更",
    description: "職業にパーティ能力特徴を設定する場合はONにします。",
    default: true,
  }),
]);

const parameters = [
  createStructParam("clearCache", {
    struct: structClearCache,
    text: "キャッシュクリア",
    description: "キャッシュクリアの設定を行います。",
    default: {
      changeEquip: true,
      changeState: true,
      changeClass: true,
    },
  }),
];

export const config = new ConfigDefinitionBuilder(
  "CachePartyAbilityTraits",
  2024,
  "パーティ能力特徴をキャッシュする"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structClearCache)
  .withParameters(parameters)
  .withHelp(dedent`DarkPlasma_PartyAbilityTraitExtensionで追加するパーティ能力特徴をキャッシュし、
    再計算を抑制します。
    パーティ能力特徴によってパフォーマンスに影響が出ていると感じた場合にお試しください。
    
    以下のタイミングで再計算を行います。
    - パーティメンバーが増減した時
    - 装備を変更した時
    - アクターにステートが付加されたり、解除された時
    - 職業が変わった時`)
  .build();
