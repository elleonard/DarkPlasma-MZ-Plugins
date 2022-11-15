/// <reference path="./HorizontalScrollWindow.d.ts" />

function Window_HorizontalScrollMixIn(windowClass: Window_Selectable) {
  windowClass.maxRows = function () {
    return 1;
  };

  windowClass.overallWidth = function () {
    return this.itemWidth() * this.maxItems();
  };

  windowClass.itemRect = function (index) {
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index;
    const row = 0;
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
  };

  windowClass.cursorDown = function () { };
  windowClass.cursorUp = function () { };

  windowClass.ensureCursorVisible = function (smooth) {
    if (this._cursorAll) {
      this.scrollTo(0, 0);
    } else if (this.innerWidth > 0 && this.index() >= 0) {
      const scrollX = this.scrollX();
      const targetLeftXMin = this.index() * this.itemWidth();
      const targetLeftXMax = (this.index() - this.maxCols() + 1) * this.itemWidth();
      if (scrollX > targetLeftXMin) {
        if (smooth) {
          this.smoothScrollTo(targetLeftXMin, 0);
        } else {
          this.scrollTo(targetLeftXMin, 0);
        }
      } else if (scrollX < targetLeftXMax) {
        if (smooth) {
          this.smoothScrollTo(targetLeftXMax, 0);
        } else {
          this.scrollTo(targetLeftXMax, 0);
        }
      }
    }
  };

  windowClass.updateArrows = function () {
    this.downArrowVisible = this._scrollX < this.maxScrollX();
    this.upArrowVisible = this._scrollX > 0;
  };

  windowClass._refreshArrows = function () {
    const w = this._width;
    const h = this._height;
    const p = 24;
    const q = p / 2;
    const sx = 96 + p;
    const sy = 0 + p;
    this._downArrowSprite.bitmap = this._windowskin;
    this._downArrowSprite.anchor.x = 0.5;
    this._downArrowSprite.anchor.y = 0.5;
    this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
    this._downArrowSprite.rotation = 270 * Math.PI / 180;
    this._downArrowSprite.move(w - q, h / 2);
    this._upArrowSprite.bitmap = this._windowskin;
    this._upArrowSprite.anchor.x = 0.5;
    this._upArrowSprite.anchor.y = 0.5;
    this._upArrowSprite.setFrame(sx + q, sy, p, q);
    this._upArrowSprite.rotation = 270 * Math.PI / 180;
    this._upArrowSprite.move(q, h / 2);
  };
}

globalThis.Window_HorizontalScrollMixIn = Window_HorizontalScrollMixIn;
