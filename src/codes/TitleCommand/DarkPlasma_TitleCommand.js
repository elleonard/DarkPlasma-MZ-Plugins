import { settings } from './_build/DarkPlasma_TitleCommand_parameters';

function selectedScene(symbol) {
  const command = settings.additionalCommands.find((command) => command.symbol === symbol);
  return window[command.scene] || null;
}

const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function () {
  _Scene_Title_createCommandWindow.call(this);
  settings.additionalCommands.forEach((command) => {
    const handler = command.commandType === 1 ? this.commandSceneChange.bind(this) : this.commandShutdown.bind(this);
    this._commandWindow.setHandler(command.symbol, handler);
  });
};

const _Scene_Title_commandWindowRect = Scene_Title.prototype.commandWindowRect;
Scene_Title.prototype.commandWindowRect = function () {
  const rect = _Scene_Title_commandWindowRect.call(this);
  return new Rectangle(rect.x, rect.y, rect.width, this.calcWindowHeight(3 + settings.additionalCommands.length, true));
};

Scene_Title.prototype.commandSceneChange = function () {
  this._commandWindow.close();
  const scene = selectedScene(this._commandWindow.currentSymbol());
  if (!scene) {
    throw `シンボル ${this._commandWindow.currentSymbol()} に無効なシーンが指定されています。`;
  }
  SceneManager.push(scene);
};

Scene_Title.prototype.commandShutdown = function () {
  if (StorageManager.isLocalMode()) {
    window.close();
  } else {
    window.open('about:blank', '_self').close();
  }
};

const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function () {
  _Window_TitleCommand_makeCommandList.call(this);
  settings.additionalCommands.forEach((command) => {
    this.addCommandAt(command.position, command.text, command.symbol);
  });
};

Window_TitleCommand.prototype.addCommandAt = function (index, name, symbol, enabled = true, ext = null) {
  this._list.splice(index, 0, {
    name: name,
    symbol: symbol,
    enabled: enabled,
    ext: ext,
  });
};
