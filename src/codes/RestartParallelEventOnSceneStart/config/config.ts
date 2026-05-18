import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/19",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "RestartParallelEventOnSceneStart",
  2026,
  "マップシーン開始時に先頭から再実行する並列実行イベント"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`
    マップシーン開始時（メニューを閉じた後、戦闘終了後など）に
    特定の並列実行イベントをコマンドリストの先頭から再実行します。

    イベントのメモ欄:
    <restartOnSceneStart> マップシーン開始時に先頭から再実行します。
  `)
  .build();
