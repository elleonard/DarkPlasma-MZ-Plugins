import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/19",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "ResumeMapAnimation",
  2026,
  "マップシーンに戻った時にアニメーションを再開する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`
    マップシーンから他のシーン（メニュー・ショップ・戦闘など）に移行し、
    マップシーンに戻った時、移行前に再生中だったアニメーションを再開します。

    マップ移動（場所移動）による場面転換では再開しません。

    MZスタイル・MVスタイルともに中断した位置から再開します。
    あくまで再生位置ベースの再開であるため、
    ランダム性のあるeffekseerアニメーションについて、
    再開前と全く同じ画面から再開するわけではありません。
  `)
  .build();
