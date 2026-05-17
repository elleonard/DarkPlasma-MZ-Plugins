import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/17",
    version: "1.1.0",
    description: "表示行数の変更に対応",
  },
  {
    date: "2022/11/15",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "HorizontalScrollWindow",
  2026,
  "横方向にスクロールするウィンドウ"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`本プラグインはプラグイン開発者向けです。

      以下のように記述することで、対象の選択ウィンドウの
      スクロール方向を縦から横に変更します。
      Window_HorizontalScrollMixIn(windowClass: Window_Selectable);
`)
  .build();
