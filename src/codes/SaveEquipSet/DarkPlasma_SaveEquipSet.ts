/// <reference path="./SaveEquipSet.d.ts" />

import { pluginName } from '../../common/pluginName';
import {
  command_clearEquipSets,
  command_deleteActorEquipSetAt,
  command_loadActorEquipSetAt,
  command_loadEquipSet,
  command_saveActorEquipSetAt,
  command_saveEquipSet,
  parseArgs_deleteActorEquipSetAt,
  parseArgs_loadActorEquipSetAt,
  parseArgs_saveActorEquipSetAt,
} from './_build/DarkPlasma_SaveEquipSet_commands';
import { settings } from './_build/DarkPlasma_SaveEquipSet_parameters';

PluginManager.registerCommand(pluginName, command_saveEquipSet, function () {
  $gameParty.allMembers().forEach((actor) => actor.saveEquipSet());
});

PluginManager.registerCommand(pluginName, command_loadEquipSet, function () {
  /**
   * 全員の装備を外してから、所持しているものの中で記録を復元する
   */
  $gameParty.allMembers().forEach((actor) => actor.clearEquipments());
  $gameParty.allMembers().forEach((actor) => actor.loadEquipSet());
});

PluginManager.registerCommand(pluginName, command_saveActorEquipSetAt, function (args) {
  const parsedArgs = parseArgs_saveActorEquipSetAt(args);
  const actor = $gameParty.allMembers().find((actor) => actor.actorId() === parsedArgs.actorId);
  if (actor) {
    actor.saveEquipSetAt(parsedArgs.index);
  }
});

PluginManager.registerCommand(pluginName, command_loadActorEquipSetAt, function (args) {
  const parsedArgs = parseArgs_loadActorEquipSetAt(args);
  const actor = $gameParty.allMembers().find((actor) => actor.actorId() === parsedArgs.actorId);
  if (actor) {
    actor.loadEquipSetAt(parsedArgs.index);
  }
});

PluginManager.registerCommand(pluginName, command_clearEquipSets, function () {
  $gameParty.allMembers().forEach((actor) => actor.clearEquipSets());
});

PluginManager.registerCommand(pluginName, command_deleteActorEquipSetAt, function (args) {
  const parsedArgs = parseArgs_deleteActorEquipSetAt(args);
  const actor = $gameParty.allMembers().find((actor) => actor.actorId() === parsedArgs.actorId);
  if (actor) {
    actor.deleteEquipSetAt(parsedArgs.index);
  }
});

const KIND = {
  ITEM: 1,
  WEAPON: 2,
  ARMOR: 3,
};

class Game_EquipSlot {
  _slotId: number;
  _item?: MZ.Weapon|MZ.Armor;
  _itemId: number|null;
  _kind: number|null;

  /**
   * @param {number} slotId
   * @param {MZ.Weapon | MZ.Armor} item
   */
  constructor(slotId: number, item: MZ.Weapon|MZ.Armor) {
    this._slotId = slotId;
    this.initIdAndKind(item);
  }

  get slotId() {
    return this._slotId;
  }

  get item() {
    /**
     * 旧バージョンのセーブデータ救済
     */
    if (this._item || this._item === null) {
      this.initIdAndKind(this._item);
    }
    if (this._itemId === null) {
      return null;
    }
    switch (this._kind) {
      case KIND.WEAPON:
        return $dataWeapons[this._itemId];
      case KIND.ARMOR:
        return $dataArmors[this._itemId];
      default:
        throw Error(`不正なアイテム種別です: ${this._kind} ${this._itemId}`);
    }
  }

  initIdAndKind(item: MZ.Weapon|MZ.Armor) {
    this._itemId = item ? item.id : null;
    this._kind = item
      ? (() => {
          if (DataManager.isWeapon(item)) {
            return KIND.WEAPON;
          } else if (DataManager.isArmor(item)) {
            return KIND.ARMOR;
          } else {
            return null;
          }
        })()
      : null;
    delete this._item;
  }
}

/**
 * @param {Game_Actor.prototype} gameActor
 */
function Game_Actor_SaveEquipSetMixIn(gameActor: Game_Actor) {
  gameActor.equipSets = function () {
    if (!this._equipSets) {
      this._equipSets = [];
    }
    /**
     * バージョン1.0.0からの互換
     */
    if (this._equipSet) {
      if (!this._equipSets[0]) {
        this._equipSets[0] = this._equipSet.map((slot: Game_EquipSlot) => slot);
      }
      delete this._equipSet;
    }
    return this._equipSets;
  };

  gameActor.equipSetAt = function (index) {
    return this.equipSets()[index];
  };

  gameActor.saveEquipSet = function () {
    this.saveEquipSetAt(0);
  };

  gameActor.saveEquipSetAt = function (index) {
    if (settings.equipSetCount > index) {
      this.equipSets()[index] = this.equips().map((equip, slotId) => new Game_EquipSlot(slotId, equip));
    }
  };

  gameActor.loadEquipSet = function () {
    this.loadEquipSetAt(0);
  };

  gameActor.loadEquipSetAt = function (this: Game_Actor, index) {
    const equipSet = this.equipSetAt(index);
    if (settings.equipSetCount > index && equipSet) {
      equipSet
        .filter(
          (equipSlot: Game_EquipSlot) =>
            !equipSlot.item ||
            $gameParty.hasItem(equipSlot.item) &&
            this.canEquip(equipSlot.item) &&
            this.isEquipChangeOk(equipSlot.slotId)
        )
        .forEach((equipSlot: Game_EquipSlot) => this.changeEquip(equipSlot.slotId, equipSlot.item));
    }
  };

  gameActor.clearEquipSets = function () {
    this._equipSets = [];
  };

  gameActor.deleteEquipSetAt = function (index) {
    if (this.equipSetAt(index)) {
      delete this._equipSets[index];
    }
  };
}

Game_Actor_SaveEquipSetMixIn(Game_Actor.prototype);

type _Game_EquipSlot = typeof Game_EquipSlot;
declare global {
  var Game_EquipSlot: _Game_EquipSlot;
}
globalThis.Game_EquipSlot = Game_EquipSlot;
