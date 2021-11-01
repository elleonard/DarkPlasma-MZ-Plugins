import { settings } from './_build/DarkPlasma_ItemCommandCooldown_parameters';

class ItemCommandCooldownTurns {
  initialize() {
    this._turns = {};
    $gameParty.allMembers().forEach((actor) => (this._turns[actor.actorId()] = 0));
  }

  setup(actor) {
    this._turns[actor.actorId()] = actor.initialItemCommandCooldownTurn();
  }

  /**
   * @param {number} actorId
   * @return {number}
   */
  cooldownTurn(actorId) {
    if (!this._turns[actorId]) {
      this._turns[actorId] = 0;
    }
    return this._turns[actorId];
  }

  decrease() {
    $gameParty.allMembers().forEach((actor) => {
      this._turns[actor.actorId()] = this.cooldownTurn(actor.actorId()) - 1;
      if (this._turns[actor.actorId()] < 0) {
        this._turns[actor.actorId()] = 0;
      }
    });
  }
}

const itemCommandCooldownTurns = new ItemCommandCooldownTurns();

/**
 * @param {BattleManager} battleManager
 */
function BattleManager_ItemCommandCooldownMixIn(battleManager) {
  const _startBattle = battleManager.startBattle;
  battleManager.startBattle = function () {
    _startBattle.call(this);
    itemCommandCooldownTurns.initialize();
  };

  const _endTurn = battleManager.endTurn;
  battleManager.endTurn = function () {
    _endTurn.call(this);
    itemCommandCooldownTurns.decrease();
  };
}

BattleManager_ItemCommandCooldownMixIn(BattleManager);

/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_ItemCommandCooldownMixIn(gameBattler) {
  const _useItem = gameBattler.useItem;
  gameBattler.useItem = function (item) {
    _useItem.call(this, item);
    if (DataManager.isItem(item) && $gameParty.inBattle()) {
      this.setupItemCooldownTurn();
    }
  };

  gameBattler.setupItemCooldownTurn = function () {};
}

Game_Battler_ItemCommandCooldownMixIn(Game_Battler.prototype);

/**
 * @param {Game_Actor.prototype} gameActor
 */
function Game_Actor_ItemCommandCooldownMixIn(gameActor) {
  gameActor.setupItemCooldownTurn = function () {
    itemCommandCooldownTurns.setup(this);
  };

  gameActor.itemCommandCooldownTurn = function () {
    /**
     * ターン終了時に減算されるため、+1しておく
     */
    return itemCommandCooldownTurns.cooldownTurn(this.actorId()) + 1;
  };

  gameActor.initialItemCommandCooldownTurn = function () {
    return settings.defaultCooldownTurn + this.itemCommandCooldownTurnPlus();
  };

  gameActor.itemCommandCooldownTurnPlus = function () {
    return this.traitObjects()
      .filter((object) => !!object.meta.itemCommandCooldownTurnPlus)
      .reduce((result, object) => result + Number(object.meta.itemCommandCooldownTurnPlus), 0);
  };

  gameActor.canItemCommand = function () {
    return !this.isInItemCommandCooldown();
  };

  gameActor.isInItemCommandCooldown = function () {
    return itemCommandCooldownTurns.cooldownTurn(this.actorId()) > 0;
  };
}

Game_Actor_ItemCommandCooldownMixIn(Game_Actor.prototype);

/**
 * @param {Window_ActorCommand.prototype} windowClass
 */
function Window_ActorCommand_ItemCommandCooldownMixIn(windowClass) {
  const _addItemCommand = windowClass.addItemCommand;
  windowClass.addItemCommand = function () {
    _addItemCommand.call(this);
    const itemCommand = this._list.find((command) => command.symbol === 'item');
    if (itemCommand) {
      if (settings.display.enabled && this._actor.isInItemCommandCooldown()) {
        itemCommand.name = `${itemCommand.name} ${settings.display.format.replace(
          /\{turn\}/gi,
          this._actor.itemCommandCooldownTurn()
        )}`;
      }
      itemCommand.enabled = this._actor.canItemCommand();
    }
  };
}

Window_ActorCommand_ItemCommandCooldownMixIn(Window_ActorCommand.prototype);
