Game_BattlerBase.prototype.hpCostRate = function () {
  return this.traitObjects()
    .reduce((result, object) => result.concat(object.meta.hpCostRate), [])
    .filter((hpCostRate) => !!hpCostRate)
    .reduce((result, hpCostRate) => result * Number(hpCostRate), 1);
};
