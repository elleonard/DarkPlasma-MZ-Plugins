import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/11/09",
    version: "1.0.1",
    description: "戦闘不能対象の範囲拡散の挙動が正常でない",
  },
  {
    date: "2024/11/09",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters = [
  createNumberParam("damageRate", {
    text: "ダメージ倍率(％)",
    description: "対象の両隣に与えるダメージ、回復量の倍率を設定します。",
    default: 50,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "BlastScope",
  2024,
  "範囲「拡散」"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`スキルやアイテムの範囲設定に「拡散」を追加します。
    
    範囲設定の陣営が「敵」または「味方」かつ数が「単体」であるような
    スキルやアイテムのメモ欄に以下のように記述すると、
    範囲設定が「拡散」になります。
    <blastScope>

    「拡散」範囲は敵単体を指定し、その両隣にも効果を及ぼします。
    ここで言う隣とは、敵グループに追加した順番を基準にしており、
    必ずしも表示位置とは関係しないことに注意してください。`)
  .build();
