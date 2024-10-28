// DarkPlasma_EnemyBook 5.4.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/10/28 5.4.0 セーブデータに含むクラス名の命名を見直し
 * 2024/09/24 5.3.2 プラグインコマンドの引数が設定できない不具合を修正
 * 2024/02/04 5.3.1 目次生成をリフレッシュごとに行うよう修正
 *            5.3.0 未登録の敵キャラもハイライトできるように変更
 * 2024/01/15 5.2.3 ビルド方式を変更 (configをTypeScript化)
 * 2023/09/08 5.2.2 ゲーム開始時点で Game_System インスタンスに図鑑オブジェクトを持たせるよう修正
 *            5.2.1 ハイライトする際にエラーが発生する不具合を修正
 *            5.2.0 ハイライト色のインターフェース追加
 * 2023/06/03 5.1.1 リファクタ
 * 2023/03/25 5.1.0 選択ウィンドウの敵キャラを取得するインターフェースを追加
 * 2023/03/18 5.0.0 デフォルト言語を日本語に修正
 *                  アイコン設定をSystemTypeIconに切り出す
 *                  戦闘中に開く機能をEnemyBookInBattleに切り出す
 * 2023/02/23 4.5.3 デフォルト言語を日本語に変更
 * 2023/02/18 4.5.2 デフォルト言語を設定
 * 2022/09/10 4.5.1 typescript移行
 * 2022/07/24 4.5.0 敵キャラ画像のスケール設定メモタグを追加
 *            4.4.0 敵キャラ画像表示位置設定を追加
 * 2022/07/18 4.3.1 リファクタ
 * 2022/07/16 4.3.0 ウィンドウ操作用にインターフェースを公開
 * 2022/07/09 4.2.0 レイアウト調整用にウィンドウクラスをグローバルに公開
 * 2022/05/14 4.1.2 リファクタ
 * 2022/04/25 4.1.1 リファクタ
 *                  図鑑ウィンドウレイヤーの位置調整
 * 2021/12/29 4.1.0 DarkPlasma_OrderIdAliasに対応
 * 2021/12/11 4.0.1 ドロップ収集率が正常に表示されない不具合を修正
 *            4.0.0 レイアウトをMixInに切り出す
 *                  Scene_EnemyBookのインターフェース一部変更（拡張プラグインに影響あり）
 * 2021/12/01 3.4.3 図鑑を完成させるコマンドを使うとドロップアイテム収集率が正常に計算されない不具合を修正
 *            3.4.2 登録可能モンスターの数が変わると図鑑コンプリート率が正常に計算されない不具合を修正
 * 2021/11/29 3.4.1 ドロップアイテム収集率が正常に計算されない不具合を修正
 * 2021/11/21 3.4.0 出現モンスターを最上部に表示する設定を追加
 * 2021/11/17 3.3.0 Window_EnemyBookIndexをグローバルに公開
 * 2021/11/13 3.2.0 Scene_EnemyBookとScene_Battleでウィンドウ生成メソッドのインターフェースを統一
 *            3.1.0 拡張用インターフェース追加
 * 2021/11/06 3.0.1 リファクタ
 * 2021/11/03 3.0.0 ドロップ率分数表示に対応
 *                  横型レイアウトを削除
 * 2021/09/19 2.2.2 ゲームデータ更新で登録可否のみを更新したケースに対応
 * 2021/09/03 2.2.1 図鑑に載らない敵のみの場合、ページ切り替え操作が効かなくなる不具合を修正
 * 2021/09/03 2.2.0 戦闘中最初に開いた時、出現している敵にカーソルを合わせる
 *                  戦闘中、ページ切り替え操作で出現している敵を行き来する
 *                  横型レイアウトを非推奨化（次回更新で削除予定）
 * 2021/08/22 2.1.0 戦闘中に出現している敵をリストで強調する機能を追加
 * 2021/07/05 2.0.8 MZ 1.3.2に対応
 * 2021/06/22 2.0.7 サブフォルダからの読み込みに対応
 * 2021/01/04 2.0.6 セーブデータ作成後のゲームアップデートによるエネミーの増減に対応
 * 2021/01/04 2.0.5 登録不可エネミーがコンプリート率計算に含まれる不具合を修正
 * 2020/12/31 2.0.4 レイアウト調整用インターフェース公開 ラベルが正しく表示されない不具合を修正
 * 2020/12/14 2.0.3 敵キャラの色調変更が適用されない不具合を修正
 * 2020/10/10 2.0.2 リファクタ
 * 2020/09/29 2.0.1 プラグインコマンドに説明を追加
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/30 1.0.0 MZ版公開
 */

