import { settings } from './_build/DarkPlasma_FilterEquip_parameters';

const _Scene_Equip_create = Scene_Equip.prototype.create;
Scene_Equip.prototype.create = function () {
  _Scene_Equip_create.call(this);
  this.createFilterWindows();
};

const _Scene_Equip_createItemWindow = Scene_Equip.prototype.createItemWindow;
Scene_Equip.prototype.createItemWindow = function () {
  _Scene_Equip_createItemWindow.call(this);
  this._itemWindow.setHandler('shift', this.onFilterOpen.bind(this));
};

/**
 * 装備の絞り込み機能用のウィンドウを生成する
 */
Scene_Equip.prototype.createFilterWindows = function () {
  this._filterWindowLayer = new WindowLayer();
  this._filterWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
  this._filterWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
  this.addChild(this._filterWindowLayer);

  this._filterTraitWindow = new Window_EquipFilterTrait(this.equipFilterTraitWindowRect());
  this._filterTraitWindow.setHandler('ok', this.onFilterTraitOk.bind(this));
  this._filterTraitWindow.setHandler('shift', this.onFilterClose.bind(this));
  this._filterTraitWindow.setHandler('cancel', this.onFilterClose.bind(this));
  this._filterTraitWindow.setItemWindow(this._itemWindow);
  this._filterTraitWindow.hide();
  this._filterWindowLayer.addChild(this._filterTraitWindow);

  this._filterEffectWindow = new Window_EquipFilterEffect(this.equipFilterEffectWindowRect());
  this._filterEffectWindow.setHandler('shift', this.onFilterClose.bind(this));
  this._filterEffectWindow.setHandler('cancel', this.onFilterEffectCancel.bind(this));
  this._filterEffectWindow.setItemWindow(this._itemWindow);
  this._filterEffectWindow.setFilterTraitWindow(this._filterTraitWindow);
  this._filterEffectWindow.hide();
  this._filterWindowLayer.addChild(this._filterEffectWindow);

  this.refreshFilter();
};

Scene_Equip.prototype.equipFilterTraitWindowRect = function () {
  const y = this._statusWindow.paramY(0);
  return new Rectangle(0, y, this._statusWindow.width / 2, Graphics.boxHeight - y - this._helpWindow.height);
};

Scene_Equip.prototype.equipFilterEffectWindowRect = function () {
  return new Rectangle(
    this._filterTraitWindow.width,
    this._filterTraitWindow.y,
    this._filterTraitWindow.width,
    this._filterTraitWindow.height
  );
};

/**
 * 絞り込み用データの更新
 */
Scene_Equip.prototype.refreshFilter = function () {
  this._filters = this.actor()
    .equipSlots()
    .map((etypeId) => {
      const equips = $gameParty.allItems().filter((item) => this.actor().canEquip(item) && item.etypeId === etypeId);
      return this.equipFilterBuilder(equips).build();
    });
};

/**
 * 絞り込み用データビルダー
 * @param {MZ.Weapon[]|MZ.Armor[]} equips 装備データ一覧
 * @return {EquipFilterBuilder}
 */
Scene_Equip.prototype.equipFilterBuilder = function (equips) {
  return new EquipFilterBuilder(equips);
};

const _Scene_Equip_onActorChange = Scene_Equip.prototype.onActorChange;
Scene_Equip.prototype.onActorChange = function () {
  this.refreshFilter();
  this._filterTraitWindow.setFilter(this._filters[0], this.actor().equipSlots()[0]);
  this._filterEffectWindow.setFilter(this._filters[0], this.actor().equipSlots()[0]);
  _Scene_Equip_onActorChange.call(this);
};

const _Scene_Equip_executeEquipChange = Scene_Equip.prototype.executeEquipChange;
Scene_Equip.prototype.executeEquipChange = function () {
  _Scene_Equip_executeEquipChange.call(this);
  this.refreshFilter();
};

/**
 * 絞り込みモード開始
 */
Scene_Equip.prototype.onFilterOpen = function () {
  this._itemWindow.deactivate();
  const slotId = this._slotWindow.index();
  this._filterTraitWindow.setFilter(this._filters[slotId], this.actor().equipSlots()[slotId]);
  this._filterTraitWindow.show();
  this._filterTraitWindow.activate();
  this._filterTraitWindow.select(0);
  this._filterTraitWindow.scrollTo(0, 0);
};

