import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createStringParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/04/11",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const parameters: PluginParameterSchema[] = [
  createStringParam("menuText", {
    text: "メニューテキスト",
    description: "シャットダウンメニューとして表示する名前",
    default: "シャットダウン",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "ShutdownGame",
  2026,
  "タイトルとゲーム終了メニューにシャットダウンを追加する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`タイトルとゲーム終了メニューにシャットダウンを追加します。
    本プラグインはブラウザプレイ用のゲームでは利用できません。`)
  .build();
