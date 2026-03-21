import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/03/21",
    version: "2.0.0",
    description: "CleanUpDeletedEventsから改名",
  },
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
  "RecoverGameEvents",
  2026,
  "セーブデータのイベント配列を復元する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`セーブデータにはイベントの状態が配列で記録されます。
    本プラグインは、セーブデータに含まれるイベント配列のキーを
    意図しない状態から復元するためのプラグインです。
    
    通常のプロジェクトにとっては不要ですので、必要性を認識してから導入を検討してください。`)
  .build();
