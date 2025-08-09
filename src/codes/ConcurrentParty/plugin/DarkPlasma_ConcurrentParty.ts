/// <reference path="./ConcurrentParty.d.ts" />

import { settings } from '../config/_build/DarkPlasma_ConcurrentParty_parameters';
import { command_devideParty, command_isPartyDevided, command_joinAllMember, command_leaderId, command_nextParty, command_partyIndex, command_partyPosition, command_previousParty, parseArgs_devideParty, parseArgs_isPartyDevided, parseArgs_leaderId, parseArgs_nextParty, parseArgs_partyIndex, parseArgs_partyPosition, parseArgs_previousParty } from '../config/_build/DarkPlasma_ConcurrentParty_commands';
import { pluginName } from '../../../common/pluginName';

PluginManager.registerCommand(pluginName, command_devideParty, function (args) {
  if ($gameParty.isDevided()) {
    return;
  }
  const parsedArgs = parseArgs_devideParty(args);
  const devidedParties = parsedArgs.parties.map(party => {
    const devidedParty = new Game_DevidedParty();
    party.actorIds
      .map(actorId => $gameActors.actor(actorId))
      .filter((actor): actor is Game_Actor => !!actor && actor.index() >= 0)
      .forEach(actor => devidedParty.addMember(actor));
    devidedParty.setPosition({
      mapId: party.location.mapId,
      x: party.location.x,
      y: party.location.y,
      direction: party.direction,
    });
    return devidedParty;
  }).filter(party => party.isValid());
  if (devidedParties.length > 1) {
    $gameParty.devidePartyInto({
      parties: devidedParties,
      currentIndex: 0,
    });
  }
});

PluginManager.registerCommand(pluginName, command_nextParty, function (args) {
  $gameParty.changeToNextParty(parseArgs_nextParty(args));
});

PluginManager.registerCommand(pluginName, command_previousParty, function (args) {
  $gameParty.changeToPreviousParty(parseArgs_previousParty(args));
});

PluginManager.registerCommand(pluginName, command_joinAllMember, function () {
  $gameParty.joinAllDevidedParties();
});

PluginManager.registerCommand(pluginName, command_leaderId, function (args) {
  const parsedArgs = parseArgs_leaderId(args);
  if ($gameParty.isDevided()) {
    const party = $gameParty.devidedParty(parsedArgs.partyIndex);
    if (party) {
      $gameVariables.setValue(parsedArgs.variableId, party.leader()?.actorId() || 0);
    }
  }
});

PluginManager.registerCommand(pluginName, command_partyIndex, function (args) {
  const parsedArgs = parseArgs_partyIndex(args);
  if ($gameParty.isDevided()) {
    const index = $gameParty.currentPartyIndex();
    if (index !== undefined) {
      $gameVariables.setValue(parsedArgs.variableId, index);
    }
  }
});

PluginManager.registerCommand(pluginName, command_partyPosition, function (args) {
  const parsedArgs = parseArgs_partyPosition(args);
  if ($gameParty.isDevided()) {
    const party = $gameParty.devidedParty(parsedArgs.partyIndex);
    if (party) {
      $gameVariables.setValue(parsedArgs.mapIdVariableId, party.position.mapId);
      $gameVariables.setValue(parsedArgs.xVariableId, party.position.x);
      $gameVariables.setValue(parsedArgs.yVariableId, party.position.y);
      $gameVariables.setValue(parsedArgs.directionVariableId, party.position.direction);
    }
  }
});

PluginManager.registerCommand(pluginName, command_isPartyDevided, function (args) {
  const paresdArgs = parseArgs_isPartyDevided(args);
  $gameSwitches.setValue(paresdArgs.switchId, $gameParty.isDevided());
});

function Game_Temp_ConcurrentPartyMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._changePartyQueue = [];
  };

  gameTemp.enqueueChangePartyProcess = function (process) {
    this._changePartyQueue.push(process);
  };

  gameTemp.dequeueChangePartyProcess = function () {
    return this._changePartyQueue.shift();
  };
}

Game_Temp_ConcurrentPartyMixIn(Game_Temp.prototype);

