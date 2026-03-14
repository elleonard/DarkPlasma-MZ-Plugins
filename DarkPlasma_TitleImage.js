// DarkPlasma_TitleImage 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/03/15 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc タイトル画像を変更する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_SharedSaveInfo
 * @orderAfter DarkPlasma_SharedSaveInfo
 *
 * @command changeTitleImage
 * @text タイトル画像を変更する
 * @arg title1
 * @text タイトル画像1
 * @type file
 * @dir img/titles1/
 * @arg title2
 * @text タイトル画像2
 * @type file
 * @dir img/titles2/
 *
 * @command resetTitleImage
 * @text タイトル画像を元に戻す
 * @desc タイトル画像をデータベースで指定したものに戻します。
 *
 * @help
 * version: 1.0.0
 * タイトル画面に用いる画像を変更します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_SharedSaveInfo version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_SharedSaveInfo
 */

(() => {
  'use strict';

  function parseArgs_changeTitleImage(args) {
    return {
      title1: String(args.title1 || ``),
      title2: String(args.title2 || ``),
    };
  }

  const command_changeTitleImage = 'changeTitleImage';

  const command_resetTitleImage = 'resetTitleImage';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  PluginManager.registerCommand(pluginName, command_changeTitleImage, function (args) {
    const parsedArgs = parseArgs_changeTitleImage(args);
    $gameTemp.setTitleImage(parsedArgs.title1, parsedArgs.title2);
  });
  PluginManager.registerCommand(pluginName, command_resetTitleImage, function () {
    $gameTemp.setTitleImage();
  });
  function DataManager_TitleImageMixIn(dataManager) {
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
  function Game_Temp_TitleImageMixIn(gameTemp) {
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
  function Scene_Title_TitleImageMixIn(sceneTitle) {
    sceneTitle.createBackground = function () {
      this._backSprite1 = new Sprite(ImageManager.loadTitle1($gameTemp.title1Name()));
      this._backSprite2 = new Sprite(ImageManager.loadTitle2($gameTemp.title2Name()));
      this.addChild(this._backSprite1);
      this.addChild(this._backSprite2);
    };
  }
  Scene_Title_TitleImageMixIn(Scene_Title.prototype);
})();
