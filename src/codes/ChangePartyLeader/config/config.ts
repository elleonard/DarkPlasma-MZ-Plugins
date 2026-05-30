import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createDatabaseParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/30",
    version: "1.0.1",
    description: "リーダーを変更するコマンド実行時に、変更後のリーダーが現在と同じ場合に、実行直前のリーダーが記録されない不具合の修正",
  },
  {
    description: "configをTypeScript移行",
  },
  {
    date: "2022/11/06",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const commands: PluginCommandSchema[] = [
  createCommand("changeLeader", {
    text: "リーダーを変更する",
    description: "パーティリーダーを指定したアクターに変更します。（元のリーダーと隊列を入れ替えます）",
    args: [
      createDatabaseParam("actorId", {
        type: 'actor',
        text: "アクター",
      }),
    ],
  }),
  createCommand("resetLeader", {
    text: "リーダーを元に戻す",
    description: "リーダーを変更プラグインコマンド実行直前の状態に戻します。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "ChangePartyLeader",
  2026,
  "パーティの先頭（リーダー）を変更する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands(commands)
  .withHelp(dedent`先頭のパーティメンバーを、現在パーティメンバーにいるアクターに
      入れ替えるプラグインコマンドを提供します。

      セーブデータに以下のデータを追加します。
      - プラグインコマンドでリーダーを変更する直前のリーダー

      尚、指定したアクターや元のリーダーがパーティメンバーにいない場合、
      プラグインコマンドは何もしません。`)
  .build();
