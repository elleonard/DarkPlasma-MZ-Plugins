import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createNumberParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/09/15",
    version: "1.0.0",
    description: "公開",
  }
];


const commandFixChoiceListPosition = createCommand("fixChoiceListPosition", {
  text: "選択肢の位置固定",
  description: "選択肢の表示位置を固定します。",
  args: [
    createSelectParam("xPositionType", {
      text: "X座標タイプ",
      description: "X座標のタイプを指定します。",
      options: [
        {
          name: "左",
          value: 0,
        },
        {
          name: "中",
          value: 1,
        },
        {
          name: "右",
          value: 2,
        },
        {
          name: "数値指定",
          value: 3,
        },
        {
          name: "固定しない",
          value: 4,
        },
      ],
      default: 4,
    }),
    createNumberParam("x", {
      text: "X座標",
      description: "X座標を指定します。X座標タイプが数値指定の場合のみ有効です。",
      default: 0,
    }),
    createSelectParam("yPositionType", {
      text: "Y座標タイプ",
      description: "Y座標のタイプを指定します。上 中 下はメッセージウィンドウの位置を表します。",
      options: [
        {
          name: "上",
          value: 0,
        },
        {
          name: "中",
          value: 1,
        },
        {
          name: "下",
          value: 2,
        },
        {
          name: "数値指定",
          value: 3,
        },
        {
          name: "固定しない",
          value: 4,
        },
      ],
      default: 2,
    }),
    createNumberParam("y", {
      text: "Y座標",
      description: "Y座標を指定します。Y座標タイプが数値指定の場合のみ有効です。",
      default: 0,
    }),
  ],
});

const commandUnfixChoiceListPosition = createCommand("unfixChoiceListPosition", {
  text: "選択肢の位置固定解除",
  description: "選択肢の位置固定を解除します。",
});

export const config = new ConfigDefinitionBuilder(
  "FixChoiceListPosition",
  2024,
  "選択肢の表示位置を固定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommand(commandFixChoiceListPosition)
  .withCommand(commandUnfixChoiceListPosition)
  .withHelp(dedent`プラグインコマンドによって選択肢の表示位置を固定します。
    
    位置固定に関する情報はセーブデータに含まれます。
    
    Y座標タイプについて
    本来、選択肢はメッセージウィンドウの位置に応じてY座標が決まります。
    メッセージウィンドウの位置 上 中 下に対応する位置に固定する場合に、
    上 中 下を選んでください。`)
  .build();
