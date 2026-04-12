import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createNumberParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/04/13",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const parameterPictureId: PluginParameterSchema = createNumberParam("pictureId", {
  text: "ピクチャID",
});

const parameterDuration: PluginParameterSchema = createNumberParam("duration", {
  text: "フレーム数",
  min: 1,
});

const parameterWait: PluginParameterSchema = createBooleanParam("wait", {
  text: "完了までウェイト",
  default: false,
});

const commands: PluginCommandSchema[] = [
  createCommand("slide", {
    text: "スライド",
    description: "ピクチャをスライド移動します。",
    args: [
      parameterPictureId,
      createSelectParam("direction", {
        text: "方向",
        description: "スライド移動する方向を指定します。",
        options: [
          {
            name: "下",
            value: 2,
          },
          {
            name: "左",
            value: 4,
          },
          {
            name: "右",
            value: 6,
          },
          {
            name: "上",
            value: 8,
          },
        ],
        default: 2,
      }),
      createNumberParam("distance", {
        text: "距離",
        description: "スライド移動する距離を指定します。",
      }),
      createSelectParam("easingType", {
        text: "イージングタイプ",
        description: "スライド移動のイージングタイプを設定します。",
        options: [
          {
            name: "一定速度",
            value: 0,
          },
          {
            name: "ゆっくり始まる",
            value: 1,
          },
          {
            name: "ゆっくり終わる",
            value: 2,
          },
          {
            name: "ゆっくり始まってゆっくり終わる",
            value: 3,
          },
        ],
        default: 0,
      }),
      parameterDuration,
      parameterWait,
    ],
  }),
  createCommand("shake", {
    text: "震える",
    description: "ピクチャが震えます。",
    args: [
      parameterPictureId,
      createNumberParam("power", {
        text: "強さ",
        min: 1,
        default: 1,
      }),
      createNumberParam("speed", {
        text: "速さ",
        min: 1,
        default: 1,
      }),
      parameterDuration,
      parameterWait,
    ],
  }),
  createCommand("hopping", {
    text: "跳ねる",
    description: "ピクチャが跳ねます。",
    args: [
      parameterPictureId,
      createNumberParam("count", {
        text: "回数",
        min: 1,
        default: 3,
      }),
      createNumberParam("height", {
        text: "高さ",
        min: 1,
        default: 200,
      }),
      createNumberParam("speed", {
        text: "速さ",
        min: 1,
        default: 10,
      }),
      createNumberParam("damping", {
        text: "高さ減衰率",
        decimals: 1,
        max: 1,
      }),
      parameterWait,
    ],
  }),
  createCommand("flicker", {
    text: "点滅する",
    description: "ピクチャが点滅します。",
    args: [
      parameterPictureId,
      createNumberParam("count", {
        text: "回数",
        min: 1,
        default: 3,
      }),
      createNumberParam("interval", {
        text: "インターバル",
        min: 1,
        default: 10,
      }),
      parameterWait,
    ],
  }),
];

export const config = new ConfigDefinitionBuilder(
  "PictureMotion",
  2026,
  "ピクチャの複雑な移動"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands(commands)
  .withHelp(dedent`ピクチャの複雑な移動を実現します。`)
  .build();