function Game_Screen_ConcurrentPartyMixIn(gameScreen: Game_Screen) {
  gameScreen.isFadeBusy = function () {
    return this._fadeInDuration > 0 || this._fadeOutDuration > 0;
  };
}

Game_Screen_ConcurrentPartyMixIn(Game_Screen.prototype);

function Game_Party_ConcurrentPartyMixIn(gameParty: Game_Party) {
  gameParty.devidePartyInto = function (devidedParties) {
    this._devidedParties = devidedParties;
    this.currentParty()?.transferTo(0);
  };

  gameParty.devidedParties = function () {
    return this._devidedParties;
  };

  gameParty.devidedParty = function (index) {
    if (!this._devidedParties) {
      return undefined;
    }
    return this._devidedParties.parties[index];
  };

  gameParty.currentParty = function () {
    return this._devidedParties
      ? this.devidedParty(this._devidedParties.currentIndex)
      : undefined;
  };

  gameParty.currentPartyIndex = function () {
    return this._devidedParties
      ? this._devidedParties.currentIndex
      : undefined;
  };

  gameParty.changeToNextParty = function (param) {
    if (this._devidedParties) {
      this.currentParty()?.updatePosition();
      this._devidedParties.currentIndex = (this._devidedParties.currentIndex + 1) % this._devidedParties.parties.length;
      this.onPartyChanged(param);
    }
  };

  gameParty.changeToPreviousParty = function (param) {
    if (this._devidedParties) {
      this.currentParty()?.updatePosition();
      this._devidedParties.currentIndex = (this._devidedParties.currentIndex + this._devidedParties.parties.length - 1) % this._devidedParties.parties.length;
      this.onPartyChanged(param);
    }
  };

  gameParty.onPartyChanged = function (param) {
    if (param.autoFadeOut) {
      $gameTemp.enqueueChangePartyProcess("fadeOut");
    }
    $gameTemp.enqueueChangePartyProcess("transfer");
    if (settings.commonEvent) {
      $gameTemp.enqueueChangePartyProcess("commonEvent");
    }
    if (param.autoFadeIn) {
      $gameTemp.enqueueChangePartyProcess("fadeIn");
    }
  };

  gameParty.joinAllDevidedParties = function () {
    this._devidedParties = undefined;
    $gamePlayer.refresh();
  };

  gameParty.isDevided = function () {
    return !!this.devidedParties();
  };

  const _allMembers = gameParty.allMembers;
  gameParty.allMembers = function () {
    return this.isDevided()
      ? this.currentParty()!.allMembers()
      : _allMembers.call(this);
  };

  const _swapOrder = gameParty.swapOrder;
  gameParty.swapOrder = function (index1, index2) {
    if (this.isDevided()) {
      this.currentParty()?.swapOrder(index1, index2);
    } else {
      _swapOrder.call(this, index1, index2);
    }
  };

  const _addActor = gameParty.addActor;
  gameParty.addActor = function (actorId) {
    _addActor.call(this, actorId);
    const actor = $gameActors.actor(actorId);
    if (actor && this.isDevided() && !this.currentParty()?.includesActor(actor)) {
      this.currentParty()?.addMember(actor);
    }
  };

  const _removeActor = gameParty.removeActor;
  gameParty.removeActor = function (actorId) {
    const actor = $gameActors.actor(actorId);
    if (actor && this.isDevided()) {
      this.currentParty()?.removeMember(actor);
    }
    _removeActor.call(this, actorId);
  };
}

Game_Party_ConcurrentPartyMixIn(Game_Party.prototype);

class Game_DevidedParty {
  _members: (Game_Actor|undefined)[];
  _position: Game_DevidedPartyPosition;

  constructor() {
    this._members = [];
    this._position = {
      mapId: 0,
      x: 0,
      y: 0,
      direction: 0,
    };
  }

  get position() {
    return this._position;
  }

  isValid() {
    return this._members.length > 0;
  }

  setPosition(position: Game_DevidedPartyPosition): void {
    this._position = position;
  }

