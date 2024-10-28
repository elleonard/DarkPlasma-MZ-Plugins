import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createColorParam, createDatabaseArrayParam, createDummyParam, createNumberParam, createSelectParam, createStringParam, createStruct, createStructParam, createCommand, createDatabaseParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/10/28",
    version: "5.4.0",
    description: "セーブデータに含むクラス名の命名を見直し",
  },
  {
    date: "2024/09/24",
    version: "5.3.2",
    description: "プラグインコマンドの引数が設定できない不具合を修正",
  },
  {
    date: "2024/02/04",
    version: "5.3.1",
    description: "目次生成をリフレッシュごとに行うよう修正",
  },
  {
    version: "5.3.0",
    description: "未登録の敵キャラもハイライトできるように変更",
  },
  {
    date: "2024/01/15",
    version: "5.2.3",
    description: "ビルド方式を変更 (configをTypeScript化)",
  },
  {
    date: "2023/09/08",
    version: "5.2.2",
    description: "ゲーム開始時点で Game_System インスタンスに図鑑オブジェクトを持たせるよう修正",
  },
  {
    version: "5.2.1",
    description: "ハイライトする際にエラーが発生する不具合を修正",
  },
  {
    version: "5.2.0",
    description: "ハイライト色のインターフェース追加",
  },
  {
    date: "2023/06/03",
    version: "5.1.1",
    description: "リファクタ",
  },
  {
    date: "2023/03/25",
    version: "5.1.0",
    description: "選択ウィンドウの敵キャラを取得するインターフェースを追加",
  },
  {
    date: "2023/03/18",
    version: "5.0.0",
    description: "デフォルト言語を日本語に修正"
  },
  {
    description: "アイコン設定をSystemTypeIconに切り出す"
  },
  {
    description: "戦闘中に開く機能をEnemyBookInBattleに切り出す"
  },
  {
    date: "2023/02/23",
    version: "4.5.3",
    description: "デフォルト言語を日本語に変更"
  },
  {
    date: "2023/02/18",
    version: "4.5.2",
    description: "デフォルト言語を設定"
  },
  {
    date: "2022/09/10",
    version: "4.5.1",
    description: "typescript移行"
  },
  {
    date: "2022/07/24",
    version: "4.5.0",
    description: "敵キャラ画像のスケール設定メモタグを追加"
  },
  {
    version: "4.4.0",
    description: "敵キャラ画像表示位置設定を追加"
  },
  {
    date: "2022/07/18",
    version: "4.3.1",
    description: "リファクタ"
  },
  {
    date: "2022/07/16",
    version: "4.3.0",
    description: "ウィンドウ操作用にインターフェースを公開"
  },
  {
    date: "2022/07/09",
    version: "4.2.0",
    description: "レイアウト調整用にウィンドウクラスをグローバルに公開"
  },
  {
    date: "2022/05/14",
    version: "4.1.2",
    description: "リファクタ"
  },
  {
    date: "2022/04/25",
    version: "4.1.1",
    description: "リファクタ"
  },
  {
    description: "図鑑ウィンドウレイヤーの位置調整"
  },
  {
    date: "2021/12/29",
    version: "4.1.0",
    description: "DarkPlasma_OrderIdAliasに対応"
  },
  {
    date: "2021/12/11",
    version: "4.0.1",
    description: "ドロップ収集率が正常に表示されない不具合を修正"
  },
  {
    version: "4.0.0",
    description: "レイアウトをMixInに切り出す"
  },
  {
    description: "Scene_EnemyBookのインターフェース一部変更（拡張プラグインに影響あり）"
  },
  {
    date: "2021/12/01",
    version: "3.4.3",
    description: "図鑑を完成させるコマンドを使うとドロップアイテム収集率が正常に計算されない不具合を修正"
  },
  {
    version: "3.4.2",
    description: "登録可能モンスターの数が変わると図鑑コンプリート率が正常に計算されない不具合を修正"
  },
  {
    date: "2021/11/29",
    version: "3.4.1",
    description: "ドロップアイテム収集率が正常に計算されない不具合を修正"
  },
  {
    date: "2021/11/21",
    version: "3.4.0",
    description: "出現モンスターを最上部に表示する設定を追加"
  },
  {
    date: "2021/11/17",
    version: "3.3.0",
    description: "Window_EnemyBookIndexをグローバルに公開"
  },
  {
    date: "2021/11/13",
    version: "3.2.0",
    description: "Scene_EnemyBookとScene_Battleでウィンドウ生成メソッドのインターフェースを統一"
  },
  {
    version: "3.1.0",
    description: "拡張用インターフェース追加"
  },
  {
    date: "2021/11/06",
    version: "3.0.1",
    description: "リファクタ"
  },
  {
    date: "2021/11/03",
    version: "3.0.0",
    description: "ドロップ率分数表示に対応"
  },
  {
    description: "横型レイアウトを削除"
  },
  {
    date: "2021/09/19",
    version: "2.2.2",
    description: "ゲームデータ更新で登録可否のみを更新したケースに対応"
  },
  {
    date: "2021/09/03",
    version: "2.2.1",
    description: "図鑑に載らない敵のみの場合、ページ切り替え操作が効かなくなる不具合を修正"
  },
  {
    date: "2021/09/03",
    version: "2.2.0",
    description: "戦闘中最初に開いた時、出現している敵にカーソルを合わせる"
  },
  {
    description: "戦闘中、ページ切り替え操作で出現している敵を行き来する"
  },
  {
    description: "横型レイアウトを非推奨化（次回更新で削除予定）"
  },
  {
    date: "2021/08/22",
    version: "2.1.0",
    description: "戦闘中に出現している敵をリストで強調する機能を追加"
  },
  {
    date: "2021/07/05",
    version: "2.0.8",
    description: "MZ 1.3.2に対応"
  },
  {
    date: "2021/06/22",
    version: "2.0.7",
    description: "サブフォルダからの読み込みに対応"
  },
  {
    date: "2021/01/04",
    version: "2.0.6",
    description: "セーブデータ作成後のゲームアップデートによるエネミーの増減に対応"
  },
  {
    date: "2021/01/04",
    version: "2.0.5",
    description: "登録不可エネミーがコンプリート率計算に含まれる不具合を修正"
  },
  {
    date: "2020/12/31",
    version: "2.0.4",
    description: "レイアウト調整用インターフェース公開 ラベルが正しく表示されない不具合を修正"
  },
  {
    date: "2020/12/14",
    version: "2.0.3",
    description: "敵キャラの色調変更が適用されない不具合を修正"
  },
  {
    date: "2020/10/10",
    version: "2.0.2",
    description: "リファクタ"
  },
  {
    date: "2020/09/29",
    version: "2.0.1",
    description: "プラグインコマンドに説明を追加"
  },
  {
    date: "2020/09/08",
    version: "2.0.0",
    description: "パラメータ名を変更"
  },
  {
    date: "2020/08/30",
    version: "1.0.0",
    description: "MZ版公開"
  }
];

