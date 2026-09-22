/// <reference path="./NineSliceSprite.d.ts" />

function Sprite_NineSliceSpriteMixIn(sprite: Sprite) {
  sprite.refreshNineSlice = function (option: NineSliceOption) {
    const { source, borders, width, height, cornerSize } = option;
    const { left, top, right, bottom } = borders;
    // 四隅の表示サイズ（左右/上下で共通）。指定がなければ境界幅のまま伸縮しない
    const destLeft = cornerSize?.width ?? left;
    const destRight = cornerSize?.width ?? right;
    const destTop = cornerSize?.height ?? top;
    const destBottom = cornerSize?.height ?? bottom;

    const sourceCenterWidth = source.width - left - right;
    const sourceCenterHeight = source.height - top - bottom;
    const centerWidth = width - destLeft - destRight;
    const centerHeight = height - destTop - destBottom;

    const composed = new Bitmap(width, height);

    // 四隅
    composed.blt(source, 0, 0, left, top, 0, 0, destLeft, destTop);
    composed.blt(source, source.width - right, 0, right, top, width - destRight, 0, destRight, destTop);
    composed.blt(source, 0, source.height - bottom, left, bottom, 0, height - destBottom, destLeft, destBottom);
    composed.blt(
      source,
      source.width - right,
      source.height - bottom,
      right,
      bottom,
      width - destRight,
      height - destBottom,
      destRight,
      destBottom
    );

    // 上下辺（横方向のみ伸縮）
    composed.blt(source, left, 0, sourceCenterWidth, top, destLeft, 0, centerWidth, destTop);
    composed.blt(
      source,
      left,
      source.height - bottom,
      sourceCenterWidth,
      bottom,
      destLeft,
      height - destBottom,
      centerWidth,
      destBottom
    );

    // 左右辺（縦方向のみ伸縮）
    composed.blt(source, 0, top, left, sourceCenterHeight, 0, destTop, destLeft, centerHeight);
    composed.blt(
      source,
      source.width - right,
      top,
      right,
      sourceCenterHeight,
      width - destRight,
      destTop,
      destRight,
      centerHeight
    );

    // 中央（縦横とも伸縮）
    composed.blt(source, left, top, sourceCenterWidth, sourceCenterHeight, destLeft, destTop, centerWidth, centerHeight);

    this._nineSliceSource = source;
    this.bitmap = composed;
  };
}

Sprite_NineSliceSpriteMixIn(Sprite.prototype);
