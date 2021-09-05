import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_FilterEquip_RecentlyGained_parameters';

Game_Party = class extends Game_Party {
  gainItem(item, amount, includeEquip) {
    super.gainItem(item, amount, includeEquip);
    if (amount > 0) {
      if (DataManager.isWeapon(item)) {
        this.pushGainWeaponHistory(item);
      } else if (DataManager.isArmor(item)) {
        this.pushGainArmorHistory(item);
      }
    }
  }

  /**
   * @param {MZ.Weapon} weapon 武器データ
   */
  pushGainWeaponHistory(weapon) {
    if (!this._gainWeaponHistory) {
      this._gainWeaponHistory = [];
    }
    this._gainWeaponHistory.push(weapon.id);
    if (this._gainWeaponHistory.length > settings.threshold) {
      this._gainWeaponHistory.shift();
    }
  }

  /**
   * @param {MZ.Armor} armor 防具データ
   */
  pushGainArmorHistory(armor) {
    if (!this._gainArmorHistory) {
      this._gainArmorHistory = [];
    }
    this._gainArmorHistory.push(armor.id);
    if (this._gainArmorHistory.length > settings.threshold) {
      this._gainArmorHistory.shift();
    }
  }

  /**
   * 最近入手した武器ID一覧
   * @return {number[]}
   */
  gainWeaponHistory() {
    return this._gainWeaponHistory || [];
  }

  /**
   * 最近入手した防具ID一覧
   * @return {number[]}
   */
  gainArmorHistory() {
    return this._gainArmorHistory || [];
  }

  /**
   * 最近入手したアイテムかどうか
   * @param {MZ.Item|MZ.Weapon|MZ.Armor} item アイテムデータ
   * @return {boolean}
   */
  isRecentlyGainded(item) {
    if (DataManager.isWeapon(item)) {
      return this.gainWeaponHistory().includes(item.id);
    } else if (DataManager.isArmor(item)) {
      return this.gainArmorHistory().includes(item.id);
    }
    return false;
  }
};

const traitIds = [];

Scene_Equip = class extends Scene_Equip {
  equipFilterBuilder(equips) {
    const ALLOCATION_TRAIT_ID_RECENTLY_GAINED = 0;
    traitIds[ALLOCATION_TRAIT_ID_RECENTLY_GAINED] = EquipFilterBuilder.allocateUniqueTraitId(
      pluginName,
      settings.traitName,
      ALLOCATION_TRAIT_ID_RECENTLY_GAINED
    );
    const builder = super.equipFilterBuilder(equips);
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
  }
};
