import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createStringParam, createCommand, createMultilineStringParam, createStruct, createNumberParam, createDatabaseParam, createFileParam, createStructArrayParam, createBooleanParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/07/12",
    version: "3.1.2",
    description: "報酬リスト表示を最初から必要メダル数昇順でソートしておくように修正",
  },
  {
    description: "報酬リストウィンドウの初期選択位置を指定"
  },
  {
    date: "2025/07/11",
    version: "3.1.1",
    description: "設定値をtypescript移行",
  },
  {
    description: "報酬メッセージが初期設定のままだと正常に動作しない不具合を修正",
  },
  {
    date: "2023/05/15",
    version: "3.1.0",
    description: "typescript移行"
  },
  {
    description: "報酬メッセージに交換に必要な枚数を含める機能追加",
  },
  {
    date: "2022/05/14",
    version: "3.0.0",
    description: "報酬獲得済みフラグのキーを変更（2.x以前とセーブデータ互換性がありません）",
  },
  {
    date: "2021/07/05",
    version: "2.2.2",
    description: "MZ 1.3.2に対応",
  },
  {
    date: "2021/06/22",
    version: "2.2.1",
    description: "サブフォルダからの読み込みに対応",
  },
  {
    date: "2021/02/13",
    version: "2.2.0",
    description: "報酬メッセージ複数行対応",
  },
  {
    date: "2020/10/10",
    version: "2.1.2",
    description: "リファクタ",
  },
  {
    date: "2020/09/29",
    version: "2.1.1",
    description: "プラグインコマンドに説明を追加",
  },
  {
    date: "2020/09/18",
    version: "2.1.0",
    description: "入手順を必要メダルの少ない順に変更",
  },
  {
    date: "2020/09/10",
    version: "2.0.0",
    description: "パラメータ名を変更",
  },
  {
    description: "ウェイトなし歩行が遅れる不具合を修正"
  },
  {
    date: "2020/08/25",
    version: "1.0.0",
    description: "MZ版公開",
  }
];

const structRewardItems: PluginStruct = createStruct("RewardItems", [
  createNumberParam("medalCount", {
    text: "必要メダル数",
    default: 1,
  }),
  createDatabaseParam("id", {
    type: 'item',
    text: "報酬アイテム",
  }),
]);

const structRewardWeapons: PluginStruct = createStruct("RewardWeapons", [
  createNumberParam("medalCount", {
    text: "必要メダル数",
    default: 1,
  }),
  createDatabaseParam("id", {
    type: 'weapon',
    text: "報酬武器",
  }),
]);

const structRewardArmors: PluginStruct = createStruct("RewardArmors", [
  createNumberParam("medalCount", {
    text: "必要メダル数",
    default: 1,
  }),
  createDatabaseParam("id", {
    type: 'armor',
    text: "報酬防具",
  }),
]);

const structRewardMessage: PluginStruct = createStruct("RewardMessage", [
  createMultilineStringParam("message", {
    text: "報酬メッセージ",
    description: "報酬をもらった際のメッセージ。特殊な書式はヘルプ参照",
    default: dedent`メダルを\${medalCount}個集めた。
              「\${itemName}」を手に入れた！`,
  }),
  createFileParam("faceFile", {
    text: "顔グラファイル",
    dir: "img/faces",
  }),
  createNumberParam("faceIndex", {
    text: "顔グラ番号",
    min: 0,
    max: 7,
  }),
]);

const parameters: PluginParameterSchema[] = [
  createDatabaseParam("medalItem", {
    type: 'item',
    text: "メダルアイテム",
    default: 1,
  }),
  createDatabaseParam("medalCountVariable", {
    type: 'variable',
    text: "メダル預かり数変数",
    description: "メダルの預かり数を記録する変数",
    default: 1,
  }),
  createStringParam("medalUnit", {
    text: "メダルの単位",
    default: "枚",
  }),
  createStructArrayParam("rewardItems", {
    struct: structRewardItems,
    text: "報酬アイテム",
    default: [],
  }),
  createStructArrayParam("rewardWeapons", {
    struct: structRewardWeapons,
    text: "報酬武器",
    default: [],
  }),
  createStructArrayParam("rewardArmors", {
    struct: structRewardArmors,
    text: "報酬防具",
    default: [],
  }),
  createStructArrayParam("rewardMessages", {
    struct: structRewardMessage,
    text: "報酬メッセージ",
    default: [
      {
        message: dedent`メダルを\${medalCount}個集めた。
            「\${itemName}」を手に入れた！`,
        faceFile: "",
        faceIndex: 0,
      },
    ],
  }),
  createBooleanParam("migrateV2ToV3", {
    text: "2.xからのセーブデータ変換",
    description: "2.xからバージョンアップする際のセーブデータ変換をするかどうか。詳細はヘルプ",
    default: true,
  }),
];

const commands: PluginCommandSchema[] = [
  createCommand("gotoSceneMedal", {
    text: "ちいさなメダルシーンを開く",
    description: "小さなメダルメニューが開き、報酬アイテム一覧が確認できます。",
  }),
  createCommand("processTinyMedal", {
    text: "ちいさなメダルを渡す",
    description: "ちいさなメダルシーンに移行せずにメダルを渡す処理だけします。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "TinyMedal",
  2020,
  "ちいさなメダルシステム"
)
  .withHistories(histories)
  .withParameters(parameters)
  .withCommands(commands)
  .withStructure(structRewardItems)
  .withStructure(structRewardWeapons)
  .withStructure(structRewardArmors)
  .withStructure(structRewardMessage)
  .withHelp(dedent`DQシリーズのちいさなメダルシステム（累計式）を実現します。

      同じメダル数で同じアイテム・武器・防具の報酬を
      設定した場合の動作は保証しません。
      デフォルトにおける獲得済みフラグのキーは
      メダル数とアイテム・武器・防具の種別とIDです。
      例: アイテムID:1のアイテムをメダル10枚で獲得した場合のキー
      10_1_1

      これをカスタマイズしたい場合、
      以下を上書きするプラグインを追加してください。
      Data_TinyMedal_RewardItem.prototype.rewardKey: () => string

      ゲームのリリース後にキーとなる値を変更してしまうと、
      セーブデータ互換性を破壊することに注意してください。

      報酬メッセージの特殊な書式
      \${itemName}: 報酬アイテム名
      \${medalCount}: その報酬獲得に必要なメダル数

      報酬メッセージの例:
      よし！ それでは メダルを
      \${medalCount}枚 集めた ほうびとして
      \${itemName} を さずけようぞ！

      2.xからのセーブデータ変換について
      この機能をONにした場合、2.x以前を使用していたときのセーブデータを
      ロードした際に3.x用に変換します。
      ただし、報酬設定の順序や内容を変更すると正しくセーブデータが変換されず、
      意図しない挙動となることに注意してください。

      2.xから3.x以降へバージョンアップする場合、
      セーブデータ変換をOFFにすると、
      2.x以前を使用していたときのセーブデータにおいて、
      報酬獲得状況がリセットされます。`)
  .build();
