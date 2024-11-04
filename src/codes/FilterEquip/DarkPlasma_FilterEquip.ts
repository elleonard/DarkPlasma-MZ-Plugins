/// <reference path="./FilterEquip.d.ts" />
import { settings } from './_build/DarkPlasma_FilterEquip_parameters';

const FILTER_HANDLER_NAME = 'filter';

function ColorManager_FilterEquipMixIn(colorManager: typeof ColorManager) {
  colorManager.filterOnColor = function () {
    return typeof settings.selectedItemColor === "string"
      ? settings.selectedItemColor
      : this.textColor(settings.selectedItemColor);
  };
}

ColorManager_FilterEquipMixIn(ColorManager);

function Scene_Equip_FilterEquipMixIn(sceneEquip: Scene_Equip) {
  const _create = sceneEquip.create;
  sceneEquip.create = function () {
    _create.call(this);
    this.createFilterWindows();
  };
  
  const _createItemWindow = sceneEquip.createItemWindow;
  sceneEquip.createItemWindow = function () {
    _createItemWindow.call(this);
    this._itemWindow.setHandler(FILTER_HANDLER_NAME, this.onFilterOpen.bind(this));
  };
  
  /**
   * 装備の絞り込み機能用のウィンドウを生成する
   */
  sceneEquip.createFilterWindows = function () {
    this._filterWindowLayer = new WindowLayer();
    this._filterWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._filterWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._filterWindowLayer);
  
    this._filterTraitWindow = new Window_EquipFilterTrait(this.equipFilterTraitWindowRect());
    this._filterTraitWindow.setHandler('ok', this.onFilterTraitOk.bind(this));
    this._filterTraitWindow.setHandler(FILTER_HANDLER_NAME, this.onFilterClose.bind(this));
    this._filterTraitWindow.setHandler('cancel', this.onFilterClose.bind(this));
    this._filterTraitWindow.setItemWindow(this._itemWindow);
    this._filterTraitWindow.hide();
    this._filterWindowLayer.addChild(this._filterTraitWindow);
  
    this._filterEffectWindow = new Window_EquipFilterEffect(this.equipFilterEffectWindowRect());
    this._filterEffectWindow.setHandler(FILTER_HANDLER_NAME, this.onFilterClose.bind(this));
    this._filterEffectWindow.setHandler('cancel', this.onFilterEffectCancel.bind(this));
    this._filterEffectWindow.setItemWindow(this._itemWindow);
    this._filterEffectWindow.setFilterTraitWindow(this._filterTraitWindow);
    this._filterEffectWindow.hide();
    this._filterWindowLayer.addChild(this._filterEffectWindow);
  
    this.refreshFilter();
  };
  
  sceneEquip.equipFilterTraitWindowRect = function () {
    const y = this._statusWindow.paramY(0);
    return new Rectangle(0, y, this._statusWindow.width / 2, Graphics.boxHeight - y - this._helpWindow.height);
  };
  
  sceneEquip.equipFilterEffectWindowRect = function () {
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
  sceneEquip.refreshFilter = function (this: Scene_Equip) {
    this._filters = this.actor()
      .equipSlots()
      .map((etypeId: number) => {
        const equips: (MZ.Weapon|MZ.Armor)[] = $gameParty.allItems()
          .filter((item): item is MZ.Weapon|MZ.Armor => !DataManager.isItem(item) && this.actor().canEquip(item) && item.etypeId === etypeId);
        return this.equipFilterBuilder(equips).build();
      });
  };
  
  /**
   * 絞り込み用データビルダー
   * @param {MZ.Weapon[]|MZ.Armor[]} equips 装備データ一覧
   * @return {EquipFilterBuilder}
   */
  sceneEquip.equipFilterBuilder = function (equips: (MZ.Weapon|MZ.Armor)[]): EquipFilterBuilder {
    return new EquipFilterBuilder(equips);
  };
  
  const _onActorChange = sceneEquip.onActorChange;
  sceneEquip.onActorChange = function () {
    this.refreshFilter();
    this._filterTraitWindow.setFilter(this._filters[0]);
    this._filterEffectWindow.setFilter(this._filters[0]);
    _onActorChange.call(this);
  };
  
  const _executeEquipChange = sceneEquip.executeEquipChange;
  sceneEquip.executeEquipChange = function () {
    _executeEquipChange.call(this);
    this.refreshFilter();
  };
  
  /**
   * 絞り込みモード開始
   */
  sceneEquip.onFilterOpen = function () {
    this._itemWindow.deactivate();
    const slotId = this._slotWindow.index();
    this._filterTraitWindow.setFilter(this._filters[slotId]);
    this._filterTraitWindow.show();
    this._filterTraitWindow.activate();
    this._filterTraitWindow.select(0);
    this._filterTraitWindow.scrollTo(0, 0);
  };
  
  /**
   * 絞り込みモード終了
   */
  sceneEquip.onFilterClose = function () {
    this._filterTraitWindow.hide();
    this._filterEffectWindow.hide();
    this._itemWindow.activate();
    this._itemWindow.select(0);
    this._itemWindow.scrollTo(0, 0);
  };

  sceneEquip.isFilterMode = function () {
    return this._filterTraitWindow.active || this._filterEffectWindow.active;
  };
  
  sceneEquip.onFilterTraitOk = function () {
    this._filterTraitWindow.deactivate();
    const slotId = this._slotWindow.index();
    this._filterEffectWindow.setFilter(this._filters[slotId]);
    this._filterEffectWindow.show();
    this._filterEffectWindow.activate();
    this._filterEffectWindow.select(0);
    this._filterEffectWindow.scrollTo(0, 0);
  };
  
  sceneEquip.onFilterEffectCancel = function () {
    this._filterEffectWindow.hide();
    this._filterTraitWindow.activate();
  };
  
  const _onSlotOk = sceneEquip.onSlotOk;
  sceneEquip.onSlotOk = function (this: Scene_Equip) {
    this._itemWindow.setFilter(this._filters[this._slotWindow.index()]);
    _onSlotOk.call(this);
  };
  
  const _onItemCancel = sceneEquip.onItemCancel;
  sceneEquip.onItemCancel = function () {
    _onItemCancel.call(this);
    this._filters[this._slotWindow.index()].allOff();
  };
}

