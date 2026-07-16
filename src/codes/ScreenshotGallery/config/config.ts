import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createFileParam, createNumberParam, createSelectParam, createStringArrayParam, createStringParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/07/16",
    version: "2.0.2",
    description: "スクリーンショット一覧が最新順に表示されない不具合を修正",
  },
  {
    date: "2026/07/16",
    version: "2.0.1",
    description: "configをTypeScript移行",
  },
  {
    date: "2024/12/21",
    version: "2.0.0",
    description: "スクリーンショットの設定変更プラグインコマンドを別プラグインに分離",
  },
  {
    date: "2024/12/21",
    version: "1.2.0",
    description: "スクリーンショットの設定を変更するプラグインコマンドを追加",
  },
  {
    date: "2023/10/20",
    version: "1.1.1",
    description: "ロード時のディレクトリパスを統一",
  },
  {
    description: "何も選択していない状態で決定キーを押すと操作不能になる不具合を修正",
  },
  {
    date: "2023/10/13",
    version: "1.1.0",
    description: "撮影時にフラッシュ・プレビューする機能を追加",
  },
  {
    description: "表示最大数設定を追加",
  },
  {
    description: "一覧での表示サイズを調整",
  },
  {
    date: "2023/03/12",
    version: "1.0.0",
    description: "公開",
  },
];

const structSe = createStruct('Se', [
  createFileParam('name', {
    text: 'SEファイル',
    dir: 'audio/se',
  }),
  createNumberParam('volume', {
    text: '音量',
    default: 90,
    max: 100,
    min: 0,
  }),
  createNumberParam('pitch', {
    text: 'ピッチ',
    default: 100,
    max: 150,
    min: 50,
  }),
  createNumberParam('pan', {
    text: '位相',
    default: 0,
    max: 100,
    min: -100,
  }),
]);

const structFlash = createStruct('Flash', [
  createNumberParam('red', {
    text: '赤',
    default: 255,
    max: 255,
    min: 0,
  }),
  createNumberParam('green', {
    text: '緑',
    default: 255,
    max: 255,
    min: 0,
  }),
  createNumberParam('blue', {
    text: '青',
    default: 255,
    max: 255,
    min: 0,
  }),
  createNumberParam('power', {
    text: '強さ',
    default: 170,
    max: 255,
    min: 0,
  }),
  createNumberParam('duration', {
    text: '時間(フレーム)',
    default: 30,
    min: 1,
  }),
]);

const structRectangle = createStruct('Rectangle', [
  createNumberParam('x', {
    text: 'X座標',
    default: 16,
  }),
  createNumberParam('y', {
    text: 'Y座標',
    default: 16,
  }),
  createNumberParam('width', {
    text: '幅',
    default: 102,
  }),
  createNumberParam('height', {
    text: '高さ',
    default: 78,
  }),
]);

const structPreview = createStruct('Preview', [
  createBooleanParam('show', {
    text: 'プレビューを表示する',
    default: true,
  }),
  createNumberParam('frameWidth', {
    text: 'フレーム幅',
    default: 4,
  }),
  createNumberParam('duration', {
    text: '表示時間(フレーム)',
    default: 60,
  }),
  createStructParam('rect', {
    struct: structRectangle,
    text: '位置とサイズ',
    default: {
      x: 16,
      y: 16,
      width: 102,
      height: 78,
    },
  }),
]);

const parameters = [
  createSelectParam('key', {
    text: '撮影キー',
    options: [
      { name: 'control' },
      { name: 'tab' },
    ],
    default: 'control',
  }),
  createSelectParam('tweetKey', {
    text: 'ツイートキー',
    description: 'ギャラリーからツイートするキー。DarkPlasma_TweetScreenshotが必要です。機能を利用しない場合は空欄',
    options: [
      { name: 'pageup' },
      { name: 'pagedown' },
      { name: 'shift' },
      { name: 'control' },
      { name: 'tab' },
      { name: '' },
    ],
    default: 'shift',
  }),
  createStringArrayParam('scenes', {
    text: '撮影可能シーン',
    default: ['Scene_Base'],
  }),
  createSelectParam('format', {
    text: 'フォーマット',
    options: [
      { name: 'png' },
      { name: 'jpg' },
    ],
    default: 'png',
  }),
  createStructParam('se', {
    struct: structSe,
    text: '効果音',
    default: {
      name: 'Switch2',
      volume: 90,
      pitch: 100,
      pan: 0,
    },
  }),
  createStructParam('flash', {
    struct: structFlash,
    text: 'フラッシュ',
    default: {
      red: 255,
      green: 255,
      blue: 255,
      power: 170,
      duration: 30,
    },
  }),
  createStringParam('directory', {
    text: '保存先フォルダ名',
    default: 'screenshot',
  }),
  createNumberParam('maxView', {
    text: '表示最大数',
    description: 'スクショギャラリーでの表示最大数',
    default: 30,
  }),
  createStructParam('preview', {
    struct: structPreview,
    text: 'プレビュー設定',
    default: {
      show: true,
      frameWidth: 4,
      duration: 60,
      rect: {
        x: 16,
        y: 16,
        width: 102,
        height: 78,
      },
    },
  }),
];

const commands = [
  createCommand('sceneScreenshot', {
    text: 'スクショギャラリーを開く',
  }),
];

export const config = new ConfigDefinitionBuilder(
  "ScreenshotGallery",
  2023,
  "スクリーンショットギャラリー"
)
  .withHistories(histories)
  .withStructure(structSe)
  .withStructure(structFlash)
  .withStructure(structRectangle)
  .withStructure(structPreview)
  .withParameters(parameters)
  .withCommands(commands)
  .withHelp(dedent`スクリーンショットの撮影、保存を可能とし
  保存したスクリーンショットをゲーム内で閲覧するシーンを提供します。

  DarkPlasma_TweetScreenshotと一緒に利用することで
  ギャラリーでスクリーンショットを閲覧している際にその画像をツイートできます。

  ブラウザプレイには対応していません。

  シーンクラス名を指定してギャラリーシーンを開く場合、
  Scene_ScreenshotGallery
  と指定してください。`)
  .build();
