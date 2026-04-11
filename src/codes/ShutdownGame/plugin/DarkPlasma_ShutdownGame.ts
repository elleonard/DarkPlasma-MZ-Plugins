/// <reference path="./ShutdownGame.d.ts" />

import { settings } from '../config/_build/DarkPlasma_ShutdownGame_parameters';

function Scene_ShutdownMixIn(sceneClass: Scene_GameEnd|Scene_Title) {
  const _createCommandWindow = sceneClass.createCommandWindow;
  sceneClass.createCommandWindow = function () {
    _createCommandWindow.call(this);
    this._commandWindow.setHandler('shutdown', () => SceneManager.terminate());
    this.adjustCommandWindowHeight();
  };

  sceneClass.adjustCommandWindowHeight = function () {
    const targetHeight = this.calcWindowHeight(this._commandWindow.commandCount(), true);
    if (this._commandWindow.height < targetHeight && this._commandWindow.height > 0) {
      this._commandWindow.height = targetHeight;
    }
  };
}

Scene_ShutdownMixIn(Scene_GameEnd.prototype);
Scene_ShutdownMixIn(Scene_Title.prototype);

function Window_Command_CommandCountMixIn(windowCommand: Window_Command) {
  windowCommand.commandCount = function () {
    return this._list.length;
  };
}

Window_Command_CommandCountMixIn(Window_Command.prototype);

function Window_TitleCommand_ShutdownMixIn(windowTitleCommand: Window_TitleCommand) {
  const _makeCommandList = windowTitleCommand.makeCommandList;
  windowTitleCommand.makeCommandList = function () {
    _makeCommandList.call(this);
    this.addCommand(settings.menuText, "shutdown");
  };
}

Window_TitleCommand_ShutdownMixIn(Window_TitleCommand.prototype);

function Window_GameEnd_ShutdownMixIn(windowGameEnd: Window_GameEnd) {
  const _makeCommandList = windowGameEnd.makeCommandList;
  windowGameEnd.makeCommandList = function () {
    _makeCommandList.call(this);
    this.addShutdownCommand();
  };

  windowGameEnd.addShutdownCommand = function () {
    this._list.splice(this._list.findIndex(c => c.symbol === "toTitle")+1, 0, {
      name: settings.menuText,
      symbol: "shutdown",
      enabled: true,
      ext: null,
    });
  };
}

Window_GameEnd_ShutdownMixIn(Window_GameEnd.prototype);
