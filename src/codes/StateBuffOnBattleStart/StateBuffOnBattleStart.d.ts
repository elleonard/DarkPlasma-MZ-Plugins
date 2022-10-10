/// <reference path="../../typings/rmmz/rmmz.d.ts" />
/// <reference path="../../codes/AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />

type StateOnBattleStartSetting = {
  id: number;
  stateId: number;
  turn: number;
};

type BuffOnBattleStartSetting = {
  id: number;
  paramId: number;
  buffStep: number;
  turn: number;
};

type StateBuffOnBatleStartData = MZ.Actor|MZ.Class|MZ.Weapon|MZ.Armor|MZ.Enemy;

declare namespace settings {
  const stateOnBattleStart: StateOnBattleStartSetting;
  const buffOnBattleStart: BuffOnBattleStartSetting;
}

declare interface StateOnBattleStart {
  readonly id: number;
  readonly stateId: number;
  readonly turn: number;
}

declare interface BuffOnBattleStart {
  readonly id: number;
  readonly paramId: number;
  readonly buffStep: number;
  readonly turn: number;
}

declare interface Game_Battler {
  statesOnBattleStart(): StateOnBattleStart[];
  buffsOnBattleStart(): BuffOnBattleStart[];
}