/**
 * 絞り込みモード終了
 */
Scene_Equip.prototype.onFilterClose = function () {
  this._filterTraitWindow.hide();
  this._filterEffectWindow.hide();
  this._itemWindow.activate();
  this._itemWindow.select(0);
  this._itemWindow.scrollTo(0, 0);
};

Scene_Equip.prototype.onFilterTraitOk = function () {
  this._filterTraitWindow.deactivate();
  const slotId = this._slotWindow.index();
  this._filterEffectWindow.setFilter(this._filters[slotId], this.actor().equipSlots()[slotId]);
  this._filterEffectWindow.show();
  this._filterEffectWindow.activate();
  this._filterEffectWindow.select(0);
  this._filterEffectWindow.scrollTo(0, 0);
};

Scene_Equip.prototype.onFilterEffectCancel = function () {
  this._filterEffectWindow.hide();
  this._filterTraitWindow.activate();
};

const _Scene_Equip_onSlotOk = Scene_Equip.prototype.onSlotOk;
Scene_Equip.prototype.onSlotOk = function () {
  this._itemWindow.setFilter(this._filters[this._slotWindow.index()]);
  _Scene_Equip_onSlotOk.call(this);
};

const _Scene_Equip_onItemCancel = Scene_Equip.prototype.onItemCancel;
Scene_Equip.prototype.onItemCancel = function () {
  _Scene_Equip_onItemCancel.call(this);
  this._filters[this._slotWindow.index()].allOff();
};

/**
 * 独自dataIdの定義用
 */
const uniqueDataIds = {
  [Game_BattlerBase.TRAIT_DEBUFF_RATE]: 8,
  [Game_BattlerBase.TRAIT_XPARAM]: 10,
  [Game_BattlerBase.TRAIT_SPARAM]: 10,
  [Game_BattlerBase.TRAIT_SLOT_TYPE]: 2,
  [Game_BattlerBase.TRAIT_SPECIAL_FLAG]: 4,
  [Game_BattlerBase.TRAIT_PARTY_ABILITY]: 6,
};

/**
 * 独自dataIdのキャッシュ
 */
const uniqueDataIdCache = {};

const TRAIT_NAMES = {
  [Game_BattlerBase.TRAIT_ELEMENT_RATE]: settings.traitName.elementRate,
  [Game_BattlerBase.TRAIT_DEBUFF_RATE]: settings.traitName.debuffRate,
  [Game_BattlerBase.TRAIT_STATE_RATE]: settings.traitName.stateRate,
  [Game_BattlerBase.TRAIT_STATE_RESIST]: settings.traitName.stateResist,
  [Game_BattlerBase.TRAIT_XPARAM]: settings.traitName.xparam,
  [Game_BattlerBase.TRAIT_SPARAM]: settings.traitName.sparam,
  [Game_BattlerBase.TRAIT_ATTACK_ELEMENT]: settings.traitName.attackElement,
  [Game_BattlerBase.TRAIT_ATTACK_STATE]: settings.traitName.attackState,
  [Game_BattlerBase.TRAIT_ATTACK_SPEED]: settings.traitName.attackSpeed,
  [Game_BattlerBase.TRAIT_ATTACK_TIMES]: settings.traitName.attackTimes,
  [Game_BattlerBase.TRAIT_ATTACK_SKILL]: settings.traitName.attackSkill,
  [Game_BattlerBase.TRAIT_STYPE_ADD]: settings.traitName.stypeAdd,
  [Game_BattlerBase.TRAIT_STYPE_SEAL]: settings.traitName.stypeSeal,
  [Game_BattlerBase.TRAIT_SKILL_ADD]: settings.traitName.skillAdd,
  [Game_BattlerBase.TRAIT_SKILL_SEAL]: settings.traitName.skillSeal,
  [Game_BattlerBase.TRAIT_EQUIP_WTYPE]: settings.traitName.equipWtype,
  [Game_BattlerBase.TRAIT_EQUIP_ATYPE]: settings.traitName.equipAtype,
  [Game_BattlerBase.TRAIT_EQUIP_LOCK]: settings.traitName.equipLock,
  [Game_BattlerBase.TRAIT_EQUIP_SEAL]: settings.traitName.equipSeal,
  [Game_BattlerBase.TRAIT_SLOT_TYPE]: settings.traitName.slotType,
  [Game_BattlerBase.TRAIT_ACTION_PLUS]: settings.traitName.actionPlus,
  [Game_BattlerBase.TRAIT_SPECIAL_FLAG]: settings.traitName.specialFlag,
  [Game_BattlerBase.TRAIT_PARTY_ABILITY]: settings.traitName.partyAbility,
};

