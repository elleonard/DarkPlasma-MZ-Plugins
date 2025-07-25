import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createFileParam, createNumberParam, createSelectParam, createStruct, createStructArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/07/26",
    version: "1.1.3",
    description: "合成する画像の表示位置・拡大率の更新処理を通常のピクチャと分離",
  },
  {
    date: "2025/02/02",
    version: "1.1.2",
    description: "ベース画像ロード完了時に合成する画像が1フレーム遅れて表示されることがある不具合を修正",
  },
  {
    date: "2025/02/02",
    version: "1.1.1",
    description: "合成する画像のオフセット設定が想定と異なる不具合を修正",
  },
  {
    date: "2024/04/13",
    version: "1.1.0",
    description: '画像ファイル名に制御文字を使用可能にする',
  },
  {
    date: "2024/04/13",
    version: "1.0.0",
    description: "公開",
  }
];

const structAdditionalImage = createStruct(
  'AdditionalImage', [
    createFileParam('name', {
      text: '画像ファイル',
      dir: 'img',
    }),
    createNumberParam('offsetX', {
      text: 'X座標オフセット',
    }),
    createNumberParam('offsetY', {
      text: 'Y座標オフセット',
    }),
    createNumberParam('scaleX', {
      text: '拡大率 幅(％)',
      default: 100,
    }),
    createNumberParam('scaleY', {
      text: '拡大率 高さ(％)',
      default: 100,
    }),
    createNumberParam('opacity', {
      text: '不透明度',
      default: 255,
      min: 0,
      max: 255,
    }),
    createSelectParam('blendMode', {
      text: '合成方法',
      options: [
        {
          name: '通常',
          value: 0,
        },
        {
          name: '加算',
          value: 1,
        },
        {
          name: '乗算',
          value: 2,
        },
        {
          name: 'スクリーン',
          value: 3,
        },
      ],
      default: 0,
    }),
  ]
);

const commandComposePicture = createCommand(
  'composePicture', {
    text: '画像を合成する',
    args: [
      createNumberParam('basePictureId', {
        text: 'ベースピクチャID',
        description: '指定したピクチャをベース画像として扱います。',
        min: 1,
        max: 100,
      }),
      createStructArrayParam('additionalImages', {
        struct: structAdditionalImage,
        text: '合成する画像',
      })
    ],
  }
);

const parameters = [
  createNumberParam('startIdOfAdditionalPicture', {
    text: '合成する画像のピクチャID始点',
    description: '合成する画像に割り当てるピクチャIDの始点を設定します。',
    default: 10001,
    min: 201,
  })
];

export const config = new ConfigDefinitionBuilder(
  "ComposePicture",
  2024,
  "画像を合成して1枚のピクチャとして扱う"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withCommand(commandComposePicture)
  .withStructure(structAdditionalImage)
  .withHelp(dedent`画像を合成して1枚のピクチャとして扱うプラグインコマンドを提供します。

  本プラグインはセーブデータにピクチャの合成情報を追加します。`)
  .build();
