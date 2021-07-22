// DarkPlasma_BountyList 2.1.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/22 2.1.0 表示順序指定タグを追加
 * 2021/07/05 2.0.4 MZ 1.3.2に対応
 * 2021/06/22 2.0.3 サブフォルダからの読み込みに対応
 * 2020/10/10 2.0.2 リファクタ
 * 2020/09/29 2.0.1 プラグインコマンドの説明を追加
 * 2020/09/08 2.0.0 パラメータ名変更
 * 2020/08/24 1.0.1 URL修正
 *            1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 賞金首リストを表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param bountyInformations
 * @desc 賞金首リストに表示する情報。このリストの順番どおりに表示します
 * @text 賞金首情報
 * @type struct<BountyInformation>[]
 * @default ["{\"metaTag\":\"bountyRequest\",\"text\":\"依頼内容\"}","{\"metaTag\":\"bountyWhere\",\"text\":\"出現場所\"}","{\"metaTag\":\"bountyReward\",\"text\":\"討伐報酬\"}","{\"metaTag\":\"bountyDifficulty\",\"text\":\"討伐難度\"}","{\"metaTag\":\"bountyDescription\",\"text\":\"\"}"]
 *
 * @param unknownName
 * @desc 表示条件を満たさないエネミーの表示名
 * @text 未表示名
 * @type string
 * @default ？？？？？？
 *
 * @param showKilledBounty
 * @desc 撃破した賞金首を自動的に表示する
 * @text 撃破後自動表示
 * @type boolean
 * @default true
 *
 * @param textOffsetX
 * @desc 横方向のオフセット
 * @text テキストオフセットX
 * @type number
 * @default 0
 *
 * @param textOffsetY
 * @desc 縦方向のオフセット
 * @text テキストオフセットY
 * @type number
 * @default 0
 *
 * @param textColorNormal
 * @desc リスト内の倒していない敵の文字色
 * @text 倒してない敵の色
 * @type number
 * @default 0
 *
 * @param textColorKilled
 * @desc リスト内の倒した敵の文字色
 * @text 倒した敵の色
 * @type number
 * @default 7
 *
 * @command BountyList open
 * @text 賞金首シーンを開く
 * @desc 賞金首シーンを開きます。
 *
 * @command BountyList add
 * @text 敵キャラを賞金首リストに表示
 * @desc 指定した敵キャラを賞金首リスト内で開示します。
 * @arg id
 * @text 敵キャラID
 * @type enemy
 *
 * @command BountyList remove
 * @text 敵キャラを賞金首リストから非表示
 * @desc 指定した敵キャラを賞金首リストで非表示にします。
 * @arg id
 * @text 敵キャラID
 * @type enemy
 *
 * @command BountyList complete
 * @text 賞金首リストを全開示
 * @desc 賞金首リストを全開示します。
 *
 * @command BountyList clear
 * @text 賞金首リストを初期化
 * @desc 賞金首リストを初期化します。
 *
 * @help
 * version: 2.1.0
 * 賞金首に指定したいエネミーのメモ欄に以下の記述をしてください。
 *
 * <isBounty>
 * <bountyShowSwitch:xx> スイッチxx番がONなら表示する
 * <bountyOrderId:xx> 表示順を指定（省略した場合、エネミーIDを使用する）
 *
 * 賞金首リストには、<isBounty>が設定されており、
 * なおかつ以下のいずれかを満たす敵キャラが表示されます。
 * - 倒したことがある
 * - <bountyShowSwitch:xx>を指定しており、スイッチxx番がONである
 *
 * また、表示したい情報があれば、
 * 賞金首情報を設定した上で、以下のように記述してください。
 *
 * <bountyRequest:賞金首の依頼内容>
 * <bountyWhere:賞金首の出現場所>
 * <bountyReward:賞金首の報酬>
 * <bountyDifficulty:賞金首の討伐難度>
 * <bountyDescription:賞金首の説明>
 *
 * これはデフォルトの設定例であり、
 * 賞金首情報の設定次第でお好みの要素を追加できます。
 *
 * 賞金首リストをプログラムから開く:
 * SceneManager.push(Scene_BountyList);
 */
