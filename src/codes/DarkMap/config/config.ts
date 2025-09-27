import { PluginCommandSchema, PluginConfigSchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createDatabaseParam, createNumberParam, createSelectParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const structRGBColor = createStruct(
  "Color",
  [
    createNumberParam("red", {
      text: "赤",
      default: 255,
      max: 255,
      min: 0,
    }),
    createNumberParam("green", {
      text: "緑",
      default: 255,
      max: 255,
      min: 0,
    }),
    createNumberParam("blue", {
      text: "青",
      default: 255,
      max: 255,
      min: 0,
    }),
  ]
);

const commandTurnOnLight: PluginCommandSchema = createCommand("turnOnLight", {
  text: "明かりを点ける",
  description: "指定した対象の明かりを点けます。",
  args: [
    createSelectParam("target", {
      text: "対象",
      description: "明かりを点ける対象を選択します。",
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
    createStructParam('lightColor', {
      struct: structRGBColor,
      text: '明かりの色',
      default: {
        red: 255,
        green: 255,
        blue: 255,
      },
    }),
    createNumberParam('lightRadius', {
      text: "明かりの広さ",
      description: "明かりの広さを設定します。",
      default: 200,
    }),
  ],
});

const commandTurnOffLight: PluginCommandSchema = createCommand("turnOffLight", {
  text: "明かりを消す",
  description: "指定した対象の明かりを消します。",
  args: [
    createSelectParam("target", {
      text: "対象",
      description: "明かりを消す対象を選択します。",
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
});

const commandResetLightInMap: PluginCommandSchema = createCommand("resetLightInMap", {
  text: "マップ内の明かりをリセットする",
  description: "マップ内の明かりを初期状態に戻します。",
});

const commandResetAllLight: PluginCommandSchema = createCommand("resetAllLight", {
  text: "全ての明かりをリセットする",
  description: "マップ内外の全ての明かりをリセットします。",
});

export const config: PluginConfigSchema = {
  name: "DarkPlasma_DarkMap",
  year: 2021,
  license: "MIT",
  histories: [
    {
      date: "2025/09/27",
      version: "3.1.1",
      description: "明かりを点けるプラグインコマンドで広さと色が適用されない不具合を修正",
    },
    {
      date: "2025/08/16",
      version: "3.1.0",
      description: "マップ内、マップ内外全ての明かりをリセットするプラグインコマンドの追加",
    },
    {
      date: "2025/08/15",
      version: "3.0.0",
      description: "明かりを点ける, 消すプラグインコマンドの追加",
    },
    {
      description: "明かり判定インターフェースに破壊的変更",
    },
    {
      date: "2024/02/23",
      version: "2.2.0",
      description: "プレイヤー、イベント以外にも対応できるようにインターフェースを追加",
    },
    {
      date: "2024/01/23",
      version: '2.1.0',
      description: 'プレイヤーの明かりの広さを設定可能に',
    },
    {
      date: "2024/01/21",
      version: "2.0.0",
      description: "暗闇の色をRGBすべてについて設定可能に",
    },
    {
      description: "デフォルトの明かりの広さを変数で設定可能に",
    },
    {
      date: "2024/01/15",
      version: "1.0.3",
      description: "ビルド方式を変更 (configをTypeScript化)",
    },
    {
      date: "2022/08/19",
      version: "1.0.2",
      description: "typescript移行",
    },
    {
      date: "2022/03/31",
      version: "1.0.1",
      description: "TemplateEvent.jsと併用すると戦闘テストできない不具合を修正"
    },
    {
      date: "2021/11/19",
      version: "1.0.0",
      description: "公開"
    },
  ],
  locates: ['ja'],
  plugindesc: "暗いマップと明かり",
  parameters: [
    createStructParam('darknessColor', {
      struct: structRGBColor,
      text: "暗闇の色",
      default: {
        red: 0,
        green: 0,
        blue: 0,
      },
    }),
    createStructParam('lightColor', {
      struct: structRGBColor,
      text: '明かりの色',
      default: {
        red: 255,
        green: 255,
        blue: 255,
      },
    }),
    createNumberParam('lightRadius', {
      text: "明かりの広さ",
      description: "デフォルトの明かりの広さを設定します。",
      default: 200,
    }),
    createDatabaseParam('lightRadiusVariable', {
      type: "variable",
      text: "明かりの広さ(変数)",
      description: "デフォルトの明かりの広さを変数で設定します。",
      default: 0,
    }),
    createNumberParam('lightRadiusPlayer', {
      text: "明かりの広さ(プレイヤー)",
      description: 'プレイヤーの明かりの広さを設定します。負の値を設定するとデフォルトの広さを使用します。',
      default: -1,
      min: -1,
    }),
  ],
  commands: [
    commandTurnOnLight,
    commandTurnOffLight,
    commandResetLightInMap,
    commandResetAllLight,
  ],
  structures: [
    structRGBColor,
  ],
  dependencies: {
    base: [],
    orderAfter: [],
    orderBefore: [],
  },
  help: dedent`暗いマップと、プレイヤーやイベントの周囲を照らす明かりを提供します。

  マップのメモ欄:
  <dark> 暗いマップにします。

  イベントのメモ欄:
  <light> デフォルトでイベントの周囲を照らします。
  <lightColor:#ffbb73> 明かりの色を設定します。
  <lightRadius:155> 明かりの範囲を設定します。
  <saveLight> このイベントの明かりの状態を別マップに移動した後も保存します。

  本プラグインはセーブデータを拡張します。
  マップ上のキャラクターについて、下記のデータを追加します。
  - 明かりが点いているかどうか
  - 明かりの色
  - 明かりの広さ
`,
};
