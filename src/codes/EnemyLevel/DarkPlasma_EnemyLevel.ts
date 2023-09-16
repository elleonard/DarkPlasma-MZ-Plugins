/// <reference path="./EnemyLevel.d.ts" />

import { settings } from "./_build/DarkPlasma_EnemyLevel_parameters";

function Game_Enemy_LevelMixIn(gameEnemy: Game_Enemy) {
  Object.defineProperty(gameEnemy, "level", {
    get: function () {
      return this._level;
    },
    configurable: true,
  });

  const _setup = gameEnemy.setup;
  gameEnemy.setup = function (enemyId, x, y) {
    this._level = Number($dataEnemies[enemyId].meta.level || settings.defaultLevel);
    _setup.call(this, enemyId, x, y);
  };
}

Game_Enemy_LevelMixIn(Game_Enemy.prototype);
