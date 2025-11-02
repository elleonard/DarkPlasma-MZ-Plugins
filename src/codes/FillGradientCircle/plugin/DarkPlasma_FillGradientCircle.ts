/// <reference path="./FillGradientCircle.d.ts" />

function Bitmap_FillGradientCircleMixIn(bitmap: Bitmap) {
  bitmap.fillGradientCircle = function (
    this: Bitmap,
    centerX: number,
    centerY: number,
    radius: number,
    insideColor: string,
    outsideColor: string
  ) {
    const context = this._context;
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, insideColor);
    gradient.addColorStop(1, outsideColor);
    context.save();
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fill();
    context.restore();
    this._baseTexture.update();
  };
}

Bitmap_FillGradientCircleMixIn(Bitmap.prototype);
