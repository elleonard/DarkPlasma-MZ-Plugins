import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createDatabaseParam, createFileParam, createNumberParam, createSelectArrayParam, createStringArrayParam, createStringParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/06/16",
    version: "2.3.1",
    description: "configをTypeScript移行",
  },
  {
    date: "2025/07/08",
    version: "2.3.0",
    description: "スクリプトを用いてマップからログシーンを開く手段を追加",
  },
  {
    date: "2024/03/14",
    version: "2.2.0",
    description: "パラメータを消去する制御文字の設定を、無視する制御文字の設定に変更",
  },
  {
    date: "2023/12/23",
    version: "2.1.1",
    description: "ゲーム開始直後にテキストを持たないイベントを実行すると自動区切り線が挿入される不具合を修正",
  },
  {
    version: "2.1.0",
    description: "自動区切り線の挿入を区切り線の直後に行わないように変更",
  },
  {
    date: "2023/10/08",
    version: "2.0.0",
    description: "保持ログメッセージに関するプログラム上のインターフェース変更 (Breaking Change)",
  },
  {
    description: "保持ログメッセージ件数設定を追加",
  },
  {
    date: "2023/10/06",
    version: "1.3.0",
    description: "ウィンドウ退避のインターフェースを公開",
  },
  {
    date: "2023/09/21",
    version: "1.2.1",
    description: "リファクタ",
  },
  {
    date: "2023/07/22",
    version: "1.2.0",
    description: "タッチUIが有効な場合にキャンセルボタンを表示",
  },
  {
    version: "1.1.2",
    description: "名前の制御文字をログ記録時点で展開するように修正",
  },
  {
    date: "2023/01/30",
    version: "1.1.1",
    description: "決定キーでログウィンドウが閉じない不具合を修正",
  },
  {
    date: "2022/11/03",
    version: "1.1.0",
    description: "開閉キーのpageup/pagedownを非推奨化",
  },
  {
    description: "開閉キーでログウィンドウを閉じられない不具合を修正",
  },
  {
    description: "決定キーでもログウィンドウを閉じられるように変更",
  },
  {
    date: "2022/11/02",
    version: "1.0.0",
    description: "公開",
  },
];

const parameters: PluginParameterSchema[] = [
  createDatabaseParam("disableLoggingSwitch", {
    type: "switch",
    text: "ログ記録無効スイッチ",
    description: "設定したスイッチがONの間はログを残しません。0の場合、常にログを残します。",
    default: 0,
  }),
  createSelectArrayParam("openLogKeys", {
    text: "ログ開閉ボタン",
    description: "テキストログウィンドウを開閉するためのボタンを設定します。",
    options: [
      { name: "shift" },
      { name: "control" },
      { name: "tab" },
      { name: "pageup (非推奨)", value: "pageup" },
      { name: "pagedown (非推奨)", value: "pagedown" },
    ],
    default: ["tab"],
  }),
  createDatabaseParam("disableLogWindowSwitch", {
    type: "switch",
    text: "ログウィンドウ無効スイッチ",
    description: "設定したスイッチがONの間はログウィンドウを開けません。0の場合、常に開けます。",
    default: 0,
  }),
  createNumberParam("lineSpacing", {
    text: "ログの行間",
    description: "ログの行間を設定します。",
    default: 0,
  }),
  createNumberParam("messageSpacing", {
    text: "メッセージ間隔",
    description: "ログのメッセージの間隔を設定します。メッセージはイベントコマンド単位でひとかたまりです。",
    default: 0,
  }),
  createStringParam("logSplitter", {
    text: "ログ区切り線",
    description: "イベントの切れ目などに挟むための区切り線を設定します。",
    default: "-------------------------------------------------------",
  }),
  createBooleanParam("autoSplit", {
    text: "自動区切り線",
    description: "ONの場合、バトル、コモン、並列イベントを除くイベント終了時に区切り線を自動で入れます。",
    default: true,
  }),
  createStringParam("choiceFormat", {
    text: "選択肢フォーマット",
    description: "ログに表示する選択肢のフォーマットを設定します。{choice}は選んだ選択肢に変換されます。",
    default: "選択肢:{choice}",
  }),
  createNumberParam("choiceColor", {
    text: "選択肢色",
    description: "ログに表示する選択肢の色を設定します。",
    default: 17,
  }),
  createStringParam("choiceCancelText", {
    text: "キャンセルログ",
    description: "選択肢をキャンセルした際に記録する内容を設定します。",
    default: "キャンセル",
  }),
  createBooleanParam("smoothBackFromLog", {
    text: "テキスト再表示なし",
    description: "ONの場合、ログシーンから戻った際にテキストを再度表示し直しません。",
    default: true,
  }),
  createFileParam("backgroundImage", {
    text: "背景画像",
    description: "ログシーンに表示する背景画像を設定します。",
    dir: "img",
  }),
  createBooleanParam("showLogWindowFrame", {
    text: "ウィンドウ枠表示",
    description: "ONの場合、ログウィンドウ枠を表示します。",
    default: true,
  }),
  createStringArrayParam("escapeCharacterCodes", {
    text: "無視する制御文字",
    description: "逐次処理される制御文字\\XXXをログウィンドウにおいて無視したい場合、ここにXXXを追加します。",
    default: [],
  }),
  createNumberParam("scrollSpeed", {
    text: "スクロール速さ",
    description: "上下キーによるスクロールの速さを設定します。大きいほど速くなります。",
    default: 1,
    min: 1,
  }),
  createNumberParam("scrollSpeedHigh", {
    text: "高速スクロール速さ",
    description: "PageUp/PageDownキーによるスクロールの速さを設定します。",
    default: 10,
    min: 1,
  }),
  createNumberParam("maxLogMessages", {
    text: "ログメッセージ保持数",
    description: "ログメッセージを保持する件数を設定します。増やしすぎるとゲームの挙動に影響し得ることに注意してください。",
    default: 200,
  }),
];

const commands = [
  createCommand("showTextLog", {
    text: "ログウィンドウを開く",
  }),
  createCommand("insertLogSplitter", {
    text: "ログに区切り線を追加する",
  }),
  createCommand("insertTextLog", {
    text: "ログに指定したテキストを追加する",
    args: [
      createStringParam("text", {
        text: "テキスト",
      }),
    ],
  }),
];

export const config = new ConfigDefinitionBuilder(
  "TextLog",
  2022,
  "イベントテキストのログを保持・表示する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withCommands(commands)
  .withHelp(dedent`イベントで表示されたテキストをログとして保持、表示します。
  ログはセーブデータには保持されません。

  マップ上、イベント中にログ開閉キーを押すことでログウィンドウを開きます。
  ログ開閉キー、決定キー、キャンセルキーのいずれかでログウィンドウを閉じます。

  無視する制御文字設定について
  メッセージ表示時に逐次処理される制御文字のみ無視することができます。
  \\V \\Sなど、メッセージ表示処理開始時に
  変換処理が施される制御文字を無視することはできません。

  以下のスクリプトにより、マップからログを開くことができます。
  $gameTemp.requestCallTextLogOnMap();`)
  .build();
