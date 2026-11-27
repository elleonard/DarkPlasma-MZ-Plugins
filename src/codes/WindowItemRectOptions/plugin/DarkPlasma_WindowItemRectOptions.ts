/// <reference path="./WindowItemRectOptions.d.ts" />

function Window_Selectable_ItemRectOptionsMixIn(windowSelectable: Window_Selectable) {
  windowSelectable.itemRectOptions = function () {
    if (!this._itemRectOptions) {
      return this.defaultItemRectOptions();
    }
    return this._itemRectOptions;
  };

  windowSelectable.defaultItemRectOptions = function () {
    return {};
  };

  windowSelectable.setItemRectOptions = function (position: WindowItemRectOptions): void {
    if (!this._itemRectOptions) {
      this._itemRectOptions = this.defaultItemRectOptions();
    }
    (Object.keys(position) as (keyof WindowItemRectOptions)[]).forEach(key => {
      this._itemRectOptions![key] = position[key];
    });
    this.refresh();
  };

  const _itemWidth = windowSelectable.itemWidth;
  windowSelectable.itemWidth = function (): number {
    return this.itemRectOptions().itemWidth || _itemWidth.call(this);
  };

  const _itemHeight = windowSelectable.itemHeight;
  windowSelectable.itemHeight = function (): number {
    return this.itemRectOptions().itemHeight || _itemHeight.call(this);
  };

  const _colSpacing = windowSelectable.colSpacing;
  windowSelectable.colSpacing = function (): number {
    return this.itemRectOptions().colSpacing || _colSpacing.call(this);
  };

  const _rowSpacing = windowSelectable.rowSpacing;
  windowSelectable.rowSpacing = function (): number {
    return this.itemRectOptions().rowSpacing || _rowSpacing.call(this);
  };

  windowSelectable.itemRectOffsetX = function () {
    return this.itemRectOptions().offsetX || 0;
  };

  windowSelectable.itemRectOffsetY = function () {
    return this.itemRectOptions().offsetY || 0;
  };

  const _itemRect = windowSelectable.itemRect;
  windowSelectable.itemRect = function (index: number): Rectangle {
    const rect = _itemRect.call(this, index);
    rect.x += this.itemRectOffsetX();
    rect.y += this.itemRectOffsetY();
    return rect;
  };

  const _overallHeight = windowSelectable.overallHeight;
  windowSelectable.overallHeight = function (): number {
    return _overallHeight.call(this) + this.itemRectOffsetY();
  };

  windowSelectable.itemTop = function (row) {
    return row * this.itemHeight() + this.itemRectOffsetY();
  };

  const _ensureCursorVisible = windowSelectable.ensureCursorVisible;
  windowSelectable.ensureCursorVisible = function (smooth) {
    if (this._cursorAll) {
      _ensureCursorVisible.call(this, smooth);
    } else if (this.innerHeight > 0 && this.row() >= 0) {
      const scrollY = this.scrollY();
      const itemTop = this.itemTop(this.row());
      const itemBottom = itemTop + this.itemHeight();
      const scrollMin = itemBottom - this.innerHeight;
      if (scrollY > itemTop) {
        if (smooth) {
          this.smoothScrollTo(0, itemTop);
        } else {
          this.scrollTo(0, itemTop);
        }
      } else if (scrollY < scrollMin) {
        if (smooth) {
          this.smoothScrollTo(0, scrollMin);
        } else {
          this.scrollTo(0, scrollMin);
        }
      }
    }
  };
}

Window_Selectable_ItemRectOptionsMixIn(Window_Selectable.prototype);
