/// <reference path="./SharedSwitchVariable.d.ts" />

import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_SharedSwitchVariable_parameters';

PluginManager.registerCommand(pluginName, 'saveSharedInfo', function () {
  DataManager.saveSharedInfo();
});

function DataManager_SharedSwitchVariableMixIn(dataManager: typeof DataManager) {
  const _setupEventTest = dataManager.setupEventTest;
  dataManager.setupEventTest = function () {
    _setupEventTest.call(this);
    this.loadSharedInfo();
  };

  const _extractSaveContents = dataManager.extractSaveContents;
  dataManager.extractSaveContents = function (contents) {
    _extractSaveContents.call(this, contents);
    this.loadSharedInfo();
  };
  
  dataManager.isSharedInfoLoaded = function () {
    return this._isSharedInfoLoaded;
  };
  
  dataManager.loadSharedInfo = function () {
    this._isSharedInfoLoaded = false;
    StorageManager.loadObject('shared')
      .then((sharedInfo: SharedSwitchesAndVariables) => {
        const sharedSwitches = sharedInfo.switches || [];
        sharedSwitches.forEach((sharedSwitch) => {
          $gameSwitches.setValue(sharedSwitch.id, sharedSwitch.value);
        });
        const sharedVariables = sharedInfo.variables || [];
        sharedVariables.forEach((sharedVariable) => {
          $gameVariables.setValue(sharedVariable.id, sharedVariable.value);
        });
        this._isSharedInfoLoaded = true;
        return 0;
      })
      .catch(() => {
        /**
         * セーブデータが存在しなかった場合にもロード完了扱いにする
         */
        this._isSharedInfoLoaded = true;
      });
  };
  
  dataManager.makeSharedInfo = function () {
    return {
      switches: this.sharedSaveSwitches(),
      variables: this.sharedSaveVariables(),
    };
  };
  
  const _saveGame = dataManager.saveGame;
  dataManager.saveGame = function (savefileId) {
    this.saveSharedInfo();
    return _saveGame.call(this, savefileId);
  };
  
  dataManager.saveSharedInfo = function () {
    StorageManager.saveObject('shared', this.makeSharedInfo());
  };
  
  const _setupNewGame = dataManager.setupNewGame;
  dataManager.setupNewGame = function () {
    _setupNewGame.call(this);
    this.loadSharedInfo();
  };
  
  dataManager.sharedSaveSwitches = function () {
    return settings.switchRangeList
      .filter((switchRange) => switchRange.from <= switchRange.to)
      .map((switchRange) => range(switchRange.to - switchRange.from + 1, switchRange.from))
      .flat()
      .map((switchId) => {
        return {
          id: switchId,
          value: $gameSwitches.value(switchId),
        };
      });
  };
  
  dataManager.sharedSaveVariables = function () {
    return settings.variableRangeList
      .filter((variableRange) => variableRange.from <= variableRange.to)
      .map((variableRange) => range(variableRange.to - variableRange.from + 1, variableRange.from))
      .flat()
      .map((variableId) => {
        return {
          id: variableId,
          value: $gameVariables.value(variableId),
        };
      });
  };
}

DataManager_SharedSwitchVariableMixIn(DataManager);

function Scene_Map_SharedSwitchVariableMixIn(sceneMap: Scene_Map) {
  const _isReady = sceneMap.isReady;
  sceneMap.isReady = function () {
    return _isReady.call(this) && DataManager.isSharedInfoLoaded();
  };
}

Scene_Map_SharedSwitchVariableMixIn(Scene_Map.prototype);

/**
 * 指定した数値から開始する連番の配列を返す
 * @param {number} length 数値
 * @param {number} start 開始数値
 * @return {number[]}
 */
const range = (length: number, start: number): number[] => [...Array(length).keys()].map((n) => n + start);
