/// <reference path="./SortEquip.d.ts" />

import { ParamSymbol, paramSymbol, symbolToParamId } from '../../../common/object/paramSymbol';
import { SParamSymbol, sparamSymbol, symbolToSParamId } from '../../../common/object/sparamSymbol';
import { XParamSymbol, symbolToXParamId, xparamSymbol } from '../../../common/object/xparamSymbol';
import { settings } from '../config/_build/DarkPlasma_SortEquip_parameters';

const SORT_HANDLER_NAME = 'sort';

function ColorManager_SortEquipMixIn(colorManager: typeof ColorManager) {
  colorManager.selectedSortColor = function () {
    return typeof settings.selectedSortColor === "string"
      ? settings.selectedSortColor
      : this.textColor(settings.selectedSortColor);
  };
}

ColorManager_SortEquipMixIn(ColorManager);

function Game_Actor_SortEquipMixIn(gameActor: Game_Actor) {
  gameActor.forceClearEquipments = function () {
    [...Array(this.equipSlots().length).keys()]
      .filter(i => this.isEquipChangeOk(i))
      .forEach(i => this.forceChangeEquip(i, null));
  };
}

Game_Actor_SortEquipMixIn(Game_Actor.prototype);

function Scene_Equip_SortEquipMixIn(sceneEquip: Scene_Equip) {
  const _create = sceneEquip.create;
  sceneEquip.create = function () {
    _create.call(this);
    this.createSortWindow();
    this._itemWindow.createSortCache();
  };

  const _createItemWindow = sceneEquip.createItemWindow;
  sceneEquip.createItemWindow = function () {
    _createItemWindow.call(this);
    this._itemWindow.setHandler(SORT_HANDLER_NAME, () => this.onSortOpen());
  };

  sceneEquip.createSortWindow = function () {
    this._sortWindowLayer = new WindowLayer();
    this._sortWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._sortWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._sortWindowLayer);

    this._sortWindow = new Window_EquipSort(this.sortWindowRect());
    this._sortWindow.setHandler('ok', () => this.onSortOk());
    this._sortWindow.setHandler(SORT_HANDLER_NAME, () => this.onSortCancel());
    this._sortWindow.setHandler('cancel', () => this.onSortCancel());
    this._sortWindow.hide();
    this._sortWindowLayer.addChild(this._sortWindow);
  };

  sceneEquip.sortWindowRect = function () {
    const y = this._statusWindow.paramY(0);
    return new Rectangle(
      0,
      y,
      this._statusWindow.width / 2,
      Graphics.boxHeight - y - this._helpWindow.height
    );
  };

  sceneEquip.onSortOpen = function () {
    this._itemWindow.deactivate();
    this._itemWindow.createSortCache();
    this._sortWindow.setValidSortParamTypes(this._itemWindow.validSortParamTypes());
    this._sortWindow.show();
    this._sortWindow.activate();
    this._sortWindow.select(0);
    this._sortWindow.scrollTo(0, 0);
  };

  sceneEquip.onSortOk = function () {
    this._sortWindow.toggleSort(this._sortWindow.currentSort());
    this._itemWindow.setSort(this._sortWindow.sort()?.symbol || null);
    this._sortWindow.activate();
  };

  sceneEquip.onSortCancel = function () {
    this._sortWindow.deactivate();
    this._sortWindow.hide();
    this._itemWindow.activate();
  };

  sceneEquip.isSortMode = function () {
    return this._sortWindow?.active;
  };
}

Scene_Equip_SortEquipMixIn(Scene_Equip.prototype);

function Window_ItemList_EquipSortMixIn(windowItemList: Window_ItemList) {
  const _makeItemList = windowItemList.makeItemList;
  windowItemList.makeItemList = function () {
    _makeItemList.call(this);
    this.sortItems();
  };

  if (!windowItemList.sortItems) {
    windowItemList.sortItems = function () { };
  }
}

Window_ItemList_EquipSortMixIn(Window_ItemList.prototype);

/**
 * TODO: 外部定義のソートパラメータを追加できるようにする
 */
const sortParamTypes: SortParamSymbol[] = [...paramSymbol, ...sparamSymbol, ...xparamSymbol] as const;

