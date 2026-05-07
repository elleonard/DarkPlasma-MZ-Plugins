import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/07",
    version: "1.2.0",
    description: "バトラーの状態に応じた最大・最小値をサポートするようにインターフェース拡張",
  },
  {
    date: "2026/05/06",
    version: "1.1.0",
    description: "特定種別の値合計を取得するインターフェースを追加",
  },
  {
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "StateWithValue",
  2026,
  "値付きステート"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withOrderAfterDependency({
    name: "DarkPlasma_EvacuateStateAndMeta",
  })
  .withHelp(dedent`ステートに値を持たせる機能を提供します。
    本プラグインは単体では動作しません。
    本プラグインの機能は拡張プラグインから利用されます。`)
  .build();
