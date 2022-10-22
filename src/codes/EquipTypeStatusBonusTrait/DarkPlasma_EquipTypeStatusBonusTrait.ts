/// <reference path="./EquipTypeStatusBonusTrait.d.ts" />

import { pluginName } from '../../common/pluginName';
import { hasTraits } from '../../common/data/hasTraits';

const localTraitIdStart = 1;
const paramPlusWithWeaponTypeTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitIdStart, "武器タイプ能力値");
const xparamPlusWithWeaponTypeTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitIdStart + 1, "武器タイプ追加能力値");
const paramPlusWithArmorTypeTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitIdStart + 2, "防具タイプ能力値");
const xparamPlusWithArmorTypeTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitIdStart + 3, "防具タイプ追加能力値");

const PARAM_KEYS = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
const XPARAM_KEYS = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];

function dataIdFromTypeIdAndParamId(typeId: number, paramId: number) {
  return typeId * 10 + paramId;
}

class ParamPlusWithEquipTypeTrait {
  _typeId: number;
  _statusType: string;
  _value: number;

  constructor(typeName: string, statusType: string, value: number) {
    const typeId = this.types().findIndex(type => type === typeName.trim());
    if (typeId < 0) {
      throw Error(`存在しない武器・防具タイプが設定されています :${typeName}`);
    }
    if (!PARAM_KEYS.includes(statusType) && !XPARAM_KEYS.includes(statusType)) {
      throw Error(`不正なステータスが設定されています :${statusType}`);
    }
    this._typeId = typeId;
    this._statusType = statusType;
    this._value = value;
  }

  static fromTag(tag: string): ParamPlusWithEquipTypeTrait {
    const traitParams = tag.split(':');
    const clazz = this;
    return new clazz(traitParams[0], traitParams[1], Number(traitParams[2]));
  }

  types(): string[] {
    return [];
  }

  traitId(): number {
    return 0;
  }

  /**
   * タイプIDと能力値IDの両方の情報を強引に含める
   */
  dataId(): number {
    return dataIdFromTypeIdAndParamId(this._typeId, this.paramId());
  }

  paramId(): number {
    return this.isXParam() ? XPARAM_KEYS.indexOf(this._statusType) : PARAM_KEYS.indexOf(this._statusType);
  }

  trait(): MZ.Trait {
    return {
      code: this.traitId(),
      dataId: this.dataId(),
      value: this.isXParam() ? this._value/100 : this._value,
    };
  }

  isXParam() {
    return XPARAM_KEYS.includes(this._statusType);
  }
}

class ParamPlusWithWeaponTypeTrait extends ParamPlusWithEquipTypeTrait {
  types() {
    return $dataSystem?.weaponTypes || [];
  }

  traitId() {
    return this.isXParam() ? xparamPlusWithWeaponTypeTraitId.id : paramPlusWithWeaponTypeTraitId.id;
  }
}

class ParamPlusWithArmorTypeTrait extends ParamPlusWithEquipTypeTrait {
  types() {
    return $dataSystem?.armorTypes || [];
  }

  traitId() {
    return this.isXParam() ? xparamPlusWithArmorTypeTraitId.id : paramPlusWithArmorTypeTraitId.id;
  }
}

function DataManager_EquipTypeStatusBonusTraitMixIn(dataManager: typeof DataManager) {
  dataManager.loadExtraTraits = function () {
    this._databaseFiles.map(database => globalThis[database.name])
      .forEach(database => {
        if (Array.isArray(database)) {
          database.forEach(data => {
            if (data && "note" in data) {
              this.extractExtraTraits(data);
            }
          })
        }
      })
  };

  dataManager.extractExtraTraits = function(data) {
    if (hasTraits(data)) {
      if (data.meta.weaponTypeBonus) {
        String(data.meta.weaponTypeBonus).split('\n')
          .filter(bonus => bonus)
          .map(bonus => ParamPlusWithWeaponTypeTrait.fromTag(bonus).trait())
          .forEach(trait => data.traits.push(trait));
      }
      if (data.meta.armorTypeBonus) {
        String(data.meta.armorTypeBonus).split('\n')
          .filter(bonus => bonus)
          .map(bonus => ParamPlusWithArmorTypeTrait.fromTag(bonus).trait())
          .forEach(trait => data.traits.push(trait));
      }
    }
  }
}

DataManager_EquipTypeStatusBonusTraitMixIn(DataManager);

function Scene_Boot_EquipTypeStatusBonusTraitMixIn(sceneBoot: Scene_Boot) {
  const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
  sceneBoot.onDatabaseLoaded = function () {
    _onDatabaseLoaded.call(this);
    this.loadExtraTraits();
  };

  /**
   * 装備種別によるボーナス特徴は、装備種別一覧を含む $dataSystem がロード済みであることがロードの前提
   * データベースのロードが完了した後に、metaを加工してtraitsを追加する
   */
  sceneBoot.loadExtraTraits = function () {
    DataManager.loadExtraTraits();
  };
}

Scene_Boot_EquipTypeStatusBonusTraitMixIn(Scene_Boot.prototype);

function Game_Actor_EquipTypeStatusBonusTraitMixIn(gameActor: Game_Actor) {
  const _paramPlus = gameActor.paramPlus;
  gameActor.paramPlus = function (paramId) {
    return _paramPlus.call(this, paramId) + this.paramPlusWithEquipTraits(paramId);
  };

  gameActor.paramPlusWithEquipTraits = function (paramId) {
    return this.validParamPlusWithEquipTraits(paramId).reduce((result, trait) => result + trait.value, 0);
  };

  gameActor.validParamPlusWithEquipTraits = function (paramId: number) {
    return this.equips().filter(equip => equip).reduce((result: MZ.Trait[], equip) => {
      const dataId = DataManager.isWeapon(equip)
        ? dataIdFromTypeIdAndParamId(equip.wtypeId, paramId)
        : dataIdFromTypeIdAndParamId(equip.atypeId, paramId);
      const traitId = DataManager.isWeapon(equip)
        ? paramPlusWithWeaponTypeTraitId.id
        : paramPlusWithArmorTypeTraitId.id;
      return result.concat(this.traitsWithId(traitId, dataId));
    }, []);
  };

  const _xparam = gameActor.xparam;
  gameActor.xparam = function (xparamId) {
    return _xparam.call(this, xparamId) + this.xparamPlusWithEquipTraits(xparamId);
  };

  gameActor.xparamPlusWithEquipTraits = function (xparamId) {
    return this.validXParamPlusWithEquipTraits(xparamId).reduce((result, trait) => result + trait.value, 0);
  };

  gameActor.validXParamPlusWithEquipTraits = function (xparamId: number) {
    return this.equips().filter(equip => equip).reduce((result: MZ.Trait[], equip) => {
      const dataId = DataManager.isWeapon(equip)
        ? dataIdFromTypeIdAndParamId(equip.wtypeId, xparamId)
        : dataIdFromTypeIdAndParamId(equip.atypeId, xparamId);
      const traitId = DataManager.isWeapon(equip)
        ? xparamPlusWithWeaponTypeTraitId.id
        : xparamPlusWithArmorTypeTraitId.id;
      return result.concat(this.traitsWithId(traitId, dataId));
    }, []);
  }
}

Game_Actor_EquipTypeStatusBonusTraitMixIn(Game_Actor.prototype);
