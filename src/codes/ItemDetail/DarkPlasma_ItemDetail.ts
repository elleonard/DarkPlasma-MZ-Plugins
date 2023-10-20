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

Window_CustomKeyHandlerMixIn(settings.openDetailKey, Window_ItemList.prototype, 'detail');

function Window_ItemList_DetailMixIn(windowClass: Window_ItemList) {
  windowClass.setDetailWindow = function (detailWindow) {
    this._detailWindow = detailWindow;
  };

  const _setHelpWindowItem = windowClass.setHelpWindowItem;
  windowClass.setHelpWindowItem = function (item) {
    _setHelpWindowItem.call(this, item);
    this._detailWindow?.setItem(item as (MZ.Item|MZ.Weapon|MZ.Armor|null));
  };

  const _isCursorMovable = windowClass.isCursorMovable;
  windowClass.isCursorMovable = function () {
    return _isCursorMovable.call(this)
      && (!this._detailWindow || !this._detailWindow.visible);
  };

  const _isOkEnabled = windowClass.isOkEnabled;
  windowClass.isOkEnabled = function () {
    return _isOkEnabled.call(this)
      && (!this._detailWindow || !this._detailWindow.visible);
  };

  const _processCancel = windowClass.processCancel;
  windowClass.processCancel = function () {
    this._detailWindow?.hide();
    _processCancel.call(this);
  };
}

Window_ItemList_DetailMixIn(Window_ItemList.prototype);

class Window_ItemDetail extends Window_Scrollable {
  _text: string;

  initialize(rect: Rectangle) {
    super.initialize(rect);
    this._text = '';
    this.hide();
  }

  setItem(item: MZ.Item|MZ.Weapon|MZ.Armor|null) {
    this.setText(String(item?.meta.detail || ''));
  }

  setText(text: string) {
    if (this._text !== text) {
      this._text = text;
      this.refresh();
    }
  }

  drawDetail(detail: string) {
    this.drawTextEx(detail, 0, this.baseLineY());
  }

  baseLineY() {
    return -(this.scrollBaseY()/this.scrollBlockHeight()) * this.lineHeight();
  }

  public scrollBlockHeight(): number {
    return this.lineHeight();
  }

  public overallHeight(): number {
    return this.textSizeEx(this._text).height + settings.heightAdjustment;
  }

  public paint(): void {
    this.contents.clear();
    this.drawDetail(this._text);
  }

  refresh() {
    this.paint();
  }

  public update(): void {
    super.update();
    this.processCursorMove();
  }

  processCursorMove() {
    if (this.isCursorMovable()) {
      if (Input.isRepeated('down')) {
        this.cursorDown();
      }
      if (Input.isRepeated('up')) {
        this.cursorUp();
      }
    }
  }

  isCursorMovable() {
    return this.visible;
  }

  cursorDown() {
    if (this.scrollY() <= this.maxScrollY()) {
      this.smoothScrollDown(1);
    }
  }

  cursorUp() {
    if (this.scrollY() > 0) {
      this.smoothScrollUp(1);
    }
  }
}
