/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Player {
  _dashSpeed: number;

  dashSpeed(): number;
  setDashSpeed(dashSpeed: number): void;
}
