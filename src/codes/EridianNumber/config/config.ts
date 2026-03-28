import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "IλVI+/ℓλ/++",
    version: "I.ℓ.ℓ",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "EridianNumber",
  2026,
  "数字をエリディアン表記にする"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`本プラグインは表示文字列に現れる数値を
    エリディアン表記に変換します。
    
    本プラグインを利用する前に、プロジェクト・ヘイル・メアリーを
    第∀ℓ章まで読了していただくことを推奨します。`)
  .build();
