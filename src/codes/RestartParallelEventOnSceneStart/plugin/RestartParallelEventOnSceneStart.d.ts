/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_Event {
  isRestartOnSceneStart(): boolean;
  restartInterpreter(): void;
}