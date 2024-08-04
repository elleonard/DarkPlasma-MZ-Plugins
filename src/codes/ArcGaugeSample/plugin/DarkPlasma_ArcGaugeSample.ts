/// <reference path="./ArcGaugeSample.d.ts" />

function Bitmap_ArcGaugeMixIn(bitmap: Bitmap) {
  bitmap.fillArc = function (x, y, radius, width, startAngle, endAngle, color, counterClockwise) {
    const context = this.context;
    context.save();
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
    context.stroke();
    context.restore();
    this._baseTexture.update();
  };

  bitmap.gradientFillArc = function (x, y, radius, width, startAngle, endAngle, color1, color2, counterClockwise) {
    const context = this.context;
    context.save();
    /**
     * MZのNW.jsはChromium85であり、99よりも低い
     * createConicGradientはChromium99からの搭載であるため、ここでは代用のロジックを用いる
     */
    const colors = [color1, color2].map((color) => {
      const dummy = document.createElement("p");
      dummy.style.color = color;
      return dummy.style.color.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/)!.slice(1,4).map(c => Number(c));
    });
    const isSameColor = colors[1].every((c, i) => c === colors[0][i]);
    const colorDiff = colors[1].map((c, i) => {
      return c - colors[0][i];
    });
    const deg = Math.PI/180;
    const length = counterClockwise
      ? (Math.PI*2 - (endAngle - startAngle))/Math.PI * 180
      : (endAngle - startAngle)/Math.PI * 180;
    for (let i = 0; i < length; i++) {
      const interpolated = isSameColor ? colors[1] : colorDiff.map((d, index) => {
        const ret = d * (i/length) + colors[0][index];
        return index < 3 ? ret & 255 : ret;
      });

      context.strokeStyle = 'rgba(' + interpolated.join(',') + ')';
      context.lineWidth = width;
      context.beginPath();
      const beginArg = counterClockwise
        ? Math.max(startAngle - i * deg, -(Math.PI*2 - endAngle))
        : Math.min(startAngle + i * deg, endAngle);
      const endArg = counterClockwise
        ? Math.min(beginArg - deg - 0.2, -(Math.PI*2 - endAngle))
        : Math.min(beginArg + deg + 0.2, endAngle);
      context.arc(x, y, radius, beginArg, endArg, counterClockwise);
      context.stroke();
    }
    context.restore();
    this._baseTexture.update();
  };
}

Bitmap_ArcGaugeMixIn(Bitmap.prototype);

function Window_StatusBase_ArcGaugeMixIn(windowClass: Window_StatusBase) {
  windowClass.placeGauge = function (actor, type, x, y) {
    const key = "actor%1-gauge-%2".format(actor.actorId(), type);
    const sprite = this.createInnerSprite(key, Sprite_ArcGauge) as Sprite_ArcGauge;
    sprite.setup(actor, type);
    sprite.move(x, y);
    sprite.show();
  };
}

Window_StatusBase_ArcGaugeMixIn(Window_StatusBase.prototype);

class Sprite_ArcGauge extends Sprite_Gauge {
  _radius: number;
  _startAngle: number;
  _endAngle: number;
  _gaugeWidth: number;
  _counterClockwise?: boolean;

  public initMembers(): void {
    super.initMembers();
    this._radius = 10;
    this._startAngle = 0;
    this._endAngle = Math.PI * 2;
    this._gaugeWidth = 9;
    this._counterClockwise = false;
  }

  public bitmapWidth(): number {
    return 128;
  }

  public bitmapHeight(): number {
    return 80;
  }

  public gaugeX(): number {
    return 52;
  }

  public drawGauge(): void {
    const rate = this.gaugeRate();
    this.bitmap?.fillArc(
      this.gaugeX(),
      this._radius + this.gaugeHeight(),
      this._radius,
      this._gaugeWidth,
      this._startAngle,
      this._endAngle,
      this.gaugeBackColor(),
      this._counterClockwise
    );
    this.bitmap?.gradientFillArc(
      this.gaugeX(),
      this._radius + this.gaugeHeight(),
      this._radius,
      this._gaugeWidth-2,
      this._startAngle,
      (this._endAngle - this._startAngle) * rate + this._startAngle,
      this.gaugeColor1(),
      this.gaugeColor2(),
      this._counterClockwise
    );
  }
}
