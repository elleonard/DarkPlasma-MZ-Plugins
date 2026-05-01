/// <reference path="./ItemCommandCooldown.d.ts" />

import { settings } from '../config/_build/DarkPlasma_ItemCommandCooldown_parameters';

function ColorManager_ItemCommandCooldownMixIn(colorManager: typeof ColorManager) {
  colorManager.itemCooldownColor = function () {
    return typeof settings.display.color === "string"
      ? settings.display.color
      : this.textColor(settings.display.color);
  };
}

ColorManager_ItemCommandCooldownMixIn(ColorManager);

class ItemCommandCooldownTurns {
  _turns: {[actorId: number]: number};

  initialize() {
    this._turns = {};
    $gameParty.allMembers().forEach((actor) => (this._turns[actor.actorId()] = 0));
  }

  setup(actor: Game_Actor) {
    this._turns[actor.actorId()] = actor.initialItemCommandCooldownTurn();
  }

  cooldownTurn(actorId: number): number {
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

function BattleManager_ItemCommandCooldownMixIn(battleManager: typeof BattleManager) {
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

function Game_Battler_ItemCommandCooldownMixIn(gameBattler: Game_Battler) {
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

function Game_Actor_ItemCommandCooldownMixIn(gameActor: Game_Actor) {
  gameActor.setupItemCooldownTurn = function () {
    itemCommandCooldownTurns.setup(this);
  };

  gameActor.itemCommandCooldownTurn = function () {
    return itemCommandCooldownTurns.cooldownTurn(this.actorId());
  };

  gameActor.initialItemCommandCooldownTurn = function () {
    /**
     * ターン終了時に減算されるため、+1しておく
     */
    return settings.defaultCooldownTurn + this.itemCommandCooldownTurnPlus() + 1;
  };

  /**
   * TODO: AllocateUniqueTraitIdを使う
   */
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

function Window_ActorCommand_ItemCommandCooldownMixIn(windowClass: Window_ActorCommand) {
  const _addItemCommand = windowClass.addItemCommand;
  windowClass.addItemCommand = function () {
    _addItemCommand.call(this);
    const itemCommand = this._list.find((command) => command.symbol === 'item');
    if (itemCommand) {
      itemCommand.enabled = this._actor?.canItemCommand() || false;
    }
  };

  const _drawItem = windowClass.drawItem;
  windowClass.drawItem = function (index) {
    if (
      settings.display.enabled
      && this._actor
      && this._actor.isInItemCommandCooldown()
      && this.commandSymbol(index) === 'item'
    ) {
      const rect = this.itemLineRect(index);
      const align = this.itemTextAlign();
      const cooldownText = settings.display.format.replace(
        /\{turn\}/gi, `${this._actor.itemCommandCooldownTurn()}`
      );
      /**
       * 中央寄せでいい感じにクールタイムの色だけ変えるため、詰め用文字列を作る
       */
      const cooldownWidth = this.textWidth(cooldownText);
      const commandWidth = this.textWidth(this.commandName(index));
      this.resetTextColor();
      this.changePaintOpacity(this.isCommandEnabled(index));
      this.drawText(
        `${this.commandName(index)} ${this.paddingText(cooldownWidth, cooldownText.length)}`,
        rect.x,
        rect.y,
        rect.width,
        align
      );
      this.changeTextColor(ColorManager.itemCooldownColor());
      this.drawText(
        `${this.paddingText(commandWidth, this.commandName(index).length)} ${cooldownText}`,
        rect.x,
        rect.y,
        rect.width,
        align
      );
    } else {
      _drawItem.call(this, index);
    }
  };

  windowClass.paddingText = function (width, minLength) {
    let result = ''.padStart(minLength, ' ');
    while (this.textWidth(result) < width) {
      result += ' ';
    }
    return result;
  };
}

Window_ActorCommand_ItemCommandCooldownMixIn(Window_ActorCommand.prototype);
