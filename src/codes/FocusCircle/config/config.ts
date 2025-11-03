import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/11/03",
    version: "2.1.0",
    description: "専用メッセージウィンドウをシーン内変数に追加",
  },
  {
    date: "2025/11/02",
    version: "2.0.0",
    description: "フォーカス時に専用のメッセージウィンドウを前面に出す",
  },
  {
    description: "楕円系に変更",
  },
  {
    date: "2025/11/02",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const commandFocusOn: PluginCommandSchema = createCommand("FocusOn", {
  text: "フォーカスする",
  description: "指定した座標と半径で、楕円形にフォーカスします。",
  args: [
    createNumberParam("id", {
      text: "フォーカスID",
    }),
    createNumberParam("x", {
      text: "X座標",
    }),
    createNumberParam("y", {
      text: "Y座標",
    }),
    createNumberParam("radiusX", {
      text: "半径X",
    }),
    createNumberParam("radiusY", {
      text: "半径Y",
    }),
  ],
});

const commandFocusOff: PluginCommandSchema = createCommand("FocusOff", {
  text: "フォーカスを削除する",
  description: "指定したIDのフォーカスを削除します。",
  args: [
    createNumberParam("id", {
      text: "フォーカスID",
    })
  ],
});

const commandMoveFocus: PluginCommandSchema = createCommand("MoveFocus", {
  text: "フォーカスを移動する",
  description: "指定したIDのフォーカスを移動します。",
  args: [
    createNumberParam("id", {
      text: "フォーカスID",
    }),
    createNumberParam("x", {
      text: "移動先X座標",
    }),
    createNumberParam("y", {
      text: "移動先Y座標",
    }),
    createNumberParam("radiusX", {
      text: "半径X",
    }),
    createNumberParam("radiusY", {
      text: "半径Y",
    }),
  ],
});

const commandClearAllFocus: PluginCommandSchema = createCommand("ClearAllFocus", {
  text: "全てのフォーカスを削除する",
  description: "全てのフォーカスを削除します。",
});

const parameters: PluginParameterSchema[] = [
  createNumberParam("opacity", {
    text: "フォーカス不透明度",
    default: 200,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "FocusCircle",
  2025,
  "楕円形フォーカス効果"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands([
    commandFocusOn,
    commandFocusOff,
    commandMoveFocus,
    commandClearAllFocus,
  ])
  .withParameters(parameters)
  .withHelp(dedent`楕円形フォーカス効果を実現します。
    
    画面上の特定の楕円形エリアにフォーカスします。
    フォーカスの状態はセーブデータに含まれません。`)
  .build();
