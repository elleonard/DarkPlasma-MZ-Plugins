import { settings } from './_build/DarkPlasma_FixEquip_parameters';

const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
Game_Actor.prototype.isEquipChangeOk = function (slotId) {
  return _Game_Actor_isEquipChangeOk.call(this, slotId) && !this.isEquipTypeFixed(this.equipSlots()[slotId]);
};

Game_Actor.prototype.isEquipTypeFixed = function (etypeId) {
  return settings.fixEquips
    .filter((fixEquip) => fixEquip.switchId > 0 && $gameSwitches.value(fixEquip.switchId))
    .some((fixEquip) => fixEquip.equipTypes.includes(etypeId));
};
