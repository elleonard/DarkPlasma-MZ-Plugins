/// <reference path="./PartialTextColor.d.ts" />

function Bitmap_PartialTextColorMixIn(bitmap: Bitmap) {
  bitmap.drawTextWithPartialColor = function (text, x, y, maxWidth, lineHeight, align) {
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") {
      tx += maxWidth / 2;
    }
    if (align === "right") {
      tx += maxWidth;
    }
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align || "left";
    context.textBaseline = "alphabetic";
    context.globalAlpha = 1;
    const parsed = this._parseTextForPartialColor(text);
    this._drawTextOutline(parsed.plainText, tx, ty, maxWidth);
    context.globalAlpha = alpha;
    this._drawTextBodyWithPartialColor(parsed, tx, ty, maxWidth);
    context.restore();
    this._baseTexture.update();
  };

  bitmap._parseTextForPartialColor = function (text) {
    const regex = /\x1bC\[([^\]]+)\]/g;
    const parts: { text: string; color: string | undefined }[] = [];
    let plainText = '';
    let lastIndex = 0;
    let currentColor: string | undefined = undefined;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const segment = text.substring(lastIndex, match.index);
        parts.push({ text: segment, color: currentColor });
        plainText += segment;
      }
      const value = match[1];
      currentColor = /^\d+$/.test(value)
        ? ColorManager.textColor(parseInt(value, 10))
        : value;
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex);
      parts.push({ text: remaining, color: currentColor });
      plainText += remaining;
    }

    return { plainText, parts };
  };

  bitmap._drawTextBodyWithPartialColor = function (textWithPartialColor, tx, ty, maxWidth) {
    const context = this.context;
    // 3. 純粋な文字列の全体の幅を計測し、縮小比率を計算する
    const totalWidth = context.measureText(textWithPartialColor.plainText).width;
    let scaleX = 1;
    if (maxWidth && totalWidth > maxWidth) {
      scaleX = maxWidth / totalWidth;
    }

    // 4. キャンバスの状態を保存して縮小を適用
    context.save();
    context.translate(tx, ty);
    context.scale(scaleX, 1);

    // 5. 各パーツを順に描画
    let currentX = 0;
    textWithPartialColor.parts.forEach(part => {
      context.fillStyle = part.color ?? this.textColor;

      context.fillText(part.text, currentX, 0);
      currentX += context.measureText(part.text).width;
    });

    // 6. 状態を元に戻す
    context.restore();
  };
}

Bitmap_PartialTextColorMixIn(Bitmap.prototype);

function Window_Base_PartialTextColorMixIn(windowBase: Window_Base) {
  windowBase.drawText = function (text, x, y, maxWidth, align) {
    this.contents.drawTextWithPartialColor(String(text), x, y, maxWidth, this.lineHeight(), align);
  };
}

Window_Base_PartialTextColorMixIn(Window_Base.prototype);
