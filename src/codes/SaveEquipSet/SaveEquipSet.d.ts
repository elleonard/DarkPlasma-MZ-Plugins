/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_EquipSlot {
  _slotId: number;
  _item?: MZ.Weapon|MZ.Armor;
  _itemId: number|null;
  _kind: number|null;

  readonly slotId: number;
  readonly item: MZ.Weapon|MZ.Armor|null;

  initIdAndKind(item: MZ.Weapon|MZ.Armor): void;
}

declare interface Game_Actor {
  _equipSet?: Game_EquipSlot[];
  _equipSets: Game_EquipSlot[][];

  canEquipByLoad(equipSlot: Game_EquipSlot): boolean;
  equipSets(): Game_EquipSlot[][];
  equipSetAt(index: number): Game_EquipSlot[];
  saveEquipSet(): void;
  saveEquipSetAt(index: number): void;
  loadEquipSet(): void;
  loadEquipSetAt(index: number): void;
  clearEquipSets(): void;
  deleteEquipSetAt(index: number): void;
}
