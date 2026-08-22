/// <reference path="./WindowItemRectOptions.d.ts" />

function Window_Selectable_ItemRectOptionsMixIn(windowSelectable: Window_Selectable) {
  windowSelectable.itemRectOptions = function() {
    if (!this._itemRectOptions) {
      return this.defaultItemRectOptions();
    }
    return this._itemRectOptions;
  };

  windowSelectable.defaultItemRectOptions = function () {
    return {};
  };

  windowSelectable.setItemRectOptions = function(position: WindowItemRectOptions): void {
    if (!this._itemRectOptions) {
      this._itemRectOptions = this.defaultItemRectOptions();
    }
    (Object.keys(position) as (keyof WindowItemRectOptions)[]).forEach(key => {
      this._itemRectOptions![key] = position[key];
    });
    this.refresh();
  };

  const _itemWidth = windowSelectable.itemWidth;
  windowSelectable.itemWidth = function(): number {
    return this.itemRectOptions().itemWidth || _itemWidth.call(this);
  };

  const _itemHeight = windowSelectable.itemHeight;
  windowSelectable.itemHeight = function(): number {
    return this.itemRectOptions().itemHeight || _itemHeight.call(this);
  };

  const _colSpacing = windowSelectable.colSpacing;
  windowSelectable.colSpacing = function(): number {
    return this.itemRectOptions().colSpacing || _colSpacing.call(this);
  };

  const _rowSpacing = windowSelectable.rowSpacing;
  windowSelectable.rowSpacing = function(): number {
    return this.itemRectOptions().rowSpacing || _rowSpacing.call(this);
  };

  windowSelectable.itemRectOffsetX = function() {
    return this.itemRectOptions().offsetX || 0;
  };

  windowSelectable.itemRectOffsetY = function() {
    return this.itemRectOptions().offsetY || 0;
  };

  const _itemRect = windowSelectable.itemRect;
  windowSelectable.itemRect = function(index: number): Rectangle {
    const rect = _itemRect.call(this, index);
    rect.x += this.itemRectOffsetX();
    rect.y += this.itemRectOffsetY();
    return rect;
  };
}

Window_Selectable_ItemRectOptionsMixIn(Window_Selectable.prototype);
