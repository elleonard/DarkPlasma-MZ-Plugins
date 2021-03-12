const _Game_Actor_meetsItemConditions = Game_Actor.prototype.meetsItemConditions;
Game_Actor.prototype.meetsItemConditions = function (item) {
  return _Game_Actor_meetsItemConditions.call(this, item) && !this.isItemSealed(item);
};

Game_Actor.prototype.isItemSealed = function (item) {
  return this.traitObjects().some((object) => {
    return (
      DataManager.sealItems(object).includes(item.id) ||
      (object.meta.sealHealItem && DataManager.isHealItem(item)) ||
      (object.meta.sealResurrectionItem && DataManager.isResurrectionItem(item))
    );
  });
};

/**
 * 特徴を持つオブジェクトから、封印アイテムID一覧を取得する
 * @param { {traits: MZ.Trait[]} } object 特徴を持つオブジェクト
 * @return {Number[]}
 */
DataManager.sealItems = function (object) {
  return object.meta.sealItems ? object.meta.sealItems.split(',').map((itemId) => Number(itemId)) : [];
};

/**
 * ダメージタイプが回復であるようなアイテムか
 * @param {MZ.Item} item アイテムデータ
 * @return {boolean}
 */
DataManager.isHealItem = function (item) {
  return [3, 4].includes(item.damage.type);
};

/**
 * 戦闘不能を解除する効果を持つアイテムか
 * @param {MZ.Item} item アイテムデータ
 * @return {boolean}
 */
DataManager.isResurrectionItem = function (item) {
  return item.effects.some(
    (effect) =>
      effect.code === Game_Action.EFFECT_REMOVE_STATE && effect.dataId === Game_BattlerBase.prototype.deathStateId()
  );
};
