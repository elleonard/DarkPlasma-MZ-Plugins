import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/09/13",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "DualWieldRepeats",
  2025,
  "二刀流時に特定の行動の連続回数を増やす"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`スキル・アイテムに指定のメモタグを記述すると、
    対象を二刀流連撃行動に設定します。
    二刀流連撃行動は、二刀流のバトラーが使用すると連続回数が1増えます。
    
    <dualWieldRepeats>`)
  .build();
