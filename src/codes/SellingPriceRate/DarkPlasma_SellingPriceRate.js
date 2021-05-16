import { settings } from './_build/DarkPlasma_SellingPriceRate_parameters';

Scene_Shop.prototype.sellingPrice = function () {
  return Math.floor(this._item.price / (100 / settings.sellingPriceRate));
};
