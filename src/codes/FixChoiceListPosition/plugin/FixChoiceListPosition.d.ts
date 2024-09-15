/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_System {
  _choiceListPosition: {
    isXFixed: boolean;
    isYFixed: boolean;
    xPositionType: number;
    yPositionType: number;
    x: number|undefined;
    y: number|undefined;
  };

  fixChoiceListPosition(xPositionType: number, yPositionType: number, x?: number, y?: number): void;
  unfixChoiceListPosition(): void;

  isChoiceListPositionFixed(): {
    x: boolean;
    y: boolean;
  }
  choiceListPositionType(): {
    x: number;
    y: number;
  };
  choiceListPosition(): {
    x?: number;
    y?: number;
  };
}
