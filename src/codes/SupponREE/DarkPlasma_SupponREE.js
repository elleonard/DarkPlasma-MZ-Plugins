import { pluginName } from './../../common/pluginName';
import { settings } from './_build/DarkPlasma_SupponREE_parameters';

const OLD_PLUGIN_COMMAND_CODE = 356;
const PLUGIN_COMMAND_CODE = 357;
const COMMAND_NAME = {
  FIXED_ENEMY_TYPE: 'fixedEnemyType',
  FIXED_ENEMY: 'fixedEnemy',
  RANDOM_ENCOUNTER: 'supponREE',
};

const _extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _extractMetadata.call(this, data);
  if (this.isEnemy(data)) {
    if (data.meta.EnemyType !== undefined) {
      data.enemyTypes = String(data.meta.EnemyType).split(' ');
    } else {
      data.enemyTypes = [];
    }
  }
};

DataManager.isEnemy = function (data) {
  return $dataEnemies && data && data.id && $dataEnemies.length > data.id && data === $dataEnemies[data.id];
};

DataManager.enemiesFromType = function (type) {
  return $dataEnemies.filter((enemy) => enemy && enemy.enemyTypes.includes(type));
};

PluginManagerEx.registerCommand(document.currentScript, COMMAND_NAME.RANDOM_ENCOUNTER, (args) => {
  args.randomEncounter.forEach((encounter) => {
    $gameTroop.processRandomEncounter(encounter.id, encounter.type, encounter.ratio);
  });
});

/**
 * 表示位置の設定
 * @param {number} X
 * @param {number} y
 */
Game_Enemy.prototype.setScreenPosition = function (x, y) {
  this._screenX = x;
  this._screenY = y;
};

const _Game_Troop_setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function (troopId) {
  this.clear();
  this._troopId = troopId;
  // バトルイベントによるランダムエンカウント処理
  this.supponReUsed = false;
  this.processLegacySupponREE();
  this.processSupponREE();
  if (this.supponReUsed) {
    this.makeUniqueNames();
  } else {
    _Game_Troop_setup.call(this, troopId);
  }
};

/**
 * 旧形式のSupponREEプラグインコマンドを処理する（互換用）
 */
Game_Troop.prototype.processLegacySupponREE = function () {
  let enemyCount = 0;
  const lists = $dataTroops[this._troopId].pages[0].list;
  const fixedEnemyTypeCommand = lists.find((list) => {
    return (
      !!list.parameters[0] &&
      list.code === OLD_PLUGIN_COMMAND_CODE &&
      list.parameters[0].split(' ')[0] === COMMAND_NAME.FIXED_ENEMY_TYPE
    );
  });
  if (fixedEnemyTypeCommand && fixedEnemyTypeCommand.parameters[0].split(' ').length > 1) {
    const enemyTypes = fixedEnemyTypeCommand.parameters[0].split(' ').slice(1);
    enemyTypes
      .filter((enemyType) => {
        return DataManager.enemiesFromType(enemyType).length > 0;
      })
      .forEach((enemyType) => {
        const enemies = DataManager.enemiesFromType(enemyType);
        const enemyId = enemies[Math.randomInt(enemies.length)].id;
        this._enemies.push(new Game_Enemy(enemyId, 0, 0));
        enemyCount++;
      });
  }
  const fixedEnemyCommand = lists.find((list) => {
    return (
      !!list.parameters[0] &&
      list.code === OLD_PLUGIN_COMMAND_CODE &&
      list.parameters[0].split(' ')[0] === COMMAND_NAME.FIXED_ENEMY
    );
  });
  if (fixedEnemyCommand && fixedEnemyCommand.parameters[0].split(' ').length > 1) {
    const enemyIds = fixedEnemyCommand.parameters[0].split(' ').slice(1);
    enemyIds.forEach((enemyId) => this._enemies.push(new Game_Enemy(enemyId, 0, 0))); // 暫定で0, 0にセット
    enemyCount += enemyIds.length;
  }
  const randomEnemyCommand = lists.find((list) => {
    return (
      !!list.parameters[0] &&
      list.code === OLD_PLUGIN_COMMAND_CODE &&
      list.parameters[0].split(' ')[0] === COMMAND_NAME.RANDOM_ENCOUNTER
    );
  });
  if (randomEnemyCommand && randomEnemyCommand.parameters[0].split(' ').length > 2) {
    const commandArgs = randomEnemyCommand.parameters[0].split(' ').slice(1);
    const ratio = commandArgs[0];
    const times = commandArgs[1];
    const enemyIds = commandArgs.slice(2);
    for (let i = 0; i < times; i++) {
      if (ratio > Math.randomInt(100) || enemyCount === 0) {
        const enemyId = enemyIds[Math.randomInt(enemyIds.length)];
        this._enemies.push(new Game_Enemy(enemyId, 0, 0)); // 暫定で0, 0にセット
        enemyCount++;
      }
    }
    this.supponReUsed = true;
    return;
  }
  return;
};

/**
 * 新形式のランダム出現設定を処理する
 * プラグインコマンド本来の使い方とズレておりダーティだが、
 * 敵グループ画面から設定させるにはこれが最もやりやすい
 */
