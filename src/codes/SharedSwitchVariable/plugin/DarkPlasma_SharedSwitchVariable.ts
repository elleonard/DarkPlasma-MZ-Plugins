/// <reference path="./SharedSwitchVariable.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { settings } from '../config/_build/DarkPlasma_SharedSwitchVariable_parameters';
import { command_saveSharedInfo } from '../config/_build/DarkPlasma_SharedSwitchVariable_commands';

PluginManager.registerCommand(pluginName, command_saveSharedInfo, function () {
  DataManager.saveSharedInfo();
});

function DataManager_SharedSwitchVariableMixIn(dataManager: typeof DataManager) {
  const _onLoadSharedInfo = dataManager.onLoadSharedInfo;
  dataManager.onLoadSharedInfo = function (sharedInfo) {
    const sharedSwitches = sharedInfo.switches || [];
    sharedSwitches.forEach((sharedSwitch) => {
      $gameSwitches.setValue(sharedSwitch.id, sharedSwitch.value);
    });
    const sharedVariables = sharedInfo.variables || [];
    sharedVariables.forEach((sharedVariable) => {
      $gameVariables.setValue(sharedVariable.id, sharedVariable.value);
    });
    return _onLoadSharedInfo.call(this, sharedInfo);
  };

  const _makeSharedInfo = dataManager.makeSharedInfo;
  dataManager.makeSharedInfo = function () {
    return {
      ..._makeSharedInfo.call(this),
      switches: this.sharedSaveSwitches(),
      variables: this.sharedSaveVariables(),
    };
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

/**
 * 指定した数値から開始する連番の配列を返す
 * @param {number} length 数値
 * @param {number} start 開始数値
 * @return {number[]}
 */
const range = (length: number, start: number): number[] => [...Array(length).keys()].map((n) => n + start);
