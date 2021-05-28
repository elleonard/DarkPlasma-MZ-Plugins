import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_SharedSwitchVariable_parameters';

PluginManager.registerCommand(pluginName, 'saveSharedInfo', function () {
  DataManager.saveSharedInfo();
});

const _DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function (contents) {
  _DataManager_extractSaveContents.call(this, contents);
  this.loadSharedInfo();
};

const _DataManager_isMapLoaded = DataManager.isMapLoaded;
DataManager.isMapLoaded = function () {
  /**
   * 共有データロード完了後にマップ処理を行う
   */
  return _DataManager_isMapLoaded.call(this) && this.isSharedInfoLoaded();
};

DataManager.isSharedInfoLoaded = function () {
  return this._isSharedInfoLoaded;
};

DataManager.loadSharedInfo = function () {
  this._isSharedInfoLoaded = false;
  StorageManager.loadObject('shared')
    .then((sharedInfo) => {
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

DataManager.makeSharedInfo = function () {
  return {
    switches: this.sharedSaveSwitches(),
    variables: this.sharedSaveVariables(),
  };
};

const _DataManager_saveGame = DataManager.saveGame;
DataManager.saveGame = function (savefileId) {
  this.saveSharedInfo();
  return _DataManager_saveGame.call(this, savefileId);
};

DataManager.saveSharedInfo = function () {
  StorageManager.saveObject('shared', this.makeSharedInfo());
};

const _DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
  _DataManager_setupNewGame.call(this);
  this.loadSharedInfo();
};

DataManager.sharedSaveSwitches = function () {
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

DataManager.sharedSaveVariables = function () {
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

/**
 * 指定した数値から開始する連番の配列を返す
 * @param {number} length 数値
 * @param {number} start 開始数値
 * @return {number[]}
 */
const range = (length, start) => [...Array(length).keys()].map((n) => n + start);
