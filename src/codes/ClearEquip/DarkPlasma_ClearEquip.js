import { pluginName } from './../../common/pluginName';
import { settings } from './_build/DarkPlasma_ClearEquip_parameters';

const PLUGIN_COMMAND_NAME = {
  CLEAR_EQUIP: 'clearEquip',
  CLEAR_ALL_MEMBER_EQUIP: 'clearAllMemberEquip',
  CLEAR_ALL_EQUIP: 'clearAllEquip',
  CLEAR_ALL_MEMBER_ALL_EQUIP: 'clearAllMemberAllEquip',
};

const _Game_Party_removeActor = Game_Party.prototype.removeActor;
Game_Party.prototype.removeActor = function (actorId) {
  // パーティメンバーがはずれたときに装備をすべてはずす
  if (settings.clearEquipWhenMemberIsOut && this._actors.includes(actorId)) {
    $gameActors.actor(actorId).clearEquipments();
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

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR_EQUIP, function (args) {
  const actor = $gameParty.members().find((actor) => actor.actorId() === Number(args.actorId));
  if (actor) {
    const equipTypes = JSON.parse(args.equipTypes).map((equipType) => Number(equipType));
    actor.clearEquipByEquipTypes(equipTypes);
  }
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR_ALL_EQUIP, function (args) {
  const actor = $gameParty.members().find((actor) => actor.actorId() === Number(args.actorId));
  if (actor) {
    actor.clearEquipments();
  }
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR_ALL_MEMBER_EQUIP, function (args) {
  const equipTypes = JSON.parse(args.equipTypes).map((equipType) => Number(equipType));
  $gameParty.members().forEach((actor) => actor.clearEquipByEquipTypes(equipTypes));
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR_ALL_MEMBER_ALL_EQUIP, function () {
  $gameParty.members().forEach((actor) => actor.clearEquipments());
});
