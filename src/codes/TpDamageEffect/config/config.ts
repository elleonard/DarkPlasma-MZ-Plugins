import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/10/06",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "TpDamageEffect",
  2024,
  "TPにダメージを与える使用効果"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueEffectCode",
    version: "1.0.1",
    order: "after",
  })
  .withHelp(dedent`TPにダメージを与える使用効果を追加します。
    
    スキルやアイテムのメモ欄に以下のように記述すると、
    TPに10のダメージを与える使用効果を設定できます。
    <tpDamage:10>
    
    固定値以外のダメージを与える効果にしたい場合は、
    拡張プラグインを作成してください。`)
  .build();
