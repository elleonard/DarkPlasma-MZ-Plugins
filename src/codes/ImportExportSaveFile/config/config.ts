import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { createStringParam, createStruct, createNumberParam, createFileParam, createStructParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories = [
  {
    date: "2024/01/15",
    version: "1.2.1",
    description: "ビルド方式を変更 (configをTypeScript化)",
  },
  {
    date: "2022/12/24",
    version: "1.2.0",
    description: "ゲームアツマール上からスマホでエクスポートできるように修正",
  },
  {
    date: "2022/12/23",
    version: "1.1.0",
    description: "インポート時の説明文をplaceholderに変更",
  },
  {
    date: "2022/12/22",
    version: "1.0.0",
    description: "リファクタ",
  },
  {
    version: "0.0.1",
    description: "公開",
  }
];

const structRectangle = createStruct(
  "Rectangle",
  [
    createNumberParam(
      "x",
      {
        text: "X座標",
      }
    ),
    createNumberParam(
      "y",
      {
        text: "Y座標",
      }
    ),
    createNumberParam(
      "width",
      {
        text: "横幅",
      }
    ),
    createNumberParam(
      "height",
      {
        text: "高さ",
      }
    )
  ]
);

const structPoint = createStruct(
  "Point",
  [
    createNumberParam(
      "x",
      {
        text: "X座標"
      }
    ),
    createNumberParam(
      "y",
      {
        text: "Y座標",
      }
    ),
  ]
);

const structButtonImage = createStruct(
  "ButtonImage",
  [
    createFileParam(
      "ok",
      {
        text: "OKボタン",
        dir: "img/system",
        default: "buttonOk",
      }
    ),
    createFileParam(
      "cancel",
      {
        text: "キャンセルボタン",
        dir: "img/system",
        default: "buttonCancel",
      }
    ),
    createFileParam(
      "import",
      {
        text: "インポートボタン",
        dir: "img/system",
        default: "buttonImport",
      }
    ),
    createFileParam(
      "export",
      {
        text: "エクスポートボタン",
        dir: "img/system",
        default: "buttonExport",
      }
    ),
  ]
);

const parameters = [
  createStructParam(
    "textAreaRect",
    {
      struct: structRectangle,
      text: "セーブデータ表示エリア",
      description: "PC版向けのセーブデータ表示エリアを設定します。",
      default: {
        x: 208,
        y: 100,
        width: 400,
        height: 400,
      },
    }
  ),
  createStructParam(
    "okButtonPos",
    {
      struct: structPoint,
      text: "OKボタン座標",
      default: {
        x: 308,
        y: 520,
      },
    }
  ),
  createStructParam(
    "cancelButtonPos",
    {
      struct: structPoint,
      text: "キャンセルボタン座標",
      default: {
        x: 508,
        y: 520,
      },
    }
  ),
  createSelectParam(
    "menuButtonType",
    {
      text: "イン/エクスポートボタン位置",
      options: [
        {
          name: "選択中のセーブファイル上",
          value: 1,
        },
        {
          name: "指定した座標",
          value: 2,
        },
      ],
      default: 1,
    }
  ),
  createStructParam(
    "importButtonPos",
    {
      struct: structPoint,
      text: "インポートボタン座標",
      description: "イン/エクスポートボタン位置設定が指定した座標である場合に有効です。",
      default: {
        x: 680,
        y: 16,
      },
    }
  ),
  createStructParam(
    "exportButtonPos",
    {
      struct: structPoint,
      text: "エクスポートボタン座標",
      description: "イン/エクスポートボタン位置設定が指定した座標である場合に有効です。",
      default: {
        x: 750,
        y: 16,
      },
    }
  ),
  createStringParam(
    "exportHelpText",
    {
      text: "エクスポート説明文",
      default: "表示されているテキストを保存してください。",
    }
  ),
  createStringParam(
    "importHelpText",
    {
      text: "インポート説明文",
      default: "セーブデータのテキストを貼り付けてください。",
    }
  ),
  createStructParam(
    "buttonImages",
    {
      struct: structButtonImage,
      text: "ボタン画像",
      default: {
        ok: "buttonOk",
        cancel: "buttonCancel",
        import: "buttonImport",
        export: "buttonExport",
      },
    }
  ),
];

export const config = new ConfigDefinitionBuilder(
  "ImportExportSaveFile",
  2022,
  "セーブデータのインポート・エクスポート機能"
)
  .withHistories(histories)
  .withParameters(parameters)
  .withStructure(structRectangle)
  .withStructure(structPoint)
  .withStructure(structButtonImage)
  .withHelp(dedent`本プラグインはkienさんの「セーブデータのインポート・エクスポート」を
  MZ移植したものです。

  このプラグインが動作するには以下の画像ファイルが
  img/system内に存在する必要があります：

  'buttonOk' :
  インポート・エクスポート画面においてユーザーの
  アクションを決定するボタンとして表示されます。
  'buttonCancel' : インポート画面において
  インポートを行わずにセーブ・ロード画面に戻るボタンとして表示されます。
  'buttonImport' : セーブ・ロード画面において
  インポート画面に移行するためのボタンとして表示されます。
  'buttonExport' : セーブ・ロード画面において
  エクスポート画面に移行するためのボタンとして表示されます。

  画像はデフォルト素材の'ButtonSet'と同様、
  上半分にデフォルト状態、
  下半分に押された状態の画像として作成してください。`)
  .build();
