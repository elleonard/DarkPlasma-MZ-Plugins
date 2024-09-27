import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/09/27",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "SelfDestructingEffect",
  2024,
  "使用効果 自滅"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`使用効果 自滅を実装します。
    この使用効果をスキルやアイテムに設定すると、使用者を戦闘不能にします。
    
    以下のメモタグで設定することができます。
    <selfDestructing>`)
  .build();
