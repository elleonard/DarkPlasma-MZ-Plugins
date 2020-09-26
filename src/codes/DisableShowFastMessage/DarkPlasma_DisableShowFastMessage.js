import { pluginName } from '../../common/pluginName';

PluginManager.registerCommand(pluginName, 'Enable showFastMessage', () => {
  $gameSystem.enableShowFastMessage();
});

PluginManager.registerCommand(pluginName, 'Disable showFastMessage', () => {
  $gameSystem.disableShowFastMessage();
});

const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
  _Game_System_initialize.call(this);
  this._enableShowFastMessage = true;
};

const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function () {
  _Game_System_onAfterLoad.call(this);
  if (this._enableShowFastMessage === undefined) {
    this._enableShowFastMessage = true;
  }
};

Game_System.prototype.isEnableShowFastMessage = function () {
  return this._enableShowFastMessage;
};

Game_System.prototype.enableShowFastMessage = function () {
  this._enableShowFastMessage = true;
};

Game_System.prototype.disableShowFastMessage = function () {
  this._enableShowFastMessage = false;
};

const _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
Window_Message.prototype.updateShowFast = function () {
  if ($gameSystem.isEnableShowFastMessage()) {
    _Window_Message_updateShowFast.call(this);
  }
};
