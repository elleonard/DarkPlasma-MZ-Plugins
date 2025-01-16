import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/01/16",
    version: "1.0.0",
    description: "公開",
  }
];

const commandLoseAllItems = createCommand('LoseAllItems', {
  text: "アイテムを破棄する",
  description: "指定カテゴリに属する全てのアイテムを破棄します。",
  args: [
    createBooleanParam('loseItems', {
      text: "アイテムを破棄する",
      description: "アイテムを破棄します。大事なものは破棄しません。",
      default: true,
    }),
    createBooleanParam('loseWeapons', {
      text: "武器を破棄する",
      description: "武器を破棄します。装備している武器は破棄しません。",
      default: false,
    }),
    createBooleanParam('loseArmors', {
      text: "防具を破棄する",
      description: "防具を破棄します。装備している防具は破棄しません。",
      default: false,
    }),
    createBooleanParam('loseKeyItems', {
      text: "大事なものを破棄する",
      description: "大事なものを破棄します。",
      default: false,
    }),
  ],
});

export const config = new ConfigDefinitionBuilder(
  "LoseAllItems",
  2025,
  "所持しているアイテムを全て捨てるプラグインコマンド"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommand(commandLoseAllItems)
  .withHelp(dedent`所持しているアイテムを全て捨てるプラグインコマンドを提供します。`)
  .build();
