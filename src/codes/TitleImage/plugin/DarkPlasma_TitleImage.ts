/// <reference path="./TitleImage.d.ts" />

import { command_changeTitleImage, command_resetTitleImage, parseArgs_changeTitleImage } from '../config/_build/DarkPlasma_TitleImage_commands';
import { pluginName } from '../../../common/pluginName';

PluginManager.registerCommand(pluginName, command_changeTitleImage, function (args) {
  const parsedArgs = parseArgs_changeTitleImage(args);
  $gameTemp.setTitleImage(parsedArgs.title1, parsedArgs.title2);
});

PluginManager.registerCommand(pluginName, command_resetTitleImage, function () {
  $gameTemp.setTitleImage();
});

function DataManager_TitleImageMixIn(dataManager: typeof DataManager) {
  const _onLoadSharedInfo = dataManager.onLoadSharedInfo;
  dataManager.onLoadSharedInfo = function (sharedInfo) {
    $gameTemp.setTitleImage(sharedInfo.title1Name, sharedInfo.title2Name);
    return _onLoadSharedInfo.call(this, sharedInfo);
  };

  const _makeSharedInfo = dataManager.makeSharedInfo;
  dataManager.makeSharedInfo = function () {
    return {
      ..._makeSharedInfo.call(this),
      title1Name: $gameTemp.title1Name(),
      title2Name: $gameTemp.title2Name(),
    };
  };
}

DataManager_TitleImageMixIn(DataManager);

function Game_Temp_TitleImageMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._title1Name = undefined;
    this._title2Name = undefined;
  };

  gameTemp.setTitleImage = function (title1Name, title2Name) {
    this._title1Name = title1Name;
    this._title2Name = title2Name;
  };

  gameTemp.title1Name = function () {
    return this._title1Name ?? $dataSystem.title1Name;
  };

  gameTemp.title2Name = function () {
    return this._title2Name ?? $dataSystem.title2Name;
  };
}

Game_Temp_TitleImageMixIn(Game_Temp.prototype);

function Scene_Title_TitleImageMixIn(sceneTitle: Scene_Title) {
  sceneTitle.createBackground = function () {
    this._backSprite1 = new Sprite(
      ImageManager.loadTitle1($gameTemp.title1Name())
    );
    this._backSprite2 = new Sprite(
      ImageManager.loadTitle2($gameTemp.title2Name())
    );
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
  };
}

Scene_Title_TitleImageMixIn(Scene_Title.prototype);
