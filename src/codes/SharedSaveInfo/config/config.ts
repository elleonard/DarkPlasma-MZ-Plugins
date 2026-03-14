import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/03/15",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const commandSaveSharedInfo = createCommand("saveSharedInfo", {
  text: "共有セーブに保存する",
  description: "共有セーブデータにスイッチ・変数を保存します。",
});

export const config = new ConfigDefinitionBuilder(
  "SharedSaveInfo",
  2026,
  "全てのセーブデータに共通のデータを定義する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands([commandSaveSharedInfo])
  .withHelp(dedent`全てのセーブデータに共通のデータを定義します。
    本プラグインは単体では効力を発揮しません。
    拡張プラグインといっしょに利用してください。`)
  .build();
