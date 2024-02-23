import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { createCommand, createDatabaseParam, createNumberParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories = [
  {
    date: "2024/02/23",
    version: "1.0.0",
    description: "公開",
  }
];

const commands = [
  createCommand("isInLights", {
    text: "明かりの中にいるか判定",
    description: "明かりの中にいる場合指定したスイッチをONにします。",
    args: [
      createDatabaseParam("switchId", {
        type: "switch",
        text: "スイッチ",
        description: "対象が明かりの中にいる場合ONにするスイッチを指定します。",
        default: 0,
      }),
      createSelectParam("target", {
        text: "対象",
        description: "明かりの中にいるかどうか判定する対象を選択します。",
        options: [
          {
            name: "プレイヤー",
            value: "player",
          },
          {
            name: "このイベント",
            value: "thisEvent",
          },
          {
            name: "他のイベント",
            value: "otherEvent",
          },
        ],
        default: "player",
      }),
      createNumberParam("eventId", {
        text: "イベントID",
        description: "対象が他のイベントの場合に、イベントIDを指定します。",
        default: 0,
      }),
    ],
  })
];

export const config = new ConfigDefinitionBuilder(
  "IsInLights",
  2024,
  "明かりの中にいるかどうか判定するプラグインコマンド"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands(commands)
  .withBaseDependency({
    name: "DarkPlasma_DarkMap",
    version: "2.2.0",
  })
  .withHelp(dedent`暗いマップにおいて明かりの中にいるかどうか判定し、
  結果をスイッチに反映するプラグインコマンドを提供します。`)
  .build();
