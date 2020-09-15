import { pluginName } from '../../common/pluginName';

const COMMANDS = {
  SET_CHOICE_HELP: 'setChoiceHelp',
};

PluginManager.registerCommand(pluginName, COMMANDS.SET_CHOICE_HELP, (args) => {
  let choiceHelp = JSON.parse(args.helpTexts);
  $gameMessage.setChoiceHelp(choiceHelp);
});

const _Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function () {
  _Game_Message_clear.call(this);
  this.resetChoiceHelp();
};

const _Game_Message_originalIndexOfDisplayedChoices = Game_Message.prototype.originalIndexOfDiplayedChoices;
Game_Message.prototype.originalIndexOfDiplayedChoices = function () {
  return _Game_Message_originalIndexOfDisplayedChoices
    ? _Game_Message_originalIndexOfDisplayedChoices.call(this)
    : this.choices().map((_, index) => index);
};

Game_Message.prototype.setChoiceHelp = function (choiceHelp) {
  this._choiceHelp = choiceHelp;
};

Game_Message.prototype.choiceHelp = function () {
  const originalIndexes = this.originalIndexOfDiplayedChoices();
  return this._choiceHelp.filter((_, index) => originalIndexes.includes(index));
};

Game_Message.prototype.resetChoiceHelp = function () {
  this._choiceHelp = [];
};

const _Scene_Message_createAllWindows = Scene_Message.prototype.createAllWindows;
Scene_Message.prototype.createAllWindows = function () {
  this.createHelpWindow();
  _Scene_Message_createAllWindows.call(this);
};

Scene_Message.prototype.createHelpWindow = function () {
  this._helpWindow = new Window_Help(this.helpWindowRect());
  this._helpWindow.close();
  this.addWindow(this._helpWindow);
};

Scene_Message.prototype.helpWindowRect = function () {
  const wx = 0;
  const wy = this.helpAreaTop();
  const ww = Graphics.boxWidth;
  const wh = this.helpAreaHeight();
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Message.prototype.helpAreaTop = function () {
  return 0;
};

Scene_Message.prototype.helpAreaHeight = function () {
  return this.calcWindowHeight(2, false);
};

const _Scene_Message_associateWindows = Scene_Message.prototype.associateWindows;
Scene_Message.prototype.associateWindows = function () {
  _Scene_Message_associateWindows.call(this);
  this._choiceListWindow.setHelpWindow(this._helpWindow);
};

const _Window_ChoiceList_updateHelp = Window_ChoiceList.prototype.updateHelp;
Window_ChoiceList.prototype.updateHelp = function () {
  _Window_ChoiceList_updateHelp.call(this);
  const helpText = $gameMessage.choiceHelp()[this.index()];
  if (helpText) {
    this._helpWindow.setText(helpText);
    this._helpWindow.open();
  } else {
    this._helpWindow.setText('');
    this._helpWindow.close();
  }
};

const _Window_ChoiceList_close = Window_ChoiceList.prototype.close;
Window_ChoiceList.prototype.close = function () {
  _Window_ChoiceList_close.call(this);
  this._helpWindow.close();
};