/**
 * 特徴名
 * @param {number} traitId 特徴ID
 * @return {string}
 */
function traitName(traitId) {
  return TRAIT_NAMES[traitId] || uniqueTraitIdCache.nameByTraitId(traitId);
}

/**
 * 効果のない特徴（回避率+0％など）であるか
 * @param {MZ.Trait} trait
 * @return {boolean}
 */
function hasNoEffectTrait(trait) {
  const defaultValue = (() => {
    switch (trait.code) {
      case Game_BattlerBase.TRAIT_ELEMENT_RATE:
      case Game_BattlerBase.TRAIT_DEBUFF_RATE:
      case Game_BattlerBase.TRAIT_STATE_RATE:
      case Game_BattlerBase.TRAIT_SPARAM:
        return 1;
      case Game_BattlerBase.TRAIT_XPARAM:
      case Game_BattlerBase.TRAIT_ATTACK_STATE:
      case Game_BattlerBase.TRAIT_ATTACK_SPEED:
      case Game_BattlerBase.TRAIT_ATTACK_TIMES:
      case Game_BattlerBase.TRAIT_ACTION_PLUS:
        return 0;
    }
    return null;
  })();
  return trait.value === defaultValue;
}

class EquipFilterBuilder {
  /**
   * @param {MZ.Weapon[]|MZ.Armor[]} equips 装備
   */
  constructor(equips) {
    this._equips = equips;
    this._equipToTraitsRules = [this.equipToTraitsDefaultRule];
    this._traitToEffectNameRules = [this.traitToEffectNameDefaultRule];
    this._traitList = this.defaultTraitList();
  }

  /**
   * 装備を絞り込み用trait配列に変換するルールを追加する
   * @param {(equip: MZ.Weapon|MZ.Armor) => MZ.Trait[]} ruleFunction
   */
  withEquipToTraitsRule(ruleFunction) {
    this._equipToTraitsRules.push(ruleFunction);
    return this;
  }

  /**
   * 指定した特徴ID及び効果IDから、効果名を返すルールを追加する
   * @param {(traitId: number, dataId: number) => string|null} ruleFunction
   */
  withTraitToEffectNameRule(ruleFunction) {
    this._traitToEffectNameRules.push(ruleFunction);
    return this;
  }

  /**
   * 独自に特徴IDを追加する
   * @param {number} traitId 特徴ID
   */
  withTrait(traitId) {
    this._traitList.push(traitId);
    return this;
  }

  /**
   * 表示対象外とする特徴IDを指定する
   * @param {number} traitId 特徴ID
   */
  withoutTrait(traitId) {
    this._traitList = this._traitList.filter((trait) => trait.id !== traitId);
    return this;
  }

  /**
   * @return {EquipFilter}
   */
  build() {
    const effects = [
      ...new Map(
        this._equips
          .reduce((result, equip) => result.concat(this.equipToTraits(equip)), [])
          .filter((effect) => !hasNoEffectTrait(effect))
          .map((effect) => [`${effect.code}:${effect.dataId}`, effect])
      ).values(),
    ];

    const instance = new EquipFilter(this.equipToTraits.bind(this));
    this.traitList().forEach((traitId) => {
      const filterTrait = this.effectToFilterTrait(effects, traitId);
      if (filterTrait) {
        instance.addTrait(filterTrait);
      }
    });
    return instance;
  }

  /**
   * 表示する可能性のある特徴IDリスト
   * @return {number[]}
   */
  traitList() {
    return this._traitList;
  }