/*:en
 * @plugindesc Displays detailed statuses of enemies.
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_CustomKeyHandler
 * @base DarkPlasma_SystemTypeIcon
 * @orderAfter DarkPlasma_CustomKeyHandler
 *
 * @param unknownData
 * @text Unknown Data
 * @type string
 * @default ??????
 *
 * @param grayOutUnknown
 * @text Gray out Unknown Enemy
 * @type boolean
 * @default false
 *
 * @param maskUnknownDropItem
 * @text Mask Unknown Drop Item
 * @type boolean
 * @default false
 *
 * @param enemyPercentLabel
 * @text Enemy Percent Label
 * @type string
 * @default Enemy
 *
 * @param dropItemPercentLabel
 * @text Drop Item Percent Label
 * @type string
 * @default Drop Item
 *
 * @param displayDropRate
 * @text Display Drop Rate
 * @type boolean
 * @default false
 *
 * @param dropRateFormat
 * @text Drop Rate Format
 * @type select
 * @option XX％
 * @value 0
 * @option 1/X
 * @value 1
 * @default 0
 *
 * @param weakElementAndStateLabel
 * @desc Label for weak elements and states.
 * @text Weak Label
 * @type string
 * @default Weak
 *
 * @param resistElementAndStateLabel
 * @desc Label for resist elements and states.
 * @text Resist Label
 * @type string
 * @default Resist
 *
 * @param devideResistAndNoEffect
 * @desc Display no effect elements and states apart from the resists.
 * @text Devide resist and no effect
 * @type boolean
 * @default false
 *
 * @param noEffectElementAndStateLabel
 * @desc Label for no effect elements and states.
 * @text No Effect Label
 * @type string
 * @default No Effect
 *
 * @param excludeWeakStates
 * @desc List for states not to display as weak states.
 * @text Exclude weak states
 * @type state[]
 * @default []
 *
 * @param excludeResistStates
 * @desc List for states not to display as resist states.
 * @text Exclude resist states
 * @type state[]
 * @default []
 *
 * @param debuffStatus
 * @text Debuff status
 *
 * @param displayDebuffStatus
 * @text Display debuff status
 * @type boolean
 * @parent debuffStatus
 * @default true
 *
 * @param debuffStatusThreshold
 * @text Debuff Status Threshold
 * @type struct<DebuffStatusThresholdsEn>
 * @parent debuffStatus
 * @default {"weak":"{\"small\":\"100\",\"large\":\"150\"}","resist":"{\"small\":\"100\",\"large\":\"50\"}"}
 *
 * @param highlightColor
 * @desc Highlight color for enemy list.
 * @text Battler Enemy Highlight Color
 * @type color
 * @default 2
 *
 * @param enemyImageView
 * @text Display enemy image setting.
 * @type struct<ImageViewEn>
 * @default {"x":"135","y":"190"}
 *
 * @command open enemyBook
 * @text open enemy book
 * @desc Open enemy book.
 *
 * @command add to enemyBook
 * @text add to enemy book
 * @desc Add enemy to book.
 * @arg id
 * @text enemy id
 * @type enemy
 * @default 0
 *
 * @command remove from enemyBook
 * @text remove from enemy book
 * @desc Remove enemy from book.
 * @arg id
 * @text enemy id
 * @type enemy
 * @default 0
 *
 * @command complete enemyBook
 * @text complete enemy book
 * @desc Complete enemy book.
 *
 * @command clear enemyBook
 * @text clear enemy book
 * @desc Clear enemy book.
 *
 * @help
 * version: 5.4.0
 * The original plugin is RMMV official plugin written by Yoji Ojima.
 * Arranged by DarkPlasma.
 *
 * Script:
 *   $gameSystem.percentCompleteEnemy() # Get percentage of enemy.
 *   $gameSystem.percentCompleteDrop()  # Get percentage of drop item.
 *   SceneManager.push(Secne_EnemyBook) # Open enemy book.
 *
 * Enemy Note:
 *   <desc1:foobar>   # Description text in the enemy book, line 1
 *   <desc2:blahblah> # Description text in the enemy book, line 2
 *   <book:no>        # This enemy does not appear in the enemy book
 *   <scaleInBook:80> # Enemy image scale in book
 *
 * You can control order of enemies with DarkPlasma_OrderIdAlias.
 * You can open enemy book in battle with DarkPlasma_EnemyBookInBattle.
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_CustomKeyHandler version:1.2.1
 * DarkPlasma_SystemTypeIcon version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_CustomKeyHandler
 */
/*~struct~DebuffStatusThresholdEn:
 * @param small
 * @text Threshold (small)
 * @type number
 * @default 0
 *
 * @param large
 * @text Threshold (large)
 * @type number
 * @default 0
 */
/*~struct~DebuffStatusThresholdsEn:
 * @param weak
 * @desc Display debuff status icon as weak if debuff rate of the enemy is larger than this value.
 * @text Weak Threshold
 * @type struct<DebuffStatusThresholdEn>
 * @default {"small":"100","large":"150"}
 *
 * @param resist
 * @desc Display debuff status icon as resist if debuff rate of the enemy is smaller than this value.
 * @text Resist Threshold
 * @type struct<DebuffStatusThresholdEn>
 * @default {"small":"100","large":"50"}
 */
/*~struct~ImageViewEn:
 * @param x
 * @text position x
 * @type number
 * @default 0
 *
 * @param y
 * @text position y
 * @type number
 * @default 0
 */
/*:
 * @plugindesc 敵キャラ図鑑
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_CustomKeyHandler
 * @base DarkPlasma_SystemTypeIcon
 * @orderAfter DarkPlasma_CustomKeyHandler
 *
 * @param unknownData
 * @text 未確認要素表示名
 * @type string
 * @default ？？？？？？
 *
 * @param grayOutUnknown
 * @text 未確認要素グレー表示
 * @type boolean
 * @default false
 *
 * @param maskUnknownDropItem
 * @text 未確認ドロップ隠し
 * @type boolean
 * @default false
 *
 * @param enemyPercentLabel
 * @text 図鑑収集率ラベル
 * @type string
 * @default Enemy
 *
 * @param dropItemPercentLabel
 * @text ドロップ取得率ラベル
 * @type string
 * @default Drop Item
 *
 * @param displayDropRate
 * @text ドロップ率表示
 * @type boolean
 * @default false
 *
 * @param dropRateFormat
 * @text ドロップ率表示形式
 * @type select
 * @option XX％
 * @value 0
 * @option 1/X
 * @value 1
 * @default 0
 *
 * @param weakElementAndStateLabel
 * @desc 弱点属性/ステート/弱体のラベルを設定します
 * @text 弱点ラベル
 * @type string
 * @default 弱点属性/ステート/弱体
 *
 * @param resistElementAndStateLabel
 * @desc 耐性属性/ステート/弱体のラベルを設定します
 * @text 耐性ラベル
 * @type string
 * @default 耐性属性/ステート/弱体
 *
 * @param devideResistAndNoEffect
 * @desc 耐性属性/ステート/弱体と無効属性/ステート/弱体を分けて表示します
 * @text 耐性と無効を分ける
 * @type boolean
 * @default false
 *
 * @param noEffectElementAndStateLabel
 * @desc 無効属性/ステート/弱体のラベルを設定します
 * @text 無効ラベル
 * @type string
 * @default 無効属性/ステート/弱体
 *
 * @param excludeWeakStates
 * @desc 弱点ステートに表示しないステートを設定します
 * @text 弱点表示しないステート
 * @type state[]
 * @default []
 *
 * @param excludeResistStates
 * @desc 耐性/無効ステートに表示しないステートを設定します
 * @text 耐性表示しないステート
 * @type state[]
 * @default []
 *
 * @param debuffStatus
 * @text 弱体有効度の表示
 *
 * @param displayDebuffStatus
 * @text 有効弱体/耐性弱体を表示
 * @type boolean
 * @parent debuffStatus
 * @default true
 *
 * @param debuffStatusThreshold
 * @text 弱体有効度閾値
 * @type struct<DebuffStatusThresholds>
 * @parent debuffStatus
 * @default {"weak":"{\"small\":\"100\",\"large\":\"150\"}","resist":"{\"small\":\"100\",\"large\":\"50\"}"}
 *
 * @param highlightColor
 * @desc 図鑑のモンスターリストをハイライトする際の色を設定します。
 * @text ハイライト色
 * @type color
 * @default 2
 *
 * @param enemyImageView
 * @text 敵キャラ画像表示設定
 * @type struct<ImageView>
 * @default {"x":"135","y":"190"}
 *
 * @command open enemyBook
 * @text 図鑑を開く
 * @desc 図鑑シーンを開きます。
 *
 * @command add to enemyBook
 * @text 図鑑に登録する
 * @desc 指定した敵キャラを図鑑に登録します。
 * @arg id
 * @text 敵キャラID
 * @type enemy
 * @default 0
 *
 * @command remove from enemyBook
 * @text 図鑑から登録抹消する
 * @desc 指定した敵キャラを図鑑から登録抹消します。
 * @arg id
 * @text 敵キャラID
 * @type enemy
 * @default 0
 *
 * @command complete enemyBook
 * @text 図鑑を完成させる
 * @desc 図鑑の内容を全開示します。
 *
 * @command clear enemyBook
 * @text 図鑑を初期化する
 * @desc 図鑑の内容を初期化します。
 *
 * @help
 * version: 5.4.0
 * このプラグインはYoji Ojima氏によって書かれたRPGツクール公式プラグインを元に
 * DarkPlasmaが改変を加えたものです。
 *
 * スクリプト:
 *   # 図鑑のエネミー遭遇達成率を取得する
 *   $gameSystem.percentCompleteEnemy()
 *   # 図鑑のドロップアイテム取得達成率を取得する
 *   $gameSystem.percentCompleteDrop()
 *   # 図鑑を開く
 *   SceneManager.push(Secne_EnemyBook)
 *
 * 敵キャラのメモ:
 *   <desc1:なんとか>  # 説明１行目
 *   <desc2:かんとか>  # 説明２行目
 *   <book:no>        # 図鑑に載せない場合
 *   <scaleInBook:80> # 図鑑上の画像の拡大率
 *
 * DarkPlasma_OrderIdAlias と併用することにより、図鑑の並び順を制御できます。
 * DarkPlasma_EnemyBookInBattle と併用することにより、
 * 戦闘中に図鑑を開けます。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_CustomKeyHandler version:1.2.1
 * DarkPlasma_SystemTypeIcon version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_CustomKeyHandler
 */
