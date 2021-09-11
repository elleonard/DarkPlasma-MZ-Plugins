import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_FilterEquip_RecentlyGained_parameters';

function Game_Party_FilterEquipRecentlyGainedMixIn(gameParty) {
  const _gainItem = gameParty.gainItem;
  gameParty.gainItem = function (item, amount, includeEquip) {
    _gainItem.call(this, item, amount, includeEquip);
    if (amount > 0) {
      if (DataManager.isWeapon(item)) {
        this.pushGainWeaponHistory(item);
      } else if (DataManager.isArmor(item)) {
        this.pushGainArmorHistory(item);
      }
    }
  };

  /**
   * @param {MZ.Weapon} weapon 武器データ
   */
  gameParty.pushGainWeaponHistory = function (weapon) {
    if (!this._gainWeaponHistory) {
      this._gainWeaponHistory = [];
    }
    this._gainWeaponHistory.push(weapon.id);
    if (this._gainWeaponHistory.length > settings.threshold) {
      this._gainWeaponHistory.shift();
    }
  };

  /**
   * @param {MZ.Armor} armor 防具データ
   */
  gameParty.pushGainArmorHistory = function (armor) {
    if (!this._gainArmorHistory) {
      this._gainArmorHistory = [];
    }
    this._gainArmorHistory.push(armor.id);
    if (this._gainArmorHistory.length > settings.threshold) {
      this._gainArmorHistory.shift();
    }
  };

  /**
   * 最近入手した武器ID一覧
   * @return {number[]}
   */
  gameParty.gainWeaponHistory = function () {
    return this._gainWeaponHistory || [];
  };

  /**
   * 最近入手した防具ID一覧
   * @return {number[]}
   */
  gameParty.gainArmorHistory = function () {
    return this._gainArmorHistory || [];
  };

  /**
   * 最近入手したアイテムかどうか
   * @param {MZ.Item|MZ.Weapon|MZ.Armor} item アイテムデータ
   * @return {boolean}
   */
  gameParty.isRecentlyGainded = function (item) {
    if (DataManager.isWeapon(item)) {
      return this.gainWeaponHistory().includes(item.id);
    } else if (DataManager.isArmor(item)) {
      return this.gainArmorHistory().includes(item.id);
    }
    return false;
  };
}

Game_Party_FilterEquipRecentlyGainedMixIn(Game_Party.prototype);

const traitIds = [];

const _Scene_Equip_equipFilterBuilder = Scene_Equip.prototype.equipFilterBuilder;
Scene_Equip.prototype.equipFilterBuilder = function (equips) {
  const ALLOCATION_TRAIT_ID_RECENTLY_GAINED = 0;
  traitIds[ALLOCATION_TRAIT_ID_RECENTLY_GAINED] = EquipFilterBuilder.allocateUniqueTraitId(
    pluginName,
    settings.traitName,
    ALLOCATION_TRAIT_ID_RECENTLY_GAINED
  );
  const builder = _Scene_Equip_equipFilterBuilder(equips);
  return builder.withTrait(traitIds[ALLOCATION_TRAIT_ID_RECENTLY_GAINED]).withEquipToTraitsRule((equip) => {
    return $gameParty.isRecentlyGainded(equip)
      ? [
          {
            code: traitIds[ALLOCATION_TRAIT_ID_RECENTLY_GAINED],
            dataId: 1, // dummy
            value: 1, // dummy
          },
        ]
      : [];
  });
};
