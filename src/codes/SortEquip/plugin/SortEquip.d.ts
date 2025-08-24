/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../ParameterText/ParameterText.d.ts" />
/// <reference path="../../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />

declare namespace ColorManager {
  function selectedSortColor(): string;
}

declare interface Game_Actor {
  forceClearEquipments(): void;
}

declare interface Scene_Equip {
  _sortWindowLayer: WindowLayer;
  _sortWindow: Window_EquipSort;

  createSortWindow(): void;
  sortWindowRect(): Rectangle;

  onSortOpen(): void;
  onSortOk(): void;
  onSortCancel(): void;
}

type SortParam = {
  name: string;
  symbol: string;
};

type SortParamSymbol = 'mhp' | 'mmp' | 'atk' | 'def' | 'mat' | 'mdf' | 'agi' | 'luk'
 | 'hit' | 'eva' | 'cri' | 'cev' | 'mev' | 'mrf' | 'cnt' | 'hrg' | 'mrg' | 'trg'
 | 'tgr' | 'grd' | 'rec' | 'pha' | 'mcr' | 'tcr' | 'pdr' | 'mdr' | 'fdr' | 'exr';

declare interface Window_ItemList {
  sortItems(): void;
}

declare interface Window_EquipItem {
  _sort: string|null;

  _validSortParamTypes: Map<string, string[]>;

  /**
   * ソート用パラメータのキャッシュ
   * 実際にスロットの装備が付け替えられるとリフレッシュ
   * アクター・スロットをキーとするMap
   * 値はアイテムIDをキーとするオブジェクト
   * 更にその値はパラメータ識別名をキーとするMap;
   */
  _sortParamCache: Map<string, {[key: number]: Map<string, number>}>;

  /**
   * ソート用パラメータ計算用アクターのキャッシュ
   * 実際にスロットの装備が付け替えられるとリフレッシュ
   * アクター・スロットごとに用意する
   */
  _sortTempActorCache: Map<string, Game_Actor>;
  _sortTempActor?: Game_Actor;

  createSortCache(): void;

  setSort(sort: string|null): void;  // 独自のパラメータを指定できるようにstringにしておく
  calculateSortParameters(item: MZ.Weapon|MZ.Armor|null): Map<string, number>;
  calculateSortParam(item: MZ.Weapon|MZ.Armor|null, param: string): number;
  allocateSortTempActor(item: MZ.Weapon|MZ.Armor|null): Game_Actor|undefined;
  refreshSortTempActor(key: string): Game_Actor;

  sortParamCacheKey(): string;
  setSortParamCache(key: string, itemId: number, values: Map<string, number>): void;
  sortParamCache(): Map<string, {[key: number]: Map<string, number>}>;
  sortTempActorCache(): Map<string, Game_Actor>;

  validSortParamTypes(): string[];
}

declare interface Window_EquipSort extends Window_Selectable {
  _validSortParamTypes: string[];

  setValidSortParamTypes(validSortParamTypes: string[]): void;
  toggleSort(sort: SortParam): void;
  currentSort(): SortParam;
  sort(): SortParam|null;
}
