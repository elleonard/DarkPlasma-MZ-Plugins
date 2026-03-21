import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/03/17",
    version: "1.0.1",
    description: "イベントの一時消去などが正常に動作しなくなる不具合を修正",
  },
  {
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "CleanUpDeletedEvents",
  2026,
  "削除されたイベントをセーブデータから除去する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`ゲームのバージョンアップによって削除されたイベントも、
    セーブデータ内には残ってしまいます。
    本プラグインは、セーブデータに残ってしまったゴミイベントを除去し、意図しないエラーを防ぎます。`)
  .build();