function Window_EquipItem_EquipSortMixIn(windowEquipItem: Window_EquipItem) {
  windowEquipItem.setSort = function (sort) {
    if (this._sort !== sort) {
      this._sort = sort;
      this.refresh();
    }
  };

  windowEquipItem.createSortCache = function () {
    if (this._validSortParamTypes?.has(this.sortParamCacheKey())) {
      return;
    }
    this._data.forEach(item => {
      if (item) {
        const cache = this.calculateSortParameters(item as MZ.Weapon|MZ.Armor);
        this.setSortParamCache(this.sortParamCacheKey(), item.id, cache);
      }
    });
  };

  windowEquipItem.sortItems = function () {
    const sort: SortParamSymbol | string | null = this._sort;
    if (sort && sortParamTypes.includes(sort as SortParamSymbol)) {
      (this._data as (MZ.Weapon | MZ.Armor | null)[]).sort((a, b) => {
        let aParam: number|undefined = undefined;
        let bParam: number|undefined = undefined;
        if (this._actor) {
          const cacheKey = this.sortParamCacheKey();
          const cache = this.sortParamCache().get(cacheKey);
          if (cache) {
            if (a && cache[a.id]?.has(sort)) {
              aParam = cache[a.id].get(sort);
            }
            if (b && cache[b.id]?.has(sort)) {
              bParam = cache[b.id].get(sort);
            }
          }
        }
        if (aParam !== undefined && bParam !== undefined) {
          return bParam - aParam;
        }
        return this.calculateSortParam(b, sort) - this.calculateSortParam(a, sort);
      });
    }
  };

  windowEquipItem.calculateSortParam = function (item, param) {
    if (!item) {
      return 0;
    }
    const params = this.calculateSortParameters(item);
    this.setSortParamCache(this.sortParamCacheKey(), item?.id, params);
    return params.get(param) || 0;
  };

  windowEquipItem.calculateSortParameters = function (item) {
    const result = new Map();
    if (item === null) {
      sortParamTypes.forEach(paramType => result.set(paramType, 0));
      return result;
    }
    const tempActor = this.allocateSortTempActor(item);
    if (!tempActor) {
      return result;
    }
    tempActor.forceChangeEquip(this._slotId, item);
    if (!this._validSortParamTypes) {
      this._validSortParamTypes = new Map();
    }
    const validParamTypes = this._validSortParamTypes.get(this.sortParamCacheKey()) || [];
    sortParamTypes.forEach(paramType => {
      result.set(paramType, tempActor[paramType]);
      if (!validParamTypes.includes(paramType) && tempActor[paramType] !== this._actor![paramType]) {
        validParamTypes.push(paramType);
      }
    });
    this._validSortParamTypes.set(this.sortParamCacheKey(), validParamTypes);
    return result;
  };

  windowEquipItem.allocateSortTempActor = function (item) {
    if (!this._actor) {
      return undefined;
    }
    const key = `${this._actor.actorId()}_${this._slotId}`;
    this._sortTempActor = this.sortTempActorCache().get(key);
    if (!this._sortTempActor) {
      this._sortTempActor = this.refreshSortTempActor(key);
    }
    this._sortTempActor.forceChangeEquip(this._slotId, item);
    return this._sortTempActor;
  };

  windowEquipItem.refreshSortTempActor = function (key) {
    const actor = JsonEx.makeDeepCopy(this._actor!);
    /**
     * 素体は全て装備を外しておく
     * 特徴による通常能力値変化のみ、素ステ次第では順序の逆転が起こり得るが、
     * 装備を付け替えるたびに再計算するコストは容認できない
     */
    actor.forceClearEquipments();
    this.sortTempActorCache().set(key, actor);
    return actor;
  };

  windowEquipItem.sortParamCacheKey = function () {
    return this._actor ? `${this._actor.actorId()}_${this._slotId}` : "";
  };

  windowEquipItem.setSortParamCache = function (key, itemId, values) {
    const cache = this.sortParamCache().get(key) || {};
    cache[itemId] = values;
    this.sortParamCache().set(key, cache);
  };

  windowEquipItem.sortTempActorCache = function () {
    if (!this._sortTempActorCache) {
      this._sortTempActorCache = new Map();
    }
    return this._sortTempActorCache;
  };

  windowEquipItem.sortParamCache = function () {
    if (!this._sortParamCache) {
      this._sortParamCache = new Map();
    }
    return this._sortParamCache;
  };

  windowEquipItem.validSortParamTypes = function () {
    return sortParamTypes.filter(type => (this._validSortParamTypes?.get(this.sortParamCacheKey()) || []).includes(type));
  };
}

Window_EquipItem_EquipSortMixIn(Window_EquipItem.prototype);
Window_CustomKeyHandlerMixIn(settings.key, Window_EquipItem.prototype, SORT_HANDLER_NAME);

class Window_EquipSort extends Window_Selectable {
  _list: SortParam[];
  _sort: SortParam|null;
  _validSortParamTypes: string[];

  public initialize(rect: Rectangle): void {
    super.initialize(rect);
    this.refresh();
  }

  setValidSortParamTypes(validSortParamTypes: string[]) {
    this._validSortParamTypes = validSortParamTypes;
    this.refresh();
  }

  toggleSort(sort: SortParam|null) {
    if (this._sort !== sort) {
      this._sort = sort;
      this.refresh();
    } else {
      this._sort = null;
      this.refresh();
    }
  }

  sort() {
    return this._sort;
  }

  currentSort() {
    return this.sortParamList()[this.index()];
  }

  public maxItems(): number {
    return this.sortParamList().length;
  }

  public drawItem(index: number): void {
    const param = this.sortParamList()[index];
    if (param) {
      const rect = this.itemLineRect(index);
      if (this._sort?.symbol === param.symbol) {
        this.changeTextColor(ColorManager.selectedSortColor());
      }
      this.drawText(param.name, rect.x, rect.y, rect.width);
      this.resetTextColor();
    }
  }

  sortParamList(): SortParam[] {
    if (!this._list || this._list.length === 0) {
      this._list = (this._validSortParamTypes || []).map(sortParamType => {
        const name = (() => {
          if (((type): type is ParamSymbol => paramSymbol.some(p => p === type))(sortParamType)) {
            return TextManager.param(symbolToParamId(sortParamType));
          } else if (((type): type is SParamSymbol => sparamSymbol.some(p => p === type))(sortParamType)) {
            return TextManager.sparam(symbolToSParamId(sortParamType));
          } else if (((type): type is XParamSymbol => xparamSymbol.some(p => p === type))(sortParamType)) {
            return TextManager.xparam(symbolToXParamId(sortParamType));
          } else {
            return "";
          }
        })();
        return {
          name: name,
          symbol: sortParamType,
        };
      });
    }
    return this._list;
  }
}
