/// <reference path="../../../typings/rmmz.d.ts" />

declare namespace Input {
  var _commandBuffer: string[];

  function clearBuffer(): void;
  function isSequentialInputted(command: string[]): boolean;
}
