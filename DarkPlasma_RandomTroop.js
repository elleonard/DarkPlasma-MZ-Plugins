// DarkPlasma_RandomTroop 1.3.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/02/18 1.3.0 敵キャラY座標オフセット設定を追加
 *            1.2.1 変数の命名を修正
 *            1.2.0 抽選枠の追加フィルタ用拡張インターフェースを追加
 * 2026/02/17 1.1.1 configをTypeScript移行
 * 2024/12/19 1.1.0 種別による敵キャラデータ一覧取得インターフェース追加
 * 2023/10/24 1.0.2 ランダム出現フラグのキャッシュが戦闘ごとにクリアされない不具合を修正
 *            1.0.1 DarkPlasma_EnemyBookとの依存関係を明記
 * 2023/08/21 1.0.0 公開
 */

/*:
 * @plugindesc 敵グループ構成のランダム化
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderBefore DarkPlasma_EnemyBook
 *
 * @param autoPositionWidth
 * @desc 自動配置の際、前後に動かす際の横幅の閾値を設定します。敵キャラ画像の横幅合計がこれより大きい場合、敵配置を前後にバラけさせます。
 * @text 自動配置横幅
 * @type number
 * @default 816
 *
 * @param offsetY
 * @desc 敵キャラを全体的に上下に動かします。増やすほど下に移動します。
 * @text 敵キャラY座標オフセット
 * @type number
 * @min -1000
 * @default 0
 *
 * @param enemyTypeTag
 * @desc 敵種別を判定するためのメモタグ名を指定します。
 * @text 敵種別タグ
 * @type string
 * @default enemyType
 *
 * @command randomTroop
 * @text ランダム構成設定
 * @desc 敵グループバトルイベントの1ページ目で使用すると、遭遇時にグループ構成をランダムに決定します。
 * @arg troop
 * @desc 任意の数の抽選枠を設定します。
 * @text 抽選枠設定
 * @type struct<RandomTroopEnemy>[]
 * @default []
 *
 * @help
 * version: 1.3.0
 * 敵グループのバトルイベント設定
 * 1ページ目でプラグインコマンドを設定することにより、
 * 設定内容に応じて遭遇時に敵グループの構成をランダムに決定します。
 *
 * 抽選枠を任意の数指定することができ、指定した数だけ出現判定を行います。
 * ある抽選枠が出現する判定となった場合、
 * その抽選枠に含まれる敵キャラリストの中から
 * ランダムで1体の敵キャラが出現します。
 *
 * 敵種別を敵キャラのメモ欄で指定し、
 * その種別を抽選枠に追加することも可能です。
 * 敵種別のメモタグはデフォルト設定では enemyType となっています。
 *
 * 例:
 * <enemyType:スライム族LV1>
 *
 * 種別はカンマ区切りで複数指定することも可能です。
 * <enemyType:スライム族LV1,スライム族LV2>
 *
 * 下記プラグインと共に利用する場合、それよりも上に追加してください。
 * DarkPlasma_EnemyBook
 */