const structDebuffStatusThreshold = createStruct(
  "DebuffStatusThreshold",
  [
    createNumberParam(
      "small",
      {
        text: {
          ja: "閾値（小）",
          en: "Threshold (small)",
        },
      }
    ),
    createNumberParam(
      "large",
      {
        text: {
          ja: "閾値（大）",
          en: "Threshold (large)",
        },
      }
    ),
  ]
);

const structDebuffStatusThresholds = createStruct(
  "DebuffStatusThresholds",
  [
    createStructParam(
      "weak",
      {
        struct: structDebuffStatusThreshold,
        text: {
          ja: "弱点閾値",
          en: "Weak Threshold",
        },
        description: {
          ja: "弱点弱体のアイコン表示判定の閾値。有効度がこれらの値よりも大ならアイコンを弱点弱体に表示",
          en: "Display debuff status icon as weak if debuff rate of the enemy is larger than this value.",
        },
        default: {
          small: 100,
          large: 150,
        },
      }
    ),
    createStructParam(
      "resist",
      {
        struct: structDebuffStatusThreshold,
        text: {
          ja: "耐性閾値",
          en: "Resist Threshold",
        },
        description: {
          ja: "耐性弱体のアイコン表示判定の閾値。有効度がこれらの値よりも小ならアイコンを耐性弱体に表示",
          en: "Display debuff status icon as resist if debuff rate of the enemy is smaller than this value.",
        },
        default: {
          small: 100,
          large: 50,
        },
      }
    ),
  ]
);

const structImageView = createStruct(
  "ImageView",
  [
    createNumberParam(
      "x",
      {
        text: {
          ja: "X座標",
          en: "position x",
        }
      }
    ),
    createNumberParam(
      "y",
      {
        text: {
          ja: "Y座標",
          en: "position y",
        },
      }
    ),
  ]
);

