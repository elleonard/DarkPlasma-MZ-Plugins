import { pluginName } from '../../common/pluginName';
import { command_erasePictures, parseArgs_erasePictures } from './_build/DarkPlasma_ErasePictures_commands';

PluginManager.registerCommand(pluginName, command_erasePictures, function (args) {
  const parsedArgs = parseArgs_erasePictures(args);
  $gameScreen.erasePictures(parsedArgs.start, parsedArgs.end);
});

Game_Screen.prototype.erasePictures = function (start, end) {
  this._pictures.fill(null, this.realPictureId(start), this.realPictureId(end) + 1);
};
