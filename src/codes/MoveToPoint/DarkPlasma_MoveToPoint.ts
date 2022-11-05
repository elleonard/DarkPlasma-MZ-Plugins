/// <reference path="./MoveToPoint.d.ts" />

import { pluginName } from '../../common/pluginName';
import { command_moveEventTo, command_movePlayerTo, command_moveThisTo, parseArgs_moveEventTo, parseArgs_movePlayerTo, parseArgs_moveThisTo } from './_build/DarkPlasma_MoveToPoint_commands';

class ASterNode {
  _x: number;
  _y: number;
  _realCost: number;
  _parent: ASterNode | null;

  constructor(x: number, y: number, realCost: number, parent?: ASterNode) {
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

  isGoal(goalX: number, goalY: number) {
    return this._x === goalX && this._y === goalY;
  }

  heuristicCost(goalX: number, goalY: number) {
    return $gameMap.distance(this.x, this.y, goalX, goalY);
  }

  totalCost(goalX: number, goalY: number) {
    return this._realCost + this.heuristicCost(goalX, goalY);
  }
}

PluginManager.registerCommand(pluginName, command_movePlayerTo, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_movePlayerTo(args);
  this.moveCharacterTo(-1, parsedArgs.x, parsedArgs.y, parsedArgs.skip, parsedArgs.wait);
});

PluginManager.registerCommand(pluginName, command_moveEventTo, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_moveEventTo(args);
  this.moveCharacterTo(parsedArgs.eventId, parsedArgs.x, parsedArgs.y, parsedArgs.skip, parsedArgs.wait);
});

PluginManager.registerCommand(pluginName, command_moveThisTo, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_moveThisTo(args);
  this.moveCharacterTo(0, parsedArgs.x, parsedArgs.y, parsedArgs.skip, parsedArgs.wait);
});

function Game_Character_MoveToPointMixIn(gameCharacter: Game_Character) {
  /**
   * 目的地まで探索して経路を返す
   */
  gameCharacter.moveRouteListTo = function (x, y) {
    let openNodes = [new ASterNode(this.x, this.y, 0)];
    const closedNodes: ASterNode[] = [];

    while (openNodes.length > 0) {
      const node = openNodes.shift()!;
      closedNodes.push(node);
      if (node.isGoal(x, y)) {
        break;
      }
      [2, 4, 6, 8].filter(dir => this.canPass(node.x, node.y, dir))
        .forEach(dir => {
          const newNode = new ASterNode(
            $gameMap.roundXWithDirection(node.x, dir),
            $gameMap.roundYWithDirection(node.y, dir),
            node.realCost + 1,
            node
          );

          const openNode = openNodes.find(openNode => openNode.x === newNode.x && openNode.y === newNode.y);
          if (openNode) {
            if (openNode.realCost > newNode.realCost) {
              openNodes = openNodes.filter(node => node !== openNode);
              openNodes.push(newNode);
            }
          } else if (closedNodes.every(closedNode => closedNode.x !== newNode.x || closedNode.y !== newNode.y)) {
            openNodes.push(newNode);
          }
        });
      openNodes.sort((a, b) => a.totalCost(x, y) - b.totalCost(x, y));
    }
    const moveRouteList: MZ.MoveCommand[] = [{ code: Game_Character.ROUTE_END }];
    for (let node = closedNodes.find(node => node.isGoal(x, y))!; node && node.parent; node = node.parent) {
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

function Game_Interpreter_MoveToPointMixIn(gameInterpreter: Game_Interpreter) {
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
        this.setWaitMode("route");
      }
    }
  };
}

Game_Interpreter_MoveToPointMixIn(Game_Interpreter.prototype);