const parameters = [
  createStringParam(
    "unknownData",
    {
      text: {
        ja: "未確認要素表示名",
        en: "Unknown Data",
      },
      default: {
        ja: "？？？？？？",
        en: "??????",
      }
    }
  ),
  createBooleanParam(
    "grayOutUnknown",
    {
      text: {
        ja: "未確認要素グレー表示",
        en: "Gray out Unknown Enemy",
      },
      default: false,
    }
  ),
  createBooleanParam(
    "maskUnknownDropItem",
    {
      text: {
        ja: "未確認ドロップ隠し",
        en: "Mask Unknown Drop Item",
      },
      default: false,
    }
  ),
  createStringParam(
    "enemyPercentLabel",
    {
      text: {
        ja: "図鑑収集率ラベル",
        en: "Enemy Percent Label",
      },
      default: "Enemy"
    },
  ),
  createStringParam(
    "dropItemPercentLabel",
    {
      text: {
        ja: "ドロップ取得率ラベル",
        en: "Drop Item Percent Label",
      },
      default: "Drop Item",
    }
  ),
  createBooleanParam(
    "displayDropRate",
    {
      text: {
        ja: "ドロップ率表示",
        en: "Display Drop Rate",
      },
      default: false,
    }
  ),
  createSelectParam(
    "dropRateFormat",
    {
      text: {
        ja: "ドロップ率表示形式",
        en: "Drop Rate Format",
      },
      default: 0,
      options: [
        {
          name: "XX％",
          value: 0,
        },
        {
          name: "1/X",
          value: 1,
        },
      ],
    }
  ),
  createStringParam(
    "weakElementAndStateLabel",
    {
      text: {
        ja: "弱点ラベル",
        en: "Weak Label",
      },
      description: {
        ja: "弱点属性/ステート/弱体のラベルを設定します",
        en: "Label for weak elements and states.",
      },
      default: {
        ja: "弱点属性/ステート/弱体",
        en: "Weak",
      },
    }
  ),
  createStringParam(
    "resistElementAndStateLabel",
    {
      text: {
        ja: "耐性ラベル",
        en: "Resist Label",
      },
      description: {
        ja: "耐性属性/ステート/弱体のラベルを設定します",
        en: "Label for resist elements and states.",
      },
      default: {
        ja: "耐性属性/ステート/弱体",
        en: "Resist",
      },
    }
  ),
  createBooleanParam(
    "devideResistAndNoEffect",
    {
      text: {
        ja: "耐性と無効を分ける",
        en: "Devide resist and no effect",
      },
      description: {
        ja: "耐性属性/ステート/弱体と無効属性/ステート/弱体を分けて表示します",
        en: "Display no effect elements and states apart from the resists.",
      },
      default: false,
    }
  ),
  createStringParam(
    "noEffectElementAndStateLabel",
    {
      text: {
        ja: "無効ラベル",
        en: "No Effect Label",
      },
      description: {
        ja: "無効属性/ステート/弱体のラベルを設定します",
        en: "Label for no effect elements and states.",
      },
      default: {
        ja: "無効属性/ステート/弱体",
        en: "No Effect",
      },
    }
  ),
  createDatabaseArrayParam(
    "excludeWeakStates",
    {
      type: "state",
      text: {
        ja: "弱点表示しないステート",
        en: "Exclude weak states",
      },
      description: {
        ja: "弱点ステートに表示しないステートを設定します",
        en: "List for states not to display as weak states.",
      },
    }
  ),
  createDatabaseArrayParam(
    "excludeResistStates",
    {
      type: "state",
      text: {
        ja: "耐性表示しないステート",
        en: "Exclude resist states",
      },
      description: {
        ja: "耐性/無効ステートに表示しないステートを設定します",
        en: "List for states not to display as resist states.",
      },
    }
  ),
  createDummyParam(
    "debuffStatus",
    {
      text: {
        ja: "弱体有効度の表示",
        en: "Debuff status",
      }
    }
  ),
  createBooleanParam(
    "displayDebuffStatus",
    {
      text: {
        ja: "有効弱体/耐性弱体を表示",
        en: "Display debuff status",
      },
      default: true,
      parent: "debuffStatus"
    }
  ),
  createStructParam(
    "debuffStatusThreshold",
    {
      struct: structDebuffStatusThresholds,
      text: {
        ja: "弱体有効度閾値",
        en: "Debuff Status Threshold",
      },
      default: {
        weak: {
          small: 100,
          large: 150,
        },
        resist: {
          small: 100,
          large: 50,
        },
      },
      parent: "debuffStatus",
    }
  ),
  createColorParam(
    "highlightColor",
    {
      text: {
        ja: "ハイライト色",
        en: "Battler Enemy Highlight Color",
      },
      description: {
        ja: "図鑑のモンスターリストをハイライトする際の色を設定します。",
        en: "Highlight color for enemy list.",
      },
      default: 2,
    }
  ),
  createStructParam(
    "enemyImageView",
    {
      struct: structImageView,
      text: {
        ja: "敵キャラ画像表示設定",
        en: "Display enemy image setting.",
      },
      default: {
        x: 135,
        y: 190,
      },
    }
  ),
];

