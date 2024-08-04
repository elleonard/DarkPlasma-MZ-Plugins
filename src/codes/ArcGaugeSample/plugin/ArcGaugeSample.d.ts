/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Bitmap {
  fillArc(
    x: number,
    y: number,
    radius: number,
    width: number,
    startAngle: number,
    endAngle: number,
    color: string,
    counterClockwise?: boolean
  ): void;
  gradientFillArc(
    x: number,
    y: number,
    radius: number,
    width: number,
    startAngle: number,
    endAngle: number,
    color1: string,
    color2: string,
    counterClockwise?: boolean
  ): void;
}
