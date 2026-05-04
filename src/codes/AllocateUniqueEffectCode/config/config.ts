import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/04",
    version: "1.0.2",
    description: "configをtypescript移行",
  },
  {
    description: "ヘルプの記述を修正",
  },
  {
    date: "2022/09/11",
    version: "1.0.1",
    description: 'typescript移行',
  },
  {
    date: "2022/07/17",
    version: "1.0.0",
    description: '公開',
  },
];

const parameters: PluginParameterSchema[] = [
  createNumberParam("startOfUniqueEffectCode", {
    text: "独自効果コード始点",
    description: "独自に効果コードを確保する際の始点。わからない場合はそのままにしてください",
    default: 51,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "AllocateUniqueEffectCode",
  2026,
  "独自の効果コードを確保する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`独自の効果コードを確保し、利用できるようにします。

      本プラグインは単体では機能しません。
      本プラグインを必要とする別のプラグインと一緒に利用してください。

      uniqueEffectCodeCache オブジェクトに対してリクエストを投げてください。

      uniqueEffectCodeCache.allocate
        : (pluginName: string, localId: number) => UniqueEffectCode
        プラグインで独自の効果コードを確保します。

      uniqueEffectCodeCache.effectCodeOf
        : (pluginName: string, localId: number) => number|undefined
        確保した効果コード
        確保していない場合はundefined

      UniqueEffectCode.prototype.code: number
        確保した効果コード`)
  .build();
