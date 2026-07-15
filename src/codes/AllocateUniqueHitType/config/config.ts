import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/07/15",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const parameters: PluginParameterSchema[] = [
  createNumberParam("startId", {
    text: "独自ID始点",
    description: "命中タイプの独自ID始点を設定します。",
    default: 3,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "AllocateUniqueHitType",
  2026,
  "独自の命中タイプのIDを確保する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`独自の命中タイプIDを確保し、利用できるようにします。
    
  本プラグインは単体では機能しません。
  本プラグインを必要とする別のプラグインと一緒に利用してください。

  以下、プラグインの開発者向けの情報です。
  uniqueHitypeIdCache オブジェクトに対してリクエストを投げてください。

  uniqueHitTypeIdCache.allocate
    : (pluginName: string, traitId: number, localId: number, name: string) => UniqueHitTypeId
    プラグインで独自の命中タイプIDを確保します。

  UniqueHitTypeId.prototype.id: number
    確保した命中タイプID

  UniqueHitTypeId.prototype.name: string
    確保した命中タイプIDの名前`)
  .build();
