import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/11/02",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const commandFocusOn: PluginCommandSchema = createCommand("FocusOn", {
  text: "フォーカスする",
  description: "指定した座標と半径で、円形にフォーカスします。",
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
    createNumberParam("radius", {
      text: "半径",
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
    createNumberParam("radius", {
      text: "半径",
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
  "円形フォーカス効果"
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
  .withBaseDependency({
    name: "DarkPlasma_FillGradientCircle",
    version: "1.0.0",
  })
  .withHelp(dedent`円形フォーカス効果を実現します。
    
    画面上の特定の円形エリアのみフォーカスします。
    フォーカスの状態はセーブデータに含まれません。`)
  .build();
