/// <reference path="./SealItemCommand.d.ts" />

import { isMapMetaDataAvailable } from '../../common/mapMetaData';

function Game_Map_SealItemCommandMixIn(gameMap: Game_Map) {
  gameMap.isItemCommandEnabled = function () {
    return !isMapMetaDataAvailable() || !$dataMap?.meta.sealItemCommand;
  };
}

Game_Map_SealItemCommandMixIn(Game_Map.prototype);

function Window_MenuCommand_SealItemCommandMixIn(windowClass: Window_MenuCommand) {
  const _makeCommandList = windowClass.makeCommandList;
  windowClass.makeCommandList = function () {
    _makeCommandList.call(this);
    const itemCommand = this.itemCommand();
    if (itemCommand && !$gameMap.isItemCommandEnabled()) {
      itemCommand.enabled = false;
    }
  };
}

Window_MenuCommand_SealItemCommandMixIn(Window_MenuCommand.prototype);

function Window_ActorCommand_SealItemCommandMixIn(windowClass: Window_ActorCommand) {
  const _addItemCommand = windowClass.addItemCommand;
  windowClass.addItemCommand = function () {
    _addItemCommand.call(this);
    if (!$gameMap.isItemCommandEnabled()) {
      const itemCommand = this.itemCommand();
      if (itemCommand) {
        itemCommand.enabled = false;
      }
    }
  };
}

Window_ActorCommand_SealItemCommandMixIn(Window_ActorCommand.prototype);

function Window_Command_SealItemCommandMixIn(windowClass: Window_Command) {
  windowClass.itemCommand = function () {
    return this._list.find((command) => command.symbol === 'item');
  };
}

Window_Command_SealItemCommandMixIn(Window_Command.prototype);
