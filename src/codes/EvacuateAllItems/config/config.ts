import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/01/17",
    version: "1.0.0",
    description: "公開",
  }
];

const commandEvacuateAllItems = createCommand('EvacuateAllItems', {
  text: "アイテムを退避する",
  description: "所持している全てのアイテムを一時的に退避します。",
  args: [
    createBooleanParam('evacuateItems', {
      text: "アイテムを退避する",
      description: "アイテムを退避します。大事なものは退避しません。",
      default: true,
    }),
    createBooleanParam('evacuateWeapons', {
      text: "武器を退避する",
      description: "武器を退避します。装備している武器は退避しません。",
      default: false,
    }),
    createBooleanParam('evacuateArmors', {
      text: "防具を退避する",
      description: "防具を退避します。装備している防具は退避しません。",
      default: false,
    }),
    createBooleanParam('evacuateKeyItems', {
      text: "大事なものを退避する",
      description: "大事なものを退避します。",
      default: false,
    }),
  ],
});

const commandRegainItems = createCommand('RegainItems', {
  text: "退避したアイテムを戻す",
  description: "退避したアイテムを戻します。所持数上限を超えたアイテムは捨てられます。",
});

export const config = new ConfigDefinitionBuilder(
  "EvacuateAllItems",
  2025,
  "アイテムを退避するプラグインコマンド"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommand(commandEvacuateAllItems)
  .withCommand(commandRegainItems)
  .withHelp(dedent`所持しているアイテムを一時的に退避するプラグインコマンドを提供します。
    退避したアイテムはインベントリから消えます。
    退避したアイテムを戻すコマンドによって再びインベントリに戻すことができます。
    
    本プラグインはセーブデータを拡張します。
    退避したアイテムのIDと個数をセーブデータに含みます。`)
  .build();
