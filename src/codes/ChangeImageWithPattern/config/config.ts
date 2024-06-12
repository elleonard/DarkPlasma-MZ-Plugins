import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createNumberParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/06/13",
    version: "1.0.1",
    description: "導入前のセーブデータをロードするとエラーになる不具合の修正",
  },
  {
    date: "2024/06/07",
    version: "1.0.0",
    description: "公開",
  }
];

const targetSelectParam = createSelectParam("target", {
  text: "対象",
  description: "画像の変更をカスタマイズする対象を選びます。",
  options: [
    {
      name: "プレイヤー",
      value: -1
    },
    {
      name: "このイベント",
      value: 0,
    },
    {
      name: "他のイベント",
      value: 1,
    },
  ],
  default: 0,
});

const targetEventIdParam = createNumberParam("targetEventId", {
  text: "対象イベントID",
  description: "対象が他のイベントの場合のみ、対象となるイベントIDを設定します。",
  default: 0,
});

const commands: PluginCommandSchema[] = [
  createCommand("hackChangeImage", {
    text: "画像の変更カスタム",
    description: "対象の画像の変更コマンドをカスタマイズします。",
    args: [
      targetSelectParam,
      targetEventIdParam,
      createSelectParam("direction", {
        text: "向き",
        description: "画像の変更によって、キャラクターの向きを設定します。",
        options: [
          {
            name: "変更しない",
            value: 0,
          },
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
        default: 0,
      }),
      createSelectParam("pattern", {
        text: "パターン",
        description: "画像の変更によって、キャラクターのパターンを設定します。",
        options: [
          {
            name: "左",
            value: 0,
          },
          {
            name: "真ん中",
            value: 1,
          },
          {
            name: "右",
            value: 2,
          },
        ],
        default: 1,
      }),
      createBooleanParam("fixPattern", {
        text: "パターンを固定する",
        description: "画像の変更によってキャラクターのパターンを固定します。",
        default: true,
      }),
    ],
  }),
  createCommand("unfixPattern", {
    text: "パターン固定の解除",
    description: "パターン固定状態を解除します。",
    args: [
      targetSelectParam,
      targetEventIdParam,
    ],
  }),
];

export const config = new ConfigDefinitionBuilder(
  "ChangeImageWithPattern",
  2024,
  "画像の変更で向きやパターンを設定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands(commands)
  .withHelp(dedent`画像の変更で向きやパターンを設定できるようにします。`)
  .build();
