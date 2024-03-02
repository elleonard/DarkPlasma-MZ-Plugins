/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />
/// <reference path="../ParameterText/ParameterText.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />

declare namespace ColorManager {
  function filterOnColor(): string;
}

declare interface EquipFilterBuilder {
  build(): EquipFilter;
  withEquipToTraitsRule(ruleFunction: (equip: MZ.Weapon|MZ.Armor) => MZ.Trait[]): EquipFilterBuilder;
  withTraitToEffectNameRule(ruleFunction: (traitId: number, dataId: number) => string|null): EquipFilterBuilder;
  withTrait(traitId: number): EquipFilterBuilder;
  withoutTrait(traitId: number): EquipFilterBuilder;

  traitList(): number[];
  defaultTraitList(): number[];
  equipToTraits(equip: MZ.Weapon|MZ.Armor): MZ.Trait[];
  equipToTraitsDefaultRule(equip: MZ.Weapon|MZ.Armor): MZ.Trait[];
  effectToFilterTrait(effects: MZ.Trait[], traitId: number): EquipFIlter_Trait|null;
  traitToEffectName(traitId: number, dataId: number): string|null;
  traitToEffectNameDefaultRule(traitId: number, dataId: number): string|null;
}

declare interface EquipFilter {
  allOff(): void;
  isIncludedItem(equip: MZ.Weapon|MZ.Armor): boolean;
}

declare interface Scene_Equip {
  _filterWindowLayer: WindowLayer;
  _filterTraitWindow: Window_EquipFilterTrait;
  _filterEffectWindow: Window_EquipFilterEffect;
  _filters: EquipFilter[];

  createFilterWindows(): void;
  equipFilterTraitWindowRect(): Rectangle;
  equipFilterEffectWindowRect(): Rectangle;
  refreshFilter(): void;
  equipFilterBuilder(equips: (MZ.Weapon|MZ.Armor)[]): EquipFilterBuilder;

  onFilterOpen(): void;
  onFilterClose(): void;
  onFilterTraitOk(): void;
  onFilterEffectCancel(): void;

  isFilterMode(): boolean;
}

declare interface Window_EquipFilter extends Window_Selectable {
  setItemWindow(itemWindow: Window_EquipItem): void;
  setFilter(filter: EquipFilter): void;
}

declare interface Window_EquipFilterEffect extends Window_EquipFilter {
  setFilterTraitWindow(filterTraitWindow: Window_EquipFilterTrait): void;
}

declare interface Window_EquipFilterTrait extends Window_EquipFilter {

}

declare interface Window_EquipItem {
  _filter: EquipFilter;

  setFilter(filter: EquipFilter): void;
}
