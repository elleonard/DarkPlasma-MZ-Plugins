/// <reference path="./OrderIdAlias.d.ts" />
import { orderIdSort } from '../../common/orderIdSort';
import { settings } from './_build/DarkPlasma_OrderIdAlias_parameters';

function DataManager_OrderIdAliasMixIn(): void {
  const _extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data: DataManager.NoteHolder) {
    _extractMetadata.call(this, data);
    if (isOrderIdHolder(data)) {
      extractOrderId(data);
    }
  };

  function isOrderIdHolder(data: any): data is OrderIdHolder {
    return !!data.id;
  }

  function extractOrderId(data: OrderIdHolder): void {
    data.orderId = Number(data.meta!.OrderId || data.id);
  }
}

DataManager_OrderIdAliasMixIn();

function Window_ItemList_OrderIdAliasMixIn(windowClass: Window_ItemList) {
  const _makeItemList = windowClass.makeItemList;
  windowClass.makeItemList = function (): void {
    _makeItemList.call(this);
    this._data.sort(orderIdSort);
  };
}

Window_ItemList_OrderIdAliasMixIn(Window_ItemList.prototype);

function Window_SkillList_OrderIdAliasMixIn(windowClass: Window_SkillList) {
  const _makeItemList = windowClass.makeItemList;
  windowClass.makeItemList = function (): void {
    _makeItemList.call(this);
    if (settings.sortSkillById) {
      this._data.sort(orderIdSort);
    }
  };
}

Window_SkillList_OrderIdAliasMixIn(Window_SkillList.prototype);
