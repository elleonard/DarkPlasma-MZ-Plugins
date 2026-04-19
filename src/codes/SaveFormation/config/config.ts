import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createStringParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/04/19",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const commandSaveFormation: PluginCommandSchema = createCommand("saveFormation", {
  text: "並び順を保存する",
  description: "パーティメンバーの現在の並び順を保存します。",
  args: [
    createStringParam("key", {
      text: "識別名",
      description: "保存する並び順に名前をつけます。同じ名前で保存された並び順は上書きされます。",
    }),
  ],
});

const commandLoadFormation: PluginCommandSchema = createCommand("loadFormation", {
  text: "並び順を復元する",
  description: "保存した並び順を復元します。保存されていない識別名を指定すると何も起きません。",
  args: [
    createStringParam("key", {
      text: "識別名",
      description: "保存の際につけた名前を指定します。",
    }),
  ],
});

export const config = new ConfigDefinitionBuilder(
  "SaveFormation",
  2026,
  "パーティの並び順を保存して復元する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands([
    commandSaveFormation,
    commandLoadFormation,
  ])
  .withHelp(dedent`パーティの並び順を保存して復元するプラグインコマンドを提供します。
    
    復元の際にパーティメンバーの構成が変更されていた場合
    元々いたメンバーを先頭に配置し、いなかったメンバーを後ろに配置します。

    戦闘中にパーティメンバーを復元することは推奨しません。
    
    本プラグインはセーブデータに以下の情報を追加します。
    - 保存したパーティメンバーの並び順`)
  .build();