Game_Troop.prototype.processSupponREE = function () {
  const lists = $dataTroops[this._troopId].pages[0].list;
  const randomEncounterCommand = lists.find((list) => {
    return (
      list.parameters.length >= 4 &&
      list.code === PLUGIN_COMMAND_CODE &&
      list.parameters[1] === COMMAND_NAME.RANDOM_ENCOUNTER
    );
  });
  this._processSupponREE = true;
  if (randomEncounterCommand) {
    PluginManager.callCommand(
      this._interpreter,
      pluginName,
      COMMAND_NAME.RANDOM_ENCOUNTER,
      randomEncounterCommand.parameters[3]
    );
  }
  this._processSupponREE = false;
};

/**
 * 新形式のランダム出現設定を処理する
 * @param {number} enemyId 敵キャラID
 * @param {string} enemyType 敵キャラ種族
 * @param {number} ratio 出現確率（％）
 */
Game_Troop.prototype.processRandomEncounter = function (enemyId, enemyType, ratio) {
  if (!this._processSupponREE) {
    return;
  }
  if (ratio > Math.randomInt(100)) {
    if (enemyId) {
      this._enemies.push(new Game_Enemy(enemyId, 0, 0));
      this.supponReUsed = true;
    } else if (enemyType) {
      const candidates = DataManager.enemiesFromType(enemyType);
      if (candidates.length > 0) {
        this._enemies.push(new Game_Enemy(candidates[Math.randomInt(candidates.length)], 0, 0));
        this.supponReUsed = true;
      }
    }
  }
};

/**
 * 敵画像を配置する
 */
Spriteset_Battle.prototype.supponReLinedUpEnemy = function () {
  const depth = Math.round(Graphics.boxHeight * 0.15); // エネミーのいる列によって生じる奥行き表現をするためのY補正用数値
  const base_y = Math.round(Graphics.boxHeight * 0.98);
  this._enemySprites.forEach((sprite) => sprite.updateBitmap());
  this._enemySprites.reverse();
  // 全スプライトの表示横幅合計
  const whole_x = this._enemySprites
    .map((sprite) => Math.ceil(sprite.bitmap.width * sprite.scale.x))
    .reduce((accumlator, current) => accumlator + current, 0);
  const line = Math.floor(whole_x / settings.autoPositionWidth) + 1; // 横列数
  let maxx = null;
  let minx = null;
  const enemyCount = this._enemySprites.length; // エネミーの数
  const enemyPerLine = Math.ceil(enemyCount / line); // 列あたりのエネミーの数
  this._enemySprites.forEach((sprite, index) => {
    const currentEnemyLine = Math.ceil((index + 1) / enemyPerLine); // 注目しているエネミーの列
    let x = Math.floor(
      (Graphics.boxWidth * (index % enemyPerLine)) / (enemyPerLine * 1.2) +
        (Graphics.boxWidth * currentEnemyLine) / (enemyPerLine * 1.2 * line)
    );
    let y = base_y - depth - Math.ceil(depth * Math.pow(0.7, currentEnemyLine));
    sprite.setHome(x, y);
    if (maxx === null) {
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

/**
 * 敵画像を配置する
 */
Spriteset_Battle.prototype.supponReLinedUpEnemySV = function () {
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
    sprite.calcHomePositionForSideView(line, positionCells[index]);
    sprite.feedbackPositionToEnemy();
  });
};

/**
 * サイドビューにおける敵画像の位置を計算する
 * @param {number} lineCount 配置する行・列数
 * @param {number} positionCellIndex 位置ID
 */
Sprite_Enemy.prototype.calcHomePositionForSideView = function (lineCount, positionCellIndex) {
  const cellSizeX = 580 / lineCount;
  const cellSizeY = (Graphics.boxHeight * 2) / 3 / lineCount;
  const partitionCellX = positionCellIndex % lineCount;
  const partitionCellY = Math.floor(positionCellIndex / lineCount);

  // 縦並びの場合、若干横軸をずらす
  // ただし、枠をはみ出ないようにする
  const offsetX = Math.min(
    Math.ceil((this.bitmap.height * this.scale.y) / 2) * (partitionCellY / lineCount),
    cellSizeX / 2
  );

  // Y軸は画像縦サイズの半分だけ下げる
  // 横並びの場合、若干縦軸をずらす
  // ただし、枠をはみ出ないようにする
  const offsetY = Math.min(
    Math.ceil((this.bitmap.height * this.scale.y) / 2) * (1 + partitionCellX / lineCount),
    cellSizeY / 2
  );

  this._homeX = cellSizeX * partitionCellX + cellSizeX / 2 + offsetX;
  this._homeY = cellSizeY * partitionCellY + cellSizeY / 2 + offsetY;
};

/**
 * 画像のX座標を左にずらす
 * @param {number} shift
 */
Sprite_Enemy.prototype.shiftXLeft = function (shiftX) {
  this._homeX -= shiftX;
  this.updatePosition();
};

Sprite_Enemy.prototype.feedbackPositionToEnemy = function () {
  if (this._enemy) {
    this._enemy.setScreenPosition(this._homeX, this._homeY);
  }
};

const _Scene_Battle_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function () {
  _Scene_Battle_start.call(this);
  if ($gameTroop.supponReUsed) {
    if ($gameSystem.isSideView()) {
      this._spriteset.supponReLinedUpEnemySV();
    } else {
      this._spriteset.supponReLinedUpEnemy();
    }
  }
};