Scene_Equip_FilterEquipMixIn(Scene_Equip.prototype);

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
function traitName(traitId: number): string {
  return TRAIT_NAMES[traitId] || uniqueTraitIdCache.nameByTraitId(traitId) || '';
}

/**
 * 効果のない特徴（回避率+0％など）であるか
 * @param {MZ.Trait} trait
 * @return {boolean}
 */
function hasNoEffectTrait(trait: MZ.Trait): boolean {
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
  _equips: (MZ.Weapon|MZ.Armor)[];
  _equipToTraitsRules: ((equip: MZ.Weapon|MZ.Armor) => MZ.Trait[])[];
  _traitToEffectNameRules: ((traitId: number, dataId: number) => string|null)[];
  _traitIdList: number[];
  /**
   * @param {(MZ.Weapon|MZ.Armor)[]} equips 装備
   */
  constructor(equips: (MZ.Weapon|MZ.Armor)[]) {
    this._equips = equips;
    this._equipToTraitsRules = [this.equipToTraitsDefaultRule];
    this._traitToEffectNameRules = [this.traitToEffectNameDefaultRule];
    this._traitIdList = this.defaultTraitList();
  }

  /**
   * 装備を絞り込み用trait配列に変換するルールを追加する
   * @param {(equip: MZ.Weapon|MZ.Armor) => MZ.Trait[]} ruleFunction
   */
  withEquipToTraitsRule(ruleFunction: ((equip: MZ.Weapon|MZ.Armor) => MZ.Trait[])) {
    this._equipToTraitsRules.push(ruleFunction);
    return this;
  }

  /**
   * 指定した特徴ID及び効果IDから、効果名を返すルールを追加する
   * @param {(traitId: number, dataId: number) => string|null} ruleFunction
   */
  withTraitToEffectNameRule(ruleFunction: (traitId: number, dataId: number) => string|null) {
    this._traitToEffectNameRules.push(ruleFunction);
    return this;
  }

  /**
   * 独自に特徴IDを追加する
   * @param {number} traitId 特徴ID
   */
  withTrait(traitId: number) {
    this._traitIdList.push(traitId);
    return this;
  }

  /**
   * 表示対象外とする特徴IDを指定する
   * @param {number} traitId 特徴ID
   */
  withoutTrait(traitId: number) {
    this._traitIdList = this._traitIdList.filter((id) => id !== traitId);
    return this;
  }

  /**
   * @return {EquipFilter}
   */
  build(): EquipFilter {
    const effects: MZ.Trait[] = [
      ...new Map<string, MZ.Trait>(
        this._equips
          .reduce((result: MZ.Trait[], equip: MZ.Weapon|MZ.Armor) => result.concat(this.equipToTraits(equip)), [])
          .filter((trait: MZ.Trait) => !hasNoEffectTrait(trait))
          .map((trait: MZ.Trait) => [`${trait.code}:${trait.dataId}`, trait])
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
  traitList(): number[] {
    return this._traitIdList;
  }

  /**
   * 特徴IDリストの基本セット
   * @return {number[]}
   */
  defaultTraitList(): number[] {
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
  equipToTraits(equip: MZ.Weapon|MZ.Armor): MZ.Trait[] {
    return this._equipToTraitsRules.map((func) => func(equip)).reduce((result, traits) => result.concat(traits), []);
  }

  /**
   * 装備を絞り込み用trait配列に変換する基本ルール
   * @param {MZ.Weapon|MZ.Armor} equip 装備
   * @return {MZ.Trait[]}
   */
  equipToTraitsDefaultRule(equip: MZ.Weapon|MZ.Armor): MZ.Trait[] {
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
  effectToFilterTrait(effects: MZ.Trait[], traitId: number): EquipFilter_Trait|null {
    const effects_ = effects.filter((effect) => effect.code === traitId);
    if (effects_.length > 0) {
      return new EquipFilter_Trait(
        traitId,
        traitName(traitId),
        effects_
          .sort((a, b) => a.dataId - b.dataId)
          .filter((effect) => this.traitToEffectName(traitId, effect.dataId))
          .map((effect) => new EquipFilter_Effect(effect.dataId, this.traitToEffectName(traitId, effect.dataId)!))
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
  traitToEffectName(traitId: number, dataId: number): string|null {
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
  traitToEffectNameDefaultRule(traitId: number, dataId: number): string|null {
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
        break;
      case Game_BattlerBase.TRAIT_SPECIAL_FLAG:
        switch (dataId) {
          case 0:
            return '自動戦闘';
          case 1:
            return '防御';
          case 2:
            return '身代わり';
          case 3:
            return 'TP持ち越し';
        }
        break;
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
        return null;
    }
    return null;
  }
}


class EquipFilter {
  _traits: EquipFilter_Trait[];
  _equipToTraits: (equip: MZ.Weapon|MZ.Armor) => MZ.Trait[];
  /**
   *
   * @param {(MZ.Weapon|MZ.Armor) => MZ.Trait} equipToTraits 装備から特徴への変換
   */
  constructor(equipToTraits: (equip: MZ.Weapon|MZ.Armor) => MZ.Trait[]) {
    /**
     * @type {EquipFilter_Trait[]}
     */
    this._traits = [];
    this._equipToTraits = equipToTraits;
  }

  /**
   * @return {EquipFilter_Trait[]}
   */
  get traits(): EquipFilter_Trait[] {
    return this._traits;
  }

  get traitNames() {
    return this._traits.map((trait) => trait.name);
  }

  /**
   * @param {EquipFilter_Trait} trait 絞り込み用特徴
   */
  addTrait(trait: EquipFilter_Trait) {
    this._traits.push(trait);
  }

  /**
   * @param {number} index
   * @returns {string[]}
   */
  effectNames(index: number): string[] {
    return index >= 0 && index < this._traits.length ? this._traits[index].effectNames : [];
  }

  /**
   * 特徴に対する絞り込みON/OFFの切り替え
   * @param {number} index 特徴インデックス
   */
  toggleTrait(index: number) {
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

  toggleEffectByName(traitIndex: number, effectName: string) {
    this._traits[traitIndex].toggleEffectByName(effectName);
  }

  /**
   * 指定した特徴の効果をすべて表示する
   * @param {number} traitIndex 特徴インデックス
   */
  allOffEffect(traitIndex: number) {
    this._traits[traitIndex].allOff();
  }

  /**
   * 効果IDを持つ特徴であるか
   * @param {number} traitIndex 特徴インデックス
   * @return {boolean}
   */
  hasDataIdTrait(traitIndex: number): boolean {
    return traitIndex < this._traits.length && this._traits[traitIndex].effects.length > 0;
  }

  /**
   * 表示すべき装備であるか
   * @param {MZ.Weapon|MZ.Armor} equip 装備データ
   * @return {boolean}
   */
  isIncludedItem(equip: MZ.Weapon|MZ.Armor): boolean {
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
  isIncludedTrait(index: number): boolean {
    return index < this._traits.length && this._traits[index].isIncluded();
  }

  /**
   * 絞り込み表示対象に含まれる効果か
   */
  isIncludedEffect(traitIndex: number, effectName: string): boolean {
    return (
      traitIndex >= 0 &&
      traitIndex < this._traits.length &&
      !!this._traits[traitIndex].effects.find(effect => effect.name === effectName)?.isIncluded()
    );
  }
}

class EquipFilter_Trait {
  _id: number;
  _name: string;
  _isIncluded: boolean;
  _effects: EquipFilter_Effect[];
  /**
   * @param {number} id 特徴ID
   * @param {string} name 名前
   * @param {EquipFilter_Effect[]} effects 効果
   */
  constructor(id: number, name: string, effects: EquipFilter_Effect[]) {
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
    return [...new Set(this._effects.map((effect) => effect.name))];
  }

  toggle() {
    this._isIncluded = !this._isIncluded;
  }

  off() {
    this._isIncluded = false;
  }

  toggleEffectByName(name: string) {
    this._effects.filter(effect => effect.name === name).forEach(effect => effect.toggle());
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
  hasTraitItem(itemTraits: MZ.Trait[]): boolean {
    return itemTraits.some((trait) => trait.code === this._id && !hasNoEffectTrait(trait));
  }

  /**
   * @param {MZ.Trait[]} itemTraits 特徴一覧
   * @return {boolean}
   */
  hasIncludedEffectItem(itemTraits: MZ.Trait[]): boolean {
    if (!itemTraits) {
      return true;
    }
    const traits = itemTraits.filter((trait) => trait.code === this._id && !hasNoEffectTrait(trait));
    return this._effects.some((effect) => effect.isIncluded() && traits.some((trait) => trait.dataId === effect.id));
  }
}

class EquipFilter_Effect {
  _id: number;
  _name: string;
  _isIncluded: boolean;
  /**
   * @param {number} id 効果ID
   * @param {string} name 名前
   */
  constructor(id: number, name: string) {
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
  _filter: EquipFilter|null;
  _itemWindow: Window_EquipItem|null;
  _data: string[];

  constructor(rect: Rectangle) {
    super(rect);
    this._filter = null;
    this._itemWindow = null;
    this.refresh();
  }

  /**
   * @param {EquipFilter} filter フィルタ情報
   */
  setFilter(filter: EquipFilter) {
    this._filter = filter;
    this.refresh();
  }

  /**
   * @param {Window_EquipItem} itemWindow 装備アイテムウィンドウ
   */
  setItemWindow(itemWindow: Window_EquipItem) {
    this._itemWindow = itemWindow;
  }

  drawItem(index: number) {
    const rect = this.itemLineRect(index);
    if (this.isFilterOn(index)) {
      this.changeTextColor(ColorManager.filterOnColor());
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

  isFilterOn(index: number) {
    return false;
  }

  toggleFilter() {
    this._itemWindow?.select(0);
    this._itemWindow?.scrollTo(0, 0);
  }

  allOff() {}

  filterNameList(): string[] {
    return [];
  }

  refresh() {
    this._data = this.filterNameList().concat(['すべて表示', '閉じる']);
    if (this._itemWindow) {
      this._itemWindow.refresh();
    }
    super.refresh();
  }

  needsOkHandler(index: number) {
    return false;
  }
}

class Window_EquipFilterTrait extends Window_EquipFilter {
  filterNameList() {
    return this._filter ? this._filter.traitNames : [];
  }

  toggleFilter() {
    super.toggleFilter();
    this._filter?.toggleTrait(this.index());
  }

  allOff() {
    this._filter?.allOffTrait();
  }

  isFilterOn(index: number) {
    return !!this._filter && this._filter.isIncludedTrait(index);
  }

  needsOkHandler(index: number) {
    return !!this._filter && this._filter.hasDataIdTrait(index);
  }
}

/**
 * dataIdの名前一覧
 */
class Window_EquipFilterEffect extends Window_EquipFilter {
  _filterTraitWindow: Window_EquipFilterTrait;
  /**
   * @param {Window_EquipFilterTrait} filterTraitWindow 特徴ウィンドウ
   */
  setFilterTraitWindow(filterTraitWindow: Window_EquipFilterTrait) {
    this._filterTraitWindow = filterTraitWindow;
  }

  filterNameList() {
    return this._filter && this._filterTraitWindow ? this._filter.effectNames(this._filterTraitWindow.index()) : [];
  }

  toggleFilter() {
    super.toggleFilter();
    this._filter?.toggleEffectByName(this._filterTraitWindow.index(), this.filterNameList()[this.index()]);
  }

  allOff() {
    this._filter?.allOffEffect(this._filterTraitWindow.index());
  }

  isFilterOn(index: number) {
    return !!this._filter && this._filter.isIncludedEffect(this._filterTraitWindow.index(), this.filterNameList()[index]);
  }
}

Window_CustomKeyHandlerMixIn(settings.key, Window_EquipItem.prototype, FILTER_HANDLER_NAME);
Window_CustomKeyHandlerMixIn(settings.key, Window_EquipFilterTrait.prototype, FILTER_HANDLER_NAME);
Window_CustomKeyHandlerMixIn(settings.key, Window_EquipFilterEffect.prototype, FILTER_HANDLER_NAME);

function Window_EquipItem_FilterEquipMixIn(windowClass: Window_EquipItem) {
  windowClass.setFilter = function (filter) {
    if (this._filter !== filter) {
      this._filter = filter;
      this.refresh();
    }
  };
  
  const _includes = windowClass.includes;
  windowClass.includes = function (item) {
    return _includes.call(this, item) && (!this._filter || this._filter.isIncludedItem(item));
  };
  
}

Window_EquipItem_FilterEquipMixIn(Window_EquipItem.prototype);

type _EquipFilterBuilder = typeof EquipFilterBuilder;
declare global {
  var EquipFilterBuilder: _EquipFilterBuilder;
}
globalThis.EquipFilterBuilder = EquipFilterBuilder;

