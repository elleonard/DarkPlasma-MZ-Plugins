/// <reference path="./RandomTroop.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { isEnemy } from '../../../common/data/isEnemy';
import type { CommandArgs_RandomTroop_randomTroop } from '../config/_build/DarkPlasma_RandomTroop_commands';
import { command_randomTroop, parseArgs_randomTroop } from "../config/_build/DarkPlasma_RandomTroop_commands";
import { settings } from '../config/_build/DarkPlasma_RandomTroop_parameters';

const PLUGIN_COMMAND_CODE = 357;

PluginManager.registerCommand(pluginName, command_randomTroop, function (args) {});

function DataManager_RandomTrooMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (isEnemy(data)) {
      data.typeTags = String(data.meta[settings.enemyTypeTag] || "").split(',')
        .filter(tag => !!tag)
        .map(tag => tag.trim());
    }
  };

  dataManager.enemiesWithTag = function (tag) {
    return $dataEnemies.filter(enemy => enemy?.typeTags.includes(tag));
  };
}

DataManager_RandomTrooMixIn(DataManager);

function Game_Troop_RandomTroopMixIn(gameTroop: Game_Troop) {
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
      const args: CommandArgs_RandomTroop_randomTroop = parseArgs_randomTroop(randomTroopCommand.parameters[3]);
      args.troop
        .map((spot, spotId) => {
          spot.enemyIds = this.randomTroopCandidateEnemyIds(spot.enemyIds, spot.tag, spotId);
          return spot;
        })
        .filter(spot => spot.rate > Math.randomInt(100))
        .forEach(spot => {
          this._enemies.push(new Game_Enemy(spot.enemyIds[Math.randomInt(spot.enemyIds.length)], 0, 0));
        });
      this.makeUniqueNames();
    }
  };

  gameTroop.randomTroopCommand = function () {
    return $dataTroops[this._troopId].pages[0].list.find(command => {
      return command.code === PLUGIN_COMMAND_CODE
        && command.parameters[1] === command_randomTroop;
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
    return enemyIds.concat(
      DataManager.enemiesWithTag(tag).map(data => data.id)
    ).filter(enemyId => this.randomTroopAdditionalFilter(enemyId, spotId));
  };

  /**
   * 抽選対象に対して追加でフィルタをかけたい場合の拡張用インターフェース
   */
  gameTroop.randomTroopAdditionalFilter = function (enemyId, spotId) {
    return true;
  };
}

Game_Troop_RandomTroopMixIn(Game_Troop.prototype);

function Game_Enemy_RandomTroopMixIn(gameEnemy: Game_Enemy) {
  gameEnemy.setScreenPosition = function (x, y) {
    this._screenX = x;
    this._screenY = y;
  };
}

Game_Enemy_RandomTroopMixIn(Game_Enemy.prototype);

function Scene_Battle_RandomTroopMixIn(sceneBattle: Scene_Battle) {
  const _start = sceneBattle.start;
  sceneBattle.start = function () {
    _start.call(this);
    if ($gameTroop.isRandomTroop()) {
      this._spriteset.repositionEnemies();
    }
  };
}

Scene_Battle_RandomTroopMixIn(Scene_Battle.prototype);

function Spriteset_Battle_RandomTroopMixIn(spritesetBattle: Spriteset_Battle) {
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
    let maxx: number = 0;
    let minx: number = Infinity;
    const enemyCount = this._enemySprites.length; // エネミーの数
    const enemyPerLine = Math.ceil(enemyCount / line); // 列あたりのエネミーの数
    this._enemySprites.forEach((sprite, index) => {
      const currentEnemyLine = Math.ceil((index + 1) / enemyPerLine); // 注目しているエネミーの列
      let x = Math.floor(
        (Graphics.boxWidth * (index % enemyPerLine)) / (enemyPerLine * 1.2) +
          (Graphics.boxWidth * currentEnemyLine) / (enemyPerLine * 1.2 * line)
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
    let positionCells: number[] = [];
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

function Sprite_Enemy_RandomTroopMixIn(spriteEnemy: Sprite_Enemy) {
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
      cellSizeX / 2
    );
  
    // Y軸は画像縦サイズの半分だけ下げる
    // 横並びの場合、若干縦軸をずらす
    // ただし、枠をはみ出ないようにする
    const offsetY = Math.min(
      Math.ceil(((this.bitmap?.height || 0) * this.scale.y) / 2) * (1 + partitionCellX / lineCount),
      cellSizeY / 2
    );
  
    this._homeX = cellSizeX * partitionCellX + cellSizeX / 2 + offsetX;
    this._homeY = cellSizeY * partitionCellY + cellSizeY / 2 + offsetY;
  };
}

Sprite_Enemy_RandomTroopMixIn(Sprite_Enemy.prototype);
