/// <reference path="./DrawLine.d.ts" />

function Bitmap_DrawLineMixIn(bitmap: Bitmap) {
  bitmap.drawLine = function (x1: number, y1: number, x2: number, y2: number, thick: number, color: string) {
    this._context.strokeStyle = color;
    this._context.lineWidth = thick;
    this._context.beginPath();
    this._context.moveTo(x1, y1);
    this._context.lineTo(x2, y2);
    this._context.closePath();
    this._context.stroke();
    this._context.restore();
    this._baseTexture.update();
  };
}

Bitmap_DrawLineMixIn(Bitmap.prototype);
