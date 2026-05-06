import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/06",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "EvacuateStateAndMeta",
  2026,
  "現在のステートに関する情報を退避する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`現在のステートに関する情報を一時的に退避しておく機能を提供します。
    本プラグインは単体では動作しません。
    本プラグインの機能は拡張プラグインから利用されます。`)
  .build();
