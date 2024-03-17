/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Event {
  _area: Game_EventArea;

  isAreaEvent(): boolean;
  setupArea(): void;
}
