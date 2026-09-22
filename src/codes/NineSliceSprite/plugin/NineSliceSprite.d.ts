/// <reference path="../../../typings/rmmz.d.ts" />

type NineSliceBorders = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type NineSliceOption = {
  /**
   * 合成元のビットマップ
   * refreshNineSlice呼び出し後、Sprite#_nineSliceSourceに保持される
   */
  source: Bitmap;
  /**
   * 9スライスの境界幅（sourceの切り出しサイズ）
   * width/heightがleft+right/top+bottomを下回らないことは呼び出し側の責任とする
   */
  borders: NineSliceBorders;
  /**
   * 四隅の表示サイズ
   * 指定しない場合、bordersの幅・高さがそのまま表示サイズになる（伸縮なし）
   * 指定した場合、左右の角はwidth、上下の角はheightに縮小して表示する
   * width/heightがcornerSize.width*2/cornerSize.height*2を下回らないことは呼び出し側の責任とする
   */
  cornerSize?: {
    width: number;
    height: number;
  };
  /**
   * 合成後の幅
   */
  width: number;
  /**
   * 合成後の高さ
   */
  height: number;
};

declare interface Sprite {
  /**
   * 直近にrefreshNineSliceへ渡された合成元のビットマップ
   */
  _nineSliceSource?: Bitmap;

  /**
   * 指定した設定をもとに9スライス画像を合成し、bitmapにセットする
   */
  refreshNineSlice(option: NineSliceOption): void;
}
