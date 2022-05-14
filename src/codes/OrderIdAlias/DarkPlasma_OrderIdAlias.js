import { orderIdSort } from '../../common/orderIdSort';
import { settings } from './_build/DarkPlasma_OrderIdAlias_parameters';

const _DataManager_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _DataManager_extractMetadata.call(this, data);
  data.orderId = Number(data.meta.OrderId || data.id);
};

const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
Window_ItemList.prototype.makeItemList = function () {
  _Window_ItemList_makeItemList.call(this);
  this._data.sort(orderIdSort);
};

const _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
Window_SkillList.prototype.makeItemList = function () {
  _Window_SkillList_makeItemList.call(this);
  if (settings.sortSkillById) {
    this._data.sort(orderIdSort);
  }
};
