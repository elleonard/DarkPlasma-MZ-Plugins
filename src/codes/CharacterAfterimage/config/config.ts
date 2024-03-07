import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createNumberParam, createSelectParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/03/07",
    version: "1.0.1",
    description: "特定のプラグインと併用するとエラーが発生する不具合を修正",
  },
  {
    date: "2024/03/01",
    version: "1.0.0",
    description: "公開",
  }
];

const structRGBAColor = createStruct(
  "ColorTone",
  [
    createNumberParam("red", {
      text: "赤",
      default: 0,
      max: 255,
      min: 0,
    }),
    createNumberParam("green", {
      text: "緑",
      default: 0,
      max: 255,
      min: 0,
    }),
    createNumberParam("blue", {
      text: "青",
      default: 0,
      max: 255,
      min: 0,
    }),
    createNumberParam("alpha", {
      text: "α",
      default: 0,
      max: 255,
      min: 0,
    }),
  ]
);

const parameters = [
  createNumberParam("duration", {
    text: "表示時間(フレーム数)",
    default: 30,
  }),
  createNumberParam("generationInterval", {
    text: "生成間隔(フレーム数)",
    default: 4,
  }),
  createNumberParam("opacity", {
    text: "不透明度",
    max: 255,
    default: 255,
  }),
  createStructParam("colorTone", {
    struct: structRGBAColor,
    text: "色調",
    default: {
      red: 0,
      blue: 0,
      green: 0,
      alpha: 0,
    },
  }),
  createSelectParam("blendMode", {
    text: "合成方法",
    options: [
      {
        name: "通常",
        value: 0,
      },
      {
        name: "加算",
        value: 1,
      },
      {
        name: "乗算",
        value: 2,
      },
      {
        name: "スクリーン",
        value: 3,
      },
    ],
    default: 0
  })
];

const commands = [
  createCommand("startAfterimage", {
    text: "残像の表示",
    description: "プレイヤーまたはイベントに対して残像を表示します。",
    args: [
      createSelectParam("target", {
        text: "対象",
        description: "残像の表示対象を選択します。",
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
  }),
  createCommand("clearAfterimage", {
    text: "残像の消去",
    description: "プレイヤーまたはイベントに対して表示している残像を消去します。",
    args: [
      createSelectParam("target", {
        text: "対象",
        description: "残像の表示対象を選択します。",
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
  }),
];

export const config = new ConfigDefinitionBuilder(
  "CharacterAfterimage",
  2024,
  "マップ上のキャラクターに残像を表示する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withCommands(commands)
  .withStructure(structRGBAColor)
  .withHelp(dedent`マップ上のキャラクターに残像を表示します。
  
  本プラグインはセーブデータを拡張します。
  マップ上の残像を表示している各キャラクターについて、
  その表示状態をセーブデータに追加します。`)
  .build();
