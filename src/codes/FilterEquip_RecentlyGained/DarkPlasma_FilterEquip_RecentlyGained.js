import { settings } from './_build/DarkPlasma_FilterEquip_RecentlyGained_parameters';

Game_Party = class extends Game_Party {
  gainItem(item, amount, includeEquip) {
    super.gainItem(item, amount, includeEquip);
    const container = this.itemContainer(item);
    if (container) {
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
};
