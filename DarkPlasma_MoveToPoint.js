// DarkPlasma_MoveToPoint 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/11/05 1.0.0 公開
 */

/*:ja
 * @plugindesc 指定座標にプレイヤーやイベントを移動させる
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command movePlayerTo
 * @text プレイヤーを移動する
 * @arg x
 * @text X座標
 * @type number
 * @arg y
 * @text Y座標
 * @type number
 * @arg skip
 * @text 移動できない場合飛ばす
 * @type boolean
 * @default false
 * @arg wait
 * @text 完了までウェイトする
 * @type boolean
 * @default true
 *
 * @command moveThisTo
 * @text このイベントを移動する
 * @arg x
 * @text X座標
 * @type number
 * @arg y
 * @text Y座標
 * @type number
 * @arg skip
 * @text 移動できない場合飛ばす
 * @type boolean
 * @default false
 * @arg wait
 * @text 完了までウェイトする
 * @type boolean
 * @default true
 *
 * @command moveEventTo
 * @text イベントを移動する
 * @arg eventId
 * @text イベントID
 * @type number
 * @min 1
 * @arg x
 * @text X座標
 * @type number
 * @arg y
 * @text Y座標
 * @type number
 * @arg skip
 * @text 移動できない場合飛ばす
 * @type boolean
 * @default false
 * @arg wait
 * @text 完了までウェイトする
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.0.0
 * 指定座標にプレイヤー、イベントを移動させるプラグインコマンドを提供します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_movePlayerTo(args) {
    return {
      x: Number(args.x || 0),
      y: Number(args.y || 0),
      skip: String(args.skip || false) === 'true',
      wait: String(args.wait || true) === 'true',
    };
  }

  function parseArgs_moveThisTo(args) {
    return {
      x: Number(args.x || 0),
      y: Number(args.y || 0),
      skip: String(args.skip || false) === 'true',
      wait: String(args.wait || true) === 'true',
    };
  }

  function parseArgs_moveEventTo(args) {
    return {
      eventId: Number(args.eventId || 0),
      x: Number(args.x || 0),
      y: Number(args.y || 0),
      skip: String(args.skip || false) === 'true',
      wait: String(args.wait || true) === 'true',
    };
  }

  const command_movePlayerTo = 'movePlayerTo';

  const command_moveThisTo = 'moveThisTo';

  const command_moveEventTo = 'moveEventTo';

  class ASterNode {
    constructor(x, y, realCost, parent) {
      this._x = x;
      this._y = y;
      this._realCost = realCost;
      this._parent = parent ?? null;
    }
    get x() {
      return this._x;
    }
    get y() {
      return this._y;
    }
    get realCost() {
      return this._realCost;
    }
    get parent() {
      return this._parent;
    }
    isGoal(goalX, goalY) {
      return this._x === goalX && this._y === goalY;
    }
    heuristicCost(goalX, goalY) {
      return $gameMap.distance(this.x, this.y, goalX, goalY);
    }
    totalCost(goalX, goalY) {
      return this._realCost + this.heuristicCost(goalX, goalY);
    }
  }
  PluginManager.registerCommand(pluginName, command_movePlayerTo, function (args) {
    const parsedArgs = parseArgs_movePlayerTo(args);
    this.moveCharacterTo(-1, parsedArgs.x, parsedArgs.y, parsedArgs.skip, parsedArgs.wait);
  });
  PluginManager.registerCommand(pluginName, command_moveEventTo, function (args) {
    const parsedArgs = parseArgs_moveEventTo(args);
    this.moveCharacterTo(parsedArgs.eventId, parsedArgs.x, parsedArgs.y, parsedArgs.skip, parsedArgs.wait);
  });
  PluginManager.registerCommand(pluginName, command_moveThisTo, function (args) {
    const parsedArgs = parseArgs_moveThisTo(args);
    this.moveCharacterTo(0, parsedArgs.x, parsedArgs.y, parsedArgs.skip, parsedArgs.wait);
  });
  function Game_Character_MoveToPointMixIn(gameCharacter) {
    /**
     * 目的地まで探索して経路を返す
     */
    gameCharacter.moveRouteListTo = function (x, y) {
      let openNodes = [new ASterNode(this.x, this.y, 0)];
      const closedNodes = [];
      while (openNodes.length > 0) {
        const node = openNodes.shift();
        closedNodes.push(node);
        if (node.isGoal(x, y)) {
          break;
        }
        [2, 4, 6, 8]
          .filter((dir) => this.canPass(node.x, node.y, dir))
          .forEach((dir) => {
            const newNode = new ASterNode(
              $gameMap.roundXWithDirection(node.x, dir),
              $gameMap.roundYWithDirection(node.y, dir),
              node.realCost + 1,
              node
            );
            const openNode = openNodes.find((openNode) => openNode.x === newNode.x && openNode.y === newNode.y);
            if (openNode) {
              if (openNode.realCost > newNode.realCost) {
                openNodes = openNodes.filter((node) => node !== openNode);
                openNodes.push(newNode);
              }
            } else if (closedNodes.every((closedNode) => closedNode.x !== newNode.x || closedNode.y !== newNode.y)) {
              openNodes.push(newNode);
            }
          });
        openNodes.sort((a, b) => a.totalCost(x, y) - b.totalCost(x, y));
      }
      const moveRouteList = [{ code: Game_Character.ROUTE_END }];
      for (let node = closedNodes.find((node) => node.isGoal(x, y)); node && node.parent; node = node.parent) {
        if (node.x > node.parent.x) {
          moveRouteList.push({ code: Game_Character.ROUTE_MOVE_RIGHT });
        } else if (node.x < node.parent.x) {
          moveRouteList.push({ code: Game_Character.ROUTE_MOVE_LEFT });
        } else if (node.y > node.parent.y) {
          moveRouteList.push({ code: Game_Character.ROUTE_MOVE_DOWN });
        } else if (node.y < node.parent.y) {
          moveRouteList.push({ code: Game_Character.ROUTE_MOVE_UP });
        }
      }
      return moveRouteList.reverse();
    };
  }
  Game_Character_MoveToPointMixIn(Game_Character.prototype);
  function Game_Interpreter_MoveToPointMixIn(gameInterpreter) {
    gameInterpreter.moveCharacterTo = function (characterId, x, y, skip, wait) {
      const character = this.character(characterId);
      if (character) {
        character.forceMoveRoute({
          list: character.moveRouteListTo(x, y),
          repeat: false,
          skippable: skip,
          wait: wait,
        });
        this._characterId = characterId;
        if (wait) {
          this.setWaitMode('route');
        }
      }
    };
  }
  Game_Interpreter_MoveToPointMixIn(Game_Interpreter.prototype);
})();
