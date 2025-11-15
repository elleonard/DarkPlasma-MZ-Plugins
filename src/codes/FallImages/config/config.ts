import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createFileParam, createNumberParam, createStruct, createStructArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/11/15",
    version: "1.0.6",
    description: "configをTypeScript移行",
  },
  {
    date: "2024/02/08",
    version: "1.0.5",
    description: 'TypeScript移行',
  },
  {
    description: '画像が降っていない状態で画像を消すコマンドを実行するとエラーになる不具合を修正',
  },
  {
    date: "'2021/07/05'",
    version: "1.0.4",
    description: 'MZ 1.3.2に対応',
  },
  {
    date: "'2021/06/22'",
    version: "1.0.3",
    description: 'サブフォルダからの読み込みに対応',
  },
  {
    date: "'2020/12/16'",
    version: "1.0.2",
    description: 'ゲーム終了時に正しく状態を初期化しない不具合を修正',
  },
  {
    date: "'2020/10/25'",
    version: "1.0.1",
    description: 'ヘルプ追記',
  },
  {
    date: "'2020/10/24'",
    version: "1.0.0",
    description: '公開',
  },
];

const structFallImage = createStruct("FallImage", [
  createNumberParam("id", {
    text: "画像設定ID",
    description: "降らせる画像設定のIDです。降らせるプラグインコマンドで指定します。",
    default: 1,
  }),
  createFileParam("file", {
    text: "画像ファイル",
    description: "降らせるための画像ファイルを指定します。",
    dir: "img/",
  }),
  createNumberParam("rows", {
    text: "画像の行数",
    description: "降らせる画像の行数を指定します。",
    default: 5,
  }),
  createNumberParam("cols", {
    text: "画像の列数",
    description: "降らせる画像の列数を指定します。",
    default: 18,
  }),
  createNumberParam("count", {
    text: "表示数",
    description: "画面内に一度に表示する数を指定します。",
    default: 40,
  }),
  createNumberParam("waveringFrequency", {
    text: "揺れ頻度",
    description: "降る過程で揺れる頻度を指定します。最大10で、多いほど頻繁に揺れます。",
    min: 0,
    max: 10,
    default: 7,
  }),
  createNumberParam("minimumLifeTime", {
    text: "最短表示時間",
    description: "1枚を降らせ続ける最短の時間（フレーム単位）を指定します。",
    default: 150,
  }),
  createNumberParam("lifeTimeRange", {
    text: "表示時間の範囲",
    description: "1枚を降らせ続ける時間の範囲（フレーム単位）を指定します。最短表示時間とこの値の和が最長表示時間になります。",
    default: 500,
  }),
  createNumberParam("animationSpeed", {
    text: "アニメーション速度",
    description: "アニメーションする速さを指定します。小さいほど速くアニメーションします。",
    decimals: 0,
    default: 2,
  }),
  createNumberParam("moveSpeedX", {
    text: "横移動速度",
    description: "横方向の移動速度を指定します。大きいほど速く移動します。",
    decimals: 0,
    default: 4,
  }),
  createNumberParam("moveSpeedY", {
    text: "縦移動速度",
    description: "落下速度を指定します。大きいほど速く落下します。",
    decimals: 0,
    default: 6,
  }),
]);

const parameters: PluginParameterSchema[] = [
  createStructArrayParam("images", {
    struct: structFallImage,
    text: "画像設定",
    description: "降らせる画像の設定",
  }),
];

const commands: PluginCommandSchema[] = [
  createCommand("startFall", {
    text: "画像を降らせる",
    description: "画像を画面内に降らせます。",
    args: [
      createNumberParam("id", {
        text: "降らせる画像設定ID",
        description: "降らせる画像設定のIDです。",
      }),
    ],
  }),
  createCommand("stopFall", {
    text: "画像を消す",
    description: "降らせている画像を消し、止ませます。",
  }),
  createCommand("fadeOutFall", {
    text: "画像をフェードアウトする",
    description: "振らせている画像をフェードアウトさせ、止ませます。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "FallImages",
  2025,
  "画面内に画像を降らせる"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structFallImage)
  .withParameters(parameters)
  .withCommands(commands)
  .withHelp(dedent`何らかの画像を降らせる画面演出を提供します。

      プラグインパラメータにIDと画像ファイルを設定し、
      プラグインコマンドでそのIDを指定してください。

      本プラグインはセーブデータを拡張します。
      画像を降らせるための状態をセーブします。
`)
  .build();
