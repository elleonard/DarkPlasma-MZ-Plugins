import { isMapMetaDataAvailable } from '../../common/mapMetaData';

Game_Map.prototype.isItemCommandEnabled = function () {
  return !isMapMetaDataAvailable() || !$dataMap.meta.sealItemCommand;
};

const _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
Window_MenuCommand.prototype.makeCommandList = function () {
  _Window_MenuCommand_makeCommandList.call(this);
  const itemCommand = this.itemCommand();
  if (itemCommand && !$gameMap.isItemCommandEnabled()) {
    itemCommand.enabled = false;
  }
};

const _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand;
Window_ActorCommand.prototype.addItemCommand = function () {
  _Window_ActorCommand_addItemCommand.call(this);
  if (!$gameMap.isItemCommandEnabled()) {
    this._list.find((command) => command.symbol === 'item').enabled = false;
  }
};

Window_Command.prototype.itemCommand = function () {
  return this._list.find((command) => command.symbol === 'item');
};
