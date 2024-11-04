import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/11/04",
    version: "1.1.0",
    description: "非推奨化",
  },
  {
    date: "2024/03/02",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters = [
  createNumberParam("startIdOfUniqueSpecialFlagId", {
    text: "独自特殊フラグID始点",
    description: "独自に特殊フラグIDを確保する際の始点ID。わからない場合はそのままにしてください。",
    default: 11,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "AllocateUniqueSpecialFlagId",
  2024,
  "独自の特殊フラグ特徴のIDを確保する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitDataId",
    version: "1.1.0",
    order: "after",
  })
  .withHelp(dedent`本プラグインの利用は非推奨になりました。
    DarkPlasma_AllocateUniqueTraitDataId の利用を検討してください。
    
  特殊フラグ特徴のIDを確保し、利用できるようにします。
  
  本プラグインは単体では機能しません。
  本プラグインを必要とする別のプラグインと一緒に利用してください。
  
  以下、プラグインの開発者向けの情報です。
  uniqueSpecialFlagIdCache オブジェクトに対してリクエストを投げてください。
  
  uniqueSpecialFlagIdCache.allocate
    : (pluginName: string, localId: number, name: string) => UniqueSpecialFlagId
    プラグインで独自の特殊フラグIDを確保します。
  
  UniqueSpecialFlagId.prototype.id: number
    確保した特殊フラグID

  UniqueSpecialFlagId.prototype.name: string
    確保した特殊フラグIDの名前
  `)
  .build();