/*~struct~BountyInformation:
 * @param metaTag
 * @desc メタタグ。<(指定した名前):hoge> をエネミーのメモ欄に記入する
 * @text メタタグ
 * @type string
 *
 * @param text
 * @desc 表示上のテキスト
 * @text テキスト
 * @type string
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    bountyInformations: JSON.parse(
      pluginParameters.bountyInformations ||
        '[{"metaTag":"bountyRequest","text":"依頼内容"},{"metaTag":"bountyWhere","text":"出現場所"},{"metaTag":"bountyReward","text":"討伐報酬"},{"metaTag":"bountyDifficulty","text":"討伐難度"},{"metaTag":"bountyDescription","text":""}]'
    ).map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          metaTag: String(parsed.metaTag || ''),
          text: String(parsed.text || ''),
        };
      })(e || '{}');
    }),
    unknownName: String(pluginParameters.unknownName || '？？？？？？'),
    showKilledBounty: String(pluginParameters.showKilledBounty || true) === 'true',
    textOffsetX: Number(pluginParameters.textOffsetX || 0),
    textOffsetY: Number(pluginParameters.textOffsetY || 0),
    textColorNormal: Number(pluginParameters.textColorNormal || 0),
    textColorKilled: Number(pluginParameters.textColorKilled || 7),
  };

  const _extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ($dataEnemies && $dataEnemies.includes(data) && data.meta.isBounty) {
      data.isBounty = true;
      if (data.meta.bountyShowSwitch) {
        data.bountyShowSwitch = Number(data.meta.bountyShowSwitch);
      }
      settings.bountyInformations.forEach((info) => {
        if (data.meta[info.tag]) {
          data[info.tag] = String(data.meta[info.tag]);
        }
      });
      data.bountyOrderId = Number(data.meta.bountyOrderId || data.id);
    }
  };

  PluginManager.registerCommand(pluginName, 'BountyList open', function () {
    SceneManager.push(Scene_BountyList);
  });

  PluginManager.registerCommand(pluginName, 'BountyList add', function (args) {
    $gameSystem.addToBountyList(Number(args.id));
  });

  PluginManager.registerCommand(pluginName, 'BountyList remove', function (args) {
    $gameSystem.removeFromBountyList(Number(args.id));
  });

  PluginManager.registerCommand(pluginName, 'BountyList complete', function () {
    $gameSystem.completeBountyList();
  });

  PluginManager.registerCommand(pluginName, 'BountyList clear', function () {
    $gameSystem.clearBountyList();
  });

  Game_System.prototype.addToBountyList = function (enemyId) {
    if (!this._bountyKillFlags) {
      this.clearBountyList();
    }
    if ($dataEnemies[enemyId].isBounty) {
      this._bountyKillFlags[enemyId] = true;
    }
  };

  Game_System.prototype.removeFromBountyList = function (enemyId) {
    if (this._bountyKillFlags) {
      this._bountyKillFlags[enemyId] = false;
    }
  };

  Game_System.prototype.completeBountyList = function () {
    this.clearBountyList();
    $dataEnemies
      .filter((enemy) => enemy && enemy.isBounty)
      .forEach(function (enemy) {
        this._bountyKillFlags[enemy.id] = true;
      }, this);
  };

  Game_System.prototype.clearBountyList = function () {
    this._bountyKillFlags = [];
  };

  Game_System.prototype.isInBountyList = function (enemy) {
    if (!this._bountyKillFlags) {
      this.clearBountyList();
    }
    // そもそもバウンティではない
    if (!enemy.isBounty) {
      return false;
    }
    // すでに撃破済み
    if (this._bountyKillFlags[enemy.id]) {
      return true;
    }
    // スイッチが立っている
    if (enemy.bountyShowSwitch && $gameSwitches.value(enemy.bountyShowSwitch)) {
      return true;
    }
    return false;
  };

  Game_System.prototype.isKilledBounty = function (enemy) {
    if (!this._bountyKillFlags) {
      this.clearBountyList();
    }
    if (!enemy.isBounty) {
      return false;
    }
    if (this._bountyKillFlags[enemy.id]) {
      return true;
    }
    return false;
  };

  const _Game_Enemy_performCollapse = Game_Enemy.prototype.performCollapse;
  Game_Enemy.prototype.performCollapse = function () {
    _Game_Enemy_performCollapse.call(this);
    $gameSystem.addToBountyList(this.enemy().id);
  };

  /**
   *  賞金首シーン
   */
  class Scene_BountyList extends Scene_MenuBase {
    constructor() {
      super();
      this.initialize();
    }

    initialize() {
      super.initialize();
    }

    create() {
      super.create();
      this._indexWindow = new Window_BountyListIndex(this.bountyListIndexWindowRect());
      this._indexWindow.setHandler('cancel', this.popScene.bind(this));
      this._detailsWindow = new Window_BountyListDetails(this.bountyListDetailsWindowRect());
      this.addWindow(this._indexWindow);
      this.addWindow(this._detailsWindow);
      this._indexWindow.setDetailsWindow(this._detailsWindow);
    }

    /**
     * @return {Rectangle}
     */
    bountyListIndexWindowRect() {
      return new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(6, true));
    }

    /**
     * @return {Rectangle}
     */
    bountyListDetailsWindowRect() {
      const y = this._indexWindow.height;
      return new Rectangle(0, y, Graphics.boxWidth, Graphics.boxHeight - y);
    }
  }

  window[Scene_BountyList.name] = Scene_BountyList;

  /**
   * 賞金首リスト表示
   */
  class Window_BountyListIndex extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this.initialize.apply(this, arguments);
    }

    initialize(rect) {
      super.initialize(rect);
      this.makeItemList();
      this.refresh();
      this.setTopRow(Window_BountyListIndex.lastTopRow);
      this.select(Window_BountyListIndex.lastIndex);
      this.activate();
    }

    makeItemList() {
      this._list = $dataEnemies
        .filter((enemy) => enemy && enemy.isBounty)
        .sort((a, b) => a.bountyOrderId - b.bountyOrderId);
    }

    maxCols() {
      return 3;
    }

    maxItems() {
      return this._list ? this._list.length : 0;
    }

    /**
     * @param {Window_BountyListDetails} detailsWindow 詳細ウィンドウ
     */
    setDetailsWindow(detailsWindow) {
      this._detailsWindow = detailsWindow;
      this.updateDetails();
    }

    update() {
      super.update();
      this.updateDetails();
    }

    updateDetails() {
      if (this._detailsWindow) {
        const enemy = this._list[this.index()];
        this._detailsWindow.setEnemy(enemy);
      }
    }

    refresh() {
      this.createContents();
      this.drawAllItems();
    }

    /**
     * @param {number} index インデックス
     */
    drawItem(index) {
      const enemy = this._list[index];
      const rect = this.itemRect(index);
      const name = $gameSystem.isInBountyList(enemy) ? enemy.name : settings.unknownName;
      if ($gameSystem.isKilledBounty(enemy)) {
        this.changeTextColor(ColorManager.textColor(settings.textColorKilled));
      } else {
        this.changeTextColor(ColorManager.textColor(settings.textColorNormal));
      }
      this.drawText(name, rect.x, rect.y, rect.width);
      this.resetTextColor();
    }

    processCancel() {
      super.processCancel();
      Window_BountyListIndex.lastTopRow = this.topRow();
      Window_BountyListIndex.lastIndex = this.index();
    }
  }

  Window_BountyListIndex.lastTopRow = 0;
  Window_BountyListIndex.lastIndex = 0;

  /**
   * 賞金首詳細表示
   */
  class Window_BountyListDetails extends Window_Base {
    constructor(rect) {
      super(rect);
      this.initialize.apply(this, arguments);
    }

    initialize(rect) {
      super.initialize(rect);
      this._enemy = null;
      this._enemySprite = new Sprite();
      this._enemySprite.anchor.x = 0.5;
      this._enemySprite.anchor.y = 0.5;
      this._enemySprite.x = rect.width / 4 - 20;
      this._enemySprite.y = rect.height / 2;
      this.addChildToBack(this._enemySprite);
      this.refresh();
    }

    /**
     * @param {MZ.Enemy} enemy 敵データ
     */
    setEnemy(enemy) {
      if (this._enemy !== enemy) {
        this._enemy = enemy;
        this.refresh();
      }
    }

    update() {
      super.update();
      if (this._enemySprite.bitmap) {
        const bitmapHeight = this._enemySprite.bitmap.height;
        const contentsHeight = this.contents.height;
        const scale = bitmapHeight > contentsHeight ? contentsHeight / bitmapHeight : 1;
        this._enemySprite.scale.x = scale;
        this._enemySprite.scale.y = scale;
      }
    }

    refresh() {
      const enemy = this._enemy;
      const lineHeight = this.lineHeight();
      const NAME_X = 0;
      const NAME_Y = 0;

      this.contents.clear();

      if (!enemy || !$gameSystem.isInBountyList(enemy)) {
        this._enemySprite.bitmap = null;
        return;
      }

      const name = enemy.battlerName;
      const hue = enemy.battlerHue;
      this._enemySprite.bitmap = $gameSystem.isSideView()
        ? ImageManager.loadSvEnemy(name, hue)
        : ImageManager.loadEnemy(name, hue);

      this.resetTextColor();
      this.drawText(enemy.name, NAME_X, NAME_Y);

      const detailsWidth = 480;
      const x = this.contents.width - detailsWidth + settings.textOffsetX;
      const y = lineHeight + $gameSystem.windowPadding() + settings.textOffsetY;

      let lineCount = 0;

      settings.bountyInformations.forEach((info) => {
        if (enemy[info.tag]) {
          this.drawTextEx(
            info.text ? `${info.text}:${enemy[info.tag]}` : enemy[info.tag],
            x,
            y + lineHeight * lineCount,
            detailsWidth
          );
          lineCount++;
        }
      });
    }
  }
})();
