/// <reference path="./InputSequentialCommand.d.ts" />

function Input_SequentialCommandMixIn(input: typeof Input) {
  const _initialize = input.initialize;
  input.initialize = function () {
    _initialize.call(this);
    this.clearBuffer();
  };

  input.clearBuffer = function () {
    this._commandBuffer = [];
  };

  input.isSequentialInputted = function (command) {
    const lastInputted = this._commandBuffer.slice(-command.length);
    if (lastInputted.length !== command.length) {
      return false;
    }
    for (let i = 0; i < command.length; i++) {
      if (lastInputted[i] !== command[i]) {
        return false;
      }
    }
    return true;
  };

  const _update = input.update;
  input.update = function () {
    _update.call(this);
    for (const name in this._currentState) {
      if (this._currentState[name] && this._pressedTime === 0) {
        this._commandBuffer.push(name);
      }
    }
  };
}

Input_SequentialCommandMixIn(Input);