  /**
   * 特徴IDリストの基本セット
   * @return {number[]}
   */
  defaultTraitList() {
    return [
      Game_BattlerBase.TRAIT_ELEMENT_RATE,
      Game_BattlerBase.TRAIT_DEBUFF_RATE,
      Game_BattlerBase.TRAIT_STATE_RATE,
      Game_BattlerBase.TRAIT_STATE_RESIST,
      Game_BattlerBase.TRAIT_XPARAM,
      Game_BattlerBase.TRAIT_SPARAM,
      Game_BattlerBase.TRAIT_ATTACK_ELEMENT,
      Game_BattlerBase.TRAIT_ATTACK_STATE,
      Game_BattlerBase.TRAIT_ATTACK_SPEED,
      Game_BattlerBase.TRAIT_ATTACK_TIMES,
      Game_BattlerBase.TRAIT_ATTACK_SKILL,
      Game_BattlerBase.TRAIT_STYPE_ADD,
      Game_BattlerBase.TRAIT_STYPE_SEAL,
      Game_BattlerBase.TRAIT_SKILL_ADD,
      Game_BattlerBase.TRAIT_SKILL_SEAL,
      Game_BattlerBase.TRAIT_EQUIP_WTYPE,
      Game_BattlerBase.TRAIT_EQUIP_ATYPE,
      Game_BattlerBase.TRAIT_EQUIP_LOCK,
      Game_BattlerBase.TRAIT_EQUIP_SEAL,
      Game_BattlerBase.TRAIT_SLOT_TYPE,
      Game_BattlerBase.TRAIT_ACTION_PLUS,
      Game_BattlerBase.TRAIT_SPECIAL_FLAG,
      Game_BattlerBase.TRAIT_PARTY_ABILITY,
    ];
  }

  /**
   * 装備を絞り込み用trait配列に変換する
   * @param {MZ.Weapon|MZ.Armor} equip 装備
   * @return {MZ.Trait[]}
   */
  equipToTraits(equip) {
    return this._equipToTraitsRules.map((func) => func(equip)).reduce((result, traits) => result.concat(traits), []);
  }

  /**
   * 装備を絞り込み用trait配列に変換する基本ルール
   * @param {MZ.Weapon|MZ.Armor} equip 装備
   * @return {MZ.Trait[]}
   */
  equipToTraitsDefaultRule(equip) {
    return equip
      ? equip.traits.map((trait) => {
          return {
            code: trait.code,
            dataId: trait.dataId,
            value: trait.value,
          };
        })
      : [];
  }

  /**
   * 指定した特徴IDを持つ絞り込み用トレイトを効果一覧から生成する
   * @param {MZ.Trait[]} effects 効果オブジェクト一覧
   * @param {number} traitId 特徴ID
   * @return {EquipFilter_Trait|null}
   */
  effectToFilterTrait(effects, traitId) {
    const effects_ = effects.filter((effect) => effect.code === traitId);
    if (effects_.length > 0) {
      return new EquipFilter_Trait(
        traitId,
        traitName(traitId),
        effects_
          .sort((a, b) => a.dataId - b.dataId)
          .filter((effect) => this.traitToEffectName(traitId, effect.dataId))
          .map((effect) => new EquipFilter_Effect(effect.dataId, this.traitToEffectName(traitId, effect.dataId)))
      );
    }
    return null;
  }

  /**
   * 指定した特徴ID及び効果IDから、効果名を返す
   * @param {number} traitId 特徴ID
   * @param {number} dataId 効果ID
   * @return {string|null}
   */
  traitToEffectName(traitId, dataId) {
    return (
      this._traitToEffectNameRules
        .slice()
        .reverse()
        .map((func) => func(traitId, dataId))
        .find((result) => result) || null
    );
  }

