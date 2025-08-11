import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/08/11",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "RemoveStateGroupEffect",
  2025,
  "使用効果 指定グループに属するステート解除"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_StateGroup2",
    version: "2.0.0",
  })
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueEffectCode",
    version: "1.0.1",
    order: 'after',
  })
  .withHelp(dedent`指定グループに属するステートを解除する使用効果を実現します。
    スキルやアイテムのメモ欄に、以下のように記述します。
    <removeStateGroup: x>
    グループxに属するステートを解除します。
    
    グループの設定には DarkPlasma_StateGroup2 をご利用ください。`)
  .build();
