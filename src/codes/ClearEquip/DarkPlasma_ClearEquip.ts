import { pluginName } from './../../common/pluginName';
import { command_clearAllEquip, command_clearAllMemberAllEquip, command_clearAllMemberEquip, command_clearEquip, parseArgs_clearAllEquip, parseArgs_clearAllMemberEquip, parseArgs_clearEquip } from './_build/DarkPlasma_ClearEquip_commands';
import { settings } from './_build/DarkPlasma_ClearEquip_parameters';

const _Game_Party_removeActor = Game_Party.prototype.removeActor;
Game_Party.prototype.removeActor = function (actorId) {
  // パーティメンバーがはずれたときに装備をすべてはずす
  if (settings.clearEquipWhenMemberIsOut && this._actors.includes(actorId)) {
    $gameActors.actor(actorId)?.clearEquipments();
  }
  _Game_Party_removeActor.call(this, actorId);
};

/**
 * 指定した装備タイプIDの装備を可能であればはずす
 * @param {number[]} equipTypes 装備タイプIDリスト
 */
Game_Actor.prototype.clearEquipByEquipTypes = function (equipTypes) {
  [...Array(this.equipSlots().length).keys()]
    .filter((slotId) => {
      return equipTypes.includes(this.equipSlots()[slotId]) && this.isEquipChangeOk(slotId);
    })
    .forEach((slotId) => this.changeEquip(slotId, null));
};

PluginManager.registerCommand(pluginName, command_clearEquip, function (args) {
  const parsedArgs = parseArgs_clearEquip(args);
  const actor = $gameParty.members().find((actor) => actor.actorId() === parsedArgs.actorId);
  if (actor) {
    actor.clearEquipByEquipTypes(parsedArgs.equipTypes);
  }
});

PluginManager.registerCommand(pluginName, command_clearAllEquip, function (args) {
  const parsedArgs = parseArgs_clearAllEquip(args);
  const actor = $gameParty.members().find((actor) => actor.actorId() === parsedArgs.actorId);
  if (actor) {
    actor.clearEquipments();
  }
});

PluginManager.registerCommand(pluginName, command_clearAllMemberEquip, function (args) {
  const parsedArgs = parseArgs_clearAllMemberEquip(args);
  $gameParty.members().forEach((actor) => actor.clearEquipByEquipTypes(parsedArgs.equipTypes));
});

PluginManager.registerCommand(pluginName, command_clearAllMemberAllEquip, function () {
  $gameParty.members().forEach((actor) => actor.clearEquipments());
});