  /**
   * 指定した特徴ID及び効果IDから、効果名を返す基本ルール
   * @param {number} traitId 特徴ID
   * @param {number} dataId 効果ID
   * @return {string|null}
   */
  traitToEffectNameDefaultRule(traitId, dataId) {
    switch (traitId) {
      case Game_BattlerBase.TRAIT_ELEMENT_RATE:
      case Game_BattlerBase.TRAIT_ATTACK_ELEMENT:
        return $dataSystem.elements[dataId];
      case Game_BattlerBase.TRAIT_DEBUFF_RATE:
        return TextManager.param(dataId);
      case Game_BattlerBase.TRAIT_STATE_RATE:
      case Game_BattlerBase.TRAIT_STATE_RESIST:
      case Game_BattlerBase.TRAIT_ATTACK_STATE:
        return $dataStates[dataId].name;
      case Game_BattlerBase.TRAIT_XPARAM:
        return TextManager.xparam(dataId);
      case Game_BattlerBase.TRAIT_SPARAM:
        return TextManager.sparam(dataId);
      case Game_BattlerBase.TRAIT_PARTY_ABILITY:
        switch (dataId) {
          case 0:
            return 'エンカウント半減';
          case 1:
            return 'エンカウント無効';
          case 2:
            return '不意打ち無効';
          case 3:
            return '先制攻撃率アップ';
          case 4:
            return '獲得金額2倍';
          case 5:
            return 'アイテム入手率2倍';
        }
      case Game_BattlerBase.TRAIT_ATTACK_SPEED:
      case Game_BattlerBase.TRAIT_ATTACK_TIMES:
      case Game_BattlerBase.TRAIT_ATTACK_SKILL:
      case Game_BattlerBase.TRAIT_STYPE_ADD:
      case Game_BattlerBase.TRAIT_STYPE_SEAL:
      case Game_BattlerBase.TRAIT_SKILL_ADD:
      case Game_BattlerBase.TRAIT_SKILL_SEAL:
      case Game_BattlerBase.TRAIT_EQUIP_WTYPE:
      case Game_BattlerBase.TRAIT_EQUIP_ATYPE:
      case Game_BattlerBase.TRAIT_EQUIP_LOCK:
      case Game_BattlerBase.TRAIT_EQUIP_SEAL:
      case Game_BattlerBase.TRAIT_ACTION_PLUS:
      case Game_BattlerBase.TRAIT_SPECIAL_FLAG:
        return null;
    }
    return null;
  }

  /**
   * 独自のtraitIdを確保する
   * @deprecated DarkPlasma_AllocateUniqueTraitIdを直接利用してください。
   * @param {string} pluginName プラグイン名
   * @param {string} traitName 特徴名
   * @param {number} id ID
   * @return {number}
   */
  static allocateUniqueTraitId(pluginName, traitName, id) {
    return uniqueTraitIdCache.allocate(pluginName, id, traitName).id;
  }

  /**
   * 独自dataIdを確保する
   * @param {string} pluginName プラグイン名
   * @param {number} traitId 特徴ID
   * @param {number} id ID
   * @return {number}
   */
  static allocateUniqueDataId(pluginName, traitId, id) {
    const base = uniqueDataIds[traitId];
    if (!base) {
      throw new Error(`traitId: ${traitId} is not supported.`);
    }
    const cacheKey = `${pluginName}_${traitId}_${id}`;
    if (uniqueDataIdCache[cacheKey]) {
      return uniqueDataIdCache[cacheKey];
    }
    uniqueDataIdCache[cacheKey] = base;
    uniqueDataIds[traitId]++;
    return base;
  }
}

window.EquipFilterBuilder = EquipFilterBuilder;

class EquipFilter {
  /**
   *
   * @param {(MZ.Weapon|MZ.Armor) => MZ.Trait} equipToTraits 装備から特徴への変換
   */
  constructor(equipToTraits) {
    /**
     * @type {EquipFilter_Trait[]}
     */
    this._traits = [];
    this._equipToTraits = equipToTraits;
  }

  /**
   * @return {EquipFilter_Trait[]}
   */
  get traits() {
    return this._traits;
  }

  get traitNames() {
    return this._traits.map((trait) => trait.name);
  }

  /**
   * @param {EquipFilter_Trait} trait 絞り込み用特徴
   */
  addTrait(trait) {
    this._traits.push(trait);
  }

  /**
   * @param {number} index
   * @returns {string[]}
   */
  effectNames(index) {
    return index >= 0 && index < this._traits.length ? this._traits[index].effectNames : [];
  }

  /**
   * 特徴に対する絞り込みON/OFFの切り替え
   * @param {number} index 特徴インデックス
   */
  toggleTrait(index) {
    this._traits[index].toggle();
  }

