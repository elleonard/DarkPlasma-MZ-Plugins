import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/06/07",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "PartialTextColor",
  2026,
  "部分文字列に色を付ける"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`drawTextによるテキスト描画でも部分文字列に色をつけられるようにします。
    \\C制御文字による色付けが可能になります。`)
  .build();
