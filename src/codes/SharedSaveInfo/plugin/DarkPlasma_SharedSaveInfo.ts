/// <reference path="./SharedSaveInfo.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_saveSharedInfo } from '../config/_build/DarkPlasma_SharedSaveInfo_commands';

PluginManager.registerCommand(pluginName, command_saveSharedInfo, function () {
  DataManager.saveSharedInfo();
});

function DataManager_SharedSaveInfoMixIn(dataManager: typeof DataManager) {
  const _setupEventTest = dataManager.setupEventTest;
  dataManager.setupEventTest = function () {
    _setupEventTest.call(this);
    this.loadSharedInfo();
  };

  const _setupNewGame = dataManager.setupNewGame;
  dataManager.setupNewGame = function () {
    _setupNewGame.call(this);
    this.loadSharedInfo();
  };

  const _extractSaveContents = dataManager.extractSaveContents;
  dataManager.extractSaveContents = function (contents) {
    _extractSaveContents.call(this, contents);
    this.loadSharedInfo();
  };

  const _saveGame = dataManager.saveGame;
  dataManager.saveGame = function (savefileId) {
    this.saveSharedInfo();
    return _saveGame.call(this, savefileId);
  };

  dataManager.saveSharedInfo = function () {
    StorageManager.saveObject('shared', this.makeSharedInfo());
  };

  dataManager.loadSharedInfo = function () {
    this._isSharedInfoLoaded = false;
    StorageManager.loadObject('shared')
      .then((sharedInfo: Game_SharedSaveInfo) => this.onLoadSharedInfo(sharedInfo))
      .catch(() => this._isSharedInfoLoaded = true);
  };

  dataManager.onLoadSharedInfo = function(sharedInfo) {
    this._isSharedInfoLoaded = true;
    return 0;
  };

  dataManager.isSharedInfoLoaded = function () {
    return this._isSharedInfoLoaded;
  };

  dataManager.makeSharedInfo = function () {
    return {};
  };
}

DataManager_SharedSaveInfoMixIn(DataManager);

function Scene_Map_SharedSwitchVariableMixIn(sceneMap: Scene_Map) {
  const _isReady = sceneMap.isReady;
  sceneMap.isReady = function () {
    return _isReady.call(this) && DataManager.isSharedInfoLoaded();
  };
}

Scene_Map_SharedSwitchVariableMixIn(Scene_Map.prototype);
