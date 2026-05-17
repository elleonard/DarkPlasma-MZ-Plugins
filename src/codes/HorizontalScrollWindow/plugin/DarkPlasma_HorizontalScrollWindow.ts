/// <reference path="./HorizontalScrollWindow.d.ts" />

function Window_HorizontalScrollMixIn(windowClass: Window_Selectable, options?: HorizontalScrollWindowOptions) {
  windowClass.itemWidth = function () {
    return Math.floor(this.innerWidth / this.maxPageCols());
  };

  windowClass.itemHeight = function () {
    return Math.floor(this.innerHeight / this.maxRows());
  };

  windowClass.row = function () {
    return this.index() % this.maxRows();
  };

  windowClass.col = function () {
    return Math.floor(this.index() / this.maxRows());
  };

  windowClass.leftCol = function () {
    return Math.floor(this.scrollX() / this.itemWidth());
  };

  windowClass.maxCols = function () {
    return Math.max(Math.ceil(this.maxItems() / this.maxRows()), 1);
  };

  windowClass.maxRows = function () {
    return options?.maxRows || 1;
  };

  windowClass.maxPageCols = function () {
    return options?.maxPageCols || 4;
  };

  windowClass.maxPageItems = function () {
    return this.maxPageCols() * this.maxRows();
  };

  windowClass.overallWidth = function () {
    return this.itemWidth() * Math.ceil(this.maxItems() / this.maxRows());
  };

  windowClass.itemRect = function (index) {
    const maxRows = this.maxRows();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = Math.floor(index / maxRows);
    const row = index % maxRows;
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
  };

  windowClass.cursorDown = function (wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    if (index < maxItems - 1 || wrap) {
      this.smoothSelect((index + 1) % maxItems);
    }
  };

  windowClass.cursorUp = function (wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    if (index > 0 || wrap) {
      this.smoothSelect((index - 1 + maxItems) % maxItems);
    }
  };

  windowClass.cursorRight = function (wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxRows = this.maxRows();
    if (index < maxItems - maxRows || wrap) {
      this.smoothSelect((index + maxRows) % maxItems);
    }
  };

  windowClass.cursorLeft = function (wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxRows = this.maxRows();
    if (index >= maxRows || wrap) {
      this.smoothSelect((index - maxRows + maxItems) % maxItems);
    }
  };

  windowClass.cursorPagedown = function () {
    const index = this.index();
    const maxItems = this.maxItems();
    if (this.leftCol() + this.maxPageCols() < this.maxCols()) {
      this.smoothScrollRight(this.maxPageCols());
      this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
    }
  };

  windowClass.cursorPageup = function () {
    const index = this.index();
    if (this.leftCol() > 0) {
      this.smoothScrollLeft(this.maxPageCols());
      this.select(Math.max(index - this.maxPageItems(), 0));
    }
  };

  windowClass.smoothScrollLeft = function (n) {
    this.smoothScrollBy(-this.itemWidth() * n, 0);
  };

  windowClass.smoothScrollRight = function (n) {
    this.smoothScrollBy(this.itemWidth() * n, 0);
  };

  windowClass.ensureCursorVisible = function (smooth) {
    if (this._cursorAll) {
      this.scrollTo(0, 0);
    } else if (this.innerWidth > 0 && this.index() >= 0) {
      const scrollX = this.scrollX();
      const targetLeftXMin = this.col() * this.itemWidth();
      const targetLeftXMax = targetLeftXMin + this.itemWidth() - this.innerWidth;
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
