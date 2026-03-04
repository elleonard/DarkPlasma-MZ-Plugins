import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createStringArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/03/04",
    version: "1.0.4",
    description: "メッセージ表示中に不必要に高い負荷がかかる不具合を修正",
  },
  {
    description: "configをTypeScript移行",
  },
  {
    date: '2025/02/23',
    version: '1.0.3',
    description: 'ショップシーンに表示するとお金ウィンドウが複製されて位置がズレる不具合を修正',
  },
  {
    date: '2023/09/21',
    version: '1.0.2',
    description: 'TextLogと併用するとログウィンドウを閉じることができない不具合を修正',
  },
  {
    date: '2023/01/18',
    version: '1.0.1',
    description: 'すでにお金ウィンドウがあるシーンにはお金ウィンドウを再定義しない',
  },
  {
    description: '指定シーンを開こうとするとエラーが起きる不具合を修正',
  },
  {
    date: '2023/01/13',
    version: '1.0.0',
    description: '公開',
  },
];

const parameters: PluginParameterSchema[] = [
  createStringArrayParam("scenes", {
    text: "シーン",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "Scene_MessageMixIn",
  2026,
  "指定のシーンにメッセージウィンドウを表示させる"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`
      パラメータで指定したシーンにメッセージウィンドウを表示できるようになります。

      $gameMessage.add などでメッセージを追加した際に、
      そのシーンでもメッセージを表示します。`)
  .build();