  /**
   * 全ての特徴・効果の絞り込みをOFFにする（すべて表示する）
   */
  allOff() {
    this._traits.forEach((trait) => {
      trait.off();
      trait.allOff();
    });
  }

  /**
   * 全ての特徴の絞り込みをOFFにする（すべて表示する）
   */
  allOffTrait() {
    this._traits.forEach((trait) => trait.off());
  }

  /**
   * 指定した効果の絞り込みON/OFFの切り替え
   * @param {number} traitIndex 特徴インデックス
   * @param {number} effectIndex 効果インデックス
   */
  toggleEffect(traitIndex, effectIndex) {
    this._traits[traitIndex].toggleEffect(effectIndex);
  }

  /**
   * 指定した特徴の効果をすべて表示する
   * @param {number} traitIndex 特徴インデックス
   */
  allOffEffect(traitIndex) {
    this._traits[traitIndex].allOff();
  }

  /**
   * 効果IDを持つ特徴であるか
   * @param {number} traitIndex 特徴インデックス
   * @return {boolean}
   */
  hasDataIdTrait(traitIndex) {
    return traitIndex < this._traits.length && this._traits[traitIndex].effects.length > 0;
  }

  /**
   * 表示すべき装備であるか
   * @param {MZ.Weapon|MZ.Armor} equip 装備データ
   * @return {boolean}
   */
  isIncludedItem(equip) {
    if (this._traits.every((trait) => !trait.isIncluded())) {
      // 全表示
      return true;
    }
    const itemTraits = this._equipToTraits(equip);
    return this._traits.some(
      (trait) =>
        trait.isIncluded() &&
        trait.hasTraitItem(itemTraits) &&
        (trait.effects.every((effect) => !effect.isIncluded()) || trait.hasIncludedEffectItem(itemTraits))
    );
  }

  /**
   * 絞り込み表示対象に含まれる特徴か
   * @param {number} index 特徴インデックス
   * @return {boolean}
   */
  isIncludedTrait(index) {
    return index < this._traits.length && this._traits[index].isIncluded();
  }

  /**
   * 絞り込み表示対象に含まれる効果か
   * @param {number} traitIndex 特徴インデックス
   * @param {number} effectIndex 効果インデックス
   * @return {boolean}
   */
  isIncludedEffect(traitIndex, effectIndex) {
    return (
      traitIndex >= 0 &&
      traitIndex < this._traits.length &&
      effectIndex < this._traits[traitIndex].effects.length &&
      this._traits[traitIndex].effects[effectIndex].isIncluded()
    );
  }
}

class EquipFilter_Trait {
  /**
   * @param {number} id 特徴ID
   * @param {string} name 名前
   * @param {EquipFilter_Effect[]} effects 効果
   */
  constructor(id, name, effects) {
    this._id = id;
    this._name = name;
    this._isIncluded = false;
    this._effects = effects;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get effects() {
    return this._effects;
  }

  get effectNames() {
    return this._effects.map((effect) => effect.name);
  }

  toggle() {
    this._isIncluded = !this._isIncluded;
  }

  off() {
    this._isIncluded = false;
  }

  toggleEffect(index) {
    this._effects[index].toggle();
  }

  allOff() {
    this._effects.forEach((effect) => effect.off());
  }

  isIncluded() {
    return this._isIncluded;
  }

  /**
   * @param {MZ.Trait[]} itemTraits 特徴一覧
   * @return {boolean}
   */
  hasTraitItem(itemTraits) {
    return itemTraits.some((trait) => trait.code === this._id && !hasNoEffectTrait(trait));
  }

  /**
   * @param {MZ.Trait[]} itemTraits 特徴一覧
   * @return {boolean}
   */
  hasIncludedEffectItem(itemTraits) {
    if (!itemTraits) {
      return true;
    }
    const traits = itemTraits.filter((trait) => trait.code === this._id && !hasNoEffectTrait(trait));
    return this._effects.some((effect) => effect.isIncluded() && traits.some((trait) => trait.dataId === effect.id));
  }
}

class EquipFilter_Effect {
  /**
   * @param {number} id 効果ID
   * @param {string} name 名前
   */
  constructor(id, name) {
    this._id = id;
    this._name = name;
    this._isIncluded = false;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  toggle() {
    this._isIncluded = !this._isIncluded;
  }

  off() {
    this._isIncluded = false;
  }

  isIncluded() {
    return this._isIncluded;
  }
}

class Window_EquipFilter extends Window_Selectable {
  constructor(rect) {
    super(rect);
    this._filter = null;
    this._etypeId = null;
    this._itemWindow = null;
    this.refresh();
  }

