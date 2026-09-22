import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/09/22",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "NineSliceSprite",
  2026,
  "9スライス画像を扱う"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`
    Spriteで9スライス画像を扱えるようにします。

    このプラグインはプラグインコマンドを提供しません。
    他プラグインからSprite#refreshNineSliceを呼び出すことで、
    9スライス画像を合成できます。
  `)
  .build();