/*~struct~DebuffStatusThreshold:
 * @param small
 * @text 閾値（小）
 * @type number
 * @default 0
 *
 * @param large
 * @text 閾値（大）
 * @type number
 * @default 0
 */
/*~struct~DebuffStatusThresholds:
 * @param weak
 * @desc 弱点弱体のアイコン表示判定の閾値。有効度がこれらの値よりも大ならアイコンを弱点弱体に表示
 * @text 弱点閾値
 * @type struct<DebuffStatusThreshold>
 * @default {"small":"100","large":"150"}
 *
 * @param resist
 * @desc 耐性弱体のアイコン表示判定の閾値。有効度がこれらの値よりも小ならアイコンを耐性弱体に表示
 * @text 耐性閾値
 * @type struct<DebuffStatusThreshold>
 * @default {"small":"100","large":"50"}
 */
/*~struct~ImageView:
 * @param x
 * @text X座標
 * @type number
 * @default 0
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 0
 */
(() => {
  'use strict';

  /**
   * @template TScene
   * @param {TScene} SceneClass
   * @return {TScene}
   * @mixin
   */
  const Scene_BookLayoutMixIn = (SceneClass) =>
    class extends SceneClass {
      /**
       * @return {Rectangle}
       */
      percentWindowRect() {
        return new Rectangle(0, 0, Graphics.boxWidth / 3, this.percentWindowHeight());
      }

      /**
       * @return {number}
       */
      percentWindowHeight() {
        return this.calcWindowHeight(2, false);
      }

      /**
       * @return {Rectangle}
       */
      indexWindowRect() {
        return new Rectangle(0, this.percentWindowHeight(), this.indexWindowWidth(), this.indexWindowHeight());
      }

      /**
       * @return {number}
       */
      indexWindowWidth() {
        return Math.floor(Graphics.boxWidth / 3);
      }

      /**
       * @return {number}
       */
      indexWindowHeight() {
        return Graphics.boxHeight - this.percentWindowHeight();
      }

      /**
       * @return {Rectangle}
       */
      mainWindowRect() {
        const x = this.indexWindowWidth();
        const y = 0;
        return new Rectangle(x, y, Graphics.boxWidth - x, Graphics.boxHeight - y);
      }
    };

  class LabelAndValueText {
    /**
     * @param {string} label
     * @param {?string} valueText
     */
    constructor(label, valueText) {
      this._label = label;
      this._valueText = valueText;
    }

    /**
     * @return {string}
     */
    get label() {
      return this._label;
    }

    /**
     * @return {string}
     */
    get valueText() {
      return this._valueText || '';
    }
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    unknownData: String(pluginParameters.unknownData || `？？？？？？`),
    grayOutUnknown: String(pluginParameters.grayOutUnknown || false) === 'true',
    maskUnknownDropItem: String(pluginParameters.maskUnknownDropItem || false) === 'true',
    enemyPercentLabel: String(pluginParameters.enemyPercentLabel || `Enemy`),
    dropItemPercentLabel: String(pluginParameters.dropItemPercentLabel || `Drop Item`),
    displayDropRate: String(pluginParameters.displayDropRate || false) === 'true',
    dropRateFormat: Number(pluginParameters.dropRateFormat || 0),
    weakElementAndStateLabel: String(pluginParameters.weakElementAndStateLabel || `弱点属性/ステート/弱体`),
    resistElementAndStateLabel: String(pluginParameters.resistElementAndStateLabel || `耐性属性/ステート/弱体`),
    devideResistAndNoEffect: String(pluginParameters.devideResistAndNoEffect || false) === 'true',
    noEffectElementAndStateLabel: String(pluginParameters.noEffectElementAndStateLabel || `無効属性/ステート/弱体`),
    excludeWeakStates: pluginParameters.excludeWeakStates
      ? JSON.parse(pluginParameters.excludeWeakStates).map((e) => {
          return Number(e || 0);
        })
      : [],
    excludeResistStates: pluginParameters.excludeResistStates
      ? JSON.parse(pluginParameters.excludeResistStates).map((e) => {
          return Number(e || 0);
        })
      : [],
    displayDebuffStatus: String(pluginParameters.displayDebuffStatus || true) === 'true',
    debuffStatusThreshold: pluginParameters.debuffStatusThreshold
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            weak: parsed.weak
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.weak)
              : { small: 100, large: 150 },
            resist: parsed.resist
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    small: Number(parsed.small || 0),
                    large: Number(parsed.large || 0),
                  };
                })(parsed.resist)
              : { small: 100, large: 50 },
          };
        })(pluginParameters.debuffStatusThreshold)
      : { weak: { small: 100, large: 150 }, resist: { small: 100, large: 50 } },
    highlightColor: pluginParameters.highlightColor?.startsWith('#')
      ? String(pluginParameters.highlightColor)
      : Number(pluginParameters.highlightColor || 2),
    enemyImageView: pluginParameters.enemyImageView
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            x: Number(parsed.x || 0),
            y: Number(parsed.y || 0),
          };
        })(pluginParameters.enemyImageView)
      : { x: 135, y: 190 },
  };

  class Window_LabelAndValueTexts extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this.refresh();
    }
    drawPercent() {
      const width = this.contentsWidth();
      const valueWidth = this.valueWidth();
      this.labelAndValueTexts().forEach((labelAndValueText, index) => {
        this.drawText(labelAndValueText.label, 0, this.lineHeight() * index, width - valueWidth);
        this.drawText(labelAndValueText.valueText, 0, this.lineHeight() * index, width, 'right');
      });
    }
    valueWidth() {
      return this.textWidth('100.0％');
    }
    /**
     * @return {LabelAndValueText[]}
     */
    labelAndValueTexts() {
      return [];
    }
    refresh() {
      this.contents.clear();
      this.drawPercent();
    }
  }

  function orderIdSort(a, b) {
    if (a === null && b === null) {
      // 両方nullなら順不同
      return 0;
    } else if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    }
    return (a.orderId || a.id) - (b.orderId || b.id);
  }

  const STATUS_NAMES = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
  const PLUGIN_COMMAND_NAME = {
    OPEN: 'open enemyBook',
    ADD: 'add to enemyBook',
    REMOVE: 'remove from enemyBook',
    COMPLETE: 'complete enemyBook',
    CLEAR: 'clear enemyBook',
  };
  const DROP_RATE_FORMAT = {
    PERCENT: 0,
    FRACTION: 1,
  };
  /**
   * 図鑑登録可能かどうか
   * @param {MZ.Enemy} enemy エネミーデータ
   * @return {boolean}
   */
  function isRegisterableEnemy(enemy) {
    return !!enemy && !!enemy.name && enemy.meta.book !== 'no';
  }
  /**
   * 図鑑登録可能なエネミー一覧
   * @return {MZ.Enemy[]}
   */
  function registerableEnemies() {
    return $dataEnemies.filter((enemy) => isRegisterableEnemy(enemy)).sort(orderIdSort);
  }
  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.OPEN, function () {
    SceneManager.push(Scene_EnemyBook);
  });
  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.ADD, function (args) {
    $gameSystem.addToEnemyBook(Number(args.id));
  });
  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.REMOVE, function (args) {
    $gameSystem.removeFromEnemyBook(Number(args.id));
  });
  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.COMPLETE, function () {
    $gameSystem.completeEnemyBook();
  });
  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR, function () {
    $gameSystem.clearEnemyBook();
  });
  class Game_EnemyBook {
    /**
     * @param {Game_EnemyBookPage[]} pages ページ一覧
     */
    constructor(pages) {
      this._pages = pages;
    }
    /**
     * 初期状態（何も登録されていない）図鑑を返す
     * @return {Game_EnemyBook}
     */
    static initialBook() {
      return new Game_EnemyBook(
        $dataEnemies.map((enemy) => {
          return isRegisterableEnemy(enemy)
            ? new Game_EnemyBookPage(
                false,
                enemy.dropItems.map((_) => false),
              )
            : null;
        }),
      );
    }
    flexPage() {
      /**
       * エネミーが増減していた場合、ページ数をあわせる
       * 減った場合、溢れたデータは捨てられる
       */
      if (this._pages.length < $dataEnemies.length) {
        this._pages = this._pages.concat(
          $dataEnemies.slice(this._pages.length).map((enemy) => {
            return isRegisterableEnemy(enemy)
              ? new Game_EnemyBookPage(
                  false,
                  enemy.dropItems.map((_) => false),
                )
              : null;
          }),
        );
      } else if (this._pages.length > $dataEnemies.length) {
        this._pages = this._pages.slice(0, $dataEnemies.length - 1);
      }
      /**
       * 登録不可から登録可能に変更された場合
       * 計算量的に微妙だが、セーブデータロード時に一度だけ実行されるところなので許容する
       * 逆パターンはどうせ表示されないので放置する
       */
      $dataEnemies
        .filter((enemy) => isRegisterableEnemy(enemy) && this._pages[enemy.id] === null)
        .forEach(
          (enemy) =>
            (this._pages[enemy.id] = new Game_EnemyBookPage(
              false,
              enemy.dropItems.map((_) => false),
            )),
        );
    }
    /**
     * エネミー登録率を百分率で返す
     */
    percentRegisteredEnemy() {
      const registerableEnemyCount = registerableEnemies().length;
      if (registerableEnemyCount === 0) {
        return 0;
      }
      const registeredEnemyCount = this._pages.filter((page, enemyId) => {
        return page && $dataEnemies[enemyId] && isRegisterableEnemy($dataEnemies[enemyId]) && page.isRegistered;
      }).length;
      return (100 * registeredEnemyCount) / registerableEnemyCount;
    }
    /**
     * ドロップアイテム登録率を百分率で返す
     */
    percentRegisteredDropItem() {
      const registerableDropItemCount = registerableEnemies().reduce(
        (previous, current) => previous + current.dropItems.filter((dropItem) => dropItem.kind > 0).length,
        0,
      );
      if (registerableDropItemCount === 0) {
        return 0;
      }
      const registeredDropItemCount = this._pages.reduce((previous, page, enemyId) => {
        if (!page || !page.isRegistered || !$dataEnemies[enemyId] || !isRegisterableEnemy($dataEnemies[enemyId])) {
          return previous;
        }
        return previous + page.registeredDropItemCount($dataEnemies[enemyId]);
      }, 0);
      return (100 * registeredDropItemCount) / registerableDropItemCount;
    }
    /**
     * 登録済みかどうか
     * @param {MZ.Enemy} enemy 敵データ
     */
    isRegistered(enemy) {
      if (enemy && this._pages[enemy.id]) {
        return this._pages[enemy.id].isRegistered;
      }
      return false;
    }
    /**
     * ドロップアイテムが登録済みかどうか
     * @param {MZ.Enemy} enemy 敵データ
     * @param {number} index ドロップアイテム番号
     */
    isDropItemRegistered(enemy, index) {
      if (enemy && this._pages[enemy.id]) {
        return this._pages[enemy.id].isDropItemRegistered(index);
      }
      return false;
    }
    /**
     * 図鑑に指定したエネミーを登録する
     */
    register(enemyId) {
      if (this._pages[enemyId]) {
        this._pages[enemyId].register();
      }
    }
    /**
     * 図鑑に指定したエネミーのドロップアイテムを登録する
     */
    registerDropItem(enemyId, index) {
      if (this._pages[enemyId]) {
        this._pages[enemyId].registerDropItem(index);
      }
    }
    /**
     * 図鑑から指定したエネミーを登録解除する
     */
    unregister(enemyId) {
      if (this._pages[enemyId]) {
        this._pages[enemyId].unregister();
      }
    }
    /**
     * 図鑑を完成させる
     */
    complete() {
      registerableEnemies().forEach((enemy) => {
        this.register(enemy.id);
        enemy.dropItems.forEach((dropItem, index) => {
          if (dropItem.kind > 0) {
            this.registerDropItem(enemy.id, index);
          }
        });
      });
    }
    /**
     * 図鑑を白紙に戻す
     */
    clear() {
      this._pages.filter((page) => page).forEach((page) => page.unregister());
    }
  }
  class Game_EnemyBookPage {
    /**
     * @param {boolean} isRegistered 登録フラグ
     * @param {boolean[]} dropItems ドロップアイテムごとに登録フラグ
     */
    constructor(isRegistered, dropItems) {
      this._isRegistered = isRegistered;
      this._dropItems = dropItems;
    }
    get isRegistered() {
      return this._isRegistered;
    }
    isDropItemRegistered(index) {
      return this._dropItems[index];
    }
    registeredDropItemCount(enemy) {
      return this._dropItems.filter((dropItem, index) => dropItem && enemy.dropItems[index].kind > 0).length;
    }
    register() {
      this._isRegistered = true;
    }
    registerDropItem(index) {
      this._dropItems[index] = true;
    }
    unregister() {
      this._isRegistered = false;
      this._dropItems = this._dropItems.map((_) => false);
    }
  }
  /**
   * 敵図鑑情報
   * Game_Systemからのみ直接アクセスされる
   */
  let enemyBook = null;
  function enemyBookInstance() {
    if (!enemyBook) {
      enemyBook = Game_EnemyBook.initialBook();
    }
    return enemyBook;
  }
  /**
   * エネミー図鑑シーン
   */
  class Scene_EnemyBook extends Scene_BookLayoutMixIn(Scene_MenuBase) {
    create() {
      super.create();
      this.createEnemyBookWindows();
    }
    createEnemyBookWindows() {
      this._enemyBookWindows = new EnemyBookWindows(
        this.popScene.bind(this),
        this._windowLayer,
        this.percentWindowRect(),
        this.indexWindowRect(),
        this.mainWindowRect(),
        false,
      );
    }
  }
  class EnemyBookWindows {
    /**
     * @param {function} cancelHandler キャンセル時の挙動
     * @param {WindowLayer} parentLayer 親レイヤー
     * @param {Rectangle} percentWindowRect
     * @param {Rectangle} indexWindowRect
     * @param {Rectangle} statusWindowRect
     * @param {boolean} isInBattle
     */
    constructor(cancelHandler, parentLayer, percentWindowRect, indexWindowRect, statusWindowRect, isInBattle) {
      this._isInBattle = isInBattle;
      this._percentWindow = new Window_EnemyBookPercent(percentWindowRect);
      this._indexWindow = new Window_EnemyBookIndex(indexWindowRect, isInBattle);
      this._indexWindow.setHandler('cancel', cancelHandler);
      this._statusWindow = new Window_EnemyBookStatus(statusWindowRect);
      parentLayer.addChild(this._percentWindow);
      parentLayer.addChild(this._indexWindow);
      parentLayer.addChild(this._statusWindow);
      this._indexWindow.setStatusWindow(this._statusWindow);
    }
    close() {
      this._percentWindow.hide();
      this._indexWindow.hide();
      this._indexWindow.deactivate();
      this._statusWindow.hide();
    }
    open() {
      this._percentWindow.show();
      this._indexWindow.show();
      this._indexWindow.activate();
      this._statusWindow.show();
    }
    isActive() {
      return this._indexWindow.active;
    }
    get indexWindow() {
      return this._indexWindow;
    }
    get statusWindow() {
      return this._statusWindow;
    }
    get percentWindow() {
      return this._percentWindow;
    }
  }
  /**
   * 登録率表示ウィンドウ
   */
  class Window_EnemyBookPercent extends Window_LabelAndValueTexts {
    labelAndValueTexts() {
      return [
        new LabelAndValueText(settings.enemyPercentLabel, `${$gameSystem.percentCompleteEnemy().toFixed(1)}％`),
        new LabelAndValueText(settings.dropItemPercentLabel, `${$gameSystem.percentCompleteDrop().toFixed(1)}％`),
      ];
    }
  }
  /**
   * エネミー図鑑目次
   */
  class Window_EnemyBookIndex extends Window_Selectable {
    initialize(rect, isInBattle) {
      super.initialize(rect);
      this._isInBattle = isInBattle;
      this.refresh();
      this.forcusOnFirst();
      this.activate();
    }
    forcusOnFirst() {
      this.setTopRow(Window_EnemyBookIndex.lastTopRow);
      this.select(Window_EnemyBookIndex.lastIndex);
    }
    /**
     * @return {number}
     */
    maxCols() {
      return 1;
    }
    /**
     * @return {number}
     */
    maxItems() {
      return this._list ? this._list.length : 0;
    }
    /**
     * @param {Window_EnemyBookStatus} statusWindow ステータスウィンドウ
     */
    setStatusWindow(statusWindow) {
      this._statusWindow = statusWindow;
      this.updateStatus();
    }
    update() {
      super.update();
      this.updateStatus();
    }
    updateStatus() {
      if (this._statusWindow) {
        const enemy = this._list[this.index()];
        this._statusWindow.setEnemy(enemy);
      }
    }
    makeItemList() {
      this._list = registerableEnemies();
    }
    refresh() {
      this.makeItemList();
      this.createContents();
      this.drawAllItems();
    }
    /**
     * @return {boolean}
     */
    isCurrentItemEnabled() {
      return this.isEnabled(this.index());
    }
    /**
     * @param {number} index インデックス
     * @return {boolean}
     */
    isEnabled(index) {
      const enemy = this._list[index];
      return $gameSystem.isInEnemyBook(enemy);
    }
    /**
     * @param {number} index インデックス
     */
    drawItem(index) {
      const enemy = this._list[index];
      const rect = this.itemRect(index);
      let name;
      if (this.mustHighlight(enemy)) {
        this.changeTextColor(this.highlightColorString(enemy));
      }
      if ($gameSystem.isInEnemyBook(enemy)) {
        name = enemy.name;
      } else {
        this.changePaintOpacity(!settings.grayOutUnknown);
        name = settings.unknownData;
      }
      this.drawText(name, rect.x, rect.y, rect.width);
      this.changePaintOpacity(true);
      this.resetTextColor();
    }
    /**
     * ハイライトすべきか
     * @param {MZ.Enemy} enemy
     * @return {boolean}
     */
    mustHighlight(enemy) {
      return false;
    }
    highlightColorString(enemy) {
      return typeof settings.highlightColor === 'string'
        ? settings.highlightColor
        : ColorManager.textColor(settings.highlightColor);
    }
    processOk() {}
    processCancel() {
      super.processCancel();
      Window_EnemyBookIndex.lastTopRow = this.topRow();
      Window_EnemyBookIndex.lastIndex = this.index();
    }
    enemy(index) {
      return this._list[index];
    }
    currentEnemy() {
      return this.enemy(this.index());
    }
  }
  Window_EnemyBookIndex.lastTopRow = 0;
  Window_EnemyBookIndex.lastIndex = 0;
  /**
   * 図鑑ステータスウィンドウ
   */
  class Window_EnemyBookStatus extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._enemy = null;
      this.setupEnemySprite();
      this.refresh();
    }
    setupEnemySprite() {
      this._enemySprite = new Sprite();
      this._enemySprite.anchor.x = 0.5;
      this._enemySprite.anchor.y = 0.5;
      this._enemySprite.x = settings.enemyImageView.x;
      this._enemySprite.y = settings.enemyImageView.y;
      this.addChildToBack(this._enemySprite);
    }
    contentsHeight() {
      const maxHeight = this.height;
      return maxHeight - this.itemPadding() * 2;
    }
    /**
     * @param {MZ.Enemy} enemy 敵キャラ情報
     */
    setEnemy(enemy) {
      if (this._enemy !== enemy) {
        this._enemy = enemy;
        this.refresh();
      }
    }
    update() {
      super.update();
      /**
       * データベースで拡大率が設定されていない場合は自動調整
       */
      if (this._enemySprite.bitmap && this._enemy && !this._enemy.meta.scaleInBook) {
        const bitmapHeight = this._enemySprite.bitmap.height;
        const contentsHeight = this.contents.height;
        let scale = 1;
        if (bitmapHeight > contentsHeight) {
          scale = contentsHeight / bitmapHeight;
        }
        this._enemySprite.scale.x = scale;
        this._enemySprite.scale.y = scale;
      }
    }
    refresh() {
      const enemy = this._enemy;
      this.contents.clear();
      if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
        this._enemySprite.bitmap = null;
        return;
      }
      const name = enemy.battlerName;
      let bitmap;
      if ($gameSystem.isSideView()) {
        bitmap = ImageManager.loadSvEnemy(name);
      } else {
        bitmap = ImageManager.loadEnemy(name);
      }
      this._enemySprite.bitmap = bitmap;
      if (enemy.meta.scaleInBook) {
        const scale = Number(enemy.meta.scaleInBook);
        this._enemySprite.scale.x = scale / 100;
        this._enemySprite.scale.y = scale / 100;
      }
      this._enemySprite.setHue(enemy.battlerHue);
      this.resetTextColor();
      this.drawText(enemy.name, 0, 0, 0);
      this.drawPage();
    }
    drawPage() {
      const enemy = this._enemy;
      const lineHeight = this.lineHeight();
      this.drawLevel(this.contentsWidth() / 2 + this.itemPadding() / 2, 0);
      this.drawStatus(this.contentsWidth() / 2 + this.itemPadding() / 2, lineHeight + this.itemPadding());
      this.drawExpAndGold(this.itemPadding(), lineHeight * 9 + this.itemPadding());
      const rewardsWidth = this.contentsWidth() / 2;
      const dropItemWidth = rewardsWidth;
      this.drawDropItems(0, lineHeight * 6 + this.itemPadding(), dropItemWidth);
      const weakAndResistWidth = this.contentsWidth() / 2;
      this._weakLines = 1;
      this._resistLines = 1;
      this.drawWeakElementsAndStates(0, lineHeight * 10 + this.itemPadding(), weakAndResistWidth);
      this.drawResistElementsAndStates(0, lineHeight * (11 + this._weakLines) + this.itemPadding(), weakAndResistWidth);
      if (settings.devideResistAndNoEffect) {
        this.drawNoEffectElementsAndStates(
          0,
          lineHeight * (12 + this._weakLines + this._resistLines) + this.itemPadding(),
          weakAndResistWidth,
        );
      }
      if (enemy.meta.desc1) {
        this.drawTextEx(String(enemy.meta.desc1), this.descriptionX(), this.descriptionY());
      }
      if (enemy.meta.desc2) {
        this.drawTextEx(String(enemy.meta.desc2), this.descriptionX(), this.descriptionY() + lineHeight);
      }
    }
    descriptionX() {
      return settings.devideResistAndNoEffect ? this.contentsWidth() / 2 + this.itemPadding() / 2 : 0;
    }
    descriptionY() {
      return this.itemPadding() + this.lineHeight() * 14;
    }
    /**
     * レベルを描画する
     */
    drawLevel(x, y) {
      const enemy = this._enemy;
      if (enemy && enemy.level) {
        this.changeTextColor(this.systemColor());
        this.drawText(`Lv.`, x, y, 160);
        this.resetTextColor();
        this.drawText(`${enemy.level}`, x + 160, y, 60, 'right');
      }
    }
    /**
     * ステータスを描画する
     */
    drawStatus(x, y) {
      const lineHeight = this.lineHeight();
      const enemy = this._enemy;
      [...Array(8).keys()].forEach((i) => {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(i), x, y, 160);
        this.resetTextColor();
        this.drawText(`${enemy.params[i]}`, x + 160, y, 60, 'right');
        y += lineHeight;
      });
    }
    /**
     * 経験値とゴールドを描画する
     */
    drawExpAndGold(x, y) {
      const enemy = this._enemy;
      this.resetTextColor();
      this.drawText(`${enemy.exp}`, x, y, 0);
      x += this.textWidth(`${enemy.exp}`) + 6;
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.expA, x, y, 0);
      x += this.textWidth(TextManager.expA + '  ');
      this.resetTextColor();
      this.drawText(`${enemy.gold}`, x, y, 0);
      x += this.textWidth(`${enemy.gold}`) + 6;
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.currencyUnit, x, y, 0);
    }
    /**
     * ドロップアイテムを描画する
     */
    drawDropItems(x, y, rewardsWidth) {
      const enemy = this._enemy;
      const lineHeight = this.lineHeight();
      const displayDropRate = settings.displayDropRate;
      enemy.dropItems.forEach((dropItems, index) => {
        if (dropItems.kind > 0) {
          const dropRateWidth = this.textWidth('0000000');
          if ($gameSystem.isInEnemyBookDrop(enemy, index)) {
            const item = Game_Enemy.prototype.itemObject(dropItems.kind, dropItems.dataId);
            this.drawItemName(item, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
            this.drawDropRate(dropItems.denominator, x, y, rewardsWidth);
          } else {
            this.changePaintOpacity(!settings.grayOutUnknown);
            if (settings.maskUnknownDropItem) {
              this.resetTextColor();
              this.drawText(settings.unknownData, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
            } else {
              const item = Game_Enemy.prototype.itemObject(dropItems.kind, dropItems.dataId);
              this.drawItemName(item, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
            }
            this.drawDropRate(dropItems.denominator, x, y, rewardsWidth);
            this.changePaintOpacity(true);
          }
          y += lineHeight;
        }
      });
    }
    /**
     * ドロップ率を描画する
     */
    drawDropRate(denominator, x, y, width) {
      if (!settings.displayDropRate || !denominator) {
        return;
      }
      switch (settings.dropRateFormat) {
        case DROP_RATE_FORMAT.PERCENT:
          const dropRate = Number(100 / denominator).toFixed(1);
          this.drawText(`${dropRate}％`, x, y, width, 'right');
          break;
        case DROP_RATE_FORMAT.FRACTION:
          this.drawText(`1/${denominator}`, x, y, width, 'right');
          break;
      }
    }
    /**
     * 指定した属性の有効度を返す
     * @param {number} elementId 属性ID
     * @return {number}
     */
    elementRate(elementId) {
      return this._enemy.traits
        .filter((trait) => trait.code === Game_BattlerBase.TRAIT_ELEMENT_RATE && trait.dataId === elementId)
        .reduce((r, trait) => r * trait.value, 1);
    }
    /**
     * 指定したステートの有効度を返す
     * @param {number} stateId ステートID
     * @return {number}
     */
    stateRate(stateId) {
      const isNoEffect = this._enemy.traits.find(
        (trait) => trait.code === Game_BattlerBase.TRAIT_STATE_RESIST && trait.dataId === stateId,
      );
      if (isNoEffect) {
        return 0;
      }
      return this._enemy.traits
        .filter((trait) => trait.code === Game_BattlerBase.TRAIT_STATE_RATE && trait.dataId === stateId)
        .reduce((r, trait) => r * trait.value, 1);
    }
    /**
     * 指定したステータスの弱体有効度を返す
     * @param {number} statusId ステータスID
     * @return {number}
     */
    debuffRate(statusId) {
      return (
        this._enemy.traits
          .filter((trait) => trait.code === Game_BattlerBase.TRAIT_DEBUFF_RATE && trait.dataId === statusId)
          .reduce((r, trait) => r * trait.value, 1) * 100
      );
    }
    maxIconsPerLine() {
      return 16;
    }
    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 横幅
     */
    drawWeakElementsAndStates(x, y, width) {
      const targetIcons = $dataSystem.elements
        .map((_, index) => index)
        .filter((elementId) => this.elementRate(elementId) > 1)
        .map((elementId) => $gameSystem.elementIconIndex(elementId))
        .concat(
          $dataStates
            .filter((state) => state && this.stateRate(state.id) > 1 && !this.isExcludedWeakState(state.id))
            .map((state) => state.iconIndex),
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            return settings.displayDebuffStatus && this.debuffRate(index) > settings.debuffStatusThreshold.weak.large;
          }).map((statusName) => $gameSystem.largeDebuffStatusIconIndex(statusName)),
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            const debuffRate = this.debuffRate(index);
            return (
              settings.displayDebuffStatus &&
              debuffRate <= settings.debuffStatusThreshold.weak.large &&
              debuffRate > settings.debuffStatusThreshold.weak.small
            );
          }).map((statusName) => $gameSystem.smallDebuffStatusIconIndex(statusName)),
        );
      this.changeTextColor(this.systemColor());
      this.drawText(settings.weakElementAndStateLabel, x, y, width);
      const iconBaseY = y + this.lineHeight();
      targetIcons.forEach((icon, index) => {
        this.drawIcon(
          icon,
          x + 32 * (index % this.maxIconsPerLine()),
          iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine()),
        );
      });
      this._weakLines = Math.floor(targetIcons.length / (this.maxIconsPerLine() + 1)) + 1;
    }
    /**
     * 弱点に表示しないステートかどうか
     * @param {number} stateId ステートID
     * @return {boolean}
     */
    isExcludedWeakState(stateId) {
      return settings.excludeWeakStates.includes(stateId);
    }
    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 横幅
     */
    drawResistElementsAndStates(x, y, width) {
      const targetIcons = $dataSystem.elements
        .map((_, index) => index)
        .filter((elementId) => {
          const elementRate = this.elementRate(elementId);
          return elementRate < 1 && (!settings.devideResistAndNoEffect || elementRate > 0);
        })
        .map((elementId) => $gameSystem.elementIconIndex(elementId))
        .concat(
          $dataStates
            .filter((state) => {
              if (!state) {
                return false;
              }
              const stateRate = this.stateRate(state.id);
              return (
                stateRate < 1 &&
                !this.isExcludedResistState(state.id) &&
                (!settings.devideResistAndNoEffect || stateRate > 0)
              );
            })
            .map((state) => state.iconIndex),
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            const debuffRate = this.debuffRate(index);
            return (
              settings.displayDebuffStatus &&
              debuffRate < settings.debuffStatusThreshold.resist.large &&
              (!settings.devideResistAndNoEffect || debuffRate > 0)
            );
          }).map((statusName) => $gameSystem.largeDebuffStatusIconIndex(statusName)),
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            const debuffRate = this.debuffRate(index);
            return (
              settings.displayDebuffStatus &&
              debuffRate >= settings.debuffStatusThreshold.resist.large &&
              debuffRate < settings.debuffStatusThreshold.resist.small
            );
          }).map((statusName) => $gameSystem.smallDebuffStatusIconIndex(statusName)),
        );
      this.changeTextColor(this.systemColor());
      this.drawText(settings.resistElementAndStateLabel, x, y, width);
      const iconBaseY = y + this.lineHeight();
      targetIcons.forEach((icon, index) => {
        this.drawIcon(
          icon,
          x + 32 * (index % this.maxIconsPerLine()),
          iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine()),
        );
      });
      this._resistLines = Math.floor(targetIcons.length / (this.maxIconsPerLine() + 1)) + 1;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     */
    drawNoEffectsLabel(x, y, width) {
      this.changeTextColor(this.systemColor());
      this.drawText(settings.noEffectElementAndStateLabel, x, y, width);
    }
    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 横幅
     */
    drawNoEffectElementsAndStates(x, y, width) {
      const targetIcons = $dataSystem.elements
        .map((_, index) => index)
        .filter((elementId) => this.elementRate(elementId) <= 0)
        .map((elementId) => $gameSystem.elementIconIndex(elementId))
        .concat(
          $dataStates
            .filter((state) => state && this.stateRate(state.id) <= 0 && !this.isExcludedResistState(state.id))
            .map((state) => state.iconIndex),
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            return settings.displayDebuffStatus && this.debuffRate(index) <= 0;
          }).map((statusName) => $gameSystem.largeDebuffStatusIconIndex(statusName)),
        );
      this.drawNoEffectsLabel(x, y, width);
      const iconBaseY = y + this.lineHeight();
      targetIcons.forEach((icon, index) => {
        this.drawIcon(
          icon,
          x + 32 * (index % this.maxIconsPerLine()),
          iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine()),
        );
      });
    }
    /**
     * 耐性リストに表示しないステートかどうか
     * @param {number} stateId ステートID
     * @return {boolean}
     */
    isExcludedResistState(stateId) {
      return settings.excludeResistStates.includes(stateId);
    }
  }
  function Game_System_EnemyBookMixIn(gameSystem) {
    const _initialize = gameSystem.initialize;
    gameSystem.initialize = function () {
      _initialize.call(this);
      enemyBook = Game_EnemyBook.initialBook();
      this._enemyBook = enemyBookInstance();
    };
    const _Game_System_onAfterLoad = gameSystem.onAfterLoad;
    gameSystem.onAfterLoad = function () {
      _Game_System_onAfterLoad.call(this);
      if (this._enemyBook) {
        enemyBook = this._enemyBook;
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
          enemyBookInstance().flexPage();
        }
      } else {
        enemyBook = Game_EnemyBook.initialBook();
        this._enemyBook = enemyBookInstance();
      }
    };
    gameSystem.addToEnemyBook = function (enemyId) {
      enemyBookInstance().register(enemyId);
    };
    gameSystem.addDropItemToEnemyBook = function (enemyId, dropIndex) {
      enemyBookInstance().registerDropItem(enemyId, dropIndex);
    };
    gameSystem.removeFromEnemyBook = function (enemyId) {
      enemyBookInstance().unregister(enemyId);
    };
    gameSystem.completeEnemyBook = function () {
      enemyBookInstance().complete();
    };
    gameSystem.clearEnemyBook = function () {
      enemyBookInstance().clear();
    };
    gameSystem.isInEnemyBook = function (enemy) {
      return enemyBookInstance().isRegistered(enemy);
    };
    gameSystem.isInEnemyBookDrop = function (enemy, dropIndex) {
      return enemyBookInstance().isDropItemRegistered(enemy, dropIndex);
    };
    gameSystem.percentCompleteEnemy = function () {
      return enemyBookInstance().percentRegisteredEnemy();
    };
    gameSystem.percentCompleteDrop = function () {
      return enemyBookInstance().percentRegisteredDropItem();
    };
  }
  Game_System_EnemyBookMixIn(Game_System.prototype);
  function Game_Troop_EnemyBookMixIn(gameTroop) {
    const _setup = gameTroop.setup;
    gameTroop.setup = function (troopId) {
      _setup.call(this, troopId);
      this.members().forEach(function (enemy) {
        if (enemy.isAppeared()) {
          $gameSystem.addToEnemyBook(enemy.enemyId());
        }
      }, this);
    };
  }
  Game_Troop_EnemyBookMixIn(Game_Troop.prototype);
  function Game_Enemy_EnemyBookMixIn(gameEnemy) {
    const _appear = gameEnemy.appear;
    gameEnemy.appear = function () {
      _appear.call(this);
      $gameSystem.addToEnemyBook(this._enemyId);
    };
    const _transform = gameEnemy.transform;
    gameEnemy.transform = function (enemyId) {
      _transform.call(this, enemyId);
      $gameSystem.addToEnemyBook(enemyId);
    };
    gameEnemy.dropItemLots = function (dropItem) {
      return dropItem.kind > 0 && Math.random() * dropItem.denominator < this.dropItemRate();
    };
    /**
     * ドロップアイテムリスト生成メソッド 上書き
     */
    gameEnemy.makeDropItems = function () {
      return this.enemy().dropItems.reduce((accumlator, dropItem, index) => {
        const dropItemObject = this.itemObject(dropItem.kind, dropItem.dataId);
        if (dropItemObject && this.dropItemLots(dropItem)) {
          $gameSystem.addDropItemToEnemyBook(this.enemy().id, index);
          return accumlator.concat(dropItemObject);
        } else {
          return accumlator;
        }
      }, []);
    };
  }
  Game_Enemy_EnemyBookMixIn(Game_Enemy.prototype);
  globalThis.EnemyBook = Game_EnemyBook;
  globalThis.EnemyBookPage = Game_EnemyBookPage;
  globalThis.Game_EnemyBook = Game_EnemyBook;
  globalThis.Game_EnemyBookPage = Game_EnemyBookPage;
  globalThis.Scene_EnemyBook = Scene_EnemyBook;
  globalThis.EnemyBookWindows = EnemyBookWindows;
  globalThis.Window_EnemyBookPercent = Window_EnemyBookPercent;
  globalThis.Window_EnemyBookIndex = Window_EnemyBookIndex;
  globalThis.Window_EnemyBookStatus = Window_EnemyBookStatus;
})();
