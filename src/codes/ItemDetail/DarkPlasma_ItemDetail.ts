/// <reference path="./ItemDetail.d.ts" />

import { settings } from "./_build/DarkPlasma_ItemDetail_parameters";

function Scene_Item_DetailMixIn(sceneItem: Scene_Item) {
  const _create = sceneItem.create;
  sceneItem.create = function () {
    _create.call(this);
    this.createDetailWindow();
  };

  const _createItemWindow = sceneItem.createItemWindow;
  sceneItem.createItemWindow = function () {
    _createItemWindow.call(this);
    this._itemWindow.setHandler('detail', () => this.toggleDetailWindow());
  };

  sceneItem.createDetailWindow = function () {
    this._detailWindowLayer = new WindowLayer();
    this._detailWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._detailWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._detailWindowLayer);
    this._detailWindow = new Window_ItemDetail(this.detailWindowRect());
    this._detailWindowLayer.addChild(this._detailWindow);
    this._itemWindow.setDetailWindow(this._detailWindow);
  };

  sceneItem.detailWindowRect = function () {
    return this.itemWindowRect();
  };

  sceneItem.toggleDetailWindow = function () {
    this._itemWindow.activate();
    this._detailWindow.scrollTo(0, 0);
    if (!this._detailWindow.visible) {
      this._detailWindow.show();
    } else {
      this._detailWindow.hide();
    }
  };
}

Scene_Item_DetailMixIn(Scene_Item.prototype);

Window_WithDetailWindowMixIn(settings.openDetailKey, Window_ItemList.prototype);

class Window_ItemDetail extends Window_DetailText {
  heightAdjustment(): number {
    return settings.heightAdjustment;
  }
}
