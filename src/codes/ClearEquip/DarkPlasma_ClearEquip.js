import { pluginName } from './../../common/pluginName';
import { settings } from './_build/DarkPlasma_ClearEquip_parameters';

const _Game_Party_removeActor = Game_Party.prototype.removeActor;
Game_Party.prototype.removeActor = function (actorId) {
  // パーティメンバーがはずれたときに装備をすべてはずす
  if (settings.clearEquipWhenMemberIsOut && this._actors.contains(actorId)) {
    $gameActors.actor(actorId).clearEquipments();
  }
  _Game_Party_removeActor.call(this, actorId);
};

PluginManager.registerCommand(pluginName, 'clearEquip', function (args) {
  const actor = $gameParty.members().find((actor) => actor.actorId() === Number(args.actorId));
  if (actor) {
    actor.clearEquipments();
  }
});
