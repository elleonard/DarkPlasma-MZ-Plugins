const _DataManager_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _DataManager_extractMetadata.call(this, data);
  data.orderId = Number(data.meta.OrderId || data.id);
};

const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
Window_ItemList.prototype.makeItemList = function () {
  _Window_ItemList_makeItemList.call(this);
  this._data.sort((a, b) => {
    if (a === null && b === null) {
      // 両方nullなら順不同
      return 0;
    } else if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    }
    return a.orderId - b.orderId;
  });
};

const _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
Window_SkillList.prototype.makeItemList = function () {
  _Window_SkillList_makeItemList.call(this);
  this._data.sort((a, b) => a.orderId - b.orderId);
};
