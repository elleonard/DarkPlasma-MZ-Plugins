/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../FilterEquip/FilterEquip.d.ts" />
/// <reference path="../../AllocateUniqueTraitDataId/plugin/AllocateUniqueTraitDataId.d.ts" />

declare let uniqueSpecialFlagId: number;
declare var uniqueSpecialFlagIdCache: UniqueSpecialFlagIdCache;

declare interface UniqueSpecialFlagId {
  _id: number;
  _name: string;

  readonly id: number;
  readonly name: string;
}

declare interface UniqueSpecialFlagIdCache {
  allocate(pluginName: string, localId: number, name: string): UniqueSpecialFlagId;
  key(pluginName: string, localId: number): string;
  nameById(id: number): string|undefined;
}
