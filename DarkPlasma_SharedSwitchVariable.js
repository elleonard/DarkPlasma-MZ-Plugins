// DarkPlasma_SharedSwitchVariable 1.0.4
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/03/16 1.0.4 イベントテストが起動できない不具合を修正
 * 2024/03/12 1.0.3 TypeScript移行
 *                  TemplateEvent.jsがあるとゲームが起動しない不具合を修正
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/05/29 1.0.0 公開
 */

/*:
 * @plugindesc 全てのセーブデータで共有するスイッチ・変数を指定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param switchRangeList
 * @desc 共有セーブに保存するスイッチの範囲リストを指定します。
 * @text スイッチ範囲リスト
 * @type struct<SwitchRange>[]
 * @default []
 *
 * @param variableRangeList
 * @desc 共有セーブに保存する変数の範囲リストを指定します。
 * @text 変数範囲リスト
 * @type struct<VariableRange>[]
 * @default []
 *
 * @command saveSharedInfo
 * @text 共有セーブに保存する
 * @desc 共有セーブデータにスイッチ・変数を保存します。
 *
 * @help
 * version: 1.0.4
 * 全てのセーブデータで共有するスイッチ・変数を指定します。
 * 指定したスイッチ・変数の値は共有セーブデータ(save/shared.rmmzsave)に保存します。
 *
 * プラグインコマンドで共有セーブデータを更新できます。
 */
/*~struct~SwitchRange:
 * @param from
 * @desc このスイッチ以降、終端で指定したスイッチまでを共有セーブに保存します。
 * @text 閉区間開始
 * @type switch
 * @default 1
 *
 * @param to
 * @desc 開始で指定したスイッチからこのスイッチまでを共有セーブに保存します。
 * @text 閉区間終端
 * @type switch
 * @default 1
 */
/*~struct~VariableRange:
 * @param from
 * @desc この変数以降、終端で指定した変数までを共有セーブに保存します。
 * @text 閉区間開始
 * @type variable
 * @default 1
 *
 * @param to
 * @desc 開始で指定した変数からこの変数までを共有セーブに保存します。
 * @text 閉区間終端
 * @type variable
 * @default 1
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    switchRangeList: JSON.parse(pluginParameters.switchRangeList || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          from: Number(parsed.from || 1),
          to: Number(parsed.to || 1),
        };
      })(e || '{}');
    }),
    variableRangeList: JSON.parse(pluginParameters.variableRangeList || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          from: Number(parsed.from || 1),
          to: Number(parsed.to || 1),
        };
      })(e || '{}');
    }),
  };

  PluginManager.registerCommand(pluginName, 'saveSharedInfo', function () {
    DataManager.saveSharedInfo();
  });
  function DataManager_SharedSwitchVariableMixIn(dataManager) {
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
  function Scene_Map_SharedSwitchVariableMixIn(sceneMap) {
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
  const range = (length, start) => [...Array(length).keys()].map((n) => n + start);
})();