  /**
   * @param {EquipFilter} filter フィルタ情報
   * @param {number} etypeId 装備タイプID
   */
  setFilter(filter, etypeId) {
    this._filter = filter;
    this._etypeId = etypeId;
    this.refresh();
  }

  /**
   * @param {Window_EquipItem} itemWindow 装備アイテムウィンドウ
   */
  setItemWindow(itemWindow) {
    this._itemWindow = itemWindow;
  }

  drawItem(index) {
    const rect = this.itemLineRect(index);
    if (this.isFilterOn(index)) {
      this.changeTextColor(ColorManager.textColor(settings.selectedItemColor));
    } else {
      this.resetTextColor();
    }
    this.drawText(this._data[index], rect.x, rect.y, rect.width, 'left');
  }

  maxItems() {
    return this._data.length;
  }

  processOk() {
    if (this.index() < this.filterNameList().length) {
      this.playOkSound();
      this.toggleFilter();
      if (this.isHandled('ok') && this.isFilterOn(this.index()) && this.needsOkHandler(this.index())) {
        this.callOkHandler();
      }
      this.refresh();
    } else if (this.index() === this.filterNameList().length) {
      this.playCursorSound();
      this.allOff();
      this.refresh();
    } else {
      this.processCancel();
    }
    this.updateInputData();
  }

  isOkEnabled() {
    return true;
  }

  isFilterOn(index) {
    return false;
  }

  toggleFilter() {
    this._itemWindow.select(0);
    this._itemWindow.scrollTo(0, 0);
  }

  allOff() {}

  filterNameList() {
    return [];
  }

  refresh() {
    this._data = this.filterNameList().concat(['すべて表示', '閉じる']);
    if (this._itemWindow) {
      this._itemWindow.refresh();
    }
    super.refresh();
  }

  needsOkHandler(index) {
    return false;
  }
}

class Window_EquipFilterTrait extends Window_EquipFilter {
  filterNameList() {
    return this._filter ? this._filter.traitNames : [];
  }

  toggleFilter() {
    super.toggleFilter();
    this._filter.toggleTrait(this.index());
  }

  allOff() {
    this._filter.allOffTrait();
  }

  isFilterOn(index) {
    return this._filter && this._filter.isIncludedTrait(index);
  }

  needsOkHandler(index) {
    return this._filter && this._filter.hasDataIdTrait(index);
  }
}

class Window_EquipFilterEffect extends Window_EquipFilter {
  /**
   * @param {Window_EquipFilterTrait} filterTraitWindow 特徴ウィンドウ
   */
  setFilterTraitWindow(filterTraitWindow) {
    this._filterTraitWindow = filterTraitWindow;
  }

  filterNameList() {
    return this._filter && this._filterTraitWindow ? this._filter.effectNames(this._filterTraitWindow.index()) : [];
  }

  toggleFilter() {
    super.toggleFilter();
    this._filter.toggleEffect(this._filterTraitWindow.index(), this.index());
  }

  allOff() {
    this._filter.allOffEffect(this._filterTraitWindow.index());
  }

  isFilterOn(index) {
    return this._filter && this._filter.isIncludedEffect(this._filterTraitWindow.index(), index);
  }
}

Window_CustomKeyHandlerMixIn('shift', Window_EquipItem.prototype);
Window_CustomKeyHandlerMixIn('shift', Window_EquipFilterTrait.prototype);
Window_CustomKeyHandlerMixIn('shift', Window_EquipFilterEffect.prototype);

Window_EquipItem.prototype.setFilter = function (filter, etypeId) {
  if (this.etypeId() !== etypeId) {
    this._filter = filter;
    this.refresh();
  }
};

const _Window_EquipItem_includes = Window_EquipItem.prototype.includes;
Window_EquipItem.prototype.includes = function (item) {
  return _Window_EquipItem_includes.call(this, item) && (!this._filter || this._filter.isIncludedItem(item));
};