/*~struct~RandomTroopEnemy:
 * @param name
 * @desc 抽選枠の名前を指定します。挙動には影響しません。管理しやすい名前をつけてください。
 * @text 抽選枠名(省略可)
 * @type string
 *
 * @param enemyIds
 * @desc 抽選枠に指定した敵キャラを追加します。
 * @text 敵キャラリスト
 * @type enemy[]
 * @default []
 *
 * @param tag
 * @desc 抽選枠に指定した敵種別メモタグを記述した敵キャラを追加します。
 * @text 敵種別
 * @type string
 *
 * @param rate
 * @desc この抽選枠が出現する確率を指定します。
 * @text 抽選確率（％）
 * @type number
 * @max 100
 * @default 100
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function isEnemy(data) {
    return $dataEnemies && $dataEnemies.includes(data);
  }

  function parseArgs_randomTroop(args) {
    return {
      troop: args.troop
        ? JSON.parse(args.troop).map((e) => {
            return e
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    name: String(parsed.name || ``),
                    enemyIds: parsed.enemyIds
                      ? JSON.parse(parsed.enemyIds).map((e) => {
                          return Number(e || 0);
                        })
                      : [],
                    tag: String(parsed.tag || ``),
                    rate: Number(parsed.rate || 100),
                  };
                })(e)
              : { name: '', enemyIds: [], tag: '', rate: 100 };
          })
        : [],
    };
  }

  const command_randomTroop = 'randomTroop';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    autoPositionWidth: Number(pluginParameters.autoPositionWidth || 816),
    offsetY: Number(pluginParameters.offsetY || 0),
    enemyTypeTag: String(pluginParameters.enemyTypeTag || `enemyType`),
  };

  const PLUGIN_COMMAND_CODE = 357;
  PluginManager.registerCommand(pluginName, command_randomTroop, function (args) {});
  function DataManager_RandomTrooMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (isEnemy(data)) {
        data.typeTags = String(data.meta[settings.enemyTypeTag] || '')
          .split(',')
          .filter((tag) => !!tag)
          .map((tag) => tag.trim());
      }
    };
    dataManager.enemiesWithTag = function (tag) {
      return $dataEnemies.filter((enemy) => enemy?.typeTags.includes(tag));
    };
  }
  DataManager_RandomTrooMixIn(DataManager);
  function Game_Troop_RandomTroopMixIn(gameTroop) {
    const _setup = gameTroop.setup;
    gameTroop.setup = function (troopId) {
      this._troopId = troopId;
      this._isRandomTroop = undefined;
      if (this.isRandomTroop()) {
        const _makeUniqueNames = this.makeUniqueNames;
        this.makeUniqueNames = () => {};
        /**
         * PictureCommonCall.jsなど、setupをフックするプラグインとの競合回避用に呼ぶだけ呼んでおく
         */
        _setup.call(this, troopId);
        /**
         * ランダム出現の場合は通常の遭遇結果を無視し、敵グループ編成を再構築する
         */
        this._enemies = [];
        this.processRandomTroop();
        this.makeUniqueNames = _makeUniqueNames;
      } else {
        _setup.call(this, troopId);
      }
    };
    gameTroop.processRandomTroop = function () {
      const randomTroopCommand = this.randomTroopCommand();
      if (randomTroopCommand) {
        const args = parseArgs_randomTroop(randomTroopCommand.parameters[3]);
        args.troop
          .map((spot, spotId) => {
            spot.enemyIds = this.randomTroopCandidateEnemyIds(spot.enemyIds, spot.tag, spotId);
            return spot;
          })
          .filter((spot) => spot.rate > Math.randomInt(100))
          .forEach((spot) => {
            this._enemies.push(new Game_Enemy(spot.enemyIds[Math.randomInt(spot.enemyIds.length)], 0, 0));
          });
        this.makeUniqueNames();
      }
    };
    gameTroop.randomTroopCommand = function () {
      return $dataTroops[this._troopId].pages[0].list.find((command) => {
        return command.code === PLUGIN_COMMAND_CODE && command.parameters[1] === command_randomTroop;
      });
    };
    gameTroop.isRandomTroop = function () {
      if (this._isRandomTroop === undefined) {
        this._isRandomTroop = this.randomTroopCommand() !== undefined;
      }
      return this._isRandomTroop;
    };
    /**
     * その抽選枠で選ばれる可能性のある敵キャラID一覧を返す
     */
    gameTroop.randomTroopCandidateEnemyIds = function (enemyIds, tag, spotId) {
      return enemyIds
        .concat(DataManager.enemiesWithTag(tag).map((data) => data.id))
        .filter((enemyId) => this.randomTroopAdditionalFilter(enemyId, spotId));
    };
    /**
     * 抽選対象に対して追加でフィルタをかけたい場合の拡張用インターフェース
     */
    gameTroop.randomTroopAdditionalFilter = function (enemyId, spotId) {
      return true;
    };
  }
  Game_Troop_RandomTroopMixIn(Game_Troop.prototype);
  function Game_Enemy_RandomTroopMixIn(gameEnemy) {
    gameEnemy.setScreenPosition = function (x, y) {
      this._screenX = x;
      this._screenY = y;
    };
  }
  Game_Enemy_RandomTroopMixIn(Game_Enemy.prototype);
  function Scene_Battle_RandomTroopMixIn(sceneBattle) {
    const _start = sceneBattle.start;
    sceneBattle.start = function () {
      _start.call(this);
      if ($gameTroop.isRandomTroop()) {
        this._spriteset.repositionEnemies();
      }
    };
  }
  Scene_Battle_RandomTroopMixIn(Scene_Battle.prototype);
  function Spriteset_Battle_RandomTroopMixIn(spritesetBattle) {
    spritesetBattle.repositionEnemies = function () {
      if ($gameSystem.isSideView()) {
        this.repositionEnemiesForSideView();
      } else {
        this.repositionEnemiesForFrontView();
      }
    };
    spritesetBattle.repositionEnemiesForFrontView = function () {
      const depth = Math.round(Graphics.boxHeight * 0.15); // エネミーのいる列によって生じる奥行き表現をするためのY補正用数値
      const base_y = Math.round(Graphics.boxHeight * 0.98);
      this._enemySprites.forEach((sprite) => sprite.updateBitmap());
      this._enemySprites.reverse();
      // 全スプライトの表示横幅合計
      const whole_x = this._enemySprites
        .map((sprite) => Math.ceil((sprite.bitmap?.width || 0) * sprite.scale.x))
        .reduce((accumlator, current) => accumlator + current, 0);
      const line = Math.floor(whole_x / settings.autoPositionWidth) + 1; // 横列数
      let maxx = 0;
      let minx = Infinity;
      const enemyCount = this._enemySprites.length; // エネミーの数
      const enemyPerLine = Math.ceil(enemyCount / line); // 列あたりのエネミーの数
      this._enemySprites.forEach((sprite, index) => {
        const currentEnemyLine = Math.ceil((index + 1) / enemyPerLine); // 注目しているエネミーの列
        let x = Math.floor(
          (Graphics.boxWidth * (index % enemyPerLine)) / (enemyPerLine * 1.2) +
            (Graphics.boxWidth * currentEnemyLine) / (enemyPerLine * 1.2 * line),
        );
        let y = base_y - depth - Math.ceil(depth * Math.pow(0.7, currentEnemyLine)) + settings.offsetY;
        sprite.setHome(x, y);
        if (maxx === 0 || minx === Infinity) {
          maxx = x;
          minx = x;
        }
        if (maxx < x) {
          maxx = x;
        }
        if (minx > x) {
          minx = x;
        }
      });
      const shiftx = (maxx + minx) / 2 - Graphics.boxWidth / 2;
      this._enemySprites.forEach((sprite) => {
        sprite.shiftXLeft(shiftx);
        // 計算した座標をセットする
        sprite.feedbackPositionToEnemy();
      });
    };
    spritesetBattle.repositionEnemiesForSideView = function () {
      this._enemySprites.forEach((sprite) => sprite.updateBitmap());
      // 全座標同一なので、スプライトIDが大きい順にならんでいる。逆順のほうが直感的であるため、reverse
      this._enemySprites.reverse();
      // 画面分割数
      const enemyCount = this._enemySprites.length;
      let partitionCount = 1; // 画面分割数
      let line = 1; // 行・列数
      while (partitionCount < enemyCount) {
        line++;
        partitionCount = Math.pow(line, 2);
      }
      // どのセルに配置するか決める
      let positionCells = [];
      if (enemyCount === 2) {
        // 2匹の場合、右上と左下
        positionCells = [1, 2];
      } else if (enemyCount === 5) {
        // 5匹の場合、鳳天舞の陣
        positionCells = [0, 2, 4, 6, 8];
      } else if (enemyCount === 6) {
        // 6匹の場合、ホーリーウォール
        positionCells = [0, 2, 3, 5, 6, 8];
      } else {
        // それ以外の場合は左上から順に詰める
        positionCells = [...Array(enemyCount).keys()];
      }
      this._enemySprites.forEach((sprite, index) => {
        sprite.repositionForSideView(line, positionCells[index]);
        sprite.feedbackPositionToEnemy();
      });
    };
  }
  Spriteset_Battle_RandomTroopMixIn(Spriteset_Battle.prototype);
  function Sprite_Enemy_RandomTroopMixIn(spriteEnemy) {
    spriteEnemy.shiftXLeft = function (shiftX) {
      this._homeX -= shiftX;
      this.updatePosition();
    };
    spriteEnemy.feedbackPositionToEnemy = function () {
      if (this._enemy) {
        this._enemy.setScreenPosition(this._homeX, this._homeY);
      }
    };
    spriteEnemy.repositionForSideView = function (lineCount, positionCellIndex) {
      const cellSizeX = 580 / lineCount;
      const cellSizeY = (Graphics.boxHeight * 2) / 3 / lineCount;
      const partitionCellX = positionCellIndex % lineCount;
      const partitionCellY = Math.floor(positionCellIndex / lineCount);
      // 縦並びの場合、若干横軸をずらす
      // ただし、枠をはみ出ないようにする
      const offsetX = Math.min(
        Math.ceil(((this.bitmap?.height || 0) * this.scale.y) / 2) * (partitionCellY / lineCount),
        cellSizeX / 2,
      );
      // Y軸は画像縦サイズの半分だけ下げる
      // 横並びの場合、若干縦軸をずらす
      // ただし、枠をはみ出ないようにする
      const offsetY = Math.min(
        Math.ceil(((this.bitmap?.height || 0) * this.scale.y) / 2) * (1 + partitionCellX / lineCount),
        cellSizeY / 2,
      );
      this._homeX = cellSizeX * partitionCellX + cellSizeX / 2 + offsetX;
      this._homeY = cellSizeY * partitionCellY + cellSizeY / 2 + offsetY;
    };
  }
  Sprite_Enemy_RandomTroopMixIn(Sprite_Enemy.prototype);
})();