  updatePosition() {
    this._position.mapId = $gameMap.mapId();
    this._position.x = $gamePlayer.x;
    this._position.y = $gamePlayer.y;
    this._position.direction = $gamePlayer.direction();
  }

  addMember(actor: Game_Actor): void {
    this._members.push(actor);
  }

  setMember(actor: Game_Actor|undefined, index: number) {
    this._members[index] = actor;
  }

  removeMember(actor: Game_Actor): void {
    this._members = this._members.filter(member => member?.actorId() !== actor.actorId());
  }

  includesActor(actor: Game_Actor): boolean {
    return this._members.some(member => member?.actorId() === actor.actorId());
  }

  actor(index: number): Game_Actor|undefined {
    return this._members[index];
  }

  leader(): Game_Actor|undefined {
    return this._members.find(actor => actor);
  }

  allMembers(): Game_Actor[] {
    return this._members.filter((actor): actor is Game_Actor => !!actor);
  }

  allMembersWithSpace(): (Game_Actor|undefined)[] {
    return this._members;
  }

  transferTo(fadeType: number): void {
    $gamePlayer.reserveTransfer(
      this.position.mapId,
      this.position.x,
      this.position.y,
      this.position.direction,
      fadeType
    );
  }

  swapOrder(index1: number, index2: number) {
    const temp = this._members[index1];
    this._members[index1] = this._members[index2];
    this._members[index2] = temp;
    $gamePlayer.refresh();
  }
}

function Scene_Map_ConcurrentPartyMixIn(sceneMap: Scene_Map) {
  const _update = sceneMap.update;
  sceneMap.update = function () {
    _update.call(this);
    if (!SceneManager.isSceneChanging()) {
      this.updateCallChangeParty();
    }
    this.updateChangePartyQueue();
  };

  sceneMap.updateCallChangeParty = function () {
    if (this.isChangePartyEnabled()) {
      if (this.isChangeToNextPartyCalled()) {
        $gameParty.changeToNextParty({ autoFadeOut: true, autoFadeIn: true });
      } else if (this.isChangeToPreviousPartyCalled()) {
        $gameParty.changeToPreviousParty({ autoFadeOut: true, autoFadeIn: true });
      }
    }
  };

  sceneMap.updateChangePartyQueue = function () {
    if (this.isChangePartyProcessBusy()) {
      return;
    }
    this._changePartyProcess = $gameTemp.dequeueChangePartyProcess();
    switch (this._changePartyProcess) {
      /**
       * イベントコマンドのフェードイン・アウトから制御できるように、
       * $gameScreenのフェード機構を用いる
       */
      case "fadeOut":
        $gameScreen.startFadeOut(this.fadeSpeed());
        break;
      case "fadeIn":
        $gameScreen.startFadeIn(this.fadeSpeed());
        break;
      case "transfer":
        $gameParty.currentParty()?.transferTo(2);
        break;
      case "commonEvent":
        if (settings.commonEvent) {
          $gameTemp.reserveCommonEvent(settings.commonEvent);
        }
        break;
    }
  };

  sceneMap.isChangePartyEnabled = function () {
    return !$gamePlayer.isMoving() && !$gameMap.isEventRunning();
  };

  sceneMap.isChangeToNextPartyCalled = function () {
    return Input.isTriggered(settings.nextPartyButton);
  };

  sceneMap.isChangeToPreviousPartyCalled = function () {
    return Input.isTriggered(settings.previousPartyButton);
  };

  sceneMap.isChangePartyProcessBusy = function () {
    switch (this._changePartyProcess) {
      case "fadeOut":
      case "fadeIn":
        return $gameScreen.isFadeBusy();
      case "transfer":
        return $gamePlayer.isTransferring();
      case "commonEvent":
        return $gameTemp.isCommonEventReserved() || $gameMap.isEventRunning();
    }
    return false;
  };
}

Scene_Map_ConcurrentPartyMixIn(Scene_Map.prototype);

type _Game_DevidedParty = typeof Game_DevidedParty;
declare global {
  var Game_DevidedParty: _Game_DevidedParty;
}
globalThis.Game_DevidedParty = Game_DevidedParty;
