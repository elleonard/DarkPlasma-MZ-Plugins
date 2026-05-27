import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createNumberParam, createSelectParam, createStruct, createStructArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/27",
    version: "1.0.1",
    description: "configをTypeScript移行",
  },
  {
    date: "2023/05/23",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const structKeyMapping: PluginStruct = createStruct("KeyMapping", [
  createNumberParam("keyCode", {
    text: "キー番号",
    description: "キーまたはゲームパッドのボタンの番号を設定します。",
  }),
  createSelectParam("action", {
    text: "動作",
    description: "キーを押した際の動作を表す文字列を設定します。",
    options: [
      {
        name: "menu",
      },
      {
        name: "special2",
      },
    ],
    default: "menu",
  }),
]);

const parameters: PluginParameterSchema[] = [
  createStructArrayParam("keyMapper", {
    struct: structKeyMapping,
    text: "キーマッピング",
    description: "キーボード操作のマッピングを設定します。",
    default: [
      {
        keyCode: 77,
        action: "menu",
      },
      {
        keyCode: 83,
        action: "special2",
      },
    ],
  }),
  createStructArrayParam("gamepadMapper", {
    struct: structKeyMapping,
    text: "ゲームパッドマッピング",
    description: "ゲームパッド操作のマッピングを設定します。",
    default: [
      {
        keyCode: 6,
        action: "special2",
      },
    ],
  }),
  createNumberParam("colsWidth", {
    text: "項目幅",
    default: 124,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "GamepadSettingBase",
  2026,
  "ゲームパッド設定の基底"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structKeyMapping)
  .withParameters(parameters)
  .withOrderAfterDependency({
    name: "PluginCommonBase",
  })
  .withHelp(dedent`オプションにゲームパッド設定を提供します。

      テキスト中で \\GAMEPAD[操作名] と入力すると
      操作説明ボタン表記に変換されます。

      操作名一覧
      ok: 決定
      cancel: キャンセル
      menu: メニュー
      pageup: 左切替
      pagedown: 右切替
      shift: 特殊操作1
      special2: 特殊操作2

      入力例: \\GAMEPAD[special2]

      Window_Base.prototype.getManualButtonName メソッドにより
      操作ボタン表記を取得できます。

      ゲームパッド設定を更にカスタマイズする場合は、
      追加プラグインで以下のメソッドを上書きしてください。

      Input.inputSymbols(): InputSymbol
      Input.inputBehaviorKeys(): string[]
      Input.inputBehaviorKeyName(key: string): string`)
  .build();
