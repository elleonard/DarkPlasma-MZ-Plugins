import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/06/25",
    version: "1.0.3",
    description: "configをTypeScript移行",
  },
  {
    date: "2024/11/04",
    version: "1.0.2",
    description: "ヘルプの誤字修正",
  },
  {
    date: "2022/08/21",
    version: "1.0.1",
    description: "typescript移行",
  },
  {
    date: "2022/05/28",
    version: "1.0.0",
    description: "公開",
  },
];

const parameters: PluginParameterSchema[] = [
  createNumberParam("startIdOfUniqueTraitId", {
    text: "独自特徴ID始点",
    description: "独自に特徴IDを確保する際の始点ID。わからない場合はそのままにしてください",
    default: 71,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "AllocateUniqueTraitId",
  2022,
  "独自の特徴IDを確保する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`独自の特徴IDを確保し、利用できるようにします。

      本プラグインは単体では機能しません。
      本プラグインを必要とする別のプラグインと一緒に利用してください。

      以下、プラグインの開発者向けの情報です。
      uniqueTraitIdCache オブジェクトに対してリクエストを投げてください。

      uniqueTraitIdCache.allocate
        : (pluginName: string, localId: number, name: string) => UniqueTraitId
        プラグインで独自の特徴IDを確保します。

      uniqueTraitIdCache.traitIdOf
        : (pluginName: string, localId: number) => number|undefined
        確保した特徴ID
        確保していない場合はundefined

      uniqueTraitIdCache.nameOf
        : (pluginName: string, localId: number) => string|undefined
        確保した特徴IDの名前
        確保していない場合はundefined

      UniqueTraitId.prototype.id: number
        確保した特徴ID

      UniqueTraitId.prototype.name: string
        確保した特徴IDの名前`)
  .build();