const commands = [
  createCommand(
    "open enemyBook",
    {
      text: {
        ja: "図鑑を開く",
        en: "open enemy book",
      },
      description: {
        ja: "図鑑シーンを開きます。",
        en: "Open enemy book.",
      }
    }
  ),
  createCommand(
    "add to enemyBook",
    {
      text: {
        ja: "図鑑に登録する",
        en: "add to enemy book",
      },
      description: {
        ja: "指定した敵キャラを図鑑に登録します。",
        en: "Add enemy to book.",
      },
      args: [
        createDatabaseParam(
          "id",
          {
            type: "enemy",
            text: {
              ja: "敵キャラID",
              en: "enemy id",
            },
          }
        ),
      ],
    }
  ),
  createCommand(
    "remove from enemyBook",
    {
      text: {
        ja: "図鑑から登録抹消する",
        en: "remove from enemy book",
      },
      description: {
        ja: "指定した敵キャラを図鑑から登録抹消します。",
        en: "Remove enemy from book.",
      },
      args: [
        createDatabaseParam(
          "id",
          {
            type: "enemy",
            text: {
              ja: "敵キャラID",
              en: "enemy id",
            },
          }
        ),
      ],
    }
  ),
  createCommand(
    "complete enemyBook",
    {
      text: {
        ja: "図鑑を完成させる",
        en: "complete enemy book",
      },
      description: {
        ja: "図鑑の内容を全開示します。",
        en: "Complete enemy book.",
      },
    }
  ),
  createCommand(
    "clear enemyBook",
    {
      text: {
        ja: "図鑑を初期化する",
        en: "clear enemy book",
      },
      description: {
        ja: "図鑑の内容を初期化します。",
        en: "Clear enemy book.",
      },
    }
  ),
];

export const config = new ConfigDefinitionBuilder(
  "EnemyBook",
  2020,
  {
    ja: "敵キャラ図鑑",
    en: "Displays detailed statuses of enemies."
  }
)
  .withHistories(histories)
  .withLocate('en')
  .withParameters(parameters)
  .withStructure(structDebuffStatusThreshold)
  .withStructure(structDebuffStatusThresholds)
  .withStructure(structImageView)
  .withCommands(commands)
  .withBaseDependency({
    name: "DarkPlasma_CustomKeyHandler",
    version: "1.2.1",
  })
  .withBaseDependency({
    name: "DarkPlasma_SystemTypeIcon",
    version: "1.0.0",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_CustomKeyHandler",
  })
  .withHelp({
    ja: dedent`このプラグインはYoji Ojima氏によって書かれたRPGツクール公式プラグインを元に
    DarkPlasmaが改変を加えたものです。

    スクリプト:
      # 図鑑のエネミー遭遇達成率を取得する
      $gameSystem.percentCompleteEnemy()
      # 図鑑のドロップアイテム取得達成率を取得する
      $gameSystem.percentCompleteDrop()
      # 図鑑を開く
      SceneManager.push(Secne_EnemyBook)

    敵キャラのメモ:
      <desc1:なんとか>  # 説明１行目
      <desc2:かんとか>  # 説明２行目
      <book:no>        # 図鑑に載せない場合
      <scaleInBook:80> # 図鑑上の画像の拡大率

    DarkPlasma_OrderIdAlias と併用することにより、図鑑の並び順を制御できます。
    DarkPlasma_EnemyBookInBattle と併用することにより、
    戦闘中に図鑑を開けます。`,
    en: dedent`The original plugin is RMMV official plugin written by Yoji Ojima.
    Arranged by DarkPlasma.

    Script:
      $gameSystem.percentCompleteEnemy() # Get percentage of enemy.
      $gameSystem.percentCompleteDrop()  # Get percentage of drop item.
      SceneManager.push(Secne_EnemyBook) # Open enemy book.

    Enemy Note:
      <desc1:foobar>   # Description text in the enemy book, line 1
      <desc2:blahblah> # Description text in the enemy book, line 2
      <book:no>        # This enemy does not appear in the enemy book
      <scaleInBook:80> # Enemy image scale in book

    You can control order of enemies with DarkPlasma_OrderIdAlias.
    You can open enemy book in battle with DarkPlasma_EnemyBookInBattle.`,
  })
  .build();
