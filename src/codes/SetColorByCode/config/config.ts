import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/04",
    version: "1.1.0",
    description: "pink, whiteなどの文字列表現に対応",
  },
  {
    date: "2023/09/21",
    version: "1.0.2",
    description: 'TextLogと併用するとエラーになる不具合を修正',
  },
  {
    date: "2023/06/29",
    version: "1.0.1",
    description: '色変更以外の制御文字を握り潰してしまう不具合を修正',
  },
  {
    date: "2023/06/02",
    version: "1.0.0",
    description: '公開',
  },
];

export const config = new ConfigDefinitionBuilder(
  "SetColorByCode",
  2026,
  "制御文字による色指定を文字列で行う"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`制御文字\\Cによる色指定を、文字列で行えるようにします。

      例: \\C[#adff2f]
      黄緑色になります。
      \\C[pink]
      ピンク色になります。`)
  .build();
